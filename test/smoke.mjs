// Functional smoke test: loads dist/app.js in a vm sandbox with DOM stubs.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert';

const listeners={document:{},window:{}};
function makeEl(id){
  return {
    id, innerHTML:'', textContent:'', value:'', open:false,
    dataset:{}, style:{},
    classList:{add(){},remove(){},toggle(){},contains:()=>false},
    setAttribute(){}, getAttribute(){return null},
    addEventListener(t,f){listeners.document[id+':'+t]=f},
    removeEventListener(){}, querySelector:()=>makeEl('q'), querySelectorAll:()=>[],
    showModal(){this.open=true}, close(){this.open=false},
    focus(){}, scrollIntoView(){},
    onclick:null, onchange:null, onsubmit:null,
    closest:()=>null,
  };
}
const els={};
const documentStub={
  getElementById:id=>els[id]||(els[id]=makeEl(id)),
  querySelector:sel=>{const id=sel.replace('#','');return els[id]||(els[id]=makeEl(id))},
  querySelectorAll:()=>[],
  addEventListener(t,f){listeners.document[t]=f},
  modelContext:{
    registerTool(tool){documentStub.modelContext.__tools.push(tool);return Promise.resolve()},
    __tools:[]
  },
  documentElement:{dataset:{}},
  activeElement:{tagName:'BODY'},
};
const store={};
const localStorageStub={
  getItem:k=>k in store?store[k]:null,
  setItem:(k,v)=>{store[k]=String(v)},
  removeItem:k=>{delete store[k]},
};
const windowStub={
  addEventListener(t,f){listeners.window[t]=f},
  scrollTo(){}, matchMedia:()=>({matches:false}),
  __onhash:null,
};
windowStub.location={hash:''};
const sandbox={
  window:windowStub,
  document:documentStub,
  location:windowStub.location,
  localStorage:localStorageStub,
  navigator:{},
  crypto:{randomUUID:()=>'uuid-test-'+Math.random().toString(36).slice(2)},
  matchMedia:windowStub.matchMedia,
  console,
  setTimeout,clearTimeout,
  Intl,URL,Promise,
  structuredClone,
};
sandbox.globalThis=sandbox;
vm.createContext(sandbox);
const code=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
vm.runInContext(code,sandbox,{filename:'app.js'});

const app=sandbox.window.__consulting;
assert(app,'__consulting hook missing');
const data=app.data;

// 1. seed intact
assert.equal(data.meetings.length,3,'seed meetings');
assert.equal(data.people.length,3,'seed people');
assert.equal(data.principles.length,3,'seed principles');
assert.equal(data.followups.length,3,'seed followups');
assert.equal(data.meetings[0].id,'m1');
assert.equal(data.followups[0].id,'f1');

// 2. analysis applied to all seed meetings
for(const m of data.meetings)assert(m.analysis&&m.analysis.segments.length>0,'analysis for '+m.id);
const a1=data.meetings[0].analysis;
assert(a1.problem&&a1.problem.text.includes('הקושי'),'m1 problem');
assert(a1.advice.length>=1&&a1.advice[0].text.includes('המלצתי'),'m1 advice');
assert.equal(a1.summary,'המלצתי שהבעל והאישה ינסחו יחד גבול אחיד ויציגו אותו כעמדה משותפת.','m1 summary = advice sentence (old behavior)');
const a2=data.meetings[1].analysis;
assert(a2.followups.length===1&&a2.followups[0].text.includes('בפגישה הבאה'),'m2 followup');
const a3=data.meetings[2].analysis;
assert(a3.advice.length===1&&a3.advice[0].type==='decision','m3 decision as advice');
// evidence integrity: every item maps to a real segment
for(const m of data.meetings){
  for(const k of ['problem','observations','reasoning','advice','outcomes','followups','contradictions']){
    const arr=k==='problem'?(m.analysis.problem?[m.analysis.problem]:[]):m.analysis[k];
    for(const it of arr){
      assert.equal(m.analysis.segments[it.evidence.seg].text,it.evidence.quote,'evidence quote matches segment '+m.id+'/'+it.evidence.seg);
      assert(['explicit','inferred'].includes(it.kind),'kind');
      assert(it.confidence>0&&it.confidence<=90,'confidence bounded (heuristic honesty): '+it.confidence);
    }
  }
}

