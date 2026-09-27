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
  setTimeout,clearTimeout,setInterval:()=>0,
  sessionStorage:localStorageStub,
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
assert.equal(data.meetings.length,4,'seed meetings');
assert.equal(data.people.length,3,'seed people');
assert.equal(data.principles.length,3,'seed principles');
assert.equal(data.followups.length,4,'seed followups');
assert.equal(data.meetings[0].id,'m1');

// 2. analysis (v3) applied to all meetings, with evidence integrity
for(const m of data.meetings)assert(m.analysis&&m.analysis.version===3&&m.analysis.segments.length>0,'analysis for '+m.id);
const byId=id=>data.meetings.find(m=>m.id===id).analysis;
const a1=byId('m1');
assert(a1.problem&&a1.problem.text.includes('הקושי'),'m1 problem');
assert(a1.advice[0].text.includes('המלצתי'),'m1 advice');
const a2=byId('m2');
assert(a2.problem&&a2.problem.text.includes('ויכוחים'),'m2 problem detected (was missed in v2)');
assert(a2.followups.length===1&&a2.followups[0].text.includes('בפגישה הבאה'),'m2 followup');
assert(byId('m3').advice[0].type==='decision','m3 decision');
const a4=byId('m4');
assert.equal(a4.speakers.join(','),'היועץ,דניאל','m4 speakers');
assert(a4.results.some(r=>r.text.includes('עבד בשתי')),'m4 result of earlier advice');
assert(!a4.results.some(r=>r.text.endsWith('?')),'questions are not results');
assert(a4.outcomes.some(o=>o.text.includes('המטרה')),'m4 intended outcome (regex fixed)');
assert(a4.contradictions.length===1,'m4 exception');
assert(a4.reasoning.some(r=>r.forAdvice&&r.text.startsWith('כי')),'m4 reasoning clause linked to advice');
assert.equal(a4.timeRange,'00:01–02:10');
for(const m of data.meetings){
  const an=m.analysis;
  for(const k of ['observations','reasoning','advice','outcomes','results','followups','contradictions']){
    for(const it of an[k].concat(k==='observations'&&an.problem?[an.problem]:[])){
      assert.equal(an.segments[it.evidence.seg].text,it.evidence.quote,'evidence quote matches segment '+m.id+'/'+it.evidence.seg);
      assert(['explicit','inferred'].includes(it.kind),'kind');
      assert(it.confidence>0&&it.confidence<=90,'confidence bounded: '+it.confidence);
    }
  }
}
// segmentation never splits inside a word
const seg=app.splitSegments('תיעוד מפורט של השיחה. משפט שני!');
assert.deepEqual(seg.map(s=>s.text),['תיעוד מפורט של השיחה.','משפט שני!'],'no letter-spacing, sentence split only');

// 3. search: prefixes, synonyms, groups
const s1=app.searchAll('דניאל');
assert(s1.groups.person.some(p=>p.title==='דניאל'),'person in results');
assert(s1.groups.meeting.some(m=>m.id==='m2'),'meeting m2 in results');
const s2=app.searchAll('מה ייעצתי לדניאל ולמה?');
assert(s2.groups.advice.length>=1,'question-form finds advice');
assert(app.searchAll('בגבולות').groups.meeting.some(m=>m.id==='m1'),'prefix ב stripped');
assert(app.searchAll('מריבות').groups.meeting.some(m=>m.id==='m2'),'synonym מריבות→ויכוחים');
assert(app.searchAll('גבולות מול ההורים').groups.meeting[0].id==='m1','multi-word Hebrew query');
assert(app.searchAll('עבודה').groups.meeting.some(m=>m.id==='m3'),'m3 by work');
assert.equal(app.searchAll('   ').total,0,'empty query');
assert(!app.searchAll('לוי').groups.meeting.some(m=>/<mark>[^<]*<mark>/.test(m.snippet)),'no nested marks');
assert(app.searchAll('<script>').total===0,'no crash on markup');

// 4. people derived from meetings, not stale counters
const dn=app.allPeople().find(p=>p.name==='דניאל');
assert.equal(dn.count,2,'daniel has 2 meetings');
assert.equal(dn.last,'2026-09-17');
assert.equal(app.adviceChanges().length,1,'daniel advice change detected');

