'use strict';
/* ============================================================
   מאגר הייעוץ · v3.0 "Clear View"
   Vanilla JS PWA · RTL · localStorage
   שמור: מפתח האחסון, מבנה הנתונים, ה־routes הישנים, כלי modelContext
   ============================================================ */

/* ---------- נתוני דוגמה (סינתטיים בלבד) ---------- */
const SEED = {
  meetings: [
    {id:'m1',title:'שיחה על גבולות במשפחה',person:'משפחת לוי',date:'2026-09-08',summary:'הוגדרה שיחה משותפת להצבת גבול ברור מול המשפחה המורחבת.',transcript:'הקושי המרכזי הוא התערבות חוזרת של ההורים. המלצתי שהבעל והאישה ינסחו יחד גבול אחיד ויציגו אותו כעמדה משותפת.',plaud:'נושא: התערבות ההורים בחיי הזוג.\nהמלצה: לגבש עמדה משותפת לפני הצגת הגבול.\nמשימה: שיחה משותפת של בני הזוג לפני המפגש המשפחתי הבא.',tags:['גבולות','זוגיות']},
    {id:'m2',title:'פגישת מעקב · תקשורת בזמן קונפליקט',person:'דניאל',date:'2026-09-03',summary:'נבחר כלל של עצירה לעשר דקות לפני חזרה לשיחה טעונה.',transcript:'דניאל תיאר ויכוחים שמסלימים. המלצתי לעצור, להירגע ולחזור לשיחה בזמן מוסכם. בפגישה הבאה נבדוק אם הצליחו ליישם.',plaud:'נושא: ויכוחים שמסלימים בין בני הזוג.\nהמלצה: כלל עצירה של עשר דקות וחזרה בזמן מוסכם.\nמעקב: לבדוק יישום בפגישה הבאה.',tags:['תקשורת','ויסות']},
    {id:'m3',title:'התלבטות סביב שינוי מקצועי',person:'נועה',date:'2026-08-27',summary:'הוחלט לבדוק מעבר הדרגתי במקום החלטה חדה מתוך לחץ.',transcript:'נועה שוקלת לעזוב את העבודה. סיכמנו שתבצע שני ניסויים קטנים לפני החלטה ותתעד מה נותן לה אנרגיה.',plaud:'נושא: שקילת עזיבת מקום העבודה.\nהחלטה: שני ניסויים קטנים לפני החלטה.\nמשימה: יומן אנרגיה שבועי.',tags:['החלטות','קריירה']},
    {id:'m4',title:'מעקב · איך עבד כלל עשר הדקות',person:'דניאל',date:'2026-09-17',summary:'הכלל עבד חלקית. נוסף ניסוח מפורש של זמן החזרה.',transcript:'[00:01] היועץ: איך עבד כלל עשר הדקות?\n[00:20] דניאל: עבד בשתי מריבות מתוך שלוש. בפעם השלישית אשתי הרגישה שאני בורח.\n[01:05] היועץ: המלצתי שלפני העצירה תאמר במפורש מתי תחזור, כי בלי זמן חזרה העצירה נשמעת כנטישה.\n[01:20] היועץ: בבית עם ילדים קטנים זה לא תמיד אפשרי, ואז עוצרים רק את הנושא ולא את השיחה.\n[01:40] היועץ: המטרה היא שהעצירה תיתפס ככלי משותף ולא כבריחה.\n[02:10] היועץ: בפגישה הבאה נבדוק אם הניסוח המפורש שינה את התגובה.',plaud:'נושא: תוצאות כלל עשר הדקות.\nתוצאה: הצליח בשתיים מתוך שלוש מריבות.\nהמלצה: לומר במפורש מתי חוזרים לשיחה.\nחריג: כשיש ילדים קטנים בבית עוצרים את הנושא ולא את השיחה.',tags:['תקשורת','ויסות']}
  ],
  people:[{name:'משפחת לוי',topic:'גבולות משפחתיים'},{name:'דניאל',topic:'תקשורת זוגית'},{name:'נועה',topic:'שינוי מקצועי'}],
  principles:[
    {title:'חזית זוגית משותפת לפני הצבת גבול',description:'מגבשים עמדה בין בני הזוג ורק אז מציגים אותה למשפחה המורחבת.'},
    {title:'לא מקבלים החלטה גדולה מתוך סערה',description:'מפרקים החלטה לניסויים קטנים ואוספים מידע לפני צעד בלתי הפיך.'},
    {title:'עצירה היא כלי תקשורת, לא נטישה',description:'מגדירים מראש זמן חזרה לשיחה כדי שהפסקה תייצר ביטחון.'}
  ],
  followups:[
    {id:'f1',person:'דניאל',title:'לבדוק איך עבד כלל עשר הדקות',due:'2026-09-14',done:true,meetingId:'m2'},
    {id:'f2',person:'משפחת לוי',title:'מה הייתה תגובת המשפחה לגבול החדש?',due:'2026-09-16',done:false,meetingId:'m1'},
    {id:'f3',person:'נועה',title:'לעבור על תוצאות שני הניסויים',due:'2026-09-20',done:false,meetingId:'m3'},
    {id:'f4',person:'דניאל',title:'האם הניסוח המפורש של זמן החזרה שינה את התגובה?',due:'2026-10-01',done:false,meetingId:'m4'}
  ]
};

/* ---------- אחסון ---------- */
const LS_KEY='consultingKnowledge';
const BACKUP_KEY='consultingLastBackup';
let storageWarned=false;
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||structuredClone(SEED)}catch{return structuredClone(SEED)}}
function save(){
  try{localStorage.setItem(LS_KEY,JSON.stringify(data))}
  catch{if(!storageWarned){storageWarned=true;toast('האחסון במכשיר לא זמין. השינויים יישמרו רק עד סגירת הדף.')}}
}