// 3. search
const s1=app.searchAll('דניאל');
assert(s1.total>0,'search דניאל has results');
assert(s1.groups.person.some(p=>p.title==='דניאל'),'person in results');
assert(s1.groups.meeting.some(m=>m.id==='m2'),'meeting m2 in results');
const s2=app.searchAll('מה ייעצתי לדניאל בפגישה הקודמת ולמה?');
assert(s2.groups.meeting.length>=1,'question-form query works');
assert(s2.groups.meeting[0].snippet.includes('<mark>'),'snippet highlights matches');
const s3=app.searchAll('עקרונות זוגי');
assert(s3.groups.principle.length>=1,'principle search works');
const s4=app.searchAll('גבול משפחה');
assert(s4.total>0,'גבול משפחה finds something');
const s5=app.searchAll('   ');
assert.equal(s5.total,0,'empty query → 0');
// highlight never breaks escaping
const s6=app.searchAll('לוי');
assert(!s6.groups.meeting.some(m=>m.snippet.includes('<mark>>')),'no broken marks');

// 4. related principles heuristic
const rel1=app.relatedPrinciples(data.meetings[0]);
assert(rel1.length>=1,'m1 related principles');
assert(rel1[0].principle.title.includes('גבול'),'top related for m1 is the boundary principle');

// 5. modelContext tools registered with same names
const tools=documentStub.modelContext.__tools.map(t=>t.name).sort();
assert.deepEqual(tools,['create_follow_up','search_consulting_knowledge'],'tool names preserved');
const searchTool=documentStub.modelContext.__tools.find(t=>t.name==='search_consulting_knowledge');
const res=searchTool.execute({query:'דניאל'});
assert(res.count>0&&Array.isArray(res.results),'tool returns results');
const fuTool=documentStub.modelContext.__tools.find(t=>t.name==='create_follow_up');
const before=data.followups.length;
const fu=fuTool.execute({person:'דניאל',title:'בדיקת מעקב',due:'2026-10-01'});
assert.equal(data.followups.length,before+1,'followup created via tool');
assert.equal(fu.status,'created');
assert.throws(()=>fuTool.execute({person:'x',title:'y',due:'bad'}),'tool validates due');

// 6. speakers + timestamps parsing
const segs=app.splitSegments('[00:02] אבי: שלום לך\n[00:15] אבי: מה הקושי המרכזי שלך?\n[00:30] רות: אני מתקשה בישן\n[00:41] רות: הכישלון המרכזי הוא ההרגשה');
assert.equal(segs.length,4,'speaker lines split');
assert.equal(segs[0].time,'00:02','timestamp parsed');
assert.equal(segs[0].speaker,'אבי','speaker parsed');
assert.equal(segs[2].speaker,'רות');
const analysis=app.analyzeTranscript('אבי: שלום\nאבי: הקושי המרכזי הוא התערבות. המלצתי להציג עמדה משותפת. בפישה הבאה נבדוק.');
// (intentional: no typos here — check real text below)
const analysis2=app.analyzeTranscript('הקושי המרכזי הוא התערבות. המלצתי להציג עמדה משותפת כי זה יוצר ביטחון. בפגישה הבאה נבדוק.');
assert(analysis2.problem&&analysis2.advice.length&&analysis2.reasoning.length&&analysis2.followups.length,'full chain detected');
assert(analysis2.reasoning.some(r=>r.text.includes('כי')),'rationale clause extracted from advice sentence');
assert.equal(analysis2.problem.kind,'explicit');

console.log('ALL SMOKE TESTS PASSED');
console.log('sample analysis (m2):',JSON.stringify({problem:a2.problem?.text,advice:a2.advice.map(x=>x.text),followups:a2.followups.map(x=>x.text)},null,1).slice(0,400));