// 5. principles linked by overlap (hypothesis)
const rel1=app.relatedPrinciples(data.meetings[0]);
assert(rel1.length>=1&&rel1[0].principle.title.includes('גבול'),'m1 → boundary principle');
assert(app.linkedCases(data.principles[2]).some(m=>m.person==='דניאל'),'stop principle linked to daniel');

// 6. zmanim + hebrew date
const z=app.zmanimFor(new Date('2026-06-21T09:00:00Z'));
const fmt=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Jerusalem'});
assert.equal(fmt.format(z.find(x=>x.k==='sunrise').t),'05:37','netivot sunrise june 21');
assert.equal(fmt.format(z.find(x=>x.k==='sunset').t),'19:49','netivot sunset june 21');
assert(z.every((x,i)=>i===0||x.t>z[i-1].t),'zmanim ordered');
assert.equal(app.gematria(15),'ט״ו');assert.equal(app.gematria(5787),'תשפ״ז');
assert.equal(app.hebrewDate(new Date('2026-09-27T09:00:00Z')),'ט״ז בתשרי תשפ״ז');

// 7. import: full transcript + PLAUD kept, followups from analysis, due in the future of the meeting
const before=data.followups.length;
const m=app.importMeeting({title:'בדיקה',person:'רות',date:'2026-09-01',transcript:'רות מתלבטת לגבי מעבר דירה. המלצתי לבדוק שתי שכונות. בפגישה הבאה נבדוק מה מצאה.',plaud:'סיכום PLAUD'});
assert.equal(app.data.meetings[0].plaud,'סיכום PLAUD','plaud stored');
assert(app.data.meetings[0].transcript.includes('מעבר דירה'),'full transcript stored');
assert.equal(app.data.followups.length,before+1,'followup from analysis');
assert.equal(app.data.followups[0].due,'2026-09-08','followup due = meeting + 7 days');
assert.equal(app.data.followups[0].meetingId,m.id,'followup linked to source');
assert(app.allPeople().some(p=>p.name==='רות'),'person created');

// 8. backup validation
assert(app.validBackup({data:app.data}),'own data is a valid backup');
assert(!app.validBackup({data:{meetings:[{}]}}),'garbage rejected');

// 9. modelContext tools keep their names; search is side-effect free
const tools=documentStub.modelContext.__tools.map(t=>t.name).sort();
assert.deepEqual(tools,['ask_second_brain','create_follow_up','search_consulting_knowledge'],'tool names preserved + ask tool');
const searchTool=documentStub.modelContext.__tools.find(t=>t.name==='search_consulting_knowledge');
windowStub.location.hash='#people';
const res=searchTool.execute({query:'דניאל'});
assert(res.count>0&&res.results.every(r=>!/<[a-z]/.test(r.summary)),'tool returns plain results');
assert.equal(windowStub.location.hash,'#people','read-only tool does not navigate');
const fuTool=documentStub.modelContext.__tools.find(t=>t.name==='create_follow_up');
const n=app.data.followups.length;
assert.equal(fuTool.execute({person:'דניאל',title:'בדיקת מעקב',due:'2026-10-01'}).status,'created');
assert.equal(app.data.followups.length,n+1);
assert.throws(()=>fuTool.execute({person:'x',title:'y',due:'bad'}),'tool validates due');


