'use strict';
/* ============================================================
   מאגר הייעוץ — v2.0
   Vanilla JS PWA · RTL · localStorage
   שמור: מפתח אחסון, SEED, routes, זרימת ייבוא, modelContext tools
   ============================================================ */

/* ---------- Seed (לא שונה) ---------- */
const SEED = {
  meetings: [
    {id:'m1',title:'שיחה על גבולות במשפחה',person:'משפחת לוי',date:'2026-09-08',summary:'הוגדרה שיחה משותפת להצבת גבול ברור מול המשפחה המורחבת.',transcript:'הקושי המרכזי הוא התערבות חוזרת של ההורים. המלצתי שהבעל והאישה ינסחו יחד גבול אחיד ויציגו אותו כעמדה משותפת.',tags:['גבולות','זוגיות']},
    {id:'m2',title:'פגישת מעקב — תקשורת בזמן קונפליקט',person:'דניאל',date:'2026-09-03',summary:'נבחר כלל של עצירה לעשר דקות לפני חזרה לשיחה טעונה.',transcript:'דניאל תיאר ויכוחים שמסלימים. המלצתי לעצור, להירגע ולחזור לשיחה בזמן מוסכם. בפגישה הבאה נבדוק אם הצליחו ליישם.',tags:['תקשורת','ויסות']},
    {id:'m3',title:'התלבטות סביב שינוי מקצועי',person:'נועה',date:'2026-08-27',summary:'הוחלט לבדוק מעבר הדרגתי במקום החלטה חדה מתוך לחץ.',transcript:'נועה שוקלת לעזוב את העבודה. סיכמנו שתבצע שני ניסויים קטנים לפני החלטה ותתעד מה נותן לה אנרגיה.',tags:['החלטות','קריירה']}
  ],
  people:[{name:'משפחת לוי',meetings:4,last:'8 בספטמבר',topic:'גבולות משפחתיים'},{name:'דניאל',meetings:7,last:'3 בספטמבר',topic:'תקשורת זוגית'},{name:'נועה',meetings:3,last:'27 באוגוסט',topic:'שינוי מקצועי'}],
  principles:[
    {title:'חזית זוגית משותפת לפני הצבת גבול',description:'מגבשים עמדה בין בני הזוג ורק אז מציגים אותה למשפחה המורחבת.',uses:47,positive:39,confidence:83},
    {title:'לא מקבלים החלטה גדולה מתוך סערה',description:'מפרקים החלטה לניסויים קטנים ואוספים מידע לפני צעד בלתי הפיך.',uses:31,positive:26,confidence:84},
    {title:'עצירה היא כלי תקשורת, לא נטישה',description:'מגדירים מראש זמן חזרה לשיחה כדי שהפסקה תייצר ביטחון.',uses:22,positive:18,confidence:82}
  ],
  followups:[{id:'f1',person:'דניאל',title:'לבדוק איך עבד כלל עשר הדקות',due:'2026-09-14',done:false},{id:'f2',person:'משפחת לוי',title:'מה הייתה תגובת המשפחה לגבול החדש?',due:'2026-09-16',done:false},{id:'f3',person:'נועה',title:'לעבור על תוצאות שני הניסויים',due:'2026-09-20',done:false}]
};

/* ---------- אחסון ---------- */
const LS_KEY='consultingKnowledge';
let storageOk=true, storageWarned=false;
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||structuredClone(SEED)}catch{return structuredClone(SEED)}}
function save(){
  try{localStorage.setItem(LS_KEY,JSON.stringify(data))}
  catch{storageOk=false;if(!storageWarned){storageWarned=true;toast('האחסון המקומי לא זמין — השינויים ישמרו עד סיום הטעינה')}}
}

