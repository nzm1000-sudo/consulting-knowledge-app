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
assert.equal(data.meetings.length,6,'seed meetings');
assert.equal(data.people.length,3,'seed people');
assert.equal(data.principles.length,3,'seed principles');
assert.equal(data.followups.length,6,'seed followups');
assert.equal(data.meetings[0].id,'m1');

// 2. analysis (v3) applied to all meetings, with evidence integrity
for(const m of data.meetings)assert(m.analysis&&m.analysis.version===7&&m.analysis.segments.length>0,'analysis for '+m.id);
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
assert.equal(app.adviceChanges().filter(x=>x.person==='דניאל').length,1,'daniel advice change detected');assert.equal(app.adviceChanges().length,3,'one change per person with two meetings');

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
// a finding is either recorded content, a link to a recording, or a system-computed pattern row (kind 'pattern') that is followed by verbatim evidence
const noInvention=a=>a.findings.every((f,i)=>known.has(f.text)||(f.route&&f.route.startsWith('case/'))||(f.kind==='pattern'&&a.findings.slice(i+1).some(g=>(g.ev||g.route)&&g.section===f.section)));
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
assert(a.unknowns.some(u=>u.includes('תצפית מועמדת')),'method rule stated');
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
assert.equal(a.intent,'timeline');assert(a.findings.some(f=>f.label==='מה דווח'&&f.text.includes('עבד בשתי')),'case evolution includes later results');
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

// 12. Phase D: longitudinal intelligence (synthetic data)
// time windows
assert.deepEqual(app.parseWindow('מה קרה בשלוש הפגישות האחרונות?'),{kind:'last',n:3,label:'3 הפגישות האחרונות'});
assert.equal(app.parseWindow('מה השתנה בחצי השנה האחרונה?').kind,'since');
a=ask('מה קרה בשתי הפגישות האחרונות?',{type:'global'});
assert.equal(a.intent,'timeline');assert.equal(a.coverage.inScope,2,'window limits meetings');
assert(a.coverage.text.startsWith('חלון זמן: 2 הפגישות האחרונות'));
// timeline is chronological and grouped by meeting
a=ask('איך זה התפתח לאורך הזמן?',{type:'person',id:'דניאל'});
const secs=[...new Set(a.findings.map(f=>f.section))];
assert.equal(secs.length,2,'one group per meeting');assert(secs[0].includes('3 בספטמבר')&&secs[1].includes('17 בספטמבר'),'oldest first');
assert(a.answer.some(p=>p.includes('העצה השתנתה פעם אחת')));
assert(allVerbatim(a)&&noInvention(a));
// recurring concepts: synonyms count as one topic across meetings
const keysA=app.conceptKeys('ויכוחים שמסלימים'),keysB=app.conceptKeys('עבד בשתי מריבות מתוך שלוש');
assert([...keysA.keys()].some(k=>keysB.has(k)),'ויכוחים ≈ מריבות');
a=ask('מה חוזר אצלו?',{type:'person',id:'דניאל'});
assert.equal(a.intent,'recurring');
assert(a.findings.some(f=>f.kind==='pattern'&&f.label.startsWith('2 הקלטות')),'recurring across 2 recordings');
assert(a.answer[0].includes('התאמה לשונית'),'recurrence is labelled as linguistic, not a verdict');
assert(allVerbatim(a)&&noInvention(a));
// advice → outcome linkage
const outs=app.adviceOutcomes(app.data.meetings);
const m2o=outs.find(x=>x.m.id==='m2');
assert.equal(m2o.status,'reported');assert(m2o.results[0].it.text.includes('עבד בשתי'));
assert.equal(outs.find(x=>x.m.id==='m4').status,'no_later_meeting');
a=ask('האם העצות שלי עבדו?',{type:'global'});
assert.equal(a.intent,'outcomes');
assert(a.answer[0].includes('הסקה'),'the link is declared an inference');
assert(a.unknowns.some(u=>u.includes('עוד אין פגישת המשך')));
// closed vs open
a=ask('מה נסגר ומה עדיין פתוח?',{type:'person',id:'דניאל'});
assert.equal(a.intent,'unresolved');
assert(a.findings.some(f=>f.section==='נסגר')&&a.findings.some(f=>f.section==='פתוח'));
// first appearance
a=ask('מתי התחילו הוויכוחים?',{type:'person',id:'דניאל'});
assert.equal(a.intent,'firstSeen');
assert(a.answer[0].includes('3 בספטמבר'),'first seen in m2');
assert(a.unknowns.some(u=>u.includes('רק להקלטות שבמאגר')),'first = first recorded');
// change of advice shows the stated reason
a=ask('מתי שיניתי את ההמלצה ומה היה הנימוק?',{type:'person',id:'דניאל'});
assert.equal(a.intent,'changedMind');
assert(a.findings.some(f=>f.label==='הנימוק שנאמר בפגישה המאוחרת'&&f.text.startsWith('כי')));
assert(allVerbatim(a)&&noInvention(a));