/* ---------- עזרים ---------- */
const el=id=>document.getElementById(id);
const qsa=(s,root=document)=>root.querySelectorAll(s);
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function parseDay(d){return new Date(d+'T12:00:00')}
function formatDate(d){const dt=parseDay(d);const o={day:'numeric',month:'long'};if(dt.getFullYear()!==new Date().getFullYear())o.year='numeric';return new Intl.DateTimeFormat('he-IL',o).format(dt)}
function formatFull(d){return new Intl.DateTimeFormat('he-IL',{weekday:'short',day:'numeric',month:'long',year:'numeric'}).format(parseDay(d))}
function isoOf(dt){return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0')}
function todayISO(){return isoOf(new Date())}
function addDays(iso,n){const d=parseDay(iso);d.setDate(d.getDate()+n);return isoOf(d)}
function dueLabel(d){
  if(!d)return{t:'ללא תאריך',cls:''};
  const today=new Date();today.setHours(12,0,0,0);
  const days=Math.round((parseDay(d)-today)/864e5);
  if(days<0)return{t:days===-1?'עבר יום אחד':'עברו '+(-days)+' ימים',cls:'overdue'};
  if(days===0)return{t:'היום',cls:'today'};
  if(days===1)return{t:'מחר',cls:''};
  return{t:formatDate(d),cls:''};
}
function confLabel(c){
  if(!c&&c!==0)return null;
  if(c>=80)return{label:'ביטחון גבוה',n:3};
  if(c>=65)return{label:'ביטחון בינוני',n:2};
  return{label:'ביטחון נמוך',n:1};
}
let toastTimer=null;
function toast(msg){const t=el('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}
function ssGet(k,fb){try{const v=sessionStorage.getItem(k);return v?JSON.parse(v):fb}catch{return fb}}
function ssSet(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}

/* ---------- אייקונים ---------- */
const ICONS={
  home:'<path d="M4 9.5 10 4l6 5.5V16a1 1 0 0 1-1 1h-3.5v-4.2h-3V17H5a1 1 0 0 1-1-1z"/>',
  mic:'<rect x="7.3" y="3" width="5.4" height="9.4" rx="2.7"/><path d="M5 10.8a5 5 0 0 0 10 0M10 15.8V18"/>',
  users:'<circle cx="7.2" cy="7.3" r="2.7"/><path d="M2.8 16.4c.6-2.9 2.4-4.4 4.4-4.4s3.8 1.5 4.4 4.4M13.2 5a2.5 2.5 0 1 1 .4 4.9M14.3 12.2c1.9.4 3.1 1.8 3.5 4"/>',
  spark:'<path d="M10 2.6 12 8l5.4 2L12 12l-2 5.4L8 12 2.6 10 8 8z"/>',
  bulb:'<path d="M7.2 13.2c-1.5-1-2.5-2.7-2.5-4.6a5.3 5.3 0 0 1 10.6 0c0 1.9-1 3.6-2.5 4.6v1.6H7.2zM7.8 17.4h4.4"/>',
  split:'<path d="M10 3v5M10 8 4.5 13.5V17M10 8l5.5 5.5V17"/>',
  search:'<circle cx="9" cy="9" r="5.4"/><path d="m13.1 13.1 3.9 3.9"/>',
  check:'<circle cx="10" cy="10" r="7"/><path d="m6.7 10.3 2.2 2.2 4.4-4.8"/>',
  checksm:'<path d="m4.5 10.5 3.4 3.4 7.6-8.3"/>',
  plus:'<path d="M10 4.5v11M4.5 10h11"/>',
  back:'<path d="m7.5 4.5 6 5.5-6 5.5"/>',
  fwd:'<path d="m12.5 4.5-6 5.5 6 5.5"/>',
  quote:'<path d="M8 6.2C5.8 7 4.6 8.6 4.6 11v3.2h4V10H6.4c.1-1.3.9-2.2 2.3-2.8zM15.4 6.2c-2.2.8-3.4 2.4-3.4 4.8v3.2h4V10h-2.2c.1-1.3.9-2.2 2.3-2.8z"/>',
  clock:'<circle cx="10" cy="10" r="7"/><path d="M10 6.2V10l2.6 1.8"/>',
  doc:'<path d="M5.5 3h6.8L15 6.7V17a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM12 3.2V7h3.8M7 10.5h6M7 13.5h6"/>'
};
const ic=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ---------- ניווט ---------- */
const NAV=[
  {group:'עבודה יומית',items:[
    {key:'home',label:'היום',icon:'home',mobile:true},
    {key:'recordings',label:'הקלטות',icon:'mic',count:()=>data.meetings.length,mobile:true},
    {key:'people',label:'אנשים',icon:'users',count:()=>allPeople().length,mobile:true},
    {key:'followups',label:'מעקבים',icon:'check',count:()=>data.followups.filter(f=>!f.done).length,alert:()=>data.followups.some(f=>!f.done&&f.due&&f.due<todayISO()),mobile:true}
  ]},
  {group:'הידע',items:[
    {key:'advice',label:'עצות ונימוקים',icon:'bulb',count:()=>allAdvice().length,mobile:true},
    {key:'principles',label:'עקרונות',icon:'spark',count:()=>data.principles.length},
    {key:'contradictions',label:'סתירות וחריגים',icon:'split',count:()=>contradictionCount()}
  ]}
];
const PARENT={case:'recordings',person:'people',principle:'principles'};
const KNOWN=['home','recordings','people','followups','advice','principles','contradictions','search','case','person','principle'];
function parseRoute(){
  let h=(location.hash||'').replace(/^#/,'');
  if(h.startsWith('/'))h=h.slice(1);
  if(!h)return{key:'home',param:null};
  const i=h.indexOf('/');
  const key=i<0?h:h.slice(0,i);
  let param=null;
  if(i>=0){try{param=decodeURIComponent(h.slice(i+1))}catch{param=h.slice(i+1)}}
  return{key,param};
}
function navigate(key,param){
  const target=param?'/'+key+'/'+encodeURIComponent(param):key;
  if(location.hash==='#'+target)render();
  else location.hash=target;
}

/* ---------- מצב ניווט (נשמר בין מסכים) ---------- */
const navState=ssGet('consultingNav',{scroll:{},lastCase:null,filters:{},caseTab:{}});
let pendingJump=null;
function persistNav(){ssSet('consultingNav',navState)}

/* ---------- ניתוח מקומי (כללים, פונקציה טהורה) ---------- */
const ANALYSIS_VERSION=3;
const ENGINE_LABEL='כללים מקומיים';
const H={
  contradiction:/(שונה מכלל|חריג|לעומת זאת|לא תמיד|בתנאים מסוימים|יוצא מן הכלל)/,
  advice:/(המלצתי|המלצנו|הצעתי|אני מציע(ה)?|אני ממליץ(ה)?|מומלץ|כדאי|מוטב|צריך(ה)? (ש|ל)|נראה לי (שת|שכדאי))/,
  decision:/(הוחלט|החלטנו|סיכמנו|הסכמנו)/,
  followup:/(בפגישה הבאה|בפגישה העתידה|נבדוק|לבדוק|מעקב|נחזור (על|ל)?זה|נחזור לזה)/,
  result:/(^|[\s,])(עבד|עבדה|עבדו|הצליח|הצליחה|הצליחו|לא הצליח|השתפר|השתפרה|השתפרו|יישם|יישמה|יישמו|עזר|עזרה|לא עזר)(?=[\s.,!?]|$)/,
  outcome:/(המטרה|התוצאה (הצפויה|הרצויה)|מצפ(ה|ים) ש|הציפייה)/,
  rationale:/(מכיוון|בגלל|הסיבה|שכן|כדי ש|על מנת|הנימוק)/,
  problem:/(הקושי|הבעיה|מתקש|ויכוח|מריב|קונפליקט|מסלימ|פחד|חושש|שוקל|מתלבט|נתקע|סובל|לחץ)/,
  observation:/(תיאר|דיווח|סיפר|שיתף|שיתפה|הרגיש|שמתי לב|הבנתי ש|ניכר ש)/
};
const LABEL_WORDS=new Set(['מטרה','סיכום','תאריך','זמן','נושא','שם','עמודה','סוג','מקור','המלצה','משימה','תוצאה','חריג','החלטה','מעקב']);
function splitSegments(transcript){
  const out=[];
  const lines=String(transcript||'').split(/\n+/).map(l=>l.trim()).filter(Boolean);
  for(const raw of lines){
    let rest=raw,time=null;
    const tm=rest.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*)$/);
    if(tm){time=tm[1];rest=tm[2]}
    let speaker=null;
    const sm=rest.match(/^([^:：]{2,25})[:：]\s*(.+)$/);
    if(sm&&!/^\d/.test(sm[1])&&!/[.,?!]/.test(sm[1])&&!LABEL_WORDS.has(sm[1].trim())){speaker=sm[1].trim();rest=sm[2].trim()}
    if(!rest)continue;
    // פיצול למשפטים שלמים בלבד, לפי סימן סוף משפט ורווח. אין פיצול בתוך מילה.
    const sents=rest.split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    for(const s of sents)out.push({speaker,time,text:s});
  }
  return out;
}
function analyzeTranscript(text){
  const segments=splitSegments(text);
  const items=[];
  const used=new Set();
  const push=(type,seg,i,kind,confidence)=>{
    if(used.has(i))return;used.add(i);
    items.push({id:type+'-'+i,type,text:seg.text,kind,confidence,evidence:{quote:seg.text,time:seg.time,speaker:seg.speaker,seg:i}});
  };
  segments.forEach((seg,i)=>{
    const t=seg.text;
    const question=/\?\s*$/.test(t);
    if(H.contradiction.test(t))push('contradiction',seg,i,'inferred',60);
    else if(!question&&H.advice.test(t))push('advice',seg,i,'explicit',84);
    else if(H.decision.test(t))push('decision',seg,i,'explicit',80);
    else if(H.followup.test(t))push('followup',seg,i,'explicit',78);
    else if(!question&&H.result.test(t))push('result',seg,i,'explicit',72);
    else if(H.outcome.test(t))push('outcome',seg,i,'explicit',74);
    else if(H.rationale.test(t))push('reasoning',seg,i,'explicit',74);
    else if(H.problem.test(t))push('problem',seg,i,'explicit',76);
    else if(H.observation.test(t))push('observation',seg,i,'inferred',64);
    else if(!question&&segments.length<=6)push('observation',seg,i,'inferred',48);
  });
  // נימוק שמוטמע בתוך משפט העצה או ההחלטה
  const RATIONALE_CLAUSE=/[\s,](כי|מכיוון ש|בגלל ש|שכן|כדי ש|על מנת ל)\s*(\S.*)$/;
  for(const it of [...items]){
    if(it.type!=='advice'&&it.type!=='decision')continue;
    const mm=it.text.match(RATIONALE_CLAUSE);
    if(mm&&mm[2].length>=8){
      items.push({id:'reasoning-c-'+it.evidence.seg,type:'reasoning',text:mm[0].replace(/^[\s,]+/,''),kind:'inferred',confidence:70,evidence:{...it.evidence},forAdvice:it.id});
    }
  }
  const by=t=>items.filter(x=>x.type===t);
  const problems=by('problem');
  const times=segments.map(s=>s.time).filter(Boolean);
  return {
    version:ANALYSIS_VERSION,
    segments,
    speakers:[...new Set(segments.map(s=>s.speaker).filter(Boolean))],
    problem:problems[0]||null,
    observations:problems.slice(1).concat(by('observation')).slice(0,6),
    reasoning:by('reasoning'),
    advice:by('decision').concat(by('advice')),
    outcomes:by('outcome'),
    results:by('result'),
    followups:by('followup'),
    contradictions:by('contradiction'),
    wordCount:String(text||'').trim().split(/\s+/).filter(Boolean).length,
    timeRange:times.length>=2?times[0]+'–'+times[times.length-1]:null,
    summary:(by('decision').concat(by('advice'))[0]||problems[0]||segments[0])?.text||''
  };
}
function ensureAllAnalysis(){
  let changed=false;
  for(const m of data.meetings){
    if(!m.id){m.id='m-'+Date.now()+'-'+Math.floor(Math.random()*1e4);changed=true}
    if(!m.analysis||m.analysis.version!==ANALYSIS_VERSION){m.analysis=analyzeTranscript(m.transcript);changed=true}
  }
  data.principles.forEach((p,i)=>{if(!p.id){p.id='p'+(i+1);changed=true}});
  if(changed)save();
}
function reasonFor(an,adv){
  const rs=an.reasoning||[];
  return rs.find(r=>r.forAdvice===adv.id)||rs.find(r=>!r.forAdvice)||null;
}

/* ---------- נגזרות מהנתונים ---------- */
const byDateDesc=(a,b)=>b.date.localeCompare(a.date);
function meetingsOf(name){return data.meetings.filter(m=>m.person===name).sort(byDateDesc)}
function allPeople(){
  const names=new Map();
  for(const p of data.people)names.set(p.name,p);
  for(const m of data.meetings)if(!names.has(m.person))names.set(m.person,{name:m.person});
  return[...names.values()].map(p=>{
    const ms=meetingsOf(p.name);
    return{...p,count:ms.length,last:ms[0]?.date||null,first:ms[ms.length-1]?.date||null,topic:p.topic||(ms[0]?.tags||[])[0]||''};
  }).sort((a,b)=>(b.last||'').localeCompare(a.last||''));
}
function allAdvice(){
  const out=[];
  for(const m of [...data.meetings].sort(byDateDesc)){
    const an=m.analysis||{};
    for(const a of an.advice||[])out.push({m,a,reason:reasonFor(an,a)});
  }
  return out;
}
function adviceChanges(){
  const out=[];
  for(const p of allPeople()){
    const ms=meetingsOf(p.name).filter(m=>(m.analysis?.advice||[]).length);
    for(let i=0;i<ms.length-1;i++){
      out.push({person:p.name,later:ms[i],earlier:ms[i+1],a1:ms[i+1].analysis.advice[0],a2:ms[i].analysis.advice[0]});
    }
  }
  return out;
}
function allExceptions(){
  const out=[];
  for(const m of [...data.meetings].sort(byDateDesc))for(const c of m.analysis?.contradictions||[])out.push({m,c});
  return out;
}
function contradictionCount(){return allExceptions().length+adviceChanges().length}
const TAG_RULES=[[/גבול/,'גבולות'],[/זוג|אשתו|בעלה|אשתי|בעלי|נישוא/,'זוגיות'],[/עבודה|קריירה|מקצוע/,'קריירה'],[/ויכוח|מריב|קונפליקט/,'תקשורת'],[/החלט|מתלבט|שוקל/,'החלטות'],[/הורים|משפחה/,'משפחה'],[/ילד|ילדים|חינוך/,'הורות'],[/פחד|חרד|לחץ|להירגע/,'ויסות']];
function inferTags(text){const t=TAG_RULES.filter(([re])=>re.test(text)).map(([,n])=>n);return t.length?[...new Set(t)].slice(0,3):['כללי']}

/* ---------- חיפוש ---------- */
const STOP=new Set(('מה מתי איך למה לאן האם מי איזה איזו באילו באיזו אלו אלה את אתה אני הוא היא זה זו של שלנו שלכם שלך כי ב בה בא בו בעל על עלי עליה עליו עם אצל גם רק לא כן יותר כדי לתת שאלה תרצה נא ממש כנראה אפשר לך לי לו לה לנו מהם איתו איתה בין עבור מהן אמרתי ייעצתי המלצתי נתתי עצתי מקרים מקרה').split(' '));
const SYN=[
  ['זוגיות','זוגי','בני זוג','בני הזוג','אשתו','בעלה','אשתי','נישואין'],
  ['גבול','גבולות'],
  ['משפחה','הורים','ההורים','משפחה מורחבת','חמות'],
  ['עבודה','קריירה','מקצועי','מקצוע'],
  ['ויכוח','ויכוחים','מריבה','מריבות','קונפליקט'],
  ['פחד','חשש','חושש','לחץ','פחדו'],
  ['החלטה','החלטות','התלבטות','מתלבט','שוקל'],
  ['עצירה','לעצור','הפסקה','ויסות','להירגע']
];
const PFX=['וכש','וש','וה','וב','ול','ומ','שה','שב','של','כש','מה','בה','לה','ה','ו','ב','ל','מ','ש','כ'];
function tokenize(q){
  return String(q||'').toLowerCase().replace(/[“”"«»׳״']/g,' ')
    .split(/\s+/)
    .map(w=>w.replace(/^[.,!?…:;()\-–+]+/,'').replace(/[.,!?…:;()\-–+]+$/,''))
    .filter(w=>w.length>=2&&!STOP.has(w));
}
function stems(tok){
  const out=new Set([tok]);
  for(const p of PFX)if(tok.startsWith(p)&&tok.length-p.length>=3)out.add(tok.slice(p.length));
  return[...out];
}
function variants(tok){
  const v=new Map();
  for(const s of stems(tok))v.set(s,s===tok?1:0.9);
  for(const g of SYN){
    const hit=g.some(w=>[...v.keys()].some(s=>s===w||(w.length>=3&&s.startsWith(w))||(s.length>=3&&w.startsWith(s))));
    if(hit)for(const w of g)if(!v.has(w))v.set(w,0.6);
  }
  return[...v.entries()].map(([s,w])=>({s,w}));
}
function prepQuery(q){
  const tokens=tokenize(q);
  return{tokens,vars:tokens.map(variants),marks:[...new Set(tokens.flatMap(t=>variants(t).map(v=>v.s)))].sort((a,b)=>b.length-a.length)};
}
function fieldScore(text,vars){
  if(!text)return 0;
  const t=String(text).toLowerCase();
  let best=0;for(const v of vars)if(v.w>best&&t.includes(v.s))best=v.w;
  return best;
}
function highlightEsc(escaped,marks){
  if(!marks.length)return escaped;
  const re=new RegExp('('+marks.map(m=>esc(m).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','g');
  return escaped.replace(re,'<mark>$1</mark>');
}
function snippetOf(text,q){
  const t=String(text||'');const tl=t.toLowerCase();
  let idx=-1;for(const m of q.marks){const i=tl.indexOf(m);if(i>=0&&(idx<0||i<idx))idx=i}
  if(idx<0)return'';
  const start=Math.max(0,idx-70),end=Math.min(t.length,idx+120);
  return highlightEsc(esc((start>0?'…':'')+t.slice(start,end)+(end<t.length?'…':'')),q.marks);
}
function scoreRecord(q,fields){
  let score=0,hit=0;
  q.vars.forEach(vars=>{
    let w=0;
    for(const[text,weight]of fields)w+=fieldScore(text,vars)*weight;
    if(w>0)hit++;score+=w;
  });
  if(!hit)return 0;
  return hit<q.tokens.length?score*0.5:score;
}
function searchAll(query){
  query=String(query||'').trim();
  const q=prepQuery(query);
  const groups={meeting:[],person:[],advice:[],principle:[],followup:[]};
  if(!q.tokens.length)return{query,tokens:q.tokens,groups,total:0};
  const hintAdvice=/(אמרתי|ייעצתי|המלצתי|נתתי|עצה|עצות|עצתי)/.test(query);
  const hintPrinciple=/(עקרונ|עיקרון|דפוס|חוזר|מתודולוגיה|שיטה)/.test(query);
  for(const m of data.meetings){
    const s=scoreRecord(q,[[m.title,4],[(m.tags||[]).join(' '),3],[m.summary,3],[m.person,3],[m.plaud,2],[m.transcript,2]]);
    if(!s)continue;
    const snip=snippetOf(m.transcript,q)||snippetOf(m.plaud,q)||snippetOf(m.summary,q)||esc((m.summary||'').slice(0,140));
    groups.meeting.push({id:m.id,score:s,title:m.title,meta:esc(m.person)+' · '+formatDate(m.date),snippet:snip,route:'case/'+m.id});
  }
  for(const p of allPeople()){
    const s=scoreRecord(q,[[p.name,5],[p.topic,2]]);
    if(!s)continue;
    groups.person.push({id:p.name,score:s,title:p.name,meta:esc(p.topic||'')+(p.count?' · '+p.count+' פגישות':''),route:'person/'+encodeURIComponent(p.name)});
  }
  for(const{m,a,reason}of allAdvice()){
    let s=scoreRecord(q,[[a.text,4],[reason?.text,2],[m.person,3],[(m.tags||[]).join(' '),2],[m.title,1]]);
    if(!s)continue;
    if(hintAdvice)s*=1.5;
    groups.advice.push({id:m.id+':'+a.id,score:s,title:a.text,meta:esc(m.person)+' · '+formatDate(m.date),snippet:reason?'<b>למה:</b> '+esc(reason.text):'',route:'case/'+m.id});
  }
  for(const p of data.principles){
    let s=scoreRecord(q,[[p.title,4],[p.description,2]]);
    if(!s)continue;
    if(hintPrinciple)s*=1.5;
    groups.principle.push({id:p.id,score:s,title:p.title,meta:'עיקרון מועמד · '+linkedCases(p).length+' מקרים מקושרים',route:'principle/'+p.id});
  }
  for(const f of data.followups){
    const s=scoreRecord(q,[[f.title,4],[f.person,3]]);
    if(!s)continue;
    groups.followup.push({id:f.id,score:s,title:f.title,meta:esc(f.person)+' · '+(f.done?'הושלם':dueLabel(f.due).t),route:'followups'});
  }
  let total=0;
  for(const k in groups){groups[k]=groups[k].sort((a,b)=>b.score-a.score).slice(0,20);total+=groups[k].length}
  return{query,tokens:q.tokens,groups,total};
}
const GROUP_ORDER=['person','advice','meeting','principle','followup'];
const GROUP_LABEL={meeting:'הקלטות',person:'אנשים',advice:'עצות',principle:'עקרונות',followup:'מעקבים'};
const GROUP_ICON={meeting:'mic',person:'users',advice:'bulb',principle:'spark',followup:'check'};

/* ---------- עקרונות: קישור לפי חפיפת מילים (השערה בלבד) ---------- */
function wordsOf(s){return String(s||'').toLowerCase().split(/[\s,.]+/).filter(w=>w.length>=3&&!STOP.has(w))}
function overlap(pr,hay){
  let s=0;for(const w of new Set(wordsOf(pr.title+' '+pr.description))){const st=stems(w);if(st.some(x=>x.length>=3&&hay.includes(x)))s++}
  return s;
}
function meetingHay(m){
  const an=m.analysis||{};
  return[m.title,m.summary,m.plaud,...(m.tags||[]),...(an.advice||[]).map(a=>a.text),...(an.reasoning||[]).map(a=>a.text),...(an.observations||[]).map(o=>o.text)].filter(Boolean).join(' ').toLowerCase();
}
function relatedPrinciples(meeting,limit=3){
  const hay=meetingHay(meeting);
  if(!hay.trim())return[];
  return data.principles.map(p=>({principle:p,strength:overlap(p,hay)})).filter(x=>x.strength>=2).sort((a,b)=>b.strength-a.strength).slice(0,limit);
}
function linkedCases(p){return data.meetings.filter(m=>relatedPrinciples(m,5).some(r=>r.principle.id===p.id)).sort(byDateDesc)}

/* ---------- רכיבי HTML ---------- */
function pill(t,cls=''){return`<span class="pill ${cls}">${esc(t)}</span>`}
function confHtml(c){
  const l=confLabel(c);if(!l)return'';
  return`<span class="conf" title="ביטחון המנוע בזיהוי: ${l.label}">${l.label}<span class="conf-dots" aria-hidden="true">${'<b></b>'.repeat(l.n)}${'<i></i>'.repeat(3-l.n)}</span></span>`;
}
function kindTag(k){return`<span class="tag ${k==='explicit'?'tag-exp':'tag-inf'}">${k==='explicit'?'נאמר במפורש':'הסקה של המערכת'}</span>`}
function whyHtml(it,mid){
  const ev=it.evidence;if(!ev)return'';
  return`<div class="why" id="why-${esc(mid)}-${esc(it.id)}" hidden>
    <p class="why-q">״${esc(ev.quote)}״</p>
    <div class="why-meta">${ev.speaker?`<span>${esc(ev.speaker)}</span>`:''}${ev.time?`<span class="mono" dir="ltr">${esc(ev.time)}</span>`:''}<span>משפט ${ev.seg+1} בתמלול</span>
    <button class="link-btn" type="button" data-open-src="${ev.seg}">פתיחה בתמלול ${ic('fwd')}</button></div>
  </div>`;
}
function itemHtml(it,mid){
  return`<div class="kitem ${it.kind}">
    <p class="kitem-text">${esc(it.text)}</p>
    <div class="kitem-foot">${kindTag(it.kind)}${confHtml(it.confidence)}
      ${it.evidence?`<button class="link-btn why-btn" type="button" aria-expanded="false" data-why="why-${esc(mid)}-${esc(it.id)}">${ic('quote')}למה?</button>`:''}
    </div>
    ${whyHtml(it,mid)}
  </div>`;
}
function stepHtml(label,items,mid,opts={}){
  return`<section class="chain-step ${opts.cls||''} ${opts.cat?'k-'+opts.cat:''}">
    <h3 class="step-label">${label}</h3>
    <div class="step-body">${items&&items.length?items.map(it=>itemHtml(it,mid)).join(''):`<p class="step-empty">${opts.empty||'לא זוהה בפגישה זו'}</p>`}</div>
  </section>`;
}
function meetingRow(m){
  const an=m.analysis||{};
  const isLast=navState.lastCase===m.id;
  return`<a class="row ${isLast?'is-last':''}" href="#/case/${esc(m.id)}" data-case-row="${esc(m.id)}">
    <div class="row-main">
      <div class="row-line1"><h3 class="row-title">${esc(m.title)}</h3></div>
      <div class="row-meta"><span>${esc(m.person)}</span><i class="dot-sep"></i><span>${formatDate(m.date)}</span>${an.wordCount?`<i class="dot-sep"></i><span>${an.wordCount} מילים</span>`:''}${(m.tags||[]).slice(0,2).map(t=>pill(t)).join('')}</div>
      ${m.summary?`<p class="row-sum">${esc(m.summary)}</p>`:''}
    </div>
    <div class="row-end"><span class="status-chip ${an.version?'':'pending'}">${an.version?'נותח':'ממתין'}</span><span class="row-arrow">${ic('fwd')}</span></div>
  </a>`;
}
function followRow(f,opts={}){
  const dl=dueLabel(f.due);
  const src=f.meetingId&&data.meetings.find(m=>m.id===f.meetingId);
  return`<div class="follow-row ${f.done?'follow-done':''}">
    <label class="check"><input class="check-input" type="checkbox" data-follow="${esc(f.id)}" ${f.done?'checked':''} aria-label="סימון ״${esc(f.title)}״ כהושלם"><span class="check-box" aria-hidden="true">${ic('checksm')}</span></label>
    <div class="follow-main">
      <strong>${esc(f.title)}</strong>
      <div class="follow-meta">${opts.noPerson?'':`<a href="#/person/${encodeURIComponent(f.person)}">${esc(f.person)}</a><i class="dot-sep"></i>`}<span class="${f.done?'':dl.cls}">${f.done?'הושלם':dl.t}</span>${src?`<i class="dot-sep"></i><a href="#/case/${esc(src.id)}">מתוך: ${esc(src.title)}</a>`:''}</div>
    </div>
  </div>`;
}
function adviceRow({m,a,reason},opts={}){
  return`<div class="adv-row">
    <p class="adv-text">${esc(a.text)}</p>
    ${reason?`<p class="adv-why"><b>למה:</b> ${esc(reason.text)}</p>`:`<p class="adv-why"><b>למה:</b> <span class="muted-note">לא זוהה נימוק מפורש</span></p>`}
    <div class="adv-foot">
      ${opts.noPerson?'':`<a href="#/person/${encodeURIComponent(m.person)}">${esc(m.person)}</a><i class="dot-sep"></i>`}
      <span>${formatDate(m.date)}</span><i class="dot-sep"></i>
      <a href="#/case/${esc(m.id)}">${esc(m.title)}</a>
      ${kindTag(a.kind)}
      ${a.evidence?`<button class="link-btn" type="button" data-src-case="${esc(m.id)}" data-src-seg="${a.evidence.seg}">${ic('quote')}ציון מקור</button>`:''}
    </div>
  </div>`;
}
function emptyState(title,hint,linkText,route){
  return`<div class="empty"><strong>${esc(title)}</strong>${hint?`<p>${esc(hint)}</p>`:''}${route?`<a class="button primary" href="#${route}">${esc(linkText||'חזרה')}</a>`:''}</div>`;
}
function sectionHead(title,link,linkText){return`<div class="section-head"><h2>${title}</h2>${link?`<a class="see-link" href="#${link}">${linkText} ${ic('fwd')}</a>`:''}</div>`}

/* ---------- זמני היום לנתיבות (חישוב אסטרונומי, NOAA) ---------- */
const PLACE={name:'נתיבות',lat:31.4231,lon:34.5886,tz:'Asia/Jerusalem'};
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
function sunParams(jd){
  const T=(jd-2451545)/36525;
  const L0=((280.46646+T*(36000.76983+T*0.0003032))%360+360)%360;
  const M=357.52911+T*(35999.05029-0.0001537*T);
  const e=0.016708634-T*(0.000042037+0.0000001267*T);
  const C=Math.sin(rad(M))*(1.914602-T*(0.004817+0.000014*T))+Math.sin(rad(2*M))*(0.019993-0.000101*T)+Math.sin(rad(3*M))*0.000289;
  const omega=125.04-1934.136*T;
  const lambda=L0+C-0.00569-0.00478*Math.sin(rad(omega));
  const eps0=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60;
  const eps=eps0+0.00256*Math.cos(rad(omega));
  const decl=deg(Math.asin(Math.sin(rad(eps))*Math.sin(rad(lambda))));
  const y=Math.tan(rad(eps/2))**2;
  const eqt=4*deg(y*Math.sin(2*rad(L0))-2*e*Math.sin(rad(M))+4*e*y*Math.sin(rad(M))*Math.cos(2*rad(L0))-0.5*y*y*Math.sin(4*rad(L0))-1.25*e*e*Math.sin(2*rad(M)));
  return{decl,eqt};
}
// דקות UTC מחצות לאירוע: השמש בגובה alt מעלות, בזריחה (dir=-1) או בשקיעה (dir=1). dir=0 = חצות היום.
function solarMinutes(y,mo,d,alt,dir,lat,lon){
  const jd0=Date.UTC(y,mo-1,d)/864e5+2440587.5;
  let minutes=720-4*lon;
  for(let i=0;i<3;i++){
    const{decl,eqt}=sunParams(jd0+minutes/1440);
    const noon=720-4*lon-eqt;
    if(dir===0){minutes=noon;continue}
    const cosH=(Math.sin(rad(alt))-Math.sin(rad(lat))*Math.sin(rad(decl)))/(Math.cos(rad(lat))*Math.cos(rad(decl)));
    if(cosH<-1||cosH>1)return null;
    minutes=noon+dir*4*deg(Math.acos(cosH));
  }
  return minutes;
}
function localYMD(date,tz){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(x=>[x.type,x.value]));
  return[+p.year,+p.month,+p.day];
}
function zmanimFor(date=new Date(),place=PLACE){
  const[y,mo,d]=localYMD(date,place.tz);
  const base=Date.UTC(y,mo-1,d);
  const at=(alt,dir)=>{const m=solarMinutes(y,mo,d,alt,dir,place.lat,place.lon);return m==null?null:new Date(base+m*6e4)};
  const sunrise=at(-0.833,-1),sunset=at(-0.833,1);
  const hour=(sunset-sunrise)/12;
  return[
    {k:'alot',label:'עלות השחר',t:at(-16.1,-1)},
    {k:'sunrise',label:'הנץ החמה',t:sunrise},
    {k:'shma',label:'סוף זמן ק״ש (גר״א)',t:new Date(+sunrise+3*hour)},
    {k:'tfila',label:'סוף זמן תפילה (גר״א)',t:new Date(+sunrise+4*hour)},
    {k:'chatzot',label:'חצות היום',t:at(0,0)},
    {k:'sunset',label:'שקיעה',t:sunset},
    {k:'tzeit',label:'צאת הכוכבים',t:at(-8.5,1)}
  ];
}
function gematria(n){
  const H=[[400,'ת'],[300,'ש'],[200,'ר'],[100,'ק'],[90,'צ'],[80,'פ'],[70,'ע'],[60,'ס'],[50,'נ'],[40,'מ'],[30,'ל'],[20,'כ'],[10,'י'],[9,'ט'],[8,'ח'],[7,'ז'],[6,'ו'],[5,'ה'],[4,'ד'],[3,'ג'],[2,'ב'],[1,'א']];
  let s='';n=n%1000;
  while(n>0){
    if(n===15){s+='טו';break}if(n===16){s+='טז';break}
    for(const[v,l]of H)if(n>=v){s+=l;n-=v;break}
  }
  return s.length>1?s.slice(0,-1)+'״'+s.slice(-1):s+'׳';
}
function hebrewDate(date=new Date()){
  try{
    const p=Object.fromEntries(new Intl.DateTimeFormat('he-u-ca-hebrew',{day:'numeric',month:'long',year:'numeric',timeZone:PLACE.tz}).formatToParts(date).map(x=>[x.type,x.value]));
    return gematria(+p.day)+' ב'+p.month+' '+gematria(+p.year);
  }catch{return''}
}
function zmanimCard(){return zmanimOnly()+weatherCard()}
function zmanimOnly(){
  const now=new Date();
  const fmt=new Intl.DateTimeFormat('he-IL',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:PLACE.tz});
  const list=zmanimFor(now);
  const next=list.find(z=>z.t&&z.t>now);
  return`<section class="ctx-card" id="zmanim" aria-label="זמני היום">
    <h2>זמני היום · ${PLACE.name}</h2>
    <p class="zm-date">${esc(hebrewDate(now))}</p>
    <p class="zm-greg">${new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:PLACE.tz}).format(now)}</p>
    <ul class="zm-list">${list.map(z=>`<li class="${z===next?'zm-next':z.t&&z.t<now?'zm-past':''}"><span>${z.label}</span><span>${z.t?fmt.format(z.t):'—'}</span></li>`).join('')}</ul>
    <p class="zm-note">חישוב אסטרונומי בגובה פני הים. להלכה יש לבדוק בלוח מוסמך.</p>
  </section>`;
}


/* ---------- מזג אוויר בנתיבות (Open-Meteo, בלי מפתח) ---------- */
const WX_KEY='consultingWeather',WX_TTL=20*60e3;
let wx=(()=>{try{return JSON.parse(localStorage.getItem(WX_KEY))}catch{return null}})(),wxBusy=false,wxFailed=false;
const WMO=c=>c===0?['בהיר','clear']:c<=2?['מעונן חלקית','partly']:c===3?['מעונן','cloud']:c<=48?['ערפל','fog']:c<=57?['טפטוף','rain']:c<=67?['גשם','rain']:c<=77?['שלג','snow']:c<=82?['ממטרים','rain']:['סופת רעמים','storm'];
function refreshWeather(force){
  if(wxBusy||typeof fetch!=='function')return;
  if(!force&&wx&&Date.now()-wx.at<WX_TTL)return;
  wxBusy=true;
  const u='https://api.open-meteo.com/v1/forecast?latitude='+PLACE.lat+'&longitude='+PLACE.lon+'&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&forecast_days=2&timezone=Asia%2FJerusalem';
  fetch(u).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{
    const now=Date.now();const hi=j.hourly||{};
    const key=String(j.current?.time||'').slice(0,13);let i0=(hi.time||[]).findIndex(t=>t.slice(0,13)>=key);if(i0<0)i0=0; // השעה הנוכחית לפי שעון ישראל שמחזיר השירות
    wx={at:now,cur:j.current,daily:j.daily,hours:(hi.time||[]).slice(i0,i0+13).map((t,i)=>({t,temp:hi.temperature_2m[i0+i],pp:hi.precipitation_probability?.[i0+i]??0}))};
    wxFailed=false;try{localStorage.setItem(WX_KEY,JSON.stringify(wx))}catch{}
  }).catch(()=>{wxFailed=true}).finally(()=>{wxBusy=false;const w=el('weather');if(w&&w.outerHTML!==undefined){w.outerHTML=weatherCard();applyAnimRate()}});
}
function wxIcon(kind,day){
  const sun=`<g class="wx-sun"><circle cx="24" cy="24" r="7.5" fill="url(#wxg)"/><g class="wx-rays">${Array.from({length:12},(_,i)=>`<line x1="24" y1="${i%2?9:7}" x2="24" y2="${i%2?12:13}" transform="rotate(${i*30} 24 24)"/>`).join('')}</g></g>`;
  const moon=`<g class="wx-moon"><path d="M29 14a11 11 0 1 0 5 19 9 9 0 0 1-5-19z" fill="url(#wxg)"/><circle class="wx-star" cx="36" cy="12" r="1.1"/><circle class="wx-star s2" cx="40" cy="20" r=".8"/></g>`;
  const cloud=(x=0,y=0,c='wx-cloud')=>`<path class="${c}" transform="translate(${x} ${y})" d="M14 34h22a7 7 0 0 0 0-14 10 10 0 0 0-19-2 7.5 7.5 0 0 0-3 16z"/>`;
  const drops=`<g class="wx-drops">${[16,23,30].map((x,i)=>`<line x1="${x}" y1="37" x2="${x-2}" y2="43" style="animation-delay:${-i*.5}s"/>`).join('')}</g>`;
  let body;
  if(kind==='clear')body=day?sun:moon;
  else if(kind==='partly')body=`<g transform="translate(-5 -5) scale(.8)">${day?sun:moon}</g>${cloud(4,2)}`;
  else if(kind==='cloud')body=cloud(-3,-3,'wx-cloud back')+cloud(2,1);
  else if(kind==='fog')body=`<g class="wx-fog"><line x1="8" y1="20" x2="40" y2="20"/><line x1="12" y1="27" x2="36" y2="27"/><line x1="8" y1="34" x2="40" y2="34"/></g>`;
  else if(kind==='storm')body=cloud(0,-4)+`<path class="wx-bolt" d="M25 31l-5 8h5l-3 7 8-10h-5l3-5z"/>`;
  else body=cloud(0,-5)+drops;
  return`<svg class="wx-icon" viewBox="0 0 48 48" aria-hidden="true"><defs><radialGradient id="wxg" cx=".35" cy=".35"><stop offset="0" style="stop-color:#fff"/><stop offset=".35" style="stop-color:var(--k-outcome)"/><stop offset="1" style="stop-color:var(--accent-2)"/></radialGradient></defs>${body}</svg>`;
}
function wxChart(hours){
  if(!hours||hours.length<2)return'';
  const W=280,H=64,pad=6,ts=hours.map(h=>h.temp),mn=Math.min(...ts),mx=Math.max(...ts),rg=Math.max(1,mx-mn);
  const X=i=>W-pad-i*(W-2*pad)/(hours.length-1), // מימין לשמאל: עכשיו בצד ימין
  Y=v=>10+(1-(v-mn)/rg)*(H-30);
  let d=`M${X(0)} ${Y(ts[0])}`;for(let i=1;i<ts.length;i++){const xm=(X(i-1)+X(i))/2;d+=` C${xm} ${Y(ts[i-1])} ${xm} ${Y(ts[i])} ${X(i)} ${Y(ts[i])}`}
  const area=d+` L${X(ts.length-1)} ${H-16} L${X(0)} ${H-16}Z`;
  const bars=hours.map((h,i)=>h.pp>0?`<rect x="${X(i)-2}" y="${H-16-h.pp/100*12}" width="4" height="${h.pp/100*12}" rx="1.5" class="wx-pp"/>`:'').join('');
  const labels=hours.map((h,i)=>i%3===0?`<text x="${X(i)}" y="${H-3}">${h.t.slice(11,13)}</text>`:'').join('');
  const imx=ts.indexOf(mx),imn=ts.indexOf(mn);
  return`<svg class="wx-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="תחזית ל־12 השעות הקרובות"><defs><linearGradient id="wxa" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.32"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient><linearGradient id="wxl" x1="0" x2="1"><stop offset="0" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--accent-2)"/></linearGradient></defs>
    <path d="${area}" fill="url(#wxa)"/>${bars}<path d="${d}" class="wx-line"/>
    <circle cx="${X(0)}" cy="${Y(ts[0])}" r="3" class="wx-now"/>
    <text x="${X(imx)}" y="${Y(mx)-4}" class="wx-ext">${Math.round(mx)}°</text>${imn!==imx?`<text x="${X(imn)}" y="${Y(mn)+11}" class="wx-ext">${Math.round(mn)}°</text>`:''}
    ${labels}</svg>`;
}
function weatherCard(){
  const head=`<h2>מזג אוויר · ${PLACE.name}${wx?`<span class="wx-upd">עודכן ${new Intl.DateTimeFormat('he-IL',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:PLACE.tz}).format(new Date(wx.at))}</span>`:''}</h2>`;
  if(!wx||!wx.cur)return`<section class="ctx-card wx" id="weather" aria-label="מזג אוויר">${head}<p class="ctx-empty">${wxFailed?'אין כרגע חיבור לשירות מזג האוויר. ננסה שוב בעוד כמה דקות.':'טוען נתונים…'}</p></section>`;
  const c=wx.cur,[label,kind]=WMO(c.weather_code),d=wx.daily||{};
  const dirs=['צפון','צפון־מזרח','מזרח','דרום־מזרח','דרום','דרום־מערב','מערב','צפון־מערב'];
  const wd=dirs[Math.round(((c.wind_direction_10m||0)%360)/45)%8];
  return`<section class="ctx-card wx" id="weather" aria-label="מזג אוויר">${head}
    <div class="wx-now-row">
      ${wxIcon(kind,!!c.is_day)}
      <div class="wx-temp"><strong>${Math.round(c.temperature_2m)}°</strong><span>${label}</span></div>
      <div class="wx-range"><span>${d.temperature_2m_max?Math.round(d.temperature_2m_max[0])+'°':''}</span><i></i><span>${d.temperature_2m_min?Math.round(d.temperature_2m_min[0])+'°':''}</span></div>
    </div>
    ${wxChart(wx.hours)}
    <dl class="wx-grid">
      <div><dt>מרגיש כמו</dt><dd>${Math.round(c.apparent_temperature)}°</dd></div>
      <div><dt>לחות</dt><dd>${Math.round(c.relative_humidity_2m)}%</dd></div>
      <div><dt>רוח</dt><dd><svg class="wx-arrow" viewBox="0 0 12 12" style="transform:rotate(${(c.wind_direction_10m||0)+180}deg)" aria-hidden="true"><path d="M6 1l3.5 9L6 8 2.5 10z"/></svg>${Math.round(c.wind_speed_10m)} קמ״ש <small>${wd}</small></dd></div>
      <div><dt>סיכוי לגשם</dt><dd>${d.precipitation_probability_max?d.precipitation_probability_max[0]:0}%</dd></div>
      <div><dt>קרינת UV</dt><dd>${d.uv_index_max?Math.round(d.uv_index_max[0]):'—'}</dd></div>
    </dl>
  </section>`;
}

/* ---------- מסכים ---------- */
function homeView(){
  const open=data.followups.filter(f=>!f.done).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
  const overdue=open.filter(f=>f.due&&f.due<todayISO()).length;
  const examples=[
    {q:'דניאל עצה',label:'מה ייעצתי לדניאל ולמה?'},
    {q:'מריבות בזוגיות',label:'מריבות בזוגיות'},
    {q:'גבולות מול ההורים',label:'גבולות מול ההורים'},
    {q:'פחד לעזוב עבודה',label:'פחד לעזוב עבודה'}
  ];
  const adv=allAdvice().slice(0,3);
  return`
  <section class="hero">
    <h2 class="hero-q">על מי או על <em>מה</em> מדברים היום?</h2>
    <canvas class="pulse" id="pulse" aria-hidden="true"></canvas>
    <form class="hero-search" id="hero-search" role="search">
      <input name="q" type="search" placeholder="שם, נושא או שאלה חופשית" autocomplete="off" aria-label="חיפוש במאגר">
      <button class="button primary" type="submit" aria-label="חיפוש">${ic('search')}</button>
    </form>
    <div class="example-row">${examples.map(e=>`<button class="example" type="button" data-query="${esc(e.q)}">${esc(e.label)}</button>`).join('')}</div>
  </section>
  <div class="stat-strip">
    <a href="#recordings"><strong>${data.meetings.length}</strong> הקלטות</a>
    <a href="#people"><strong>${allPeople().length}</strong> אנשים</a>
    <a href="#advice"><strong>${allAdvice().length}</strong> עצות מתועדות</a>
    <a href="#followups"><strong>${open.length}</strong> מעקבים פתוחים${overdue?` · <span class="overdue">${overdue} באיחור</span>`:''}</a>
  </div>
  <div class="stack">
    <section>${sectionHead('דורש מעקב','followups','כל המעקבים')}
      <div class="panel">${open.length?open.slice(0,5).map(f=>followRow(f)).join(''):emptyState('הכול טופל','אין מעקבים פתוחים.')}</div>
    </section>
    <section>${sectionHead('הקלטות אחרונות','recordings','כל ההקלטות')}
      <div class="panel">${[...data.meetings].sort(byDateDesc).slice(0,4).map(meetingRow).join('')||emptyState('אין הקלטות עדיין','')}</div>
    </section>
    <section>${sectionHead('עצות אחרונות','advice','כל העצות')}
      <div class="panel">${adv.length?adv.map(x=>adviceRow(x)).join(''):emptyState('אין עצות מתועדות','')}</div>
    </section>
  </div>`;
}

function recordingsView(){
  const f=navState.filters.recordings||'';
  const person=navState.filters.recPerson||'';
  const people=allPeople().map(p=>p.name);
  return`<div class="page-tools">
    <input id="filter-recordings" type="search" value="${esc(f)}" placeholder="סינון לפי כותרת, אדם או תוכן" aria-label="סינון הקלטות">
    <select id="filter-rec-person" aria-label="סינון לפי אדם"><option value="">כל האנשים</option>${people.map(n=>`<option ${n===person?'selected':''} value="${esc(n)}">${esc(n)}</option>`).join('')}</select>
    <button class="button primary" id="inline-import" type="button">${ic('plus')} הקלטה חדשה</button>
  </div><div id="recordings-list">${recordingsList(f,person)}</div>`;
}
function recordingsList(f,person){
  const q=prepQuery(f);
  const ms=[...data.meetings].sort(byDateDesc).filter(m=>(!person||m.person===person)&&(!q.tokens.length||scoreRecord(q,[[m.title,1],[m.person,1],[m.summary,1],[(m.tags||[]).join(' '),1],[m.transcript,1],[m.plaud,1]])>0));
  if(!data.meetings.length)return`<div class="panel"><div class="empty"><strong>אין הקלטות עדיין</strong><p>ייבוא תמלול ראשון יתחיל לבנות את המאגר.</p><button class="button primary" id="empty-import" type="button">${ic('plus')} ייבוא תמלול</button></div></div>`;
  if(!ms.length)return`<div class="panel">${emptyState('לא נמצאו הקלטות','אפשר לנסות מילה אחרת או לנקות את הסינון.')}</div>`;
  const groups=new Map();
  for(const m of ms){
    const k=parseDay(m.date).toLocaleDateString('he-IL',{month:'long',year:'numeric'});
    if(!groups.has(k))groups.set(k,[]);
    groups.get(k).push(m);
  }
  return[...groups.entries()].map(([k,g])=>`<h2 class="month-sep">${esc(k)}</h2><div class="panel">${g.map(meetingRow).join('')}</div>`).join('');
}

function caseView(id){
  const m=data.meetings.find(x=>x.id===id);
  if(!m)return emptyState('ההקלטה לא נמצאה','ייתכן שהקישור השתנה או שההקלטה נמחקה.','חזרה להקלטות','recordings');
  const an=m.analysis||{};
  const tab=navState.caseTab[id]||'knowledge';
  const nItems=(an.problem?1:0)+['observations','reasoning','advice','outcomes','results','followups','contradictions'].reduce((s,k)=>s+(an[k]||[]).length,0);
  const tabs=[['knowledge','ידע שחולץ',nItems],['source','תמלול מקור',(an.segments||[]).length],['plaud','ניתוח PLAUD',m.plaud?'':'אין']];
  return`<div class="detail">
    <a class="crumb" href="#recordings">${ic('back')} הקלטות</a>
    <header class="d-head">
      <h2 class="d-title">${esc(m.title)}</h2>
      <div class="d-meta">
        <a class="meta-link" href="#/person/${encodeURIComponent(m.person)}">${ic('users')} ${esc(m.person)}</a>
        <i class="dot-sep"></i><span>${formatFull(m.date)}</span>
        ${an.timeRange?`<i class="dot-sep"></i><span class="mono" dir="ltr">${esc(an.timeRange)}</span>`:''}
        ${(m.tags||[]).map(t=>pill(t)).join('')}
      </div>
      ${m.summary?`<p class="d-summary">${esc(m.summary)}</p>`:''}
    </header>
    <div class="tabs" role="tablist">${tabs.map(([k,l,n])=>`<button class="tab" role="tab" type="button" aria-selected="${tab===k}" data-case-tab="${k}">${l}${n!==''?` <span class="tab-n">${n}</span>`:''}</button>`).join('')}</div>
    <div role="tabpanel">${tab==='source'?sourcePanel(m):tab==='plaud'?plaudPanel(m):knowledgePanel(m)}</div>
  </div>`;
}
function knowledgePanel(m){
  const an=m.analysis||{};
  return`<p class="section-note">כל פריט נשלף מהתמלול ומקושר למשפט המקורי. „למה?” מציג את המשפט עצמו.</p>
  <div class="chain">
    ${stepHtml('הבעיה',an.problem?[an.problem]:[],m.id,{cat:'problem',empty:'לא זוהה ניסוח מפורש של הבעיה'})}
    ${stepHtml('תצפיות',an.observations,m.id,{cat:'observe',empty:'לא זוהו תצפיות'})}
    ${stepHtml('העצה',an.advice,m.id,{cls:'step-advice',cat:'advice',empty:'לא זוהתה עצה או החלטה'})}
    ${stepHtml('הנימוק',an.reasoning,m.id,{cat:'reason',empty:'לא זוהה נימוק מפורש'})}
    ${stepHtml('התוצאה המצופה',an.outcomes,m.id,{cat:'outcome',empty:'לא נאמרה מטרה מפורשת'})}
    ${stepHtml('מה קרה בפועל',an.results,m.id,{cat:'result',empty:'לא דווח על תוצאה של עצה קודמת'})}
    ${stepHtml('מעקב',an.followups,m.id,{cat:'follow',empty:'לא נקבע מעקב'})}
    ${stepHtml('חריגים',an.contradictions,m.id,{cat:'except',empty:'לא זוהה חריג'})}
  </div>`;
}
function sourcePanel(m){
  const an=m.analysis||{};
  const segs=an.segments||[];
  const evSet=new Set();
  ['observations','reasoning','advice','outcomes','results','followups','contradictions'].forEach(k=>(an[k]||[]).forEach(it=>it.evidence&&evSet.add(it.evidence.seg)));
  if(an.problem)evSet.add(an.problem.evidence.seg);
  return`<div class="src-tools">
    <input id="tr-filter" type="search" placeholder="חיפוש בתוך התמלול" aria-label="חיפוש בתמלול">
    <span class="src-count">${segs.length} משפטים${an.speakers?.length?' · דוברים: '+an.speakers.map(esc).join(', '):''}</span>
  </div>
  <div class="panel panel-pad">
    <ol class="tr-list" id="tr-list">
    ${segs.map((s,i)=>`<li id="ev-${esc(m.id)}-${i}" class="tr-line ${evSet.has(i)?'tr-ev':''}">
      <span class="tr-meta">${s.time?`<span class="mono" dir="ltr">${esc(s.time)}</span>`:''}${s.speaker?`<span class="tr-speaker">${esc(s.speaker)}</span>`:''}</span>
      <span class="tr-text">${esc(s.text)}</span>
    </li>`).join('')||'<li class="src-empty">אין תמלול שמור להקלטה זו</li>'}
    </ol>
  </div>`;
}
function plaudPanel(m){
  return`<p class="section-note">הניתוח כפי ש־PLAUD הפיק אותו, בלי עריכה.</p>
  <div class="panel panel-pad">${m.plaud?`<p class="plaud-text">${esc(m.plaud)}</p>`:'<p class="src-empty">לא נשמר ניתוח PLAUD להקלטה זו</p>'}</div>`;
}

function peopleView(){
  const f=navState.filters.people||'';
  return`<div class="page-tools"><input id="filter-people" type="search" value="${esc(f)}" placeholder="חיפוש אדם" aria-label="חיפוש אדם"></div>
  <div class="panel" id="people-list">${peopleList(f)}</div>`;
}
function peopleList(f){
  const q=prepQuery(f);
  const ps=allPeople().filter(p=>!q.tokens.length||scoreRecord(q,[[p.name,1],[p.topic,1]])>0);
  if(!ps.length)return emptyState('לא נמצא','');
  return ps.map(p=>{
    const openF=data.followups.filter(x=>x.person===p.name&&!x.done).length;
    return`<a class="row" href="#/person/${encodeURIComponent(p.name)}">
      <div class="row-main">
        <div class="row-line1"><h3 class="row-title">${esc(p.name)}</h3>${openF?pill(openF+' מעקבים פתוחים','alert'):''}</div>
        <div class="row-meta"><span>${esc(p.topic||'ללא נושא')}</span><i class="dot-sep"></i><span>${p.count} פגישות</span>${p.last?`<i class="dot-sep"></i><span>אחרונה: ${formatDate(p.last)}</span>`:''}</div>
      </div>
      <span class="row-end"><span class="row-arrow">${ic('fwd')}</span></span>
    </a>`;
  }).join('');
}

function personView(name){
  const p=allPeople().find(x=>x.name===name);
  if(!p)return emptyState('האדם לא נמצא','ייתכן שהשם השתנה.','חזרה לאנשים','people');
  const ms=meetingsOf(name);
  const advice=allAdvice().filter(x=>x.m.person===name);
  const latest=ms[0],prev=ms[1];
  const openF=data.followups.filter(f=>f.person===name&&!f.done).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
  let delta='';
  if(latest){
    const la=latest.analysis||{},pa=prev?.analysis||{};
    const rows=[];
    rows.push(['פגישה אחרונה',`<a href="#/case/${esc(latest.id)}">${esc(latest.title)}</a><small>${formatFull(latest.date)}</small>`]);
    if(prev&&pa.advice?.length)rows.push(['העצה בפגישה הקודמת',`${esc(pa.advice[0].text)}<small>${formatDate(prev.date)}</small>`]);
    rows.push(['מה דווח מאז',la.results?.length?la.results.map(r=>esc(r.text)).join('<br>'):'<span class="muted-note">לא דווח על תוצאה</span>']);
    if(la.problem)rows.push(['הבעיה כעת',esc(la.problem.text)]);
    if(la.advice?.length)rows.push(['העצה האחרונה',esc(la.advice[0].text)+(reasonFor(la,la.advice[0])?`<small>למה: ${esc(reasonFor(la,la.advice[0]).text)}</small>`:'')]);
    rows.push(['פתוח',openF.length?esc(openF[0].title)+`<small>${dueLabel(openF[0].due).t}</small>`:'<span class="muted-note">אין מעקב פתוח</span>']);
    delta=`<section>${sectionHead(prev?'מה השתנה מאז הפגישה הקודמת':'מה ידוע עד עכשיו')}<dl class="panel delta">${rows.map(([k,v])=>`<div class="delta-item"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>`;
  }
  return`<div class="detail">
    <a class="crumb" href="#people">${ic('back')} אנשים</a>
    <header class="d-head">
      <h2 class="d-title">${esc(name)}</h2>
      <div class="d-meta">${p.topic?pill(p.topic,'accent'):''}<span>${ms.length} פגישות</span>${p.first?`<i class="dot-sep"></i><span>מ־${formatDate(p.first)} עד ${formatDate(p.last)}</span>`:''}</div>
    </header>
    <div class="stack">
      ${delta}
      <section>${sectionHead('כל העצות שניתנו')}<div class="panel">${advice.length?advice.map(x=>adviceRow(x,{noPerson:true})).join(''):emptyState('אין עצות מתועדות','')}</div></section>
      <section>${sectionHead('ציר זמן')}<div class="timeline">${ms.map(m=>`<a class="tl-item" href="#/case/${esc(m.id)}"><span class="tl-date">${formatFull(m.date)}</span><strong>${esc(m.title)}</strong>${m.summary?`<p>${esc(m.summary)}</p>`:''}</a>`).join('')||'<p class="muted-note">אין פגישות רשומות</p>'}</div></section>
    </div>
  </div>`;
}

function adviceView(){
  const f=navState.filters.advice||'';
  const person=navState.filters.advPerson||'';
  return`<p class="section-note">כל עצה עם הנימוק שלה, האדם, ההקלטה והמשפט המקורי.</p>
  <div class="page-tools">
    <input id="filter-advice" type="search" value="${esc(f)}" placeholder="סינון עצות" aria-label="סינון עצות">
    <select id="filter-adv-person" aria-label="סינון לפי אדם"><option value="">כל האנשים</option>${allPeople().map(p=>`<option ${p.name===person?'selected':''} value="${esc(p.name)}">${esc(p.name)}</option>`).join('')}</select>
  </div>
  <div class="panel" id="advice-list">${adviceList(f,person)}</div>`;
}
function adviceList(f,person){
  const q=prepQuery(f);
  const list=allAdvice().filter(x=>(!person||x.m.person===person)&&(!q.tokens.length||scoreRecord(q,[[x.a.text,1],[x.reason?.text,1],[x.m.title,1],[(x.m.tags||[]).join(' '),1]])>0));
  return list.length?list.map(x=>adviceRow(x)).join(''):emptyState('לא נמצאו עצות','');
}

function contradictionsView(){
  const ex=allExceptions(),ch=adviceChanges();
  return`<p class="section-note">כאן מופיעים מקרים שדורשים בדיקה שלך: חריגים שנאמרו בפגישות, ועצות שהשתנו אצל אותו אדם. המערכת לא מכריעה אם זו סתירה אמיתית.</p>
  <div class="stack">
    <section>${sectionHead('חריגים שנאמרו בפגישות')}
      <div class="panel">${ex.length?ex.map(({m,c})=>`<div class="adv-row"><p class="adv-text">${esc(c.text)}</p>
        <div class="adv-foot"><a href="#/person/${encodeURIComponent(m.person)}">${esc(m.person)}</a><i class="dot-sep"></i><span>${formatDate(m.date)}</span><i class="dot-sep"></i><a href="#/case/${esc(m.id)}">${esc(m.title)}</a>
        <button class="link-btn" type="button" data-src-case="${esc(m.id)}" data-src-seg="${c.evidence.seg}">${ic('quote')}ציון מקור</button></div></div>`).join(''):emptyState('לא זוהו חריגים','')}</div>
    </section>
    <section>${sectionHead('עצות שהשתנו לאורך זמן')}
      <div class="panel">${ch.length?ch.map(x=>`<div class="adv-row">
        <div class="adv-foot" style="margin-top:0"><a href="#/person/${encodeURIComponent(x.person)}">${esc(x.person)}</a></div>
        <div class="pair">
          <div><small>קודם · <a href="#/case/${esc(x.earlier.id)}">${formatDate(x.earlier.date)}</a></small><p>${esc(x.a1.text)}</p></div>
          <div><small>אחר כך · <a href="#/case/${esc(x.later.id)}">${formatDate(x.later.date)}</a></small><p>${esc(x.a2.text)}</p></div>
        </div></div>`).join(''):emptyState('אין עדיין רצף עצות לאותו אדם','')}</div>
    </section>
  </div>`;
}

function principlesView(){
  const cards=data.principles.map(p=>{
    const n=linkedCases(p).length;
    return`<a class="principle-card" href="#/principle/${esc(p.id)}">
      <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
      <div class="p-foot">${pill(p.status==='confirmed'?'מאושר':'מועמד',p.status==='confirmed'?'accent':'ev')}<span>${n} מקרים מקושרים</span></div>
    </a>`;
  }).join('');
  return`<p class="section-note">עיקרון מועמד הוא ניסוח של דפוס שחוזר בעצות שלך. הקישור למקרים נעשה לפי חפיפת מילים, ולכן הוא השערה עד שתאשר אותו.</p>
  <div class="principle-grid">${cards||emptyState('עדיין אין עקרונות','')}</div>`;
}
function principleView(id){
  const p=data.principles.find(x=>x.id===id);
  if(!p)return emptyState('העיקרון לא נמצא','','חזרה לעקרונות','principles');
  const cases=linkedCases(p);
  const exc=cases.flatMap(m=>(m.analysis?.contradictions||[]).map(c=>({m,c})));
  const near=data.principles.filter(x=>x.id!==p.id).map(x=>({x,s:overlap(x,(p.title+' '+p.description).toLowerCase())})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,3);
  const sec=(title,body)=>`<section class="panel panel-pad pr-sec"><h3>${title}</h3>${body}</section>`;
  return`<div class="detail">
    <a class="crumb" href="#principles">${ic('back')} עקרונות</a>
    <header class="d-head"><h2 class="d-title">${esc(p.title)}</h2><div class="d-meta">${pill(p.status==='confirmed'?'מאושר':'עיקרון מועמד',p.status==='confirmed'?'accent':'ev')}<span>${cases.length} מקרים מקושרים</span></div></header>
    <p class="p-statement">${esc(p.description)}</p>
    <div class="pr-sections">
      ${sec('מקרים מקושרים',cases.length?cases.map(m=>{const a=m.analysis?.advice?.[0];return`<div class="adv-row" style="padding-inline:0"><a class="meta-link" href="#/case/${esc(m.id)}">${esc(m.title)}</a><div class="adv-foot" style="margin-top:3px"><span>${esc(m.person)}</span><i class="dot-sep"></i><span>${formatDate(m.date)}</span></div>${a?`<p class="adv-why">${esc(a.text)}</p>`:''}</div>`}).join(''):'<p class="muted-note">לא נמצאו מקרים עם חפיפה מספקת.</p>')}
      ${sec('חריגים מתוך המקרים',exc.length||(p.exceptions||[]).length?exc.map(({m,c})=>`<p class="adv-why">״${esc(c.text)}״ · <a href="#/case/${esc(m.id)}">${esc(m.person)}, ${formatDate(m.date)}</a></p>`).join('')+(p.exceptions||[]).map(e=>`<p class="adv-why">${esc(e)}</p>`).join(''):'<p class="muted-note">לא נאמר חריג באף מקרה מקושר.</p>')}
      ${sec('עקרונות קרובים',near.length?near.map(({x})=>`<p style="margin:0 0 6px"><a class="meta-link" href="#/principle/${esc(x.id)}">${esc(x.title)}</a></p>`).join(''):'<p class="muted-note">אין.</p>')}
    </div>
  </div>`;
}

function followupsView(){
  const open=data.followups.filter(f=>!f.done).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
  const done=data.followups.filter(f=>f.done);
  const overdue=open.filter(f=>f.due&&f.due<todayISO()).length;
  const g=new Map();
  for(const f of open){if(!g.has(f.person))g.set(f.person,[]);g.get(f.person).push(f)}
  return`<div class="fu-summary"><span><strong>${open.length}</strong> פתוחים</span><i class="dot-sep"></i><span class="${overdue?'overdue':''}"><strong>${overdue}</strong> באיחור</span><i class="dot-sep"></i><span><strong>${done.length}</strong> הושלמו</span></div>
  <form class="panel fu-quick" id="follow-quick">
    <p class="fu-quick-title">מעקב חדש</p>
    <div class="fu-quick-row">
      <select name="person" aria-label="אדם" required>${allPeople().map(p=>`<option value="${esc(p.name)}">${esc(p.name)}</option>`).join('')}</select>
      <input name="title" required placeholder="מה לבדוק בפגישה הבאה?" aria-label="תיאור המעקב">
      <input name="due" type="date" required value="${addDays(todayISO(),7)}" aria-label="תאריך יעד">
      <button class="button primary" type="submit">${ic('plus')} הוספה</button>
    </div>
  </form>
  <div class="stack">
    ${[...g.entries()].map(([name,fs])=>`<section>${sectionHead(`<a href="#/person/${encodeURIComponent(name)}" style="color:inherit;text-decoration:none">${esc(name)}</a>`)}<div class="panel">${fs.map(f=>followRow(f,{noPerson:true})).join('')}</div></section>`).join('')||`<div class="panel">${emptyState('אין מעקבים פתוחים','מעקבים נוצרים מתוך ההקלטות, או ידנית בטופס.')}</div>`}
    ${done.length?`<section>${sectionHead('הושלמו')}<div class="panel">${done.map(f=>followRow(f)).join('')}</div></section>`:''}
  </div>`;
}

function searchView(q=''){
  const res=searchAll(q);
  const examples=[{q:'דניאל',label:'דניאל'},{q:'מריבות בזוגיות',label:'מריבות בזוגיות'},{q:'גבולות מול ההורים',label:'גבולות מול ההורים'},{q:'פחד לעזוב עבודה',label:'פחד לעזוב עבודה'}];
  const groupsHtml=GROUP_ORDER.filter(k=>res.groups[k].length).map(k=>`
    <section class="search-group"><h2>${GROUP_LABEL[k]} <span class="pill">${res.groups[k].length}</span></h2>
      <div class="panel">${res.groups[k].map(it=>`<a class="res-row" href="#/${it.route}"><strong>${esc(it.title)}</strong><div class="res-meta">${it.meta}</div>${it.snippet?`<p class="res-snip">${it.snippet}</p>`:''}</a>`).join('')}</div>
    </section>`).join('');
  return`<form class="big-search" id="full-search" role="search">
    <input name="q" type="search" value="${esc(q)}" placeholder="שם, נושא או שאלה חופשית" autocomplete="off" aria-label="חיפוש בכל הידע">
    <button class="button primary" type="submit">חיפוש</button>
  </form>
  <div class="example-row">${examples.map(e=>`<button class="example" type="button" data-query="${esc(e.q)}">${esc(e.label)}</button>`).join('')}</div>
  ${q?`<p class="result-count">${res.total?`${res.total} תוצאות עבור ״${esc(q)}״. החיפוש כולל צורות עם ו/ה/ב/ל ומילים נרדפות.`:'לא נמצאו תוצאות'}</p>
    ${res.total?groupsHtml:`<div class="panel">${emptyState('לא נמצאו תוצאות','אפשר לנסות מילה אחת מרכזית או את השם המדויק.')}</div>`}`
  :`<div class="panel" style="margin-top:18px">${emptyState('חיפוש בכל הידע','אנשים, עצות, נימוקים, תמלולים, ניתוחי PLAUD, עקרונות ומעקבים.')}</div>`}`;
}

/* ---------- context panel ---------- */
function backupCard(){
  let last=null;try{last=localStorage.getItem(BACKUP_KEY)}catch{}
  const days=last?Math.floor((Date.now()-new Date(last))/864e5):null;
  const stale=days==null||days>=7;
  return`<section class="ctx-card ${stale?'ctx-warn':''}"><h2>גיבוי</h2>
    <p>${last?`גיבוי אחרון לפני ${days===0?'פחות מיום':days+' ימים'}.`:'עדיין לא נשמר גיבוי.'} המידע שמור רק בדפדפן הזה.</p>
    <button class="button ghost sm" type="button" data-export>שמירת גיבוי</button></section>`;
}
function contextFor(r){
  const parts=[];
  if(r.key==='case'){
    const m=data.meetings.find(x=>x.id===r.param);
    if(m){
      const an=m.analysis||{};
      const others=meetingsOf(m.person).filter(x=>x.id!==m.id).slice(0,4);
      const openF=data.followups.filter(f=>f.person===m.person&&!f.done);
      const rel=relatedPrinciples(m);
      parts.push(`<section class="ctx-card"><h2>פרטי ההקלטה</h2><dl class="ctx-dl">
        <dt>אדם</dt><dd><a href="#/person/${encodeURIComponent(m.person)}">${esc(m.person)}</a></dd>
        <dt>תאריך</dt><dd>${formatDate(m.date)}</dd>
        <dt>היקף</dt><dd>${an.wordCount||0} מילים · ${(an.segments||[]).length} משפטים</dd>
        ${an.speakers?.length?`<dt>דוברים</dt><dd>${an.speakers.map(esc).join(', ')}</dd>`:''}
        <dt>PLAUD</dt><dd>${m.plaud?'נשמר':'לא נשמר'}</dd>
        <dt>ניתוח</dt><dd>${ENGINE_LABEL}, גרסה ${an.version||'?'}</dd>
      </dl></section>`);
      parts.push(`<section class="ctx-card"><h2>עוד עם ${esc(m.person)} <a href="#/person/${encodeURIComponent(m.person)}">לפרופיל</a></h2>
        ${others.length?`<ul class="ctx-list">${others.map(o=>`<li><a href="#/case/${esc(o.id)}">${esc(o.title)}</a><span class="ctx-sub">${formatDate(o.date)}</span></li>`).join('')}</ul>`:'<p class="ctx-empty">זו הפגישה היחידה.</p>'}
        ${openF.length?`<h2 style="margin-top:14px">מעקבים פתוחים</h2><ul class="ctx-list">${openF.map(f=>`<li>${esc(f.title)}<span class="ctx-sub ${dueLabel(f.due).cls}">${dueLabel(f.due).t}</span></li>`).join('')}</ul>`:''}
      </section>`);
      if(rel.length)parts.push(`<section class="ctx-card"><h2>עקרונות שעשויים להתאים</h2><ul class="ctx-list">${rel.map(({principle:p})=>`<li><a href="#/principle/${esc(p.id)}">${esc(p.title)}</a></li>`).join('')}</ul><p class="zm-note">לפי חפיפת מילים. השערה בלבד.</p></section>`);
      parts.push(zmanimCard());
      parts.push(`<section class="ctx-danger"><button class="button danger sm" type="button" data-delete-case="${esc(m.id)}">מחיקת ההקלטה</button></section>`);
      return parts.join('');
    }
  }
  if(r.key==='person'){
    const name=r.param;
    const ms=meetingsOf(name);
    const openF=data.followups.filter(f=>f.person===name&&!f.done).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
    const tags=new Map();for(const m of ms)for(const t of m.tags||[])tags.set(t,(tags.get(t)||0)+1);
    const relMap=new Map();for(const m of ms)for(const{principle:p}of relatedPrinciples(m,2))relMap.set(p.id,p);
    parts.push(`<section class="ctx-card"><h2>מעקבים פתוחים</h2>${openF.length?`<ul class="ctx-list">${openF.map(f=>`<li>${esc(f.title)}<span class="ctx-sub ${dueLabel(f.due).cls}">${dueLabel(f.due).t}</span></li>`).join('')}</ul>`:'<p class="ctx-empty">אין.</p>'}</section>`);
    if(tags.size)parts.push(`<section class="ctx-card"><h2>נושאים חוזרים</h2><div class="example-row" style="margin:0">${[...tags.entries()].sort((a,b)=>b[1]-a[1]).map(([t,n])=>pill(t+(n>1?' · '+n:''),'accent')).join('')}</div></section>`);
    if(relMap.size)parts.push(`<section class="ctx-card"><h2>עקרונות שעשויים להתאים</h2><ul class="ctx-list">${[...relMap.values()].map(p=>`<li><a href="#/principle/${esc(p.id)}">${esc(p.title)}</a></li>`).join('')}</ul></section>`);
    parts.push(zmanimCard());
    return parts.join('');
  }
  if(r.key==='recordings'&&navState.lastCase){
    const m=data.meetings.find(x=>x.id===navState.lastCase);
    if(m)parts.push(`<section class="ctx-card"><h2>נפתח לאחרונה</h2><ul class="ctx-list"><li><a href="#/case/${esc(m.id)}">${esc(m.title)}</a><span class="ctx-sub">${esc(m.person)} · ${formatDate(m.date)}</span></li></ul></section>`);
  }
  parts.push(zmanimCard());
  if(r.key==='home')parts.push(backupCard());
  return parts.join('');
}

/* ---------- render ---------- */
let lastSearch='';
let currentRouteKey=null;
const ROUTE_TITLES={
  home:()=>({t:homeGreeting(),e:hebrewDate()+' · '+new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}),
  recordings:()=>({t:'הקלטות',e:'כל הפגישות, מהחדשה לישנה'}),
  people:()=>({t:'אנשים',e:'כל מי שנפגשת איתו'}),
  advice:()=>({t:'עצות ונימוקים',e:'מה ייעצת, למי ולמה'}),
  principles:()=>({t:'עקרונות',e:'דפוסים שחוזרים בעצות'}),
  contradictions:()=>({t:'סתירות וחריגים',e:'מקרים שדורשים בדיקה'}),
  search:()=>({t:'חיפוש',e:'בכל הידע'}),
  followups:()=>({t:'מעקבים',e:'מה נשאר פתוח'})
};
function homeGreeting(){const h=new Date().getHours();return h<5?'לילה טוב':h<12?'בוקר טוב':h<18?'צהריים טובים':'ערב טוב'}
function routeId(){return(location.hash||'#home')}
function render(){
  let r=parseRoute();
  if(!KNOWN.includes(r.key))r={key:'home',param:null};
  if(r.key==='search'&&r.param)lastSearch=r.param;
  const active=PARENT[r.key]||r.key;
  el('desktop-nav').innerHTML=navHtml(active);
  el('mobile-nav').innerHTML=navHtml(active,true);
  let title,eyebrow;
  if(r.key==='case'){const m=data.meetings.find(x=>x.id===r.param);title=m?m.title:'הקלטה';eyebrow=m?m.person+' · '+formatDate(m.date):''}
  else if(r.key==='person'){title=r.param||'אדם';eyebrow='הזיכרון לפני הפגישה'}
  else if(r.key==='principle'){const p=data.principles.find(x=>x.id===r.param);title=p?p.title:'עיקרון';eyebrow='עיקרון'}
  else{const t=ROUTE_TITLES[r.key]();title=t.t;eyebrow=t.e}
  el('page-title').textContent=title;
  el('eyebrow').textContent=eyebrow;
  if(r.key==='case'&&data.meetings.some(m=>m.id===r.param)){navState.lastCase=r.param;persistNav()}
  const views={
    home:homeView,recordings:recordingsView,people:peopleView,advice:adviceView,principles:principlesView,contradictions:contradictionsView,
    search:()=>searchView(lastSearch),followups:followupsView,
    case:()=>caseView(r.param),person:()=>personView(r.param),principle:()=>principleView(r.param)
  };
  el('view').innerHTML=views[r.key]();
  el('context').innerHTML=contextFor(r);
  bind();
  applyAnimRate();
  if(window.__fx)window.__fx.poke();
  document.title=r.key==='home'?'מאגר הייעוץ':title+' · מאגר הייעוץ';
  currentRouteKey=routeId();
  restoreScroll(r);
  closeMenu();
}
function renderViewOnly(){
  const r=parseRoute();
  const y=window.scrollY||0;
  el('view').innerHTML=r.key==='case'?caseView(r.param):el('view').innerHTML;
  bind();
  window.scrollTo({top:y});
}
function restoreScroll(r){
  if(pendingJump){const j=pendingJump;pendingJump=null;setTimeout(()=>flashLine(j.mid,j.seg),30);return}
  const y=navState.scroll[routeId()];
  if(typeof y==='number'&&!['case','person','principle'].includes(r.key)){window.scrollTo({top:y});return}
  window.scrollTo({top:0});
  if(r.key==='recordings'&&navState.lastCase){const row=document.querySelector('[data-case-row="'+navState.lastCase+'"]');if(row&&row.scrollIntoView)row.scrollIntoView({block:'center'})}
}
function navHtml(activeKey,mobile){
  const item=n=>{
    const a=n.key===activeKey;const c=n.count?n.count():0;const alert=n.alert&&n.alert();
    return`<a class="nav-item ${a?'active':''}" ${a?'aria-current="page"':''} href="#${n.key}"><span class="nav-icon">${ic(n.icon)}</span><span class="nav-label">${n.label}</span>${c?`<span class="nav-count ${alert?'nav-count-alert':''}">${c}</span>`:''}</a>`;
  };
  if(mobile)return NAV.flatMap(g=>g.items).filter(n=>n.mobile).map(n=>item({...n,label:n.key==='advice'?'עצות':n.label})).join('');
  return NAV.map(g=>`<div class="nav-group"><p class="nav-group-label">${g.group}</p>${g.items.map(item).join('')}</div>`).join('');
}
function flashLine(mid,seg){
  const t=document.getElementById('ev-'+mid+'-'+seg);
  if(!t)return;
  t.scrollIntoView({block:'center',behavior:motionMode()==='full'?'smooth':'auto'});
  t.classList.remove('tr-flash');void t.offsetWidth;t.classList.add('tr-flash');
}
function openSource(mid,seg){
  navState.caseTab[mid]='source';persistNav();
  const r=parseRoute();
  if(r.key==='case'&&r.param===mid){renderViewOnly();setTimeout(()=>flashLine(mid,seg),30)}
  else{pendingJump={mid,seg};navigate('case',mid)}
}

/* ---------- bindings ---------- */
function bind(){
  qsa('[data-query]').forEach(b=>b.onclick=()=>{lastSearch=b.dataset.query;saveRecent(b.dataset.query);if(parseRoute().key==='search')render();else navigate('search')});
  qsa('[data-follow]').forEach(c=>c.onchange=()=>{
    const f=data.followups.find(x=>x.id===c.dataset.follow);
    if(!f)return;
    f.done=c.checked;save();
    toast(c.checked?'המעקב סומן כהושלם':'המעקב נפתח מחדש');
    const row=c.closest('.follow-row');if(row)row.classList.toggle('follow-done',c.checked);
    el('desktop-nav').innerHTML=navHtml(PARENT[parseRoute().key]||parseRoute().key);
  });
  qsa('[data-why]').forEach(b=>b.onclick=()=>{
    const box=document.getElementById(b.dataset.why);if(!box)return;
    box.hidden=!box.hidden;b.setAttribute('aria-expanded',String(!box.hidden));
  });
  qsa('[data-open-src]').forEach(b=>b.onclick=()=>openSource(parseRoute().param,+b.dataset.openSrc));
  qsa('[data-src-case]').forEach(b=>b.onclick=()=>openSource(b.dataset.srcCase,+b.dataset.srcSeg));
  qsa('[data-case-tab]').forEach(b=>b.onclick=()=>{navState.caseTab[parseRoute().param]=b.dataset.caseTab;persistNav();renderViewOnly()});
  qsa('[data-export]').forEach(b=>b.onclick=exportBackup);
  qsa('[data-delete-case]').forEach(b=>b.onclick=()=>deleteMeeting(b.dataset.deleteCase));
  const hero=el('hero-search');
  if(hero)hero.onsubmit=e=>{e.preventDefault();lastSearch=String(new FormData(e.target).get('q')||'');saveRecent(lastSearch);navigate('search')};
  const full=el('full-search');
  if(full)full.onsubmit=e=>{e.preventDefault();lastSearch=String(new FormData(e.target).get('q')||'');saveRecent(lastSearch);render()};
  const live=(id,key,fn,box)=>{const i=el(id);if(i)i.oninput=i.onchange=()=>{navState.filters[key]=i.value;persistNav();fn()}};
  live('filter-recordings','recordings',()=>{el('recordings-list').innerHTML=recordingsList(navState.filters.recordings||'',navState.filters.recPerson||'')});
  live('filter-rec-person','recPerson',()=>{el('recordings-list').innerHTML=recordingsList(navState.filters.recordings||'',navState.filters.recPerson||'')});
  live('filter-people','people',()=>{el('people-list').innerHTML=peopleList(navState.filters.people||'')});
  live('filter-advice','advice',()=>{el('advice-list').innerHTML=adviceList(navState.filters.advice||'',navState.filters.advPerson||'');bindSrcButtons()});
  live('filter-adv-person','advPerson',()=>{el('advice-list').innerHTML=adviceList(navState.filters.advice||'',navState.filters.advPerson||'');bindSrcButtons()});
  const tf=el('tr-filter');
  if(tf)tf.oninput=()=>{
    const q=tf.value.trim().toLowerCase();
    qsa('#tr-list .tr-line').forEach(li=>li.classList.toggle('tr-dim',q.length>0&&!li.textContent.toLowerCase().includes(q)));
  };
  bindTilt();
  el('empty-import')?.addEventListener('click',openImport);
  el('inline-import')?.addEventListener('click',openImport);
  const fq=el('follow-quick');
  if(fq)fq.onsubmit=e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const title=String(fd.get('title')||'').trim();
    if(!title)return;
    data.followups.unshift({id:crypto.randomUUID(),person:String(fd.get('person')||''),title,due:String(fd.get('due')||addDays(todayISO(),7)),done:false});
    save();toast('המעקב נוסף');render();
  };
}
// הטיה תלת־ממדית עדינה לכרטיסי עקרונות, לפי מיקום הסמן
function bindTilt(){
  if(!window.matchMedia||motionMode()!=='full'||!matchMedia('(hover: hover)').matches)return;
  qsa('.stat-strip a').forEach(c=>{
    c.onpointermove=e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');c.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')};
  });
  qsa('.principle-card').forEach(c=>{
    c.onpointermove=e=>{
      const r=c.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.style.transform=`perspective(900px) rotateX(${(0.5-y)*6}deg) rotateY(${(x-0.5)*8}deg) translateY(-3px)`;
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
    };
    c.onpointerleave=()=>{c.style.transform=''};
  });
}
function bindSrcButtons(){qsa('[data-src-case]').forEach(b=>b.onclick=()=>openSource(b.dataset.srcCase,+b.dataset.srcSeg))}

/* ---------- recent searches ---------- */
const RECENT_KEY='consultingRecent';
function loadRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY))||[]}catch{return[]}}
function saveRecent(q){
  q=String(q||'').trim();if(!q)return;
  let r=loadRecent().filter(x=>x!==q);r.unshift(q);
  try{localStorage.setItem(RECENT_KEY,JSON.stringify(r.slice(0,5)))}catch{}
}

/* ---------- palette ---------- */
let palActive=-1;
function openPalette(){
  const d=el('search-dialog');if(!d||d.open)return;
  palActive=-1;
  const inp=el('palette-input');inp.value='';
  renderPalette('');
  d.showModal();
  setTimeout(()=>inp.focus(),30);
}
function renderPalette(q){
  const box=el('palette-results');if(!box)return;
  palActive=-1;
  if(!q.trim()){
    const recent=loadRecent();
    const people=allPeople().slice(0,4);
    box.innerHTML=`
      ${recent.length?`<h3 class="pal-h">חיפושים אחרונים</h3>${recent.map(r=>`<button class="pal-item" type="button" data-q="${esc(r)}">${ic('clock')}<span class="p-t">${esc(r)}</span></button>`).join('')}`:''}
      ${people.length?`<h3 class="pal-h">אנשים אחרונים</h3>${people.map((p,i)=>`<button class="pal-item" type="button" data-pidx="${i}" data-route-target="#/person/${encodeURIComponent(p.name)}">${ic('users')}<span class="p-t">${esc(p.name)}</span><span class="p-m">${p.last?formatDate(p.last):''}</span></button>`).join('')}`:''}`;
    box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{el('palette-input').value=b.dataset.q;renderPalette(b.dataset.q);el('palette-input').focus()});
  }else{
    const res=searchAll(q);
    let html='',idx=0;
    for(const k of GROUP_ORDER){
      const items=res.groups[k].slice(0,4);
      if(!items.length)continue;
      html+=`<h3 class="pal-h">${GROUP_LABEL[k]}</h3>`;
      for(const it of items)html+=`<button class="pal-item" type="button" data-pidx="${idx++}" data-route-target="#/${it.route}">${ic(GROUP_ICON[k])}<span class="p-t">${esc(it.title)}</span><span class="p-m">${it.meta}</span></button>`;
    }
    box.innerHTML=html||`<p class="pal-tip">אין תוצאות עבור ״${esc(q)}״.</p>`;
  }
  box.querySelectorAll('[data-pidx]').forEach(b=>b.onclick=()=>{el('search-dialog').close();location.hash=b.dataset.routeTarget.slice(1)});
}
function bindPalette(){
  const d=el('search-dialog');
  if(!d||d.__bound)return;d.__bound=true;
  d.addEventListener('click',e=>{if(e.target===d)d.close()});
  const inp=el('palette-input');
  inp.addEventListener('input',()=>renderPalette(inp.value));
  inp.addEventListener('keydown',e=>{
    const items=[...el('palette-results').querySelectorAll('[data-pidx]')];
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();if(!items.length)return;
      palActive=(palActive+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
      items.forEach((b,i)=>b.classList.toggle('active',i===palActive));
      items[palActive].scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'&&palActive>=0){e.preventDefault();items[palActive].click()}
  });
  el('palette-form').addEventListener('submit',e=>{
    e.preventDefault();
    const q=inp.value.trim();if(!q)return;
    d.close();lastSearch=q;saveRecent(q);navigate('search');
  });
}

/* ---------- ייבוא ---------- */
function openImport(){
  const form=el('import-form');form.reset();
  form.elements.date.value=todayISO();
  el('people-list-opts').innerHTML=allPeople().map(p=>`<option value="${esc(p.name)}"></option>`).join('');
  const btn=el('analyze-btn');btn.disabled=false;btn.querySelector('.btn-label').textContent='ניתוח ושמירה';
  el('import-dialog').showModal();
}
function importMeeting({title,person,date,transcript,plaud}){
  const analysis=analyzeTranscript(transcript);
  const tags=inferTags(transcript+' '+(plaud||''));
  const meeting={id:crypto.randomUUID(),title:title||'הקלטה חדשה',person,date,transcript,plaud:plaud||'',summary:analysis.summary,tags,analysis};
  data.meetings.unshift(meeting);
  if(!data.people.some(x=>x.name===person))data.people.unshift({name:person,topic:tags[0]});
  for(const f of analysis.followups)data.followups.unshift({id:crypto.randomUUID(),person,title:f.text,due:addDays(date,7),done:false,meetingId:meeting.id});
  save();
  return meeting;
}
function bindImport(){
  el('new-transcript').onclick=openImport;
  const di=el('import-dialog');
  di.addEventListener('click',e=>{if(e.target===di)di.close()});
  el('file-input').onchange=async e=>{const file=e.target.files[0];if(file)document.querySelector('[name=transcript]').value=await file.text()};
  el('import-form').onsubmit=e=>{
    if(e.submitter&&e.submitter.value==='cancel')return;
    e.preventDefault();
    const fd=new FormData(e.target);
    const v=k=>String(fd.get(k)||'').trim();
    if(!v('transcript')||!v('person')){toast('חסר שם האדם או התמלול');return}
    const btn=el('analyze-btn');btn.disabled=true;btn.querySelector('.btn-label').textContent='מנתח…';
    setTimeout(()=>{
      const m=importMeeting({title:v('title'),person:v('person'),date:v('date')||todayISO(),transcript:v('transcript'),plaud:v('plaud')});
      di.close();toast('ההקלטה נותחה ונשמרה');
      navigate('case',m.id);
    },60);
  };
}

/* ---------- מחיקה, גיבוי ושחזור ---------- */
function deleteMeeting(id){
  const m=data.meetings.find(x=>x.id===id);if(!m)return;
  if(!confirm(`למחוק את ההקלטה „${m.title}”? התמלול והידע שחולץ ממנה יימחקו מהמכשיר.`))return;
  data.meetings=data.meetings.filter(x=>x.id!==id);
  data.followups=data.followups.filter(f=>f.meetingId!==id);
  if(navState.lastCase===id){navState.lastCase=null;persistNav()}
  save();toast('ההקלטה נמחקה');navigate('recordings');
}
function exportBackup(){
  const payload={app:'consulting-knowledge',format:1,exportedAt:new Date().toISOString(),data};
  const blob=new Blob([JSON.stringify(payload,null,1)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='consulting-backup-'+todayISO()+'.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  try{localStorage.setItem(BACKUP_KEY,new Date().toISOString())}catch{}
  toast('הגיבוי נשמר בתיקיית ההורדות');
  if(parseRoute().key==='home')el('context').innerHTML=contextFor(parseRoute()),bind();
}
function validBackup(p){
  const d=p&&p.data;
  return d&&['meetings','people','principles','followups'].every(k=>Array.isArray(d[k]))&&d.meetings.every(m=>m&&typeof m.transcript==='string'&&typeof m.person==='string'&&typeof m.date==='string');
}
function bindRestore(){
  const inp=el('restore-input');if(!inp)return;
  inp.onchange=async()=>{
    const file=inp.files[0];inp.value='';if(!file)return;
    let p;try{p=JSON.parse(await file.text())}catch{toast('הקובץ אינו גיבוי תקין');return}
    if(!validBackup(p)){toast('הקובץ אינו גיבוי תקין');return}
    if(!confirm(`לשחזר ${p.data.meetings.length} הקלטות מהגיבוי? המידע הנוכחי במכשיר יוחלף.`))return;
    data=p.data;ensureAllAnalysis();save();toast('הגיבוי שוחזר');navigate('home');
  };
}

/* ---------- theme & menu ---------- */
function applyTheme(t){
  document.documentElement.dataset.theme=t;
  try{localStorage.setItem('consultingTheme',t)}catch{}
  const m=document.querySelector('meta[name=theme-color]');
  if(m)m.content=t==='dark'?'#090E18':'#ECEFF3';
  const l=document.querySelector('#theme-toggle .theme-label');
  if(l)l.textContent=t==='dark'?'מצב בהיר':'מצב כהה';
}
const PALETTES=[
  {k:'petrol',n:'טורקיז',g:'linear-gradient(135deg,#12806F,#2E4596)'},
  {k:'neon',n:'ניאון',g:'linear-gradient(135deg,#FF2E97,#9D4EDD 55%,#FF8A00)'},
  {k:'ocean',n:'אוקיינוס',g:'linear-gradient(135deg,#1E6FD9,#0891B2)'},
  {k:'sunset',n:'שקיעה',g:'linear-gradient(135deg,#E0536B,#D98A2B)'},
  {k:'forest',n:'יער',g:'linear-gradient(135deg,#3E8E4C,#A08A2E)'}
];
function applyPalette(k){
  if(!PALETTES.some(p=>p.k===k))k='petrol';
  if(k==='petrol')delete document.documentElement.dataset.palette;else document.documentElement.dataset.palette=k;
  try{localStorage.setItem('consultingPalette',k)}catch{}
  qsa('.swatch').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.palette===k)));
}
function initPalette(){
  const box=el('palette-picker');if(!box)return;
  let k='petrol';try{k=localStorage.getItem('consultingPalette')||'petrol'}catch{}
  box.innerHTML=`<p id="palette-label">פלטת צבעים</p><div class="swatches" role="radiogroup" aria-labelledby="palette-label">${PALETTES.map(p=>`<button class="swatch" type="button" role="radio" aria-checked="false" aria-label="${p.n}" title="${p.n}" data-palette="${p.k}" style="--sw:${p.g}"></button>`).join('')}</div>`;
  qsa('.swatch').forEach(b=>b.onclick=()=>{applyPalette(b.dataset.palette);toast('פלטה: '+b.getAttribute('aria-label'))});
  applyPalette(k);
}
/* ---------- תנועה: מלאה / עדינה / כבויה ---------- */
const MOTION=[{k:'full',n:'מלאה'},{k:'calm',n:'עדינה'},{k:'off',n:'כבויה'}];
// מהירות יחסית: מלאה = חצי מהמקור, עדינה = רבע. שום מצב חוץ מ„כבויה” לא עוצר.
const SPEED={full:.4,calm:.18,off:0};
function applyAnimRate(){
  if(!document.getAnimations)return;
  const r=SPEED[motionMode()]||1;
  for(const a of document.getAnimations()){const n=a.animationName||'';a.playbackRate=n==='rise'?(motionMode()==='calm'?.7:1):r}
}
function motionMode(){return document.documentElement.dataset.motion||'full'}
function applyMotion(k){
  document.documentElement.dataset.motion=k;
  const s=document.querySelector('#motion-btn .motion-state');if(s)s.textContent=MOTION.find(m=>m.k===k).n;
  if(window.__fx)window.__fx.mode(k);
  applyAnimRate();
}
function initMotion(){
  let k=null;try{k=localStorage.getItem('consultingMotion')}catch{}
  if(!MOTION.some(m=>m.k===k))k=(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)?'calm':'full';
  applyMotion(k);
  const b=el('motion-btn');
  if(b)b.onclick=()=>{const i=MOTION.findIndex(m=>m.k===motionMode());const n=MOTION[(i+1)%MOTION.length].k;applyMotion(n);try{localStorage.setItem('consultingMotion',n)}catch{};toast('תנועה: '+MOTION.find(m=>m.k===n).n);render()};
}

/* ---------- שכבה חיה: רשת נוירונים של אור, מקור אור שעוקב אחרי הסמן, דופק ---------- */
function initFx(){
  const c=el('fx');if(!c||!c.getContext||typeof requestAnimationFrame!=='function')return;
  const ctx=c.getContext('2d');if(!ctx)return;
  let W=0,H=0,dpr=1,nodes=[],col=null,mode='full',raf=0,last=0,prev=0,lsx='',lsy='',vt=0,lastReal=0;
  const P={x:.62,y:.25,tx:.62,ty:.25,active:false};
  const rgb=h=>{h=String(h||'').trim().replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return isNaN(n)?[14,107,98]:[n>>16&255,n>>8&255,n&255]};
  function readColors(){const cs=getComputedStyle(document.documentElement);col={a:rgb(cs.getPropertyValue('--accent')),b:rgb(cs.getPropertyValue('--accent-2')),dark:document.documentElement.dataset.theme==='dark'}}
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;
    c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.max(22,Math.min(70,Math.round(W*H/24000)));
    nodes=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.07,vy:(Math.random()-.5)*.07,r:.8+Math.random()*1.6,ph:Math.random()*6.28,t:Math.random()<.35}));
  }
  // דופק במנוחה: שתי פעימות רכות ואז הפסקה ארוכה, במחזור של 4.8 שניות
  const beat=t=>{const x=(t%4800)/4800;const g=(c0,w)=>Math.exp(-((x-c0)**2)/(2*w*w));return .7*g(.08,.03)+.45*g(.2,.035)};
  const rgba=(c3,a)=>`rgba(${c3[0]},${c3[1]},${c3[2]},${a})`;
  function draw(t){
    if(!col)readColors();
    const sp=SPEED[mode]||0,moving=sp>0;
    ctx.clearRect(0,0,W,H);
    const k=col.dark?1:.62, pulse=mode==='off'?0:beat(t);
    // אלומות אור רכות שנעות לאט, ונמשכות מעט לכיוון הסמן
    if(!P.active&&moving){P.tx=.5+.28*Math.cos(t/40000);P.ty=.35+.18*Math.sin(t/32000)}
    P.x+=(P.tx-P.x)*.024*sp;P.y+=(P.ty-P.y)*.024*sp;
    const lights=[
      {x:W*(.72+.06*Math.sin(t/60000)),y:H*(.18+.05*Math.cos(t/50000)),r:Math.max(W,H)*.42,c:col.a,a:.20},
      {x:W*(.18+.05*Math.cos(t/70000)),y:H*(.82+.04*Math.sin(t/55000)),r:Math.max(W,H)*.40,c:col.b,a:.18},
      {x:W*P.x,y:H*P.y,r:Math.max(W,H)*.22,c:col.a,a:.14+.03*pulse}
    ];
    ctx.globalCompositeOperation=col.dark?'lighter':'source-over';
    for(const L of lights){const g=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r);g.addColorStop(0,rgba(L.c,L.a*k));g.addColorStop(1,rgba(L.c,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
    ctx.globalCompositeOperation='source-over';
    // רשת הקשרים: נקודות ידע שמתחברות כשהן קרובות
    const mx=W*P.x,my=H*P.y,R=150;
    for(const n of nodes){
      if(moving){n.x+=n.vx*sp;n.y+=n.vy*sp;if(n.x<-20)n.x=W+20;if(n.x>W+20)n.x=-20;if(n.y<-20)n.y=H+20;if(n.y>H+20)n.y=-20;
        const dx=mx-n.x,dy=my-n.y,d=Math.hypot(dx,dy);if(d<220&&d>1){n.x+=dx/d*.05*sp;n.y+=dy/d*.05*sp}}
    }
    ctx.lineWidth=1;
    for(let i=0;i<nodes.length;i++){const a=nodes[i];for(let j=i+1;j<nodes.length;j++){const b=nodes[j];const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<R){
      const near=Math.max(0,1-Math.hypot((a.x+b.x)/2-mx,(a.y+b.y)/2-my)/260);
      ctx.strokeStyle=rgba(a.t?col.b:col.a,(1-d/R)*(.14+.16*near+.03*pulse)*k);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
    for(const n of nodes){
      const tw=.7+.3*Math.sin(t/4200+n.ph);const near=Math.max(0,1-Math.hypot(n.x-mx,n.y-my)/220);
      const cc=n.t?col.b:col.a;
      ctx.fillStyle=rgba(cc,(.10+.12*near+.04*pulse)*k*tw);ctx.beginPath();ctx.arc(n.x,n.y,n.r*5,0,6.283);ctx.fill();
      ctx.fillStyle=rgba(cc,(.45+.35*near+.08*pulse)*k*(.6+.4*tw));ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);ctx.fill();
    }
    drawPulse(t);
    // כיוון הצללים: הפוך למקור האור
    if(t-last>120){last=t;const sx=((.5-P.x)*22).toFixed(0)+'px',sy=(8+(.5-P.y)*18).toFixed(0)+'px';
      if(sx!==lsx||sy!==lsy){lsx=sx;lsy=sy;const r=document.documentElement.style;r.setProperty('--sx',sx);r.setProperty('--sy',sy)}}
  }
  // תנועה עדינה לא צריכה 60 פריימים: מספיק כ־30, וזה חוסך סוללה
  // זמן וירטואלי: מתקדם לפי מהירות המצב, כך שכל האנימציות מאטות יחד
  function loop(t){const dt=lastReal?Math.min(t-lastReal,100):0;lastReal=t;vt+=dt*(SPEED[mode]||0);if(t-prev>=32){prev=t;draw(vt)}raf=mode==='off'?0:requestAnimationFrame(loop)}
  function start(){cancelAnimationFrame(raf);raf=0;lastReal=0;if(mode==='off'){draw(vt)}else raf=requestAnimationFrame(loop)}
  addEventListener('resize',()=>{resize();if(mode==='off')draw(vt)});
  addEventListener('pointermove',e=>{P.active=true;P.tx=e.clientX/W;P.ty=e.clientY/H},{passive:true});
  document.addEventListener('pointerleave',()=>{P.active=false});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else start()});
  new MutationObserver(()=>{readColors();if(mode==='off')draw(vt)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-palette']});
  /* קו הדופק: מוניטור עם צורת פעימה אמיתית, ראש כתיבה שנע מימין לשמאל, שובל שדוהה ורשת מדידה */
  const g0=(x,c0,w)=>Math.exp(-((x-c0)**2)/(2*w*w));
  // פעימה אחת: גל P, קומפלקס QRS חד, וגל T רחב
  // כל פעימה שונה: גובה, רוחב ומיקום הפיקים נגזרים ממספר הפעימה, כך שהרצף לא חוזר על עצמו לעולם
  const rnd=(n,k)=>{const v=Math.sin(n*127.1+k*311.7)*43758.5453;return v-Math.floor(v)};
  const wave=(x,n)=>{
    const P=.08+.1*rnd(n,1),R=.68+.5*rnd(n,2),S=.14+.16*rnd(n,3),T=.2+.18*rnd(n,4),sh=(rnd(n,5)-.5)*.06,tw=.04+.025*rnd(n,6);
    const notch=rnd(n,7)>.78?.1*g0(x,.42+sh,.018):0;
    return P*g0(x,.16+sh*.5,.028)-.09*g0(x,.285+sh,.007)+R*g0(x,.305+sh,.008)-S*g0(x,.328+sh,.009)+T*g0(x,.52+sh,tw)+notch};
  const BEAT=4800,SWEEP=9600;
  let pc=null,pctx=null,pw=0,ph=0;
  function drawPulse(t){
    const c2=document.getElementById('pulse');
    if(!c2){pc=null;return}
    if(c2!==pc){pc=c2;pctx=c2.getContext('2d')}
    const w=c2.clientWidth,h=c2.clientHeight;if(!w||!h)return;
    if(Math.round(w*dpr)!==c2.width||Math.round(h*dpr)!==c2.height){c2.width=Math.round(w*dpr);c2.height=Math.round(h*dpr)}
    pw=w;ph=h;const g=pctx;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
    const k=col.dark?1:.9,mid=h*.62,amp=h*.4,sweeping=mode!=='off';
    // רשת מדידה דקה, דוהה לכיוון הקצוות
    const fade=g.createLinearGradient(0,0,w,0);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(.15,'#000');fade.addColorStop(.85,'#000');fade.addColorStop(1,'rgba(0,0,0,0)');
    g.save();
    for(let x=w;x>0;x-=8){const major=Math.round((w-x)/8)%5===0;g.strokeStyle=rgba(col.a,(major?.10:.04)*k);g.lineWidth=1;g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,h);g.stroke()}
    for(let y=mid%8;y<h;y+=8){const major=Math.abs(y-mid)<1;g.strokeStyle=rgba(col.a,(major?.12:.04)*k);g.beginPath();g.moveTo(0,y+.5);g.lineTo(w,y+.5);g.stroke()}
    g.globalCompositeOperation='destination-in';g.fillStyle=fade;g.fillRect(0,0,w,h);g.restore();
    // ראש הכתיבה: נע מימין לשמאל, סבב מלא ב־9.6 שניות (שתי פעימות על המסך)
    const now=sweeping?t:SWEEP*.72;
    const head=(now%SWEEP)/SWEEP;
    const val=(time,lag,sc)=>{const tt=time-lag,n=Math.floor(tt/BEAT),x=(tt-n*BEAT)/BEAT;return wave(x,n)*sc+.025*Math.sin(time/5200)};
    const layers=[
      {lag:0,sc:1,c:col.a,lw:1.7,glow:true,alpha:1},
      {lag:BEAT*.045,sc:.42,c:col.b,lw:1,glow:false,alpha:.45}
    ];
    const step=2;
    for(const L of layers){
      let px=null,py=null;
      for(let x=w;x>=0;x-=step){
        const prog=(w-x)/w;
        const age=((head-prog)%1+1)%1*SWEEP;          // כמה זמן עבר מאז שהראש כתב כאן
        const gap=age>SWEEP*.955;                       // רווח מחיקה קצר לפני הראש
        const y=mid-val(now-age,L.lag,L.sc)*amp;
        if(px!==null&&!gap){
          const life=sweeping?Math.exp(-age/(SWEEP*.5)):.75; // שובל זרחני שדוהה
          const a=life*L.alpha*k;
          if(L.glow){g.strokeStyle=rgba(L.c,a*.16);g.lineWidth=6;g.lineCap='round';g.beginPath();g.moveTo(px,py);g.lineTo(x,y);g.stroke()}
          g.strokeStyle=rgba(L.c,a);g.lineWidth=L.lw;g.lineCap='round';g.beginPath();g.moveTo(px,py);g.lineTo(x,y);g.stroke();
        }
        px=gap?null:x;py=y;
      }
    }
    if(sweeping){
      // ראש זוהר ופס סריקה אנכי
      const hx=w-head*w,hy=mid-val(now,0,1)*amp;
      const sc=g.createLinearGradient(0,0,0,h);sc.addColorStop(0,rgba(col.a,0));sc.addColorStop(.5,rgba(col.a,.18*k));sc.addColorStop(1,rgba(col.a,0));
      g.fillStyle=sc;g.fillRect(hx-1,0,2,h);
      const hg=g.createRadialGradient(hx,hy,0,hx,hy,9);hg.addColorStop(0,rgba([255,255,255],.95*k));hg.addColorStop(.3,rgba(col.a,.8*k));hg.addColorStop(1,rgba(col.a,0));
      g.fillStyle=hg;g.beginPath();g.arc(hx,hy,9,0,6.283);g.fill();
    }
  }

  resize();
  window.__fx={mode(m){mode=m;start()},poke(){if(mode==='off')draw(vt)}};
  mode=motionMode();start();
}

function initTheme(){
  let t=null;try{t=localStorage.getItem('consultingTheme')}catch{}
  if(t!=='light'&&t!=='dark')t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
  applyTheme(t);
  el('theme-toggle').onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
}
function closeMenu(){const s=el('sidebar');if(s&&s.classList)s.classList.remove('open');const sc=el('scrim');if(sc&&sc.classList)sc.classList.remove('open');const b=el('menu-btn');if(b&&b.setAttribute)b.setAttribute('aria-expanded','false')}
function bindMenu(){
  const b=el('menu-btn');if(!b)return;
  b.onclick=()=>{el('sidebar').classList.add('open');el('scrim').classList.add('open');b.setAttribute('aria-expanded','true')};
  el('scrim').onclick=closeMenu;
  el('export-btn').onclick=exportBackup;
}

/* ---------- modelContext tools (שמות וסכמות נשמרו) ---------- */
function bindModelContext(){
  if(!document.modelContext||!document.modelContext.registerTool)return;
  const register=tool=>Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});
  register({
    name:'search_consulting_knowledge',title:'חיפוש במאגר הייעוץ',
    description:'חיפוש בהקלטות, אנשים, עצות, עקרונות ומעקבים השמורים במאגר.',
    inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:true},
    execute({query}){
      if(typeof query!=='string'||!query.trim())throw new Error('נדרש ביטוי חיפוש');
      const res=searchAll(query);
      const strip=s=>String(s||'').replace(/<[^>]+>/g,'');
      const results=GROUP_ORDER.flatMap(k=>res.groups[k].map(it=>({id:it.id,type:k,title:it.title,summary:strip(it.snippet||it.meta),route:it.route}))).slice(0,20);
      return{count:res.total,results};
    }
  });
  register({
    name:'create_follow_up',title:'יצירת מעקב',
    description:'יצירת משימת מעקב חדשה עבור אדם במאגר ועדכון מסך המעקבים.',
    inputSchema:{type:'object',properties:{person:{type:'string',minLength:1},title:{type:'string',minLength:1},due:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'}},required:['person','title','due'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(input){
      if(!input||typeof input.person!=='string'||!input.person.trim()||typeof input.title!=='string'||!input.title.trim()||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.due))throw new Error('נתוני המעקב אינם תקינים');
      const item={id:crypto.randomUUID(),person:input.person.trim(),title:input.title.trim(),due:input.due,done:false};
      data.followups.unshift(item);save();navigate('followups');
      return{id:item.id,status:'created'};
    }
  });
}

/* ---------- init ---------- */
let data=load();
initTheme();
initPalette();
initMotion();
initFx();
ensureAllAnalysis();
bindImport();
bindPalette();
bindRestore();
bindMenu();
bindModelContext();
el('global-search-btn').onclick=openPalette;
render();
window.addEventListener('hashchange',()=>{
  if(currentRouteKey){navState.scroll[currentRouteKey]=window.scrollY||0;persistNav()}
  render();
});
document.addEventListener('keydown',e=>{
  const inField=/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||'');
  if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K'||e.key==='ל')){e.preventDefault();openPalette()}
  else if(e.key==='/'&&!inField&&!el('search-dialog').open){e.preventDefault();openPalette()}
  else if(e.key==='Escape')closeMenu();
});
if(typeof setInterval==='function')setInterval(()=>{const z=el('zmanim');if(z&&z.outerHTML!==undefined)z.outerHTML=zmanimOnly();refreshWeather()},60000);
refreshWeather();
if('serviceWorker'in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
/* debug/test hook */
window.__consulting={SEED,load,save,analyzeTranscript,splitSegments,searchAll,tokenize,variants,relatedPrinciples,linkedCases,allPeople,allAdvice,adviceChanges,zmanimFor,hebrewDate,gematria,importMeeting,validBackup,get data(){return data},navigate,esc};