// 10. Ask the second brain (tier 1, evidence only). Synthetic data.
const ask=app.askSecondBrain;
const segText=(mid,seg)=>app.data.meetings.find(m=>m.id===mid).analysis.segments[seg].text;
const allVerbatim=a=>a.findings.every(f=>!f.ev||segText(f.ev.mid,f.ev.seg).includes(f.ev.quote));
const known=new Set();
for(const m of app.data.meetings){const an=m.analysis;for(const k of ['observations','reasoning','advice','outcomes','results','followups','contradictions'])for(const it of an[k])known.add(it.text);if(an.problem)known.add(an.problem.text);an.segments.forEach(x=>known.add(x.text))}
for(const f of app.data.followups)known.add(f.title);
for(const p of app.data.principles)known.add(p.title);
for(const c of app.data.cases||[])known.add(c.title);
for(const m of app.data.meetings)known.add(m.title);
for(const p of app.allPeople())known.add(p.name);
const noInvention=a=>a.findings.every(f=>known.has(f.text)||(f.route&&f.route.startsWith('case/')));
// intents
assert.equal(app.detectIntent('מה אמרתי לו בפעם הקודמת?').k,'previous');
assert.equal(app.detectIntent('למה המלצתי לו לעצור?').k,'why');
assert.equal(app.detectIntent('מה עדיין פתוח?').k,'open');
assert.equal(app.detectIntent('תכין אותי לפגישה עם דניאל').k,'briefing');
assert.equal(app.detectIntent('איפה שיניתי את דעתי?').k,'changedMind');
assert.equal(app.detectIntent('מצא מקרים דומים לריבים').k,'similar');
// person scope from the name in the question, chronological evidence
let a=ask('מה אמרתי לדניאל בפעם הקודמת?',{type:'global'});
assert.deepEqual(a.scope,{type:'person',id:'דניאל'},'name in question narrows scope');
assert(a.findings.some(f=>f.label==='עצה'&&f.ev.mid==='m4'),'previous = latest meeting m4');
assert(a.findings.some(f=>f.label==='נימוק'&&f.text.startsWith('כי')),'reason attached');
assert(allVerbatim(a)&&noInvention(a),'previous: verbatim, nothing invented');
assert(/2 הקלטות של דניאל/.test(a.coverage.text),'coverage is dynamic and scoped');
// what changed: earlier advice + reported result
a=ask('מה השתנה מאז הפגישה הקודמת?',{type:'person',id:'דניאל'});
assert(a.findings.some(f=>f.label==='העצה בפגישה הקודמת'&&f.ev.mid==='m2'));
assert(a.findings.some(f=>f.label==='מה דווח מאז'&&f.text.includes('עבד בשתי')));
assert(allVerbatim(a)&&noInvention(a));
// why: missing reasoning is reported as unknown, not invented
a=ask('למה המלצתי את זה?',{type:'recording',id:'m2'});
assert(a.unknowns.some(u=>u.includes('לא נמצא נימוק')),'m2 has no explicit reason → unknown');
// open items
a=ask('מה עדיין פתוח?',{type:'global'});
assert(a.findings.length===app.data.followups.filter(f=>!f.done).length,'all open followups');
// briefing never adds advice that was not recorded
a=ask('תכין אותי לפגישה עם דניאל',{type:'global'});
assert(a.findings.length>=4&&noInvention(a)&&allVerbatim(a),'briefing from evidence only');
assert(a.answer.some(p=>p.includes('לא מציעה עצות חדשות')));
// advice changes shown as a progression
a=ask('איפה שיניתי את דעתי?',{type:'global'});
const prog=a.findings.filter(f=>f.label.startsWith('דניאל'));
assert(prog.length===2&&prog[0].ev.date<prog[1].ev.date,'progression in date order');
// pronoun without a person → asks to choose
a=ask('מה אמרתי לו בפעם הקודמת?',{type:'global'});
assert(a.needsScope&&a.related.length>0,'ambiguous pronoun → choose person');
// consultant questions = candidate observations only
a=ask('אילו שאלות אני נוהג לשאול?',{type:'global'});
assert(a.findings.some(f=>f.text.includes('איך עבד כלל עשר הדקות')),'consultant question found');
assert(a.unknowns.some(u=>u.includes('תצפיות מועמדות')),'single recording is not a method');
// unsupported question → no invented answer
a=ask('מה מחיר הזהב בלונדון?',{type:'global'});
assert.equal(a.intent,'search');assert.equal(a.findings.length,0);
assert(a.answer[0].includes('לא נמצאה ראיה'));
// mixed Hebrew/English does not break
a=ask('מה ה-advice האחרון של דניאל?',{type:'global'});
assert.equal(a.scope.id,'דניאל');
// verbatim enforcement: a quote that no longer matches its source is dropped
const m4=app.data.meetings.find(m=>m.id==='m4');const keep=m4.analysis.segments[3].text;
m4.analysis.segments[3].text='טקסט ששונה';
a=ask('מה אמרתי לדניאל בפעם הקודמת?',{type:'global'});
assert(a.unknowns.some(u=>u.includes('לא עברו אימות')),'tampered quote dropped');
assert(allVerbatim(a));
m4.analysis.segments[3].text=keep;
// read-only tool does not navigate or modify
const askTool=documentStub.modelContext.__tools.find(t=>t.name==='ask_second_brain');
const snapshot=JSON.stringify(app.data);windowStub.location.hash='#advice';
const tr=askTool.execute({question:'מה עדיין פתוח?'});
assert(tr.findings.length>0&&windowStub.location.hash==='#advice'&&JSON.stringify(app.data)===snapshot,'ask tool is read-only');