// 13. Phase E: method discovery (synthetic data only)
const M=app.data.meetings,mm=id=>M.find(m=>m.id===id);
// no speakers → no methodology (we cannot know who said what)
assert.equal(mm('m1').analysis.methodology.length,0,'unlabelled recording yields nothing');
// consultant moves and client events are verbatim sentences, labelled as inferences
const m5=mm('m5').analysis.methodology,m6=mm('m6').analysis.methodology;
for(const it of [...m5,...m6]){assert.equal(it.kind,'inferred');assert.equal(segText(it.evidence.seg===undefined?'':(M.find(m=>m.analysis.methodology.includes(it)).id),it.evidence.seg),it.text)}
assert(m5.some(x=>x.subtype==='client_resistance'&&x.response),'resistance with consultant response');
assert(m5.some(x=>x.subtype==='reframe'),'reframe detected');
assert(m5.some(x=>x.subtype==='client_turning_point'&&x.before),'turning point with preceding move');
assert(!m5.some(x=>x.actor==='consultant'&&x.evidence.speaker==='נועה'),'client sentences are never consultant moves');
// cross-recording status
const mp=app.methodPatterns(M);
const st=k=>mp.patterns.find(p=>p.subtype===k);
assert.equal(st('question').status,'חוזר');assert(st('question').people>=3,'question across ≥3 people');
assert.equal(st('reframe').status,'חוזר');assert.equal(st('reframe').recordings,2);
assert.equal(st('adaptation').status,'תצפית מועמדת','one recording = candidate');
assert(st('rationale')&&st('rationale').recordings===3&&st('rationale').status==='חוזר','advice-with-reason detected in m4, m5, m6');
assert(mp.sequences.some(x=>x.from==='reframe'&&x.to==='client_turning_point'&&x.recordings===2),'reframe → turning point recurs');
// statuses are revisable: removing a recording weakens the pattern
const without=app.methodPatterns(M.filter(m=>m.id!=='m6'));
assert.equal(without.patterns.find(p=>p.subtype==='reframe').status,'תצפית מועמדת','pattern weakens without m6');
// assistant: resistance
a=ask('איך אני בדרך כלל מגיב להתנגדות?',{type:'global'});
assert.equal(a.intent,'method');
assert(a.answer.some(p=>p.includes('מה היועץ עשה אחרי ההתנגדות: מסגור מחדש (2)')),'response to resistance counted');
assert(a.findings.some(f=>f.label.startsWith('מה עשה היועץ מיד אחרי')),'shows the consultant move after');
assert(allVerbatim(a));
assert(a.coverage.text.includes('שכבת המתודולוגיה: 3 מתוך '+app.data.meetings.length),'methodology coverage is dynamic');
// turning points
a=ask('מה קורה לפני נקודת מפנה?',{type:'global'});
assert(a.answer.some(p=>p.includes('מה קדם לנקודת המפנה: מסגור מחדש (2)')));
// overview + wording by person
a=ask('איך הניסוח שלי משתנה לפי האדם?',{type:'global'});
assert(a.findings.some(f=>f.kind==='pattern')&&a.findings.some(f=>f.section&&f.section.startsWith('רצף:')),'overview with sequences');
assert(noInvention(a)&&allVerbatim(a));
// a single recording never becomes "method"
a=ask('באילו מקרים אני משנה כיוון באמצע השיחה?',{type:'global'});
assert(a.answer[0].includes('תצפית מועמדת')&&a.unknowns.some(u=>u.includes('הופיע בהקלטה אחת בלבד')));
// recording scope
a=ask('אילו מהלכי ייעוץ התרחשו כאן?',{type:'recording',id:'m1'});
assert(a.answer[0].includes('לא זוהו מהלכי ייעוץ'),'no moves in an unlabelled recording');