/* ---------- עזרים ---------- */
const el=id=>document.getElementById(id);
const qsa=s=>document.querySelectorAll(s);
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function formatDate(d){const dt=new Date(d+'T12:00:00');const o={day:'numeric',month:'long'};if(dt.getFullYear()!==new Date().getFullYear())o.year='numeric';return new Intl.DateTimeFormat('he-IL',o).format(dt)}
function formatFull(d){return new Intl.DateTimeFormat('he-IL',{weekday:'short',day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'))}
function todayISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dueLabel(d){
  const today=new Date();today.setHours(0,0,0,0);
  const days=Math.round((new Date(d+'T12:00:00')-today)/864e5);
  if(days<0)return{t:'עברו '+(-days)+' ימים',cls:'overdue'};
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
function toast(msg){const t=el('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}

/* ---------- אייקונים (SVG) ---------- */
const ICONS={
  home:'<path d="M4 9.5 10 4l6 5.5V16a1 1 0 0 1-1 1h-3.5v-4.2h-3V17H5a1 1 0 0 1-1-1z"/>',
  mic:'<rect x="7.3" y="3" width="5.4" height="9.4" rx="2.7"/><path d="M5 10.8a5 5 0 0 0 10 0M10 15.8V18"/>',
  users:'<circle cx="7.2" cy="7.3" r="2.7"/><path d="M2.8 16.4c.6-2.9 2.4-4.4 4.4-4.4s3.8 1.5 4.4 4.4M13.2 5a2.5 2.5 0 1 1 .4 4.9M14.3 12.2c1.9.4 3.1 1.8 3.5 4"/>',
  spark:'<path d="M10 2.6 12 8l5.4 2L12 12l-2 5.4L8 12 2.6 10 8 8z"/>',
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
  {key:'home',label:'בית',icon:'home'},
  {key:'recordings',label:'הקלטות',icon:'mic',count:()=>data.meetings.length},
  {key:'people',label:'אנשים',icon:'users',count:()=>data.people.length},
  {key:'principles',label:'עקרונות',icon:'spark',count:()=>data.principles.length},
  {key:'search',label:'חיפוש',icon:'search'},
  {key:'followups',label:'מעקבים',icon:'check',count:()=>data.followups.filter(f=>!f.done).length,alert:true}
];
const PARENT={case:'recordings',person:'people',principle:'principles'};
function parseRoute(){
  let h=(location.hash||'').replace(/^#/,'');
  if(h.startsWith('/'))h=h.slice(1);
  if(!h)return{key:'home',param:null};
  const i=h.indexOf('/');
  const key=i<0?h:h.slice(0,i);
  const param=i<0?null:decodeURIComponent(h.slice(i+1));
  return{key,param};
}
function navigate(key,param){
  const target=param?'/'+key+'/'+encodeURIComponent(param):key;
  if(location.hash==='#'+target){render()}
  else{location.hash=target}
}

/* ---------- ניתוח מקומי (rule-based, pure) ---------- */
const H={
  contradiction:/(שונה מכלל|חריג (ל|לכלל)|לעומת( זה)?, אבל|לא תמיד|בתנאים מסוימים)/,
  advice:/(המלצתי|המלצנו|אני מציע(ה)?|אני ממליץ(ת)?|מומלץ(ת)?|כדאי|מוטב|צריך(ת)? (ש|ל)|נראה לי (שת|שתעשה))/,
  decision:/(הוחלט|החלטנו|סיכמנו|הסכמנו)/,
  followup:/(בפגישה הבאה|בפגישה העתידה|נבדוק|לבדוק|מעקב|אחרי כן נבדוק|נחזור (על|ל) זה)/,
  rationale:/(מכיוון|בגלל|הסיבה (היא|היא כי)|שכן|כדי ש|על מנת|המניע|הנימוק)/,
  problem:/(הקושי|הבעיה|מתקש(ה|ת|ים|ות)|פוערים|פחד(ה|ו|ת)?|חושש(ת)?|מפחיד(ה)?|שוקל(ת)?|מתלבט(ת)?|נתקע(ה)?|סובל(ת)?)/,
  observation:/(תיאר(ה)?|דיווח(ה)?|מספר(ה)?|משתף(ת)?|עולה (מה|מתמלול)|הבנתי שמ)/,
  outcome:/(התוצאה הצפויה|מטרת הפגישה|אמלי|אמוליד)/
};
const LABEL_WORDS=new Set(['מטרה','סיכום','תאריך','זמן','נושא','שם','עמודה','סוג','מקור']);
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
    // פירוק לשדרות — גרנולריות של הוכחה טובה יותר, גם בתמלול של שורה בודדת
    const sents=rest.split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    for(const s of sents)out.push({speaker,time,text:s});
  }
  if(!out.length){
    const sents=String(transcript||'').split(/(?<=[.!?…])\s+/).map(s=>s.trim()).filter(Boolean);
    for(const s of sents)out.push({speaker:null,time:null,text:s});
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
    if(H.contradiction.test(t))push('contradiction',seg,i,'inferred',60);
    else if(H.advice.test(t))push('advice',seg,i,'explicit',84);
    else if(H.decision.test(t))push('decision',seg,i,'explicit',80);
    else if(H.followup.test(t))push('followup',seg,i,'explicit',78);
    else if(H.rationale.test(t))push('reasoning',seg,i,'explicit',74);
    else if(H.problem.test(t))push('problem',seg,i,'explicit',76);
    else if(H.observation.test(t))push('observation',seg,i,'inferred',64);
    else if(segments.length<=6)push('observation',seg,i,'inferred',48);
  });
  // נימוק שמוטמע בתוך משפט העצה — מופק כתצפית נפרדת (inferred)
  const RATIONALE_CLAUSE=/\s(כי|מכיוון|בגלל|שכן|כדי ש|על מנת)\s+(\S.*)$/;
  for(const it of [...items]){
    if(it.type!=='advice'&&it.type!=='decision')continue;
    const mm=it.text.match(RATIONALE_CLAUSE);
    if(mm&&mm[2].length>=8){
      items.push({id:'reasoning-c-'+it.evidence.seg,type:'reasoning',text:mm[0].trim(),kind:'inferred',confidence:70,evidence:{...it.evidence}});
    }
  }
  const by=t=>items.filter(x=>x.type===t);
  const problems=by('problem');
  const times=segments.map(s=>s.time).filter(Boolean);
  return {
    segments,
    speakers:[...new Set(segments.map(s=>s.speaker).filter(Boolean))],
    problem:problems[0]||null,
    observations:problems.slice(1).concat(by('observation')).slice(0,5),
    reasoning:by('reasoning'),
    advice:by('decision').concat(by('advice')).slice(0,4),
    outcomes:by('outcome'),
    followups:by('followup'),
    contradictions:by('contradiction'),
    wordCount:String(text||'').trim().split(/\s+/).filter(Boolean).length,
    timeRange:times.length>=2?times[0]+'–'+times[times.length-1]:(times.length===1?null:null),
    summary:(by('decision').concat(by('advice'))[0]||problems[0]||segments[0])?.text||''
  };
}
function ensureAllAnalysis(){
  let changed=false;
  for(const m of data.meetings){
    if(!m.analysis){m.analysis=analyzeTranscript(m.transcript);changed=true}
    if(!m.id)m.id='m-'+Date.now()+'-'+Math.floor(Math.random()*1e4);
  }
  data.principles.forEach((p,i)=>{if(!p.id){p.id='p'+(i+1);changed=true}});
  if(changed)save();
}
function relatedPrinciples(meeting,limit=3){
  const an=meeting.analysis||{};
  const hay=[meeting.title,meeting.summary,...(meeting.tags||[]),
    ...(an.advice||[]).map(a=>a.text),...(an.observations||[]).map(o=>o.text)]
    .filter(Boolean).join(' ').toLowerCase();
  if(!hay.trim())return[];
  return data.principles
    .map(p=>{
      const words=p.title.toLowerCase().split(/\s+/).concat(p.description.toLowerCase().split(/\s+/));
      let s=0;for(const w of words){if(w.length>=3&&!STOP.has(w)&&hay.includes(w))s+=1}
      return{principle:p,strength:s};
    })
    .filter(x=>x.strength>0)
    .sort((a,b)=>b.strength-a.strength)
    .slice(0,limit);
}
function tagCounts(meetings){
  const c=new Map();
  for(const m of meetings)for(const t of (m.tags||[]))c.set(t,(c.get(t)||0)+1);
  return[...c.entries()].sort((a,b)=>b[1]-a[1]);
}

/* ---------- חיפוש ---------- */
const STOP=new Set(('מה מתי איך למה לאן האם מי איזה איזו באילו באיזו אלו אלה את אתה אני הוא היא זה זו של שלנו שלכם שלך כי ב בה בא בו בעל על עלי עליה עליו עם אצל גם רק לא כן יותר כדי לתת שאלה תרצה נא ממש כנראה אפשר לך לי לו לה לנו מהם איתו איתה בין עבור מהן').split(' '));
function tokenize(q){
  return String(q||'').toLowerCase().replace(/[“”"«»]/g,' ')
    .split(/\s+/)
    .map(w=>w.replace(/^[.,!?…:;()\-—]/,'').replace(/[.,!?…:;()\-—]$/,''))
    .filter(w=>w.length>=2&&!STOP.has(w));
}
function highlightEsc(escaped,tokens){
  let out=escaped;
  const seen=new Set();
  for(const tok of tokens){
    if(seen.has(tok))continue;seen.add(tok);
    try{out=out.replace(new RegExp(tok.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'),m=>'<mark>'+m+'</mark>')}catch{}
  }
  return out;
}
function snippetFor(m,tokens){
  for(const c of [m.transcript,m.summary,m.title].filter(Boolean)){
    const cl=c.toLowerCase();let idx=-1;
    for(const tok of tokens){const i=cl.indexOf(tok);if(i>=0&&(idx<0||i<idx))idx=i}
    if(idx>=0){
      const start=Math.max(0,idx-70),end=Math.min(c.length,idx+110);
      return highlightEsc(esc((start>0?'…':'')+c.slice(start,end)+(end<c.length?'…':'')),tokens);
    }
  }
  return esc((m.summary||m.title||'').slice(0,140));
}
function searchAll(q){
  const query=String(q||'').trim();
  const tokens=tokenize(query);
  const groups={meeting:[],person:[],principle:[],followup:[]};
  if(!tokens.length)return{query,tokens,groups,total:0};
  const hintAdvice=/(אמרתי|ייעצתי|המלצתי|נתתי|עצתי)/.test(query);
  const hintPrinciple=/(עקרונ|עקרון|דפוס|חוזר|חוזרות|מתודולוגיה|שיטה)/.test(query);
  const includes=(s,tok)=>typeof s==='string'&&s&&s.toLowerCase().includes(tok);

  for(const m of data.meetings){
    const an=m.analysis||{};
    const fields={title:m.title,summary:m.summary,person:m.person,tags:(m.tags||[]).join(' '),transcript:m.transcript||''};
    const adviceText=(an.advice||[]).map(a=>a.text).join(' ').toLowerCase();
    let score=0,hit=0;
    for(const tok of tokens){
      let w=0;
      if(includes(fields.title,tok))w+=4;
      if(includes(fields.tags,tok))w+=3;
      if(includes(fields.summary,tok))w+=3;
      if(includes(fields.person,tok))w+=3;
      if(includes(fields.transcript,tok))w+=Math.min(3,(fields.transcript||'').toLowerCase().split(tok).length-1);
      if(hintAdvice&&adviceText.includes(tok))w+=2;
      if(w>0)hit+=1;
      score+=w;
    }
    if(!hit)continue;
    if(hit<tokens.length)score*=0.5;
    groups.meeting.push({id:m.id,score,title:m.title,meta:esc(m.person)+' · '+formatDate(m.date),snippet:snippetFor(m,tokens),route:'case/'+m.id});
  }
  for(const p of data.people){
    let score=0,hit=0;
    for(const tok of tokens){
      let w=0;
      if(includes(p.name,tok))w+=4;
      if(includes(p.topic,tok))w+=2;
      if(w>0)hit+=1;score+=w;
    }
    if(!hit)continue;
    groups.person.push({id:p.name,score,title:p.name,meta:esc(p.topic||'')+(p.meetings?' · '+p.meetings+' פגישות':''),route:'person/'+encodeURIComponent(p.name)});
  }
  for(const p of data.principles){
    let score=0,hit=0;
    for(const tok of tokens){
      let w=0;
      if(includes(p.title,tok))w+=4;
      if(includes(p.description,tok))w+=2;
      if(hintPrinciple&&w>0)w+=1;
      if(w>0)hit+=1;score+=w;
    }
    if(!hit)continue;
    groups.principle.push({id:p.id,score,title:p.title,meta:p.uses+' מקרים · ביטחון '+p.confidence+'%',route:'principle/'+p.id});
  }
  for(const f of data.followups){
    let score=0,hit=0;
    for(const tok of tokens){
      let w=0;
      if(includes(f.title,tok))w+=4;
      if(includes(f.person,tok))w+=3;
      if(w>0)hit+=1;score+=w;
    }
    if(!hit)continue;
    groups.followup.push({id:f.id,score,title:f.title,meta:esc(f.person)+' · '+dueLabel(f.due).t,route:'followups'});
  }
  const cap=g=>g.sort((a,b)=>b.score-a.score).slice(0,20);
  groups.meeting=cap(groups.meeting);groups.person=cap(groups.person);
  groups.principle=cap(groups.principle);groups.followup=cap(groups.followup);
  const total=groups.meeting.length+groups.person.length+groups.principle.length+groups.followup.length;
  return{query,tokens,groups,total};
}

/* ---------- recent searches ---------- */
const RECENT_KEY='consultingRecent';
function loadRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY))||[]}catch{return[]}}
function saveRecent(q){
  q=String(q||'').trim();if(!q)return;
  let r=loadRecent().filter(x=>x!==q);
  r.unshift(q);r=r.slice(0,5);
  try{localStorage.setItem(RECENT_KEY,JSON.stringify(r))}catch{}
}

/* ---------- רכיבי HTML ---------- */
const GROUP_LABEL={meeting:'פגישות',person:'אנשים',principle:'עקרונות',followup:'מעקבים'};
function pill(t,cls=''){return`<span class="pill ${cls}">${esc(t)}</span>`}
function confHtml(c){
  const l=confLabel(c);if(!l)return'';
  return`<span class="conf" title="רמת ביטחון: ${l.label}">${l.label}<span class="conf-dots" aria-hidden="true">${'<b></b>'.repeat(l.n)}${'<i></i>'.repeat(3-l.n)}</span></span>`;
}
function itemHtml(it,meetingId,opts={}){
  const evId=it.evidence?`ev-${meetingId}-${it.evidence.seg}`:null;
  return`<div class="kitem ${it.kind}">
    <p class="kitem-text">${esc(it.text)}</p>
    <div class="kitem-foot">
      <span class="tag ${it.kind==='explicit'?'tag-exp':'tag-inf'}">${it.kind==='explicit'?'מופיע במפורש':'נלמד מן הטקסט'}</span>
      ${confHtml(it.confidence)}
      ${evId?`<a class="ev-link" href="#${evId}" data-jump-to="${evId}">${ic('quote')}ציון מקור</a>`:''}
    </div>
  </div>`;
}
function stepHtml(num,label,items,opts={}){
  const has=items&&items.length;
  return`<section class="chain-step ${opts.cls||''}">
    <div class="step-head"><span class="step-num" aria-hidden="true">${num}</span><h3 class="step-label">${label}</h3></div>
    <div class="step-body">
      ${has?items.map(it=>itemHtml(it,opts.mid)).join(''):`<p class="step-empty">${opts.empty||'לא זוהה בפגישה זו'}</p>`}
    </div>
  </section>`;
}
function meetingRow(m){
  const an=m.analysis||{};
  const tags=(m.tags||[]).slice(0,2).map(t=>pill(t)).join('');
  return`<a class="row meeting-row" href="#/case/${m.id}">
    <div class="row-main">
      <div class="row-line1"><h3 class="row-title">${esc(m.title)}</h3>${tags}</div>
      <div class="row-meta"><span>${esc(m.person)}</span><i class="dot-sep"></i><span>${formatDate(m.date)}</span>${an.wordCount?`<i class="dot-sep"></i><span class="mono">${an.wordCount} מילים</span>`:''}</div>
      ${m.summary?`<p class="row-sum">${esc(m.summary)}</p>`:''}
    </div>
    <div class="row-end"><span class="case-chip">${ic('doc')} 1 מקרה</span><span class="row-arrow">${ic('fwd')}</span></div>
  </a>`;
}
function followRow(f){
  const dl=dueLabel(f.due);
  return`<div class="follow-row ${f.done?'follow-done':''}">
    <label class="check"><input class="check-input" type="checkbox" data-follow="${f.id}" ${f.done?'checked':''} aria-label="סימון ״${esc(f.title)}״ כהושלמה"><span class="check-box" aria-hidden="true">${ic('checksm')}</span></label>
    <div class="follow-main">
      <strong>${esc(f.title)}</strong>
      <div class="follow-meta"><span>${esc(f.person)}</span><i class="dot-sep"></i><span class="${dl.cls}">${dl.t}</span></div>
    </div>
  </div>`;
}
function transcriptPanel(m){
  const an=m.analysis||{};
  const segs=an.segments||[];
  const evSet=new Set();
  ['problem','observations','reasoning','advice','outcomes','followups','contradictions'].forEach(k=>{
    const arr=k==='problem'?(an.problem?[an.problem]:[]):(an[k]||[]);
    arr.forEach(it=>it.evidence&&evSet.add(it.evidence.seg));
  });
  return`<section class="tr-panel" aria-label="התמלול המקורי">
    <header class="tr-head">
      <h3>${ic('doc')} התמלול המקורי</h3>
      <input class="tr-filter" id="tr-filter" type="search" placeholder="חיפוש בתמלול" aria-label="חיפוש בתמלול">
    </header>
    <ol class="tr-list" id="tr-list">
      ${segs.map((s,i)=>`<li id="ev-${m.id}-${i}" class="tr-line ${evSet.has(i)?'tr-ev':''}">
        ${(s.time||s.speaker)?`<span class="tr-meta">${s.time?`<span class="mono" dir="ltr">${esc(s.time)}</span>`:''}${s.speaker?`<span class="tr-speaker">${esc(s.speaker)}</span>`:''}</span>`:''}
        <span class="tr-text">${esc(s.text)}</span>
        ${evSet.has(i)?'<span class="tr-evtag">עדות</span>':''}
      </li>`).join('')||'<li class="tr-line tr-empty-line">אין תמלול רשום למקרה זה</li>'}
    </ol>
    <footer class="tr-foot"><span>${segs.length} פסקאות</span>${an.speakers&&an.speakers.length?`<span>דוברים: ${an.speakers.map(esc).join(' · ')}</span>`:''}</footer>
  </section>`;
}
function emptyState(title,hint,linkText,route){
  return`<div class="empty"><strong>${esc(title)}</strong>${hint?`<p>${esc(hint)}</p>`:''}${route?`<a class="button primary" href="#${route}">${esc(linkText||'חזרה')}</a>`:''}</div>`;
}

/* ---------- מסכים ---------- */
function homeView(){
  const h=new Date().getHours();
  const greet=h<5?'לילה טוב':h<12?'בוקר טוב':h<18?'צהריים טובים':'ערב טוב';
  const open=data.followups.filter(f=>!f.done).sort((a,b)=>a.due<b.due?-1:1);
  const overdue=open.filter(f=>f.due<todayISO()).length;
  const examples=[
    {q:'דניאל עצה',label:'מה ייעצתי לדניאל בפגישה האחרונה ולמה?'},
    {q:'עקרונות זוגי',label:'איזה עקרונות חוזרים בייעוץ זוגי?'},
    {q:'גבול משפחה',label:'מקרים על גבולות מול המשפחה'},
    {q:'פחד עבודה',label:'מה אמרתי לאנשים שפחדו לעזוב עבודה?'}
  ];
  const topPrinciples=[...data.principles].sort((a,b)=>b.confidence-a.confidence).slice(0,3);
  return`
  <section class="hero">
    <h2 class="hero-q">מה תרצה לחדש היום?</h2>
    <form class="hero-search" id="hero-search" role="search">
      <input name="q" type="search" placeholder='שאלה חופשית: ״מה אמרתי בעבר על גבולות מול המשפחה?״' autocomplete="off" aria-label="חיפוש במאגר">
      <button class="button primary" type="submit" aria-label="חיפוש">${ic('search')}</button>
    </form>
    <div class="example-row">${examples.map(e=>`<button class="example" type="button" data-query="${esc(e.q)}">${esc(e.label)}</button>`).join('')}</div>
  </section>
  <div class="meta-strip">
    <a href="#recordings"><strong>${data.meetings.length}</strong> פגישות במאגר</a>
    <a href="#people"><strong>${data.people.length}</strong> אנשים</a>
    <a href="#principles"><strong>${data.principles.length}</strong> עקרונות מועמדים</a>
    <a href="#followups" class="${overdue?'ms-alert':''}"><strong>${open.length}</strong> מעקבים פתוחים${overdue?` · <span class="ms-overdue">${overdue} מעבר למועד</span>`:''}</a>
  </div>
  <div class="grid-two">
    <section>
      <div class="section-head"><h2>דורש מעקב</h2><a class="see-link" href="#followups">לכל המעקבים ${ic('fwd')}</a></div>
      <div class="panel panel-flush">
        ${open.length?open.slice(0,4).map(followRow).join(''):emptyState('הכול טופל','אין מעקבים פתוחים כרגע.')}
      </div>
    </section>
    <section>
      <div class="section-head"><h2>פגישות אחרונות</h2><a class="see-link" href="#recordings">כל ההקלטות ${ic('fwd')}</a></div>
      <div class="panel panel-flush">
        ${[...data.meetings].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(meetingRow).join('')}
      </div>
      <div class="section-head" style="margin-top:26px"><h2>עקרונות עם ביטחון גבוה</h2><a class="see-link" href="#principles">כל העקרונות ${ic('fwd')}</a></div>
      <div class="panel panel-flush">
        ${topPrinciples.map(p=>`<a class="row principle-mini" href="#/principle/${p.id}">
          <div class="row-main"><div class="row-line1"><h3 class="row-title">${esc(p.title)}</h3></div>
          <div class="row-meta">${confHtml(p.confidence)}</div></div>
          <span class="row-arrow">${ic('fwd')}</span>
        </a>`).join('')}
      </div>
    </section>
  </div>`;
}

function recordingsView(){
  const sorted=[...data.meetings].sort((a,b)=>b.date.localeCompare(a.date));
  const groups=new Map();
  for(const m of sorted){
    const k=new Date(m.date+'T12:00:00').toLocaleDateString('he-IL',{month:'long',year:'numeric'});
    if(!groups.has(k))groups.set(k,[]);
    groups.get(k).push(m);
  }
  const body=groups.size?[...groups.entries()].map(([k,ms])=>`
    <h2 class="month-sep">${k}</h2>
    <div class="panel panel-flush">${ms.map(meetingRow).join('')}</div>`).join('')
    :`<div class="panel"><div class="empty"><strong>אין הקלטות עדיין</strong><p>ייבאו תמלול ראשון כדי להתחיל לבנות את המאגר.</p><button class="button primary" id="empty-import" type="button">${ic('plus')} ייבוא תמלול</button></div></div>`;
  return`<div class="page-tools">
    <input id="filter-recordings" type="search" placeholder="סינון לפי שם, אדם או תוכן…" aria-label="סינון הקלטות">
    <button class="button primary" id="inline-import" type="button">${ic('plus')} תמלול חדש</button>
  </div><div id="recordings-list">${body}</div>`;
}

function caseView(id){
  const m=data.meetings.find(x=>x.id===id);
  if(!m)return emptyState('המקרה לא נמצא','ייתכן שהקישור שונה או שהמקרה נמחק.','חזרה להקלטות','recordings');
  const an=m.analysis||{};
  const rel=relatedPrinciples(m);
  return`<div class="detail">
    <a class="crumb" href="#recordings">${ic('back')} הקלטות</a>
    <header class="case-head">
      <h2 class="case-title">${esc(m.title)}</h2>
      <div class="case-meta">
        <a class="meta-link" href="#/person/${encodeURIComponent(m.person)}">${ic('users')} ${esc(m.person)}</a>
        <i class="dot-sep"></i><span>${formatFull(m.date)}</span>
        <i class="dot-sep"></i><span>מקור: הקלטה</span>
        ${an.timeRange?`<i class="dot-sep"></i><span class="mono" dir="ltr">${esc(an.timeRange)}</span>`:''}
        ${(m.tags||[]).map(t=>pill(t)).join('')}
      </div>
      ${m.summary?`<p class="case-summary">${esc(m.summary)}</p>`:''}
    </header>
    <div class="case-grid">
      <div class="case-main">
        <p class="section-note">שרשרת ההסקה — מה זוהה בפגישה, מה הומלץ, ולמה. כל פריט מקושר לציונו המקורי בתמלול.</p>
        <div class="chain">
          ${stepHtml(1,'הבעיה',an.problem?[an.problem]:[],{mid:m.id,empty:'לא זוהה ניסוח של הבעיה בתמלול'})}
          ${stepHtml(2,'תצפיות',an.observations,{mid:m.id,empty:'לא זוהו תצפיות נוספות'})}
          ${stepHtml(3,'הנימוק',an.reasoning,{mid:m.id,empty:'לא זוהה נימוק מפורש — אפשר לנסח אותו ידנית'})}
          ${stepHtml(4,'העצה',an.advice,{mid:m.id,cls:'step-advice',empty:'לא זוהה המלצה בפגישה זו'})}
          ${stepHtml(5,'התוצאה הצפויה',an.outcomes,{mid:m.id,empty:'לא נסמנה תוצאה מוגדרת'})}
          ${stepHtml(6,'מעקבים שנוצרו',an.followups,{mid:m.id,empty:'לא נוצרו מעקבים מפגישה זו'})}
          <section class="chain-step">
            <div class="step-head"><span class="step-num" aria-hidden="true">!</span><h3 class="step-label">ניגודויות וחריגים</h3></div>
            <div class="step-body">
              ${an.contradictions.length?an.contradictions.map(it=>itemHtml(it,m.id)).join(''):'<p class="step-empty step-empty-soft">לא זוהה סתירה לעקרונות קיימים</p>'}
            </div>
          </section>
        </div>
        ${rel.length?`<section class="case-related">
          <h3 class="rel-title">עקרונות שעשויים להתייחס למקרה</h3>
          <div class="rel-list">${rel.map(({principle:p,strength})=>`
            <a class="rel-item" href="#/principle/${p.id}"><span class="rel-badge">השערה</span><strong>${esc(p.title)}</strong><span class="rel-sig">חפיפה ${strength}</span></a>`).join('')}</div>
          <p class="rel-note">הקישור נוצר בהוראה טקסטואלית (rule-based) ואינו קשר שנמדד.</p>
        </section>`:''}
      </div>
      <aside class="case-side">${transcriptPanel(m)}</aside>
    </div>
  </div>`;
}

function peopleView(){
  const rows=data.people.map(p=>{
    const ms=data.meetings.filter(m=>m.person===p.name);
    const openF=data.followups.filter(f=>f.person===p.name&&!f.done).length;
    return`<a class="row person-row" href="#/person/${encodeURIComponent(p.name)}">
      <div class="row-main">
        <div class="row-line1"><h3 class="row-title">${esc(p.name)}</h3>${openF?pill(openF+' מעקבים פתוחים','alert'):''}</div>
        <div class="row-meta"><span>נושא מרכזי: ${esc(p.topic||'—')}</span><i class="dot-sep"></i><span>אחרונה: ${esc(p.last||'—')}</span></div>
      </div>
      <div class="row-end"><span class="case-chip">${ms.length} פגישות</span><span class="row-arrow">${ic('fwd')}</span></div>
    </a>`;
  }).join('');
  return`<div class="page-tools"><input id="filter-people" type="search" placeholder="חיפוש אדם…" aria-label="חיפוש אדם"></div>
  <div class="panel panel-flush" id="people-list">${rows||emptyState('אין אנשים במאגר','אנשים נוספים אוטומטית עם ייבוא תמלול.')}</div>`;
}

function personView(name){
  const p=data.people.find(x=>x.name===name);
  const ms=[...data.meetings].filter(m=>m.person===name).sort((a,b)=>b.date.localeCompare(a.date));
  const topic=p?.topic||(ms[0]?.tags||[])[0]||'';
  const openF=data.followups.filter(f=>f.person===name&&!f.done).sort((a,b)=>a.due<b.due?-1:1);
  const doneF=data.followups.filter(f=>f.person===name&&f.done);
  const tags=tagCounts(ms).slice(0,5);
  const relSet=new Map();
  for(const m of ms)for(const{principle:pr,strength}of relatedPrinciples(m,2))relSet.set(pr.id,(relSet.get(pr.id)||0)+strength);
  const rel=[...relSet.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>data.principles.find(x=>x.id===id)).filter(Boolean);
  const adviceHistory=ms.flatMap(m=>{
    const an=m.analysis||{};
    return(an.advice||[]).slice(0,2).map(a=>({m,a,reason:(an.reasoning||[])[0],date:m.date}));
  });
  if(!p&&ms.length===0)return emptyState('האדם לא נמצא','ייתכן שהשם השתנה.','חזרה לאנשים','people');
  return`<div class="detail">
    <a class="crumb" href="#people">${ic('back')} אנשים</a>
    <header class="case-head">
      <h2 class="case-title">${esc(name)}</h2>
      <div class="case-meta">
        ${topic?pill(topic):''}
        <i class="dot-sep"></i><span>${ms.length} פגישות ברצף</span>
        ${p?.last?`<i class="dot-sep"></i><span>אחרונה: ${esc(p.last)}</span>`:''}
      </div>
      <p class="case-summary">הזיכרון לפני הפגישה הבאה — מה נאמר, מה הומלץ, מה עדיין פתוח.</p>
    </header>
    <div class="person-grid">
      <section class="person-main">
        <div class="section-head"><h2>מה נאמר בפגישות קודמות</h2></div>
        <div class="panel panel-flush">
          ${adviceHistory.length?adviceHistory.map(({m,a,reason,date})=>`
            <a class="row advice-row" href="#/case/${m.id}">
              <div class="row-main">
                <div class="row-line1"><h3 class="row-title">${esc(m.title)}</h3><span class="mono ad-date" dir="ltr">${date}</span></div>
                <p class="ad-text">${esc(a.text)}</p>
                ${reason?`<p class="ad-why">${ic('quote')} נימוק: ${esc(reason.text)}</p>`:''}
                <div class="row-meta" style="margin-top:7px"><span class="tag ${a.kind==='explicit'?'tag-exp':'tag-inf'}">${a.kind==='explicit'?'מופיע במפורש':'נלמד מן הטקסט'}</span>${confHtml(a.confidence)}</div>
              </div>
              <span class="row-arrow">${ic('fwd')}</span>
            </a>`).join('')
          :emptyState('אין עצות רשומות','ככל שתיוודו תמלולים — היסטוריה תיבנה אוטומטית.')}
        </div>
      </section>
      <aside class="person-side">
        <section>
          <div class="section-head"><h2>מעקבים פתוחים</h2></div>
          <div class="panel panel-flush">
            ${openF.length?openF.map(followRow).join(''):'<div class="empty" style="padding:26px"><strong>הכול סגור</strong>אין משימות פתוחות.</div>'}
            ${doneF.length?`<p class="done-note">· ${doneF.length} הושלמו בעבר</p>`:''}
          </div>
        </section>
        <section>
          <div class="section-head"><h2>דפוסי בעיות</h2></div>
          <div class="panel">
            ${tags.length?`<div class="tag-cloud">${tags.map(([t,n])=>pill(t+(n>1?' · '+n:''),'accent')).join(' ')}</div>`:'<p class="muted-note">אין תגים.</p>'}
          </div>
        </section>
        <section>
          <div class="section-head"><h2>עקרונות רלוונטיים</h2></div>
          <div class="panel panel-flush">
            ${rel.length?rel.map(pr=>`<a class="row principle-mini" href="#/principle/${pr.id}"><div class="row-main"><div class="row-line1"><h3 class="row-title">${esc(pr.title)}</h3></div><div class="row-meta">${confHtml(pr.confidence)}</div></div><span class="row-arrow">${ic('fwd')}</span></a>`).join(''):'<p class="muted-note" style="padding:14px">לא זוהו עקרונות מחפצים לתיק זה.</p>'}
          </div>
        </section>
      </aside>
    </div>
    <section style="margin-top:30px">
      <div class="section-head"><h2>ציר הזמן</h2></div>
      <div class="timeline">
        ${ms.map(m=>`<a class="tl-item" href="#/case/${m.id}"><span class="tl-dot" aria-hidden="true"></span>
          <div class="tl-body"><span class="tl-date">${formatDate(m.date)}</span><strong>${esc(m.title)}</strong>
          ${m.summary?`<p>${esc(m.summary)}</p>`:''}</div><span class="row-arrow">${ic('fwd')}</span></a>`).join('')||emptyState('אין פגישות רשומות','—','—','people')}
      </div>
    </section>
  </div>`;
}

function principlesView(){
  const cards=data.principles.map(p=>{
    const academic=p.type==='academic';
    return`<a class="principle-card" href="#/principle/${p.id}">
      <span class="p-type ${academic?'academic':'practice'}">${academic?'הקבילה מחקרית ש־AI מציגה':'עיקרון מועמד מן הפרקטיקה'}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <div class="p-foot">
        <span>${p.uses} מקרים</span><span>${p.positive} תוצאות חיוביות</span>
        <span class="conf-wrap"><span class="meter" aria-hidden="true"><i style="width:${p.confidence}%"></i></span><span class="mono">${p.confidence}%</span></span>
      </div>
    </a>`;
  }).join('');
  return`<p class="section-note">המערכת מנסחת מועמדים מתוך ההתנהלות שלך בהקלטות. עיקרון מסומן כ„הקבילה מחקרית" הוא רק השוואה שאי־AI מציע — לא בהכרח השיטה שלך.</p>
  <div class="principle-grid">${cards||emptyState('עדיין אין עקרונות','עקרונות מועמדים נבנים ככל שהמאגר מתרחב.')}</div>`;
}

function principleView(id){
  const p=data.principles.find(x=>x.id===id);
  if(!p)return emptyState('העיקרון לא נמצא','—','חזרה לעקרונות','principles');
  const academic=p.type==='academic';
  const cases=(p.cases||[]).map(cid=>data.meetings.find(m=>m.id===cid)).filter(Boolean);
  const near=data.principles.filter(x=>x.id!==p.id).map(x=>{
    const w=x.title.toLowerCase().split(/\s+/).concat(x.description.toLowerCase().split(/\s+/));
    const hay=(p.title+' '+p.description).toLowerCase();
    let s=0;for(const t of w){if(t.length>=3&&!STOP.has(t)&&hay.includes(t))s+=1}
    return{x,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,3);
  const sec=(title,body,empty)=>`<section class="panel pr-section"><h3 class="pr-sec-title">${title}</h3>${body||`<p class="step-empty">${empty||'יירשם ככל שהמידע מצטבר'}</p>`}</section>`;
  return`<div class="detail">
    <a class="crumb" href="#principles">${ic('back')} עקרונות</a>
    <div class="pr-detail">
      <span class="p-type ${academic?'academic':'practice'}" style="margin-bottom:12px">${academic?'הקבילה מחקרית ש־AI מציגה':'עיקרון מועמד שמנוסח מן הפרקטיקה'}</span>
      <h2 class="case-title">${esc(p.title)}</h2>
      <p class="pr-desc">${esc(p.description)}</p>
      <div class="pr-stats">
        <div class="pr-stat"><span>הופעות</span><strong>${p.uses}</strong></div>
        <div class="pr-stat"><span>תוצאות חיוביות</span><strong>${p.positive}</strong></div>
        <div class="pr-stat pr-stat-wide"><span>רמת ביטחון</span><span class="conf-wrap"><span class="meter lg" aria-hidden="true"><i style="width:${p.confidence}%"></i></span><span class="mono">${p.confidence}%</span></span></div>
      </div>
      <div class="pr-sections">
        ${sec('מקרים תומכים',cases.length?`<div class="panel-flush" style="border:0;padding:0">${cases.map(meetingRow).join('')}</div>`:'','הרשימה תתמלא ככל שהניתוח מייחס מקרים לעיקרון')}
        ${sec('מתי רלוונטי',p.appliesTo?`<p class="muted-note" style="padding:0">${esc(p.appliesTo)}</p>`:'','תיאר את המצבים שבהם העיקרון חל')}
        ${sec('חריגים וניגודויות',(p.exceptions||[]).map(e=>`<p class="exc-item">${ic('quote')} ${esc(e)}</p>`).join('')||'','לא רשומים חריגים — סמנו כשהעיקרון אינו חל')}
        ${sec('עקרונות קרובים',near.length?near.map(({x})=>`<a class="rel-item" href="#/principle/${x.id}"><span class="rel-badge">קרוב</span><strong>${esc(x.title)}</strong></a>`).join(''):'','—')}
        ${sec('התפתחות לאורך זמן',(p.evolution||[]).map(e=>`<div class="tl-item" style="cursor:default"><span class="tl-dot" aria-hidden="true"></span><div class="tl-body"><span class="tl-date">${esc(e.when||formatDate(e.date||todayISO()))}</span><p style="margin:2px 0 0">${esc(e.note||'')}</p></div></div>`).join(''),'העינון יצייר את השינויים בניסוח העיקרון')}
      </div>
    </div>
  </div>`;
}

function followupsView(){
  const open=data.followups.filter(f=>!f.done).sort((a,b)=>a.due<b.due?-1:1);
  const done=data.followups.filter(f=>f.done);
  const overdue=open.filter(f=>f.due<todayISO()).length;
  const byPerson=(arr)=>{
    const g=new Map();
    for(const f of arr){if(!g.has(f.person))g.set(f.person,[]);g.get(f.person).push(f)}
    return[...g.entries()];
  };
  const peopleOptions=[...new Set(data.people.map(p=>p.name))];
  return`
  <div class="fu-summary">
    <span><strong>${open.length}</strong> פתוחים</span><i class="dot-sep"></i>
    <span class="${overdue?'overdue':''}"><strong>${overdue}</strong> מעבר למועד</span><i class="dot-sep"></i>
    <span><strong>${done.length}</strong> הושלמו</span>
  </div>
  <form class="panel fu-quick" id="follow-quick">
    <label>מעקב חדש
      <div class="fu-quick-row">
        <select name="person" aria-label="אדם">${peopleOptions.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('')}</select>
        <input name="title" required placeholder="מה לבדוק בפגישה הבאה?">
        <input name="due" type="date" required value="${todayISO()}">
        <button class="button primary" type="submit">${ic('plus')} הוספה</button>
      </div>
    </label>
  </form>
  <div class="fu-groups">
    ${byPerson(open).map(([name,fs])=>`
      <section><div class="section-head"><h2>${esc(name)}</h2><span class="fu-count">${fs.length}</span></div>
      <div class="panel panel-flush">${fs.map(followRow).join('')}</div></section>`).join('')
    ||emptyState('אין מעקבים פתוחים','מעקבים נוצרים אוטומטית מתמלולים, או ידנית דרך הטופס למעלה.')}
  </div>
  ${done.length?`<section style="margin-top:26px"><div class="section-head"><h2>הושלמו</h2></div><div class="panel panel-flush">${done.map(followRow).join('')}</div></section>`:''}`;
}

function searchView(q=''){
  const res=searchAll(q);
  const examples=[
    {q:'דניאל עצה',label:'מה ייעצתי לדניאל בפגישה הקודמת ולמה?'},
    {q:'עקרונות זוגי',label:'איזה עקרונות חוזרים בייעוץ זוגי?'},
    {q:'פחד עבודה',label:'מה אמרתי לאנשים שפחדו לעזוב עבודה?'},
    {q:'גבול משפחה',label:'מקרים על גבולות מול המשפחה'},
    {q:'עצה שונה',label:'באילו מקרים נתתי עצה שונה לבעיה דומה?'}
  ];
  const groupsHtml=['meeting','person','principle','followup'].filter(k=>res.groups[k].length).map(k=>`
    <section class="search-group">
      <h2>${GROUP_LABEL[k]} <span class="sg-count">${res.groups[k].length}</span></h2>
      ${res.groups[k].map(it=>`<a class="res-row" href="#/${it.route}">
        <div class="res-line1"><strong>${esc(it.title)}</strong></div>
        <div class="res-meta">${it.meta}</div>
        ${it.snippet?`<p class="res-snip">${it.snippet}</p>`:''}
      </a>`).join('')}
    </section>`).join('');
  return`<form class="big-search" id="full-search" role="search">
    <input name="q" type="search" value="${esc(q)}" placeholder='שאלה חופשית בעברית… לדוגמה: ״באילו מקרים נתתי עצה שונה?״' autocomplete="off" ${q?'':'autofocus'} aria-label="חיפוש בכל הידע">
    <button class="button primary" type="submit">חיפוש</button>
  </form>
  <div class="example-row">${examples.map(e=>`<button class="example" type="button" data-query="${esc(e.q)}">${esc(e.label)}</button>`).join('')}</div>
  ${q?`
    <p class="result-count">${res.total?`נמצאו <strong>${res.total}</strong> תוצאות ל־״${esc(q)}״`:'לא נמצאו תוצאות'}</p>
    ${res.total?groupsHtml:`<div class="panel"><div class="empty"><strong>לא נמצאו תוצאות</strong>נסו ניסוח קצר יותר, מילה מרכזית, או השם המדויק.</div></div>`}
  `:`
    <div class="panel"><div class="empty"><strong>כל הידע שלך, בשפה חופשית</strong>אפשר לחפש אדם, בעיה, עצה, נימוק, עיקרון או תמלול — או פשוט לשאול.<br>קיצור מקלדת: <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd></div></div>
  `}`;
}

/* ---------- render ---------- */
let lastSearch='';
const ROUTE_TITLES={
  home:()=>({t:homeGreeting(),e:new Intl.DateTimeFormat('he-IL',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}),
  recordings:()=>({t:'הקלטות',e:'כל הפגישות הרשומות, מהחדשה אל הישנה'}),
  people:()=>({t:'אנשים',e:'התיקים הארוכים — מי נמצא במעקב'}),
  principles:()=>({t:'עקרונות',e:'המתודולוגיה כפי שהיא נלמדת מהקלטות'}),
  search:()=>({t:'חיפוש',e:'חיפוש חופשי בכל הידע'}),
  followups:()=>({t:'מעקבים',e:'מה נשאר פתוח ואיך ממשיכים'})
};
function homeGreeting(){const h=new Date().getHours();return h<5?'לילה טוב':h<12?'בוקר טוב':h<18?'צהריים טובים':'ערב טוב'}
function render(){
  let r=parseRoute();
  const known=['home','recordings','people','principles','search','followups','case','person','principle'];
  if(!known.includes(r.key))r={key:'home',param:null};
  const active=PARENT[r.key]||r.key;
  el('desktop-nav').innerHTML=navHtml(active);
  el('mobile-nav').innerHTML=navHtml(active,true);
  let title,eyebrow;
  if(r.key==='case'){
    const m=data.meetings.find(x=>x.id===r.param);
    title=m?m.title:'מקרה';eyebrow='מקרה · שרשרת ההסקה והערכה';
  }else if(r.key==='person'){
    title=r.param||'אדם';eyebrow='אדם · הזיכרון לפני הפגישה';
  }else if(r.key==='principle'){
    const p=data.principles.find(x=>x.id===r.param);
    title=p?p.title:'עיקרון';eyebrow='עיקרון · מתודולוגיה';
  }else{
    const t=ROUTE_TITLES[r.key]();title=t.t;eyebrow=t.e;
  }
  el('page-title').textContent=title;
  el('eyebrow').textContent=eyebrow;
  const views={
    home:homeView,recordings:recordingsView,people:peopleView,principles:principlesView,
    search:()=>searchView(lastSearch),followups:followupsView,
    case:()=>caseView(r.param),person:()=>personView(r.param),principle:()=>principleView(r.param)
  };
  el('view').innerHTML=views[r.key]();
  bind();
  window.scrollTo({top:0});
  document.title=r.key==='home'?'מאגר הייעוץ':title+' · מאגר הייעוץ';
}
function navHtml(activeKey,mobile){
  return NAV.map(n=>{
    const active=n.key===activeKey;
    const c=n.count?n.count():0;
    return`<a class="nav-item ${active?'active':''}" ${active?'aria-current="page"':''} href="#${n.key}">
      <span class="nav-icon">${ic(n.icon)}</span><span class="nav-label">${n.label}</span>
      ${c?`<span class="nav-count ${n.alert?'nav-count-alert':''}">${c}</span>`:''}
    </a>`;
  }).join('');
}

/* ---------- bindings ---------- */
function bind(){
  qsa('[data-query]').forEach(b=>b.onclick=()=>{lastSearch=b.dataset.query;saveRecent(b.dataset.query);navigate('search')});
  qsa('[data-follow]').forEach(c=>c.onchange=()=>{
    const f=data.followups.find(x=>x.id===c.dataset.follow);
    if(!f)return;
    f.done=c.checked;save();
    toast(c.checked?'המעקב הושלם':'המעקב נפתח מחדש');
    const row=c.closest('.follow-row');if(row)row.classList.toggle('follow-done',c.checked);
  });
  qsa('[data-jump-to]').forEach(a=>a.onclick=e=>{
    e.preventDefault();
    const target=document.getElementById(a.dataset.jumpTo);
    if(!target)return;
    target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    target.classList.remove('tr-flash');void target.offsetWidth;target.classList.add('tr-flash');
  });
  const hero=el('hero-search');
  if(hero)hero.onsubmit=e=>{
    e.preventDefault();
    const q=new FormData(e.target).get('q')||'';
    lastSearch=q;saveRecent(q);
    if(location.hash==='#search'||location.hash==='#/search')render();else navigate('search');
  };
  const full=el('full-search');
  if(full)full.onsubmit=e=>{
    e.preventDefault();
    lastSearch=new FormData(e.target).get('q')||'';
    saveRecent(lastSearch);
    render();
  };
  const fr=el('filter-recordings');
  if(fr)fr.oninput=()=>{
    const box=el('recordings-list');if(!box)return;
    const q=fr.value.trim().toLowerCase();
    const ms=data.meetings.filter(m=>!q||JSON.stringify(m).toLowerCase().includes(q));
    box.innerHTML=ms.length?`<div class="panel panel-flush">${ms.map(meetingRow).join('')}</div>`:`<div class="panel">${emptyState('לא נמצא','נסו מילה מרכזית.')}</div>`;
  };
  const fp=el('filter-people');
  if(fp)fp.oninput=()=>{
    const box=el('people-list');if(!box)return;
    const q=fp.value.trim();
    const ps=data.people.filter(p=>!q||p.name.includes(q));
    box.innerHTML=ps.length?ps.map(p=>`<a class="row person-row" href="#/person/${encodeURIComponent(p.name)}">
      <div class="row-main"><div class="row-line1"><h3 class="row-title">${esc(p.name)}</h3></div>
      <div class="row-meta">${esc(p.topic||'')} · ${p.meetings} פגישות</div></div>
      <span class="row-arrow">${ic('fwd')}</span></a>`).join('')
      :`<div class="empty"><strong>לא נמצא</strong></div>`;
  };
  const tf=el('tr-filter');
  if(tf)tf.oninput=()=>{
    const q=tf.value.trim().toLowerCase();
    qsa('#tr-list .tr-line').forEach(li=>{
      const t=li.textContent.toLowerCase();
      li.classList.toggle('tr-dim',q.length>0&&!t.includes(q));
    });
  };
  el('empty-import')?.addEventListener('click',openImport);
  const fq=el('follow-quick');
  if(fq)fq.onsubmit=e=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const title=String(fd.get('title')||'').trim();
    if(!title)return;
    data.followups.unshift({id:crypto.randomUUID(),person:String(fd.get('person')||''),title,due:String(fd.get('due')||todayISO()),done:false});
    save();toast('המעקב נוסף');
    navigate('followups');
  };
}

/* ---------- palette (⌘K) ---------- */
let palActive=-1,palFlat=[];
function openPalette(){
  const d=el('search-dialog');
  if(!d)return;
  palActive=-1;
  const inp=el('palette-input');
  inp.value='';
  renderPalette('');
  d.showModal();
  setTimeout(()=>inp.focus(),30);
}
function renderPalette(q){
  const box=el('palette-results');
  if(!box)return;
  if(!q.trim()){
    const recent=loadRecent();
    const examples=[
      {q:'דניאל עצה',label:'מה ייעצתי לדניאל בפגישה האחרונה ולמה?'},
      {q:'עקרונות זוגי',label:'איזה עקרונות חוזרים בייעוץ זוגי?'},
      {q:'גבול משפחה',label:'מקרים על גבולות מול המשפחה'}
    ];
    box.innerHTML=`
      ${recent.length?`<h3 class="pal-h">חיפושים אחרונים</h3>${recent.map(r=>`<button class="pal-item pal-recent" type="button" data-q="${esc(r)}">${ic('clock')}<span class="p-t">${esc(r)}</span></button>`).join('')}`:''}
      <h3 class="pal-h">נסו לשאול</h3>
      ${examples.map(e=>`<button class="pal-item pal-example" type="button" data-q="${esc(e.q)}">${ic('spark')}<span class="p-t">${esc(e.label)}</span></button>`).join('')}
      ${!recent.length?`<p class="pal-tip">הזינו שאלה חופשית בעברית — למשל ״מה אמרתי לאנשים שפחדו לעזוב עבודה?״</p>`:''}`;
    palFlat=[];palActive=-1;
    box.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{
      el('palette-input').value=b.dataset.q;
      renderPalette(b.dataset.q);
      el('palette-input').focus();
    });
    return;
  }
  const res=searchAll(q);
  const per=4;
  const visible=[];
  let html='';
  for(const k of ['meeting','person','principle','followup']){
    const items=res.groups[k].slice(0,per);
    if(!items.length)continue;
    html+=`<h3 class="pal-h">${GROUP_LABEL[k]}</h3>`;
    for(const it of items){
      const idx=visible.length;
      visible.push(it);
      html+=`<button class="pal-item" type="button" data-pidx="${idx}" data-route-target="#/${it.route}">${ic({meeting:'mic',person:'users',principle:'spark',followup:'check'}[k])}<span class="p-t">${esc(it.title)}</span><span class="p-m">${it.meta}</span></button>`;
    }
  }
  if(!visible.length)html=`<p class="pal-tip pal-empty-line">אין תוצאות ל־״${esc(q)}״ — נסו ניסוח אחר.</p>`;
  box.innerHTML=html;
  palFlat=visible;
  palActive=-1;
  box.querySelectorAll('[data-pidx]').forEach(b=>b.onclick=()=>{
    el('search-dialog').close();
    location.hash=b.dataset.routeTarget.slice(1);
  });
}
function bindPalette(){
  const d=el('search-dialog');
  if(!d||d.__bound)return;
  d.__bound=true;
  d.addEventListener('click',e=>{if(e.target===d)d.close()});
  const inp=el('palette-input');
  inp.addEventListener('input',()=>{renderPalette(inp.value)});
  inp.addEventListener('keydown',e=>{
    const items=[...el('palette-results').querySelectorAll('[data-pidx]')];
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();
      if(!items.length)return;
      palActive=(palActive+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
      items.forEach((b,i)=>b.classList.toggle('active',i===palActive));
      items[palActive].scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'&&palActive>=0){
      e.preventDefault();
      items[palActive].click();
    }
  });
  el('palette-form').addEventListener('submit',e=>{
    e.preventDefault();
    const q=inp.value.trim();
    if(!q)return;
    d.close();
    lastSearch=q;saveRecent(q);
    navigate('search');
  });
}

/* ---------- import ---------- */
function openImport(){
  const form=el('import-form');
  form.reset();
  form.elements.date.value=todayISO();
  const btn=el('analyze-btn');
  btn.disabled=false;
  btn.querySelector('.btn-label').textContent='ניתוח ושמירה';
  el('import-dialog').showModal();
}
function bindImport(){
  el('new-transcript').onclick=openImport;
  const di=el('import-dialog');
  di.addEventListener('click',e=>{if(e.target===di)di.close()});
  el('file-input').onchange=async e=>{
    const file=e.target.files[0];
    if(file)document.querySelector('[name=transcript]').value=await file.text();
  };
  el('import-form').onsubmit=e=>{
    const submitter=e.submitter;
    if(submitter&&submitter.value==='cancel')return;
    e.preventDefault();
    const fd=new FormData(e.target);
    const transcript=String(fd.get('transcript')||'').trim();
    const person=String(fd.get('person')||'').trim();
    const title=String(fd.get('title')||'').trim();
    const date=String(fd.get('date')||'')||todayISO();
    if(!transcript||!person){toast('יש להשלים את שם האדם ותוכן התמלול');return}
    const btn=el('analyze-btn');
    const lbl=btn.querySelector('.btn-label');
    btn.disabled=true;
    const stages=['מקריא תמלול…','מזהה בעיות, עצות ונימוקים…','שומר…'];
    let i=0;lbl.textContent=stages[0];
    const tick=setInterval(()=>{i++;if(i<stages.length)lbl.textContent=stages[i]},300);
    setTimeout(()=>{
      clearInterval(tick);
      const analysis=analyzeTranscript(transcript);
      const meeting={id:crypto.randomUUID(),title:title||'תמלול חדש',person,date,transcript,summary:analysis.summary,tags:[/גבול/.test(transcript)?'גבולות':'תמלול חדש'],analysis};
      data.meetings.unshift(meeting);
      let p=data.people.find(x=>x.name===person);
      if(p){p.meetings+=1;p.last=formatDate(meeting.date)}
      else data.people.unshift({name:person,meetings:1,last:formatDate(meeting.date),topic:meeting.tags[0]});
      if(/מעקב|בפגישה הבאה|לבדוק/.test(transcript))data.followups.unshift({id:crypto.randomUUID(),person,title:'מעקב בעקבות '+meeting.title,due:meeting.date,done:false});
      save();
      di.close();
      btn.disabled=false;lbl.textContent='ניתוח ושמירה';
      toast('התמלול נותח ונשמר');
      navigate('case',meeting.id);
    },750);
  };
}

/* ---------- theme ---------- */
function applyTheme(t){
  document.documentElement.dataset.theme=t;
  try{localStorage.setItem('consultingTheme',t)}catch{}
  const m=document.querySelector('meta[name=theme-color]');
  if(m)m.content=t==='dark'?'#101418':'#F4F2EC';
  const btn=el('theme-toggle');
  if(btn){
    btn.setAttribute('aria-label',t==='dark'?'מעבר למצב בהיר':'מעבר למצב כהה');
    const l=btn.querySelector('.theme-label');
    if(l)l.textContent=t==='dark'?'מצב בהיר':'מצב כהה';
  }
}
function initTheme(){
  let t=null;
  try{t=localStorage.getItem('consultingTheme')}catch{}
  if(t!=='light'&&t!=='dark')t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
  applyTheme(t);
  el('theme-toggle').onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
}

/* ---------- modelContext tools (שמות וסכמות זהות לגרסה הקודמת) ---------- */
function bindModelContext(){
  if(!document.modelContext||!document.modelContext.registerTool)return;
  const register=tool=>Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});
  register({
    name:'search_consulting_knowledge',title:'חיפוש במאגר הייעוץ',
    description:'חיפוש בפגישות השמורות לפי אדם, נושא, עצה או תוכן התמלול.',
    inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:true},
    execute({query}){
      if(typeof query!=='string'||!query.trim())throw new Error('נדרש ביטוי חיפוש');
      const res=searchAll(query);
      const results=[
        ...res.groups.meeting.map(it=>({id:it.id,type:'meeting',title:it.title,person:it.meta?.split(' · ')[0],date:null,summary:it.snippet?.replace(/<[^>]+>/g,''),route:it.route})),
        ...res.groups.principle.map(it=>({id:it.id,type:'principle',title:it.title,summary:it.meta,route:it.route})),
        ...res.groups.person.map(it=>({id:it.id,type:'person',title:it.title,summary:it.meta,route:it.route})),
        ...res.groups.followup.map(it=>({id:it.id,type:'followup',title:it.title,summary:it.meta,route:it.route}))
      ].slice(0,20);
      lastSearch=query.trim();
      navigate('search');
      return{count:res.total,results};
    }
  });
  register({
    name:'create_follow_up',title:'יצירת מעקב',
    description:'יצירת משימת מעקב חדשה עבור אדם במאגר ועדכון מסך המעקבים.',
    inputSchema:{type:'object',properties:{person:{type:'string',minLength:1},title:{type:'string',minLength:1},due:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'}},required:['person','title','due'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(input){
      if(!input||typeof input.person!=='string'||typeof input.title!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.due))throw new Error('נתוני המעקב אינם תקינים');
      const item={id:crypto.randomUUID(),person:input.person.trim(),title:input.title.trim(),due:input.due,done:false};
      data.followups.unshift(item);
      save();
      navigate('followups');
      return{id:item.id,status:'created'};
    }
  });
}

/* ---------- init ---------- */
let data=load();
initTheme();
ensureAllAnalysis();
bindImport();
bindPalette();
bindModelContext();
el('global-search-btn').onclick=openPalette;
render();
window.addEventListener('hashchange',()=>{
  const r=parseRoute();
  if(r.key==='search'&&r.param){lastSearch=r.param}
  render();
});
document.addEventListener('keydown',e=>{
  const inField=/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||'');
  if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();openPalette()}
  else if(e.key==='/'&&!inField&&el('search-dialog').open===false){e.preventDefault();openPalette()}
});
if('serviceWorker'in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
/* debug/test hook */
window.__consulting={SEED,load,save,analyzeTranscript,splitSegments,searchAll,tokenize,relatedPrinciples,data,navigate,esc};