// 11. Architecture corrections: case entity, free questions, synthesis seam
// case ≠ recording ≠ person, many-to-many
assert(Array.isArray(app.data.cases)&&app.data.cases.length===3,'cases are their own entity');
assert.deepEqual(app.casesOfPerson('דניאל').map(c=>c.id),['c1']);
assert.deepEqual(app.recordingsOfCase(app.data.cases[0]).map(m=>m.id),['m4','m2'],'case spans recordings');
app.data.cases.push({id:'cx',title:'בדיקה: תיק משפחתי משותף',status:'open',people:['דניאל','נועה'],recordingIds:['m2','m3']});
assert.equal(app.casesOfRecording('m2').length,2,'one recording in two cases');
assert(app.casesOfPerson('נועה').some(c=>c.id==='cx')&&app.casesOfPerson('דניאל').some(c=>c.id==='cx'),'one case, several people');
a=ask('תכין אותי לפגישה',{type:'case',id:'cx'});
assert(a.findings.some(f=>f.section==='אנשים קשורים'),'case briefing lists the other people');
app.data.cases.pop();
// case scope
a=ask('איך המקרה התפתח?',{type:'case',id:'c1'});
assert.equal(a.scope.type,'case');assert(a.coverage.text.includes('2 הקלטות בתיק'));
assert(a.findings.some(f=>f.label==='מה דווח מאז'),'case evolution uses later results');
// advice scope (dossier)
a=ask('מה קרה אחרי העצה הזו?',{type:'advice',id:'m2:advice-1'});
assert(a.findings.some(f=>f.section==='מה קרה אחר כך'&&f.text.includes('עבד בשתי')),'advice → later outcome');
assert(a.findings.some(f=>f.section==='איך העצה התפתחה'),'advice → later advice');
assert(a.unknowns.some(u=>u.includes('לא נמצא נימוק')),'missing reason stays unknown');
// sectioned briefing
a=ask('אני עוד מעט מדבר עם דניאל, תזכיר לי מה באמת חשוב לדעת עליו ומה נשאר פתוח',{type:'global'});
assert.equal(a.intent,'briefing');assert.equal(a.scope.id,'דניאל');
for(const s of ['תיקים','עצות ונימוקים','תוצאות ידועות','שינויים לאורך זמן','פתוח ומשימות'])assert(a.findings.some(f=>f.section===s),'briefing section '+s);
assert(noInvention(a)&&allVerbatim(a));
// free question: not limited to intents, retrieval still works
a=ask('באילו מקרים הוזכרה נטישה?',{type:'global'});
assert.equal(a.intent,'search');
assert(a.findings.some(f=>f.text.includes('נטישה')),'free question retrieves by content');
assert(a.unknowns.some(u=>u.includes('NAS')),'states that free synthesis runs on the server');
assert(allVerbatim(a)&&noInvention(a));
// synthesis seam: request carries only scoped evidence; validator rejects inventions
const bundle=app.retrieveEvidence('עצירה',{type:'person',id:'דניאל'});
const req=app.buildSynthesisRequest('מה אמרתי על עצירה?',{type:'person',id:'דניאל'},bundle,'advice');
assert(req.evidence.length>0&&req.evidence.every(e=>e.person==='דניאל'),'request only holds scoped evidence');
assert(!JSON.stringify(req).match(/api[_-]?key|sk-/i),'no secrets in request');
const good=req.evidence.find(e=>e.quote);
const v=app.validateSynthesis({answer:[{text:'המלצת לעצור.',cites:[good.id]},{text:'המלצת גם לעבור דירה.',cites:['m9#x']},{text:'ללא מקור.'}],quotes:[{evidence_id:good.id,text:good.quote},{evidence_id:good.id,text:'ציטוט שלא נאמר'}]},req);
assert.equal(v.answer.length,1,'uncited and wrongly-cited claims removed');
assert.equal(v.quotes.length,1,'non-verbatim quote removed');
assert.equal(v.rejected.length,3);
assert.equal(app.SYNTHESIS.available,false,'public site never calls a model');

console.log('ALL SMOKE TESTS PASSED');