// 14. server data source (NAS, read-only snapshot)
{
  assert.equal(app.SOURCE.mode,'local','starts local');
  assert.equal(app.serverCapable(),false,'no server fetch without http location');
  windowStub.location.protocol='https:';windowStub.location.hostname='nzm1000-sudo.github.io';
  sandbox.fetch=()=>{throw new Error('must not fetch on GitHub Pages')};
  assert.equal(app.serverCapable(),false,'GitHub Pages never asks for server data');
  assert.equal(await app.connectServer(),'local');
  windowStub.location.protocol='http:';windowStub.location.hostname='192.168.68.83';
  // 401: stays local, local store untouched
  const localBefore=store.consultingKnowledge,nLocal=app.data.meetings.length;
  sandbox.fetch=async()=>({ok:false,status:401});
  assert.equal(await app.connectServer(),'auth');
  assert.equal(app.data.meetings.length,nLocal);
  // unknown contract: rejected
  sandbox.fetch=async()=>({ok:true,status:200,json:async()=>({contract:'other',recordings:[]})});
  assert.equal(await app.connectServer(),'error');
  assert.equal(app.data.meetings.length,nLocal);
  assert.throws(()=>app.normalizeSnapshot({contract:'x'}));
  // valid snapshot
  const snap={contract:'nitzotza.snapshot.v1',generatedAt:'2026-09-28T08:00:00Z',
    recordings:[
      {id:'r1',person:'אורית',date:'2026-09-20',title:'פגישה ראשונה',transcript:'הקושי המרכזי הוא עומס בעבודה. המלצתי לקבוע שעת סיום קבועה בכל יום. בפגישה הבאה נבדוק איך זה עבד.'},
      {id:'r2',person:'אורית',date:'2026-09-27T10:00:00Z',transcript:'אורית סיפרה שהשעה הקבועה עזרה לה מאוד.'},
      {id:'bad',person:'',date:'2026-09-01',transcript:'x'},
      {id:'bad2',person:'מישהו',date:'לא תאריך',transcript:'x'}
    ],
    cases:[{id:'k1',title:'אורית · עומס',people:['אורית'],recordingIds:['r1','r2','missing']}],
    followups:[{id:'s1',person:'אורית',title:'לבדוק את שעת הסיום',due:'2026-10-01',recordingId:'r1'}]};
  let calls=0;
  sandbox.fetch=async(url,opts)=>{calls++;assert.equal(url,'./api/snapshot');assert.equal(opts.cache,'no-store');return{ok:true,status:200,json:async()=>structuredClone(snap)}};
  assert.equal(await app.connectServer(),'server');
  assert.equal(app.SOURCE.mode,'server');
  assert.equal(app.data.meetings.length,2,'invalid recordings dropped');
  assert.equal(app.data.meetings[1].date,'2026-09-27','date trimmed to day');
  assert(app.data.meetings[1].title.startsWith('הקלטה מ־')&&app.data.meetings[1].title.includes('27'),'fallback title');
  assert.deepEqual([...app.data.cases[0].recordingIds],['r1','r2'],'unknown recording ids dropped from case');
  assert(app.data.meetings.every(m=>m.analysis&&m.analysis.version),'server recordings analyzed');
  assert(app.data.meetings[0].analysis.advice.length>0,'advice detected in server recording');
  assert.equal(store.consultingKnowledge,localBefore,'local demo store untouched in server mode');
  assert(store['consultingKnowledge:server'],'server copy cached separately');
  assert.equal(store.consultingSource,'server');
  assert(app.searchAll('שעת סיום').total>0,'search works on server data');
  const a=app.askSecondBrain('מה ייעצתי לאורית?',{type:'global'});
  assert(a.findings.length>0&&a.evidenceIds.length>0,'assistant answers from server data');
  // local done flag and local followup survive a re-sync; analysis reused
  app.data.followups.find(f=>f.id==='s1').done=true;
  app.data.followups.push({id:'loc',person:'אורית',title:'מקומי',due:'2026-10-02',done:false,local:true});
  const an=app.data.meetings[0].analysis;
  await app.connectServer();
  assert.equal(calls,2);
  assert(app.data.followups.find(f=>f.id==='s1').done,'local done flag kept');
  assert(app.data.followups.some(f=>f.id==='loc'),'local followup kept');
  assert.equal(app.data.meetings[0].analysis,an,'unchanged transcript not re-analyzed');
  // server down: keep last copy
  sandbox.fetch=async()=>{throw new Error('offline')};
  await app.connectServer();
  assert.equal(app.data.meetings.length,2,'offline keeps server copy');
}

// 15. reason pairing stays local in long recordings
{
  const filler=Array.from({length:8},(_,i)=>'משפט רקע מספר '+(i+1)+' בלי שום תוכן מיוחד.').join(' ');
  const an=app.analyzeTranscript('המלצתי לקבוע שעת סיום קבועה בכל יום. '+filler+' המלצתי לצאת להליכה בערב. בגלל שיש לך חשש מזה, אז את מתעסקת בזה.');
  const [a1,a2]=[...an.advice].sort((x,y)=>x.evidence.seg-y.evidence.seg);
  assert(a1&&a2,'two advice items');
  const r=sandbox.window.__consulting.reasonFor;
  assert.equal(r(an,a1),null,'far reason is not attached to early advice');
  assert(r(an,a2)&&r(an,a2).text.includes('חשש'),'adjacent reason attached');
}

// 16. consultant label from older PLAUD voice profile
{
  const an=app.analyzeTranscript('ניצוצא שלום יוסף ברבי: מה הכי קשה לך עכשיו?\nדובר 2: הקושי הוא הלחץ בעבודה.');
  assert(an.methodology.some(x=>x.subtype==='question'&&x.actor==='consultant'),'full profile name counts as consultant');
  const other=app.analyzeTranscript('דובר 1: מה הכי קשה לך עכשיו?\nדובר 2: הקושי הוא הלחץ בעבודה.');
  assert.equal(other.methodology.length,0,'generic labels are not treated as the consultant');
}

// 17. advice counts only from the consultant when the consultant is labelled
{
  const an=app.analyzeTranscript('הרב: כדאי לך לקבוע שעה קבועה לשיחה.\nדובר 2: אני חושבת שצריך לעשות את זה אחרת.');
  assert.equal(an.advice.length,1,'client "צריך ל" is not advice');
  assert(an.advice[0].evidence.speaker==='הרב');
  const un=app.analyzeTranscript('Speaker 1: כדאי לך לקבוע שעה קבועה לשיחה.\nSpeaker 2: אני חושבת שצריך לעשות את זה אחרת.');
  assert.equal(un.advice.length,1,'"צריך לעשות" in the first person is not advice');
}

// 18. stricter advice, inferred consultant, same-speaker reasons, PLAUD summary
{
  const t=['Speaker 1: אני חושבת שצריך לעשות את זה אחרת.','Speaker 2: כדאי לך לדבר איתו לפני שאת מחליטה.',
    'Speaker 2: בגלל שאם תחכי זה רק יחמיר.','Speaker 1: כדאי לי לחשוב על זה עוד קצת.','Speaker 2: תגיד לי, מתי זה התחיל?',
    'Speaker 2: אל תמהר להילחם איתם בשבוע הראשון.','Speaker 1: בגלל שאני פוחדת מהתגובה שלו.','Speaker 2: תנסה לכתוב לו מכתב קצר.'].join('\n');
  const an=app.analyzeTranscript(t);
  assert.deepEqual(an.consultant,{label:'Speaker 2',inferred:true},'consultant inferred from explicit advice');
  const texts=an.advice.map(a=>a.text);
  assert(texts.some(x=>x.startsWith('כדאי לך'))&&texts.some(x=>x.startsWith('אל תמהר'))&&texts.some(x=>x.startsWith('תנסה')),'direct advice kept');
  assert(!texts.some(x=>x.includes('כדאי לי'))&&!texts.some(x=>x.includes('תגיד לי'))&&!texts.some(x=>x.includes('צריך לעשות')),'noise dropped');
  assert(an.advice.every(a=>a.evidence.speaker==='Speaker 2'),'advice only from the consultant');
  const r=sandbox.window.__consulting.reasonFor;
  for(const a of an.advice){const why=r(an,a);if(why)assert.equal(why.evidence.speaker,'Speaker 2','reason from the same speaker')}
  const snap=app.normalizeSnapshot({contract:'nitzotza.snapshot.v1',recordings:[{id:'p1',person:'x',date:'2026-09-01',transcript:'שלום רב.',plaud:'סיכום של PLAUD'}]},null);
  assert.equal(snap.meetings[0].plaud,'סיכום של PLAUD','PLAUD summary carried from the snapshot');
}

console.log('ALL SMOKE TESTS PASSED');
