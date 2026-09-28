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
    {id:'m4',title:'מעקב · איך עבד כלל עשר הדקות',person:'דניאל',date:'2026-09-17',summary:'הכלל עבד חלקית. נוסף ניסוח מפורש של זמן החזרה.',transcript:'[00:01] היועץ: איך עבד כלל עשר הדקות?\n[00:20] דניאל: עבד בשתי מריבות מתוך שלוש. בפעם השלישית אשתי הרגישה שאני בורח.\n[01:05] היועץ: המלצתי שלפני העצירה תאמר במפורש מתי תחזור, כי בלי זמן חזרה העצירה נשמעת כנטישה.\n[01:20] היועץ: בבית עם ילדים קטנים זה לא תמיד אפשרי, ואז עוצרים רק את הנושא ולא את השיחה.\n[01:40] היועץ: המטרה היא שהעצירה תיתפס ככלי משותף ולא כבריחה.\n[02:10] היועץ: בפגישה הבאה נבדוק אם הניסוח המפורש שינה את התגובה.',plaud:'נושא: תוצאות כלל עשר הדקות.\nתוצאה: הצליח בשתיים מתוך שלוש מריבות.\nהמלצה: לומר במפורש מתי חוזרים לשיחה.\nחריג: כשיש ילדים קטנים בבית עוצרים את הנושא ולא את השיחה.',tags:['תקשורת','ויסות']},
    {id:'m5',title:'מעקב · תוצאות הניסויים',person:'נועה',date:'2026-09-12',summary:'הניסוי בהדרכה נתן אנרגיה. הוחלט להגדיל אותו ליום בשבוע.',transcript:'[00:02] היועץ: מה נתן לך הכי הרבה אנרגיה בשבועיים האחרונים?\n[00:25] נועה: הניסוי השני, ההדרכה. אבל אני עדיין חוששת לעזוב, יש לי משכנתא.\n[01:10] היועץ: אני לא שואל אם לעזוב, אני שואל מה את לומדת על עצמך מהניסויים.\n[01:40] נועה: הבנתי. זה לא החלטה אחת, זה כיוון.\n[02:05] היועץ: המלצתי שתגדילי את ההדרכה ליום בשבוע, כי כך בודקים את הכיוון בלי לסכן את המשכנתא.\n[02:40] היועץ: בפגישה הבאה נבדוק איך הרגיש היום הנוסף.',plaud:'נושא: תוצאות שני הניסויים.\nתובנה: ההדרכה נותנת אנרגיה.\nהמלצה: להגדיל את ההדרכה ליום בשבוע.\nמעקב: לבדוק איך הרגיש היום הנוסף.',tags:['קריירה','החלטות']},
    {id:'m6',title:'מעקב · תגובת המשפחה',person:'משפחת לוי',date:'2026-09-22',summary:'המשפחה כיבדה את הגבול. אבי חושש שזה לא יחזיק.',transcript:'[00:03] היועץ: מה קרה כשהצגתם את הגבול?\n[00:20] רונית: אמא שלי נעלבה. אבל בסוף היא כיבדה את זה.\n[00:48] אבי: אני לא בטוח שזה יחזיק לאורך זמן.\n[01:15] היועץ: במקום לשאול אם זה יחזיק, תסתכלו על זה כעל אימון משותף שלכם.\n[01:50] אבי: אתה צודק, זה באמת חיזק אותנו כזוג.\n[02:20] היועץ: המלצתי שתמשיכו להציג כל החלטה משפחתית יחד, כי החזית המשותפת היא מה שעבד.\n[02:45] היועץ: בפגישה הבאה נחזור לזה ונבדוק את החגים.',plaud:'נושא: תגובת המשפחה לגבול.\nתוצאה: האם נעלבה אך כיבדה את הגבול.\nהמלצה: להמשיך להציג החלטות יחד.\nמעקב: החגים.',tags:['גבולות','זוגיות']}
  ],
  seedVersion:2,
  people:[{name:'משפחת לוי',topic:'גבולות משפחתיים'},{name:'דניאל',topic:'תקשורת זוגית'},{name:'נועה',topic:'שינוי מקצועי'}],
  principles:[
    {title:'חזית זוגית משותפת לפני הצבת גבול',description:'מגבשים עמדה בין בני הזוג ורק אז מציגים אותה למשפחה המורחבת.'},
    {title:'לא מקבלים החלטה גדולה מתוך סערה',description:'מפרקים החלטה לניסויים קטנים ואוספים מידע לפני צעד בלתי הפיך.'},
    {title:'עצירה היא כלי תקשורת, לא נטישה',description:'מגדירים מראש זמן חזרה לשיחה כדי שהפסקה תייצר ביטחון.'}
  ],
  // תיק (case) הוא ישות נפרדת: בעיה או נושא מתמשך. אדם יכול להיות בכמה תיקים, תיק יכול לכלול כמה אנשים וכמה הקלטות, והקלטה יכולה להשתייך לכמה תיקים.
  cases:[
    {id:'c1',title:'תקשורת בזמן קונפליקט',status:'open',people:['דניאל'],recordingIds:['m2','m4'],tags:['תקשורת','ויסות']},
    {id:'c2',title:'גבולות מול המשפחה המורחבת',status:'open',people:['משפחת לוי'],recordingIds:['m1','m6'],tags:['גבולות','משפחה']},
    {id:'c3',title:'שינוי מקצועי',status:'open',people:['נועה'],recordingIds:['m3','m5'],tags:['קריירה','החלטות']}
  ],
  followups:[
    {id:'f1',person:'דניאל',title:'לבדוק איך עבד כלל עשר הדקות',due:'2026-09-14',done:true,meetingId:'m2'},
    {id:'f2',person:'משפחת לוי',title:'מה הייתה תגובת המשפחה לגבול החדש?',due:'2026-09-16',done:false,meetingId:'m1'},
    {id:'f3',person:'נועה',title:'לעבור על תוצאות שני הניסויים',due:'2026-09-20',done:false,meetingId:'m3'},
    {id:'f4',person:'דניאל',title:'האם הניסוח המפורש של זמן החזרה שינה את התגובה?',due:'2026-10-01',done:false,meetingId:'m4'},
    {id:'f5',person:'נועה',title:'בפגישה הבאה נבדוק איך הרגיש היום הנוסף.',due:'2026-09-19',done:false,meetingId:'m5'},
    {id:'f6',person:'משפחת לוי',title:'בפגישה הבאה נחזור לזה ונבדוק את החגים.',due:'2026-09-29',done:false,meetingId:'m6'}
  ]
};

/* ---------- אחסון ---------- */
const LS_KEY='consultingKnowledge';
const BACKUP_KEY='consultingLastBackup';
let storageWarned=false;
/* מקור הנתונים: מקומי (דוגמה, localStorage) או שרת (ה־NAS, קריאה בלבד).
   במצב שרת נשמר עותק נפרד תחת SERVER_KEY, כדי שנתוני השרת לא ידרסו את המאגר המקומי. */
const SERVER_KEY='consultingKnowledge:server';
const SOURCE_KEY='consultingSource';
const SERVER_CONTRACT='nitzotza.snapshot.v1';
const SERVER_URL='./api/snapshot';
const SOURCE={mode:'local',status:'local',generatedAt:null,count:0};
function readSource(){try{return localStorage.getItem(SOURCE_KEY)}catch{return null}}
function storeKey(){return SOURCE.mode==='server'?SERVER_KEY:LS_KEY}
function load(){
  try{
    if(readSource()==='server'){
      const c=JSON.parse(localStorage.getItem(SERVER_KEY));
      if(c&&Array.isArray(c.meetings)){SOURCE.mode='server';SOURCE.status='cached';SOURCE.generatedAt=c.generatedAt||null;SOURCE.count=c.meetings.length;return c}
    }
    return JSON.parse(localStorage.getItem(LS_KEY))||structuredClone(SEED)
  }catch{return structuredClone(SEED)}
}
// במצב שרת נשמרת במכשיר רק הרשימה הקלה. תמלול וניתוח PLAUD לא נשמרים באחסון המקומי.
function persistable(){
  if(SOURCE.mode!=='server')return data;
  return{...data,meetings:data.meetings.map(m=>m.source==='server'?stubOf(m):m)};
}
function stubOf(m){const{transcript,plaud,analysis,detailLoaded,...rest}=m;return{...rest,transcript:'',plaud:'',stub:true}}
function save(){
  try{localStorage.setItem(storeKey(),JSON.stringify(persistable()))}
  // במצב שרת המאגר גדול מדי לאחסון המקומי, והנתונים נטענים מחדש מהשרת בכל כניסה. אין צורך להתריע.
  catch{if(SOURCE.mode!=='server'&&!storageWarned){storageWarned=true;toast('האחסון במכשיר לא זמין. השינויים יישמרו רק עד סגירת הדף.')}}
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
const PARENT={case:'recordings',person:'people',principle:'principles',file:'people'};
const KNOWN=['home','recordings','people','followups','advice','principles','contradictions','search','case','person','principle','file'];
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
const ANALYSIS_VERSION=8;
const ENGINE_LABEL='כללים מקומיים';
const H={
  contradiction:/(שונה מכלל|חריג|לעומת זאת|לא תמיד|בתנאים מסוימים|יוצא מן הכלל)/,
  // עצה = המלצה מפורשת או פנייה ישירה לאדם. "כדאי" או "צריך ל" לבדם אינם עצה: בשיחה אמיתית הם מופיעים בכל משפט.
  advice:/(המלצתי|המלצנו|הצעתי|אני מציע(ה)?|אני ממליץ(ה)?|הייתי ממליץ(ה)?|הייתי מציע(ה)?|ממליץ לך|מציע לך|העצה שלי|כדאי (לך|לכם|לכן|לו|לה|שת|שתנסה|שתנסי)|מומלץ (לך|לכם|ש)|מוטב (לך|ש)|(אתה|את|אתם) צריכ(ה|ים)? ל|צריך שת|חשוב שת|נראה לי (שת|שכדאי)|תשתדל(י|ו)?(?=[\s,.!]|$)|תקפיד(י|ו)?(?=[\s,.!]|$))/,
  decision:/(הוחלט|החלטנו|סיכמנו|הסכמנו)/,
  // מעקב = התחייבות לחזור לנושא. "לבדוק" או "מעקב" לבדם מופיעים בכל שיחה.
  followup:/(בפגישה הבאה|בפגישה העתידה|בשיחה הבאה|בשבוע הבא נ|(^|\s)נבדוק|נחזור (על|ל)?זה|נחזור לזה|תעדכנ(י|ו)? אותי|נדבר שוב|נקבע (פגישה|שיחה))/,
  result:/(^|[\s,])(עבד|עבדה|עבדו|הצליח|הצליחה|הצליחו|לא הצליח|השתפר|השתפרה|השתפרו|יישם|יישמה|יישמו|עזר|עזרה|לא עזר|כיבד|כיבדה|כיבדו|חיזק|חיזקה)(?=[\s.,!?]|$)/,
  outcome:/(המטרה|התוצאה (הצפויה|הרצויה)|מצפ(ה|ים) ש|הציפייה)/,
  rationale:/(מכיוון|בגלל|הסיבה|שכן|כדי ש|על מנת|הנימוק)/,
  problem:/(הקושי|הבעיה|מתקש|ויכוח|מריב|קונפליקט|מסלימ|פחד|חושש|שוקל|מתלבט|נתקע|סובל|לחץ)/,
  observation:/(תיאר|דיווח|סיפר|שיתף|שיתפה|הרגיש|שמתי לב|הבנתי ש|ניכר ש)/
};
// פנייה ישירה בציווי (עתיד גוף שני). "תגיד לי" או "תשמע" אינם עצה.
const IMPERATIVE=new RegExp('(^|[\\s,])(ו)?('+['תגיד','תסביר','תבקש','תנסה','תעשה','תלך','תדבר','תכתוב','תיקח','תפנה','תחשוב','תבדוק','תתחיל','תפסיק','תחכה','תוותר','תתמקד','תשים לב','אל תמהר','אל תיקח','אל תוותר','אל תיכנס','אל תילחם']
  .flatMap(w=>{const f=w.endsWith('ה')?w.slice(0,-1)+'י':w+'י';const pl=w.endsWith('ה')?w.slice(0,-1)+'ו':w+'ו';return[w,f,pl]}).map(w=>w.replace(/ /g,'\\s')).join('|')+')(?=[\\s,.!]|$)(?!\\s(לי|לנו)(?=[\\s,.!?]|$))');
// שיחת חולין: ברכות, שלום, תודה ופנייה אישית. משפט ארוך שמכיל גם תוכן לא מסונן.
const SMALLTALK=/^(היי|שלום|בוקר טוב|ערב טוב|מה שלומ(ך|כם|כן)|מה נשמע|מה השם שלך|איך קוראים לך|נעים מאוד|תודה( רבה)?|חג שמח|שנה טובה|שבוע טוב|שבת שלום|בשורות טובות|תבורכ|ברוך השם|בעזרת השם|אמן)[\s,.!?]*/;
const isSmallTalk=t=>{const w=t.split(/\s+/).length;if(isAdviceText(t))return false;return(SMALLTALK.test(t)&&w<=7)||(/^(מה שלומ|מה השם|תודה|חג שמח|שנה טובה|בשורות טובות|אוהב אות)/.test(t)&&w<=12)};
const isAdviceText=t=>(H.advice.test(t)||IMPERATIVE.test(t))&&t.split(/\s+/).length>=4;
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
/* ---------- שכבת מתודולוגיה (כללים, מועמדת) ----------
   מזהה מהלכי ייעוץ רק בהקלטות שבהן מסומנים דוברים. כל סיווג הוא הסקה (inferred),
   והטקסט הוא המשפט המקורי. שכבת חילוץ מהשרת יכולה להחליף או להשלים את המערך הזה. */
const METHOD_VERSION='rules-m1';
// שם היועץ בתמלילי PLAUD: "הרב", ובהקלטות ישנות השם המלא של פרופיל הקול.
const CONSULTANT_RE=/(יועץ|הרב|ניצוצא|ברבי)/;
const METHOD={
  question:{label:'שאלה של היועץ',actor:'consultant'},
  reframe:{label:'מסגור מחדש',actor:'consultant',re:/(לא .{1,40}(,? אני שואל|אלא)|במקום ל|תסתכל(י|ו)? על זה|תחשוב(י|ו)? על זה כ|בעצם זה)/},
  rationale:{label:'עצה עם נימוק',actor:'consultant'},
  adaptation:{label:'התאמה לנסיבות',actor:'consultant'},
  followup_plan:{label:'קביעת בדיקה בהמשך',actor:'consultant'},
  client_resistance:{label:'התנגדות או היסוס של הפונה',actor:'client',re:/(אבל אני|אני לא בטוח|לא בטוחה|לא מסכים|לא מסכימה|זה לא יעבוד|קשה לי|חושש|חוששת)/},
  client_turning_point:{label:'נקודת מפנה אצל הפונה',actor:'client',re:/(^הבנתי|אני מבין|אני מבינה|עכשיו ברור|אתה צודק|את צודקת|זה נכון)/}
};
function detectMethodology(segments,items){
  const out=[],isC=s=>!!s.speaker&&CONSULTANT_RE.test(s.speaker),isClient=s=>!!s.speaker&&!CONSULTANT_RE.test(s.speaker);
  if(!segments.some(isC))return out; // בלי דובר מסומן אי אפשר לדעת מי אמר מה
  // סוג המשפט לפי הסיווג הראשי שלו. נימוק שחולץ מתוך משפט עצה מצביע על אותו משפט, ולכן לא נכנס למפה.
  const typeAt=new Map(items.filter(it=>!it.forAdvice).map(it=>[it.evidence.seg,it.type]));
  const add=(sub,i,conf,extra={})=>out.push({id:'method-'+sub+'-'+i,type:'methodology',subtype:sub,actor:METHOD[sub].actor,text:segments[i].text,kind:'inferred',confidence:conf,source:METHOD_VERSION,evidence:{quote:segments[i].text,time:segments[i].time,speaker:segments[i].speaker,seg:i},...extra});
  const nextOf=(i,pred)=>{for(let j=i+1;j<Math.min(segments.length,i+4);j++)if(pred(segments[j]))return j;return -1};
  const prevOf=(i,pred)=>{for(let j=i-1;j>=Math.max(0,i-3);j--)if(pred(segments[j]))return j;return -1};
  segments.forEach((sg,i)=>{
    if(isC(sg)){
      const t=sg.text,ty=typeAt.get(i);
      if(/\?\s*$/.test(t))add('question',i,62);
      else if(METHOD.reframe.re.test(t))add('reframe',i,58);
      else if((ty==='advice'||ty==='decision')&&/[\s,](כי|מכיוון ש|בגלל ש|כדי ש|על מנת ל)\s/.test(t))add('rationale',i,70);
      else if(ty==='contradiction')add('adaptation',i,56);
      else if(ty==='followup')add('followup_plan',i,68);
      else return;
      const r=nextOf(i,isClient);if(r>=0)out[out.length-1].response={seg:r};
    }else if(isClient(sg)){
      if(METHOD.client_turning_point.re.test(sg.text)){add('client_turning_point',i,58);const b=prevOf(i,isC);if(b>=0)out[out.length-1].before={seg:b}}
      else if(METHOD.client_resistance.re.test(sg.text)){add('client_resistance',i,56);const r=nextOf(i,isC);if(r>=0)out[out.length-1].response={seg:r}}
    }
  });
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
  // כשהיועץ מסומן בתמליל, עצה והחלטה נספרות רק ממה שהוא אמר. "כדאי" או "צריך ל" בפי הלקוח אינם עצה.
  let consultant=segments.find(s=>s.speaker&&CONSULTANT_RE.test(s.speaker))?.speaker||null,consultantInferred=false;
  // בלי תווית יועץ (Speaker 1, Speaker 2): היועץ הוא הדובר שנותן הכי הרבה עצות מפורשות, אם הפער ברור.
  if(!consultant){
    const hits=new Map();
    for(const sg of segments)if(sg.speaker&&!/\?\s*$/.test(sg.text)&&isAdviceText(sg.text))hits.set(sg.speaker,(hits.get(sg.speaker)||0)+1);
    const [a,b]=[...hits].sort((x,y)=>y[1]-x[1]);
    if(a&&a[1]>=2&&(!b||a[1]>=b[1]*2)){consultant=a[0];consultantInferred=true}
  }
  const isCons=sp=>!!sp&&(CONSULTANT_RE.test(sp)||sp===consultant);
  const hasConsultant=!!consultant;
  const seenAdvice=new Set(),normAdv=t=>t.replace(/[^\u0590-\u05FFa-z0-9]+/gi,' ').trim();
  segments.forEach((seg,i)=>{
    const t=seg.text;
    const question=/\?\s*$/.test(t);
    const fromClient=hasConsultant&&!!seg.speaker&&!isCons(seg.speaker);
    const fromCons=hasConsultant&&!!seg.speaker&&isCons(seg.speaker);
    const words=t.split(/\s+/).length;
    // ברכות, פתיחה וסגירה של שיחה, ומשפטים של מילה או שתיים אינם ידע.
    if(isSmallTalk(t)||words<3)return;
    if(!question&&words>=5&&H.contradiction.test(t))push('contradiction',seg,i,'inferred',60);
    else if(!question&&!fromClient&&isAdviceText(t)&&!seenAdvice.has(normAdv(t))){seenAdvice.add(normAdv(t));push('advice',seg,i,'explicit',consultantInferred?70:84)}
    else if(!question&&!fromClient&&H.decision.test(t))push('decision',seg,i,'explicit',80);
    else if(!question&&!fromClient&&H.followup.test(t))push('followup',seg,i,'explicit',78);
    else if(!question&&!fromCons&&H.result.test(t))push('result',seg,i,'explicit',72);
    else if(!question&&H.outcome.test(t))push('outcome',seg,i,'explicit',74);
    else if(!question&&words>=4&&H.rationale.test(t))push('reasoning',seg,i,'explicit',74);
    // הבעיה היא מה שהלקוח מתאר, לא שאלה של היועץ
    else if(!question&&!fromCons&&words>=4&&H.problem.test(t))push('problem',seg,i,'explicit',76);
    else if(!question&&words>=4&&H.observation.test(t))push('observation',seg,i,'inferred',64);
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
    consultant:consultant?{label:consultant,inferred:consultantInferred}:null,
    problem:problems[0]||null,
    observations:problems.slice(1).concat(by('observation')).slice(0,6),
    reasoning:by('reasoning'),
    advice:by('decision').concat(by('advice')),
    outcomes:by('outcome'),
    results:by('result'),
    followups:by('followup'),
    contradictions:by('contradiction'),
    methodology:detectMethodology(segments,items),
    wordCount:String(text||'').trim().split(/\s+/).filter(Boolean).length,
    timeRange:times.length>=2?times[0]+'–'+times[times.length-1]:null,
    summary:(by('decision').concat(by('advice'))[0]||problems[0]||segments[0])?.text||''
  };
}
function ensureAllAnalysis(){
  let changed=false;
  for(const m of data.meetings){
    if(!m.id){m.id='m-'+Date.now()+'-'+Math.floor(Math.random()*1e4);changed=true}
    if(!m.analysis||m.analysis.version!==ANALYSIS_VERSION){m.analysis=analyzeTranscript(m.transcript);if(!m.stub)changed=true}
  }
  data.principles.forEach((p,i)=>{if(!p.id){p.id='p'+(i+1);changed=true}});
  // מאגר מגרסה קודמת: אין בו תיקים. מוסיפים רק את תיקי הדוגמה שההקלטות שלהם קיימות. לא מאחדים אוטומטית לפי אדם.
  if(!Array.isArray(data.cases)){
    const ids=new Set(data.meetings.map(m=>m.id));
    data.cases=structuredClone(SEED.cases).map(c=>({...c,recordingIds:c.recordingIds.filter(id=>ids.has(id))})).filter(c=>c.recordingIds.length);
    changed=true;
  }
  // נתוני דוגמה מגרסה קודמת: מוסיפים את הקלטות הדוגמה החדשות. נוגע רק במאגר שמכיל את הדוגמה המקורית.
  if((data.seedVersion||1)<SEED.seedVersion&&data.meetings.some(m=>m.id==='m1'&&m.person==='משפחת לוי')){
    const have=new Set(data.meetings.map(m=>m.id));
    for(const m of SEED.meetings)if(!have.has(m.id)){const c=structuredClone(m);c.analysis=analyzeTranscript(c.transcript);data.meetings.push(c)}
    const fh=new Set(data.followups.map(f=>f.id));for(const f of SEED.followups)if(!fh.has(f.id))data.followups.push(structuredClone(f));
    for(const sc of SEED.cases){const c=allCases().find(x=>x.id===sc.id);if(c)for(const id of sc.recordingIds)if(!c.recordingIds.includes(id)&&data.meetings.some(m=>m.id===id))c.recordingIds.push(id)}
    data.seedVersion=SEED.seedVersion;changed=true;
  }
  if(changed)save();
}
// נימוק לעצה: נימוק שבתוך משפט העצה, או נימוק נפרד שנאמר עד 3 משפטים ממנה.
// בהקלטה ארוכה אין לשייך לכל עצה את הנימוק הראשון בהקלטה.
const REASON_WINDOW=3;
function reasonFor(an,adv){
  const rs=an.reasoning||[];
  const own=rs.find(r=>r.forAdvice===adv.id);if(own)return own;
  const at=adv.evidence?.seg;if(typeof at!=='number')return null;
  let best=null,bd=Infinity;
  for(const r of rs){
    if(r.forAdvice||typeof r.evidence?.seg!=='number')continue;
    if(adv.evidence.speaker&&r.evidence.speaker&&adv.evidence.speaker!==r.evidence.speaker)continue; // נימוק של הלקוח אינו הנימוק לעצה
    const d=r.evidence.seg-at,dist=d>0?d:-d+.5; // עדיפות לנימוק שנאמר אחרי העצה
    if(d!==0&&Math.abs(d)<=REASON_WINDOW&&dist<bd){best=r;bd=dist}
  }
  return best;
}

/* ---------- נגזרות מהנתונים ---------- */
function allCases(){return Array.isArray(data.cases)?data.cases:[]}
function caseById(id){return allCases().find(c=>c.id===id)||null}
function casesOfRecording(mid){return allCases().filter(c=>(c.recordingIds||[]).includes(mid))}
function casesOfPerson(name){return allCases().filter(c=>(c.people||[]).includes(name)||(c.recordingIds||[]).some(id=>data.meetings.find(m=>m.id===id)?.person===name))}
function recordingsOfCase(c){return(c.recordingIds||[]).map(id=>data.meetings.find(m=>m.id===id)).filter(Boolean).sort(byDateDesc)}
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
// כתיב מלא: „וויכוח” ו„ויכוח” הם אותה מילה. מנרמלים וו ויי כפולים.
const normHe=t=>t.replace(/וו/g,'ו').replace(/יי/g,'י');
function stems(tok){
  const out=new Set([tok,normHe(tok)]);
  // עד שתי אותיות תחילית (למשל „וה”, „שב”), ואז גרסה מנורמלת של כל תוצאה
  for(let round=0;round<2;round++)for(const w of [...out])for(const p of PFX)if(w.startsWith(p)&&w.length-p.length>=3){const r=w.slice(p.length);out.add(r);out.add(normHe(r))}
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
function aiTag(it){return`<span class="tag tag-ai" title="זוהה על ידי ${esc(it.model||'מודל מקומי')} והציטוט נבדק מול התמליל">ציטוט מאומת · ${esc(it.model||'AI')}</span>`}
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
    ${it.summary?`<p class="kitem-sum">${esc(it.summary)}</p>`:''}
    <p class="kitem-text${it.summary?' is-quote':''}">${esc(it.text)}</p>
    <div class="kitem-foot">${it.subtype&&METHOD[it.subtype]?`<span class="tag tag-pat">${METHOD[it.subtype].label}</span>`:''}${it.source==='ai'?aiTag(it):kindTag(it.kind)}${it.source==='ai'?'':confHtml(it.confidence)}
      ${it.evidence?`<button class="link-btn why-btn" type="button" aria-expanded="false" data-why="why-${esc(mid)}-${esc(it.id)}">${ic('quote')}למה?</button>`:''}
    </div>
    ${whyHtml(it,mid)}
  </div>`;
}
// רשימה ארוכה מקוצרת ל־5 פריטים, והשאר נפתחים בלחיצה.
const STEP_SHOW=5;
function stepItems(items,mid,label){
  if(items.length<=STEP_SHOW)return items.map(it=>itemHtml(it,mid)).join('');
  return items.slice(0,STEP_SHOW).map(it=>itemHtml(it,mid)).join('')+`<details class="step-rest"><summary class="link-btn step-more">עוד ${items.length-STEP_SHOW} ב־${esc(label)}</summary><div class="step-body">${items.slice(STEP_SHOW).map(it=>itemHtml(it,mid)).join('')}</div></details>`;
}
function stepHtml(label,items,mid,opts={}){
  return`<section class="chain-step ${opts.cls||''} ${opts.cat?'k-'+opts.cat:''}">
    <h3 class="step-label">${label}</h3>
    <div class="step-body">${items&&items.length?stepItems(items,mid,label):`<p class="step-empty">${opts.empty||'לא זוהה בפגישה זו'}</p>`}</div>
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
    <div class="row-end"><span class="status-chip ${m.stub||!an.version?'pending':''}">${m.stub?'נטען בפתיחה':an.version?'נותח':'ממתין'}</span><span class="row-arrow">${ic('fwd')}</span></div>
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
  return`<div class="tip-row">
    ${a.summary?`<p class="tip-sum">${esc(a.summary)}</p>`:''}
    <p class="tip-text${a.summary?' is-quote':''}">${esc(a.text)}</p>
    ${reason?`<p class="tip-why"><b>למה:</b> ${esc(reason.text)}</p>`:`<p class="tip-why"><b>למה:</b> <span class="muted-note">לא זוהה נימוק מפורש</span></p>`}
    <div class="tip-foot">
      ${opts.noPerson?'':`<a href="#/person/${encodeURIComponent(m.person)}">${esc(m.person)}</a><i class="dot-sep"></i>`}
      ${opts.noMeeting?'':`<span>${formatDate(m.date)}</span><i class="dot-sep"></i>
      <a href="#/case/${esc(m.id)}">${esc(m.title)}</a>`}
      ${a.source==='ai'?aiTag(a):kindTag(a.kind)}
      ${a.evidence?`<button class="link-btn" type="button" data-src-case="${esc(m.id)}" data-src-seg="${a.evidence.seg}">${ic('quote')}ציון מקור</button>`:''}
      <button class="link-btn" type="button" data-ask-open="" data-scope-type="advice" data-scope-id="${esc(m.id+':'+a.id)}">${ic('spark')}שאל על העצה</button>
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
    <text x="${X(imx)}" y="${Y(mx)-4}" class="wx-ext">${Math.round(mx)}°</text>${imn!==imx?`<text x="${X(imn)}" y="${Y(mn)+11>H-18?Y(mn)-5:Y(mn)+11}" class="wx-ext">${Math.round(mn)}°</text>`:''}
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

/* ============================================================
   שאל את המוח השני · שכבה 1 (בדפדפן, בלי מודל שפה)
   שאלה → כוונה → היקף → שליפה מובנית → ראיות → אימות ציטוט → תשובה
   התשובה נבנית רק מפריטים שכבר חולצו, לכן אין בה תוכן מומצא.
   החוזה (answer/findings/evidence/related/coverage/unknowns) זהה
   לחוזה המתוכנן של POST /api/assistant/ask בשרת ה-NAS.
   ============================================================ */
const INTENTS=[
  {k:'briefing',label:'הכנה לפגישה',re:/(תכין|הכנה|להתכונן|לפני הפגישה|לפני שאני מדבר|עוד מעט מדבר|מה חשוב שאזכור|מה חשוב לדעת|מה באמת חשוב|תזכיר לי|תדריך)/},
  {k:'method',label:'שיטת הייעוץ',re:/(איך אני (בדרך כלל |נוהג |נוטה )?(מייעץ|עובד|מגיב|פותח|מוביל|מנסח|מנמק|עושה מסגור|מתמודד)|מה אני (עושה|עונה) כש|שיטת הייעוץ|השיטה שלי|מהלכי ייעוץ|מהלכים|טכניק|דפוסי ייעוץ|התנגד|נקודת מפנה|נקודות מפנה|מסגור מחדש|הניסוח שלי|משנה כיוון|באמצע השיחה)/},
  {k:'changedMind',label:'שינויים וסתירות בעצות',re:/(שיניתי את|שיניתי|שינית|סותר|סתירה|סתירות|משהו אחר|אמרתי אחרת)/},
  {k:'firstSeen',label:'מתי נושא הופיע לראשונה',re:/(מתי .{0,25}התחיל|מתי .{0,25}הופיע|מתי לראשונה|הופיע לראשונה|מאיזה שלב)/},
  {k:'unresolved',label:'מה נסגר ומה פתוח',re:/(מה נסגר|נסגר ומה|לא בוצע|לא ביצע|טרם בוצע|מה עדיין לא|עוד לא ביצע)/},
  {k:'outcomes',label:'מה קרה אחרי העצות',re:/(האם .{0,30}עבד|האם .{0,30}עזר|האם .{0,30}הצליח|העצות שלי עבדו|תוצאות? של העצ|מה יצא מ)/},
  {k:'timeline',label:'התפתחות לאורך זמן',re:/(ציר זמן|התפתח|התפתחות|לאורך הזמן|לאורך זמן|לאורך השנים|הפגישות האחרונות|בחצי השנה|בחודש האחרון|בשנה האחרונה|בשבוע האחרון|בחודשים האחרונים)/},
  {k:'why',label:'הנימוק לעצה',re:/(למה|מדוע|מה הנימוק|מה הסיבה|על סמך מה)/},
  {k:'previous',label:'מה נאמר בפעם הקודמת',re:/(בפעם הקודמת|בפגישה הקודמת|בפגישה האחרונה|בפעם האחרונה|לאחרונה)/},
  {k:'changed',label:'מה השתנה',re:/(מה השתנה|השתנה מאז|מאז הפגישה|התקדמות|מה קרה בעקבות|מה קרה מאז|מה קרה אחרי|התפתח|התפתחה|מה כבר ניסינו|תוצאות ידועות)/},
  {k:'open',label:'מה עדיין פתוח',re:/(פתוח|פתוחים|מעקב|מעקבים|לבדוק|לחזור|לא בוצע|היה אמור|משימות|התחייב)/},
  {k:'exceptions',label:'חריגים',re:/(חריג|חריגים|יוצא דופן|לא חל)/},
  {k:'principles',label:'עקרונות חוזרים',re:/(עקרונ|עיקרון|דפוס|דפוסים|מתודולוגיה|שיטה שלי)/},
  {k:'recurring',label:'מה חוזר',re:/(חוזר|חוזרת|חוזרים|חוזרות|חזרה מספר|שוב ושוב|בכל פעם|כל פעם)/},
  {k:'questions',label:'שאלות שהיועץ שואל',re:/(אילו שאלות|איזה שאלות|מה אני שואל|שאלות אני)/},
  {k:'similar',label:'מקרים דומים',re:/(דומה|דומים|דומות|נתקלתי|כבר ראיתי)/},
  {k:'problems',label:'בעיות',re:/(בעיה|בעיות|הקושי|קשיים|חוזרת אצלו|חוזר אצלו|חוזרות)/},
  {k:'advice',label:'עצות שניתנו',re:/(המלצתי|ייעצתי|עצה|עצות|המלצה|המלצות|אמרתי)/}
];
const INTENT_WORDS=/(מה|אילו|איזה|אמרתי|המלצתי|ייעצתי|לו|לה|להם|בפעם|הקודמת|האחרונה|מצא|לי|מקרים|דומים|דומה|עם|על|של|בנושא|תכין|אותי|לפגישה|שאלות|אני|שואל|נתקלתי|כבר|עצות|עצה|בעיה|בעיות)/g;
function detectIntent(q){const s=String(q||'');for(const i of INTENTS)if(i.re.test(s))return i;return{k:'search',label:'חיפוש חופשי'}}
function adviceRef(id){
  const [mid,aid]=String(id||'').split(':');const m=data.meetings.find(x=>x.id===mid);
  const a=m?.analysis?.advice?.find(x=>x.id===aid);return a?{m,a}:null;
}
function scopeLabel(sc){
  if(sc.type==='person')return sc.id;
  if(sc.type==='case'){const c=caseById(sc.id);return c?'התיק „'+c.title+'”':'תיק'}
  if(sc.type==='advice'){const r=adviceRef(sc.id);return r?'העצה מ־'+formatDate(r.m.date)+' ('+r.m.person+')':'עצה'}
  if(sc.type==='recording'){const m=data.meetings.find(x=>x.id===sc.id);return m?'ההקלטה „'+m.title+'”':'הקלטה'}
  return'כל המאגר';
}
function scopeFromRoute(){
  const r=parseRoute();
  if(r.key==='person'&&r.param)return{type:'person',id:r.param};
  if(r.key==='case'&&data.meetings.some(m=>m.id===r.param))return{type:'recording',id:r.param};
  if(r.key==='file'&&caseById(r.param))return{type:'case',id:r.param};
  return{type:'global'};
}
// שם אדם שמופיע בשאלה מצמצם את ההיקף אליו (רק כשההיקף הוא כל המאגר)
function scopeForQuestion(q,sc){
  if(sc.type!=='global')return sc;
  const p=allPeople().map(x=>x.name).sort((a,b)=>b.length-a.length).find(n=>String(q).includes(n));
  return p?{type:'person',id:p}:sc;
}
function meetingsIn(sc){
  if(sc.type==='person')return meetingsOf(sc.id);
  if(sc.type==='recording')return data.meetings.filter(m=>m.id===sc.id);
  if(sc.type==='case'){const c=caseById(sc.id);return c?recordingsOfCase(c):[]}
  if(sc.type==='advice'){const r=adviceRef(sc.id);return r?meetingsOf(r.m.person):[]}
  return[...data.meetings].sort(byDateDesc);
}
function evOf(m,it){
  const e=it.evidence||{};
  return{mid:m.id,itemId:it.id,seg:e.seg,quote:e.quote,time:e.time||null,speaker:e.speaker||null,date:m.date,person:m.person,title:m.title,version:m.analysis?.version||null,kind:it.kind,confidence:it.confidence};
}
function finding(m,it,label){return{label:label||formatDate(m.date)+' · '+m.title,text:it.text,kind:it.kind,confidence:it.confidence,ev:it.evidence?evOf(m,it):null}}
function coverageOf(sc,ms,opts={}){
  const total=data.meetings.length,cur=ms.filter(m=>m.analysis?.version===ANALYSIS_VERSION).length;
  const meth=ms.filter(m=>(m.analysis?.methodology||[]).length).length;
  const n=ms.length===1?'הקלטה אחת':ms.length+' הקלטות';
  let t=sc.type==='global'?`החיפוש כלל את כל ${ms.length} ההקלטות במאגר`:sc.type==='person'?`החיפוש כלל ${n} של ${sc.id} (מתוך ${total} במאגר)`:sc.type==='case'?`החיפוש כלל ${n} בתיק (מתוך ${total} במאגר)`:sc.type==='advice'?`החיפוש כלל את העצה ואת ${n} של אותו אדם (מתוך ${total} במאגר)`:`החיפוש כלל הקלטה אחת (מתוך ${total} במאגר)`;
  t+=cur===ms.length?`, כולן מנותחות בגרסה ${ANALYSIS_VERSION} של ${ENGINE_LABEL}.`:`. ${cur} מהן בגרסה ${ANALYSIS_VERSION}, והשאר בגרסה ישנה יותר.`;
  if(opts.method)t+=` שכבת המתודולוגיה: ${meth} הקלטות עובדו. הממצאים הם תצפיות מועמדות בלבד.`;
  return{inScope:ms.length,total,currentVersion:cur,methodology:meth,text:t};
}
// אימות: ציטוט מוצג רק אם הוא מופיע מילה במילה במשפט המקור
function verifyEvidence(ans){
  let dropped=0;
  for(const f of ans.findings){
    if(!f.ev)continue;
    const m=data.meetings.find(x=>x.id===f.ev.mid);
    const seg=m?.analysis?.segments?.[f.ev.seg];
    if(!seg||!f.ev.quote||!seg.text.includes(f.ev.quote)){f.ev=null;dropped++}
  }
  if(dropped)ans.unknowns.push(dropped+' ציטוטים לא עברו אימות מול התמלול והוסרו.');
  ans.verified=true;
  return ans;
}
/* ---------- שכבת זמן: חלון זמן, מושגים חוזרים, קישור עצה לתוצאה ---------- */
// מספר + שם עצם בעברית תקינה: „עצה אחת”, „2 עצות”
const cnt=(n,one,many)=>n===1?one:n+' '+many;
const HEB_NUM={'שתי':2,'שני':2,'שלוש':3,'שלושה':3,'ארבע':4,'ארבעה':4,'חמש':5,'חמישה':5,'שש':6,'עשר':10};
function parseWindow(q){
  q=String(q||'');
  const n=q.match(/(\d+|שתי|שני|שלוש|שלושה|ארבע|ארבעה|חמש|חמישה|שש|עשר)\s+ה?פגישות\s+ה?אחרונות/);
  if(n)return{kind:'last',n:+n[1]||HEB_NUM[n[1]],label:(+n[1]||HEB_NUM[n[1]])+' הפגישות האחרונות'};
  const d=[[/בשבוע האחרון/,7,'השבוע האחרון'],[/בחודש האחרון/,31,'החודש האחרון'],[/בחודשים האחרונים/,92,'שלושת החודשים האחרונים'],[/בחצי השנה האחרונה/,183,'חצי השנה האחרונה'],[/בשנה האחרונה/,366,'השנה האחרונה']].find(([re])=>re.test(q));
  return d?{kind:'since',from:addDays(todayISO(),-d[1]),label:d[2]}:null;
}
function applyWindow(ms,w){
  if(!w)return ms;
  if(w.kind==='last')return ms.slice(0,w.n); // ms ממוין מהחדש לישן
  return ms.filter(m=>m.date>=w.from);
}
// מושג = קבוצת מילים נרדפות, או שורש של מילה משמעותית. כך „ויכוחים” ו„מריבות” נספרים כאותו נושא.
const CONCEPT_STOP=new Set('המלצתי המלצנו סיכמנו הוחלט בפגישה הבאה נבדוק לבדוק בפעם השלישית שלוש מתוך במפורש לפני אחרי שלפני תאמר תחזור שתבצע הקטנים קטנים שיחה בשיחה לשיחה השיחה ויציגו אותו כעמדה'.split(' '));
function conceptKeys(text,exclude=new Set()){
  const keys=new Map();
  for(const tok of tokenize(text)){
    if(CONCEPT_STOP.has(tok)||exclude.has(tok))continue;
    const st=stems(tok);
    const gi=SYN.findIndex(g=>g.some(w=>st.some(x=>x===w||(w.length>=3&&x.startsWith(w))||(x.length>=4&&w.startsWith(x)))));
    if(gi>=0){keys.set('g'+gi,SYN[gi][0]);continue}
    const base=st[st.length-1];
    if(base.length>=4&&!CONCEPT_STOP.has(base)&&!exclude.has(base))keys.set(base,base);
  }
  return keys;
}
function recurringConcepts(ms,types=['problem','observations','results','contradictions']){
  const names=new Set(allPeople().flatMap(p=>tokenize(p.name)));
  const map=new Map();
  for(const m of ms){const an=m.analysis||{};
    const items=types.flatMap(k=>k==='problem'?(an.problem?[an.problem]:[]):(an[k]||[]));
    for(const it of items)for(const [k,label] of conceptKeys(it.text,names)){
      if(!map.has(k))map.set(k,{key:k,label,occ:[]});map.get(k).occ.push({m,it});
    }
    for(const t of m.tags||[]){const k='tag:'+t;if(!map.has(k))map.set(k,{key:k,label:t,tag:true,occ:[]});map.get(k).occ.push({m,it:null})}
  }
  return[...map.values()].map(c=>({...c,meetings:new Set(c.occ.map(o=>o.m.id)).size,people:new Set(c.occ.map(o=>o.m.person)).size}))
    .filter(c=>c.meetings>=2).sort((a,b)=>b.meetings-a.meetings||b.people-a.people||(a.tag?1:0)-(b.tag?1:0));
}
// קישור עצה לתוצאה: התוצאות שדווחו בפגישות המאוחרות של אותו אדם, עד העצה הבאה. זה קישור לפי סדר הזמן, ולכן הסקה.
function adviceOutcomes(ms){
  const out=[];
  for(const m of [...ms].sort((a,b)=>a.date.localeCompare(b.date))){
    for(const a of m.analysis?.advice||[]){
      const later=meetingsOf(m.person).filter(x=>x.date>m.date).sort((x,y)=>x.date.localeCompare(y.date));
      const res=[];for(const x of later){for(const r of x.analysis?.results||[])res.push({m:x,it:r});if((x.analysis?.advice||[]).length)break}
      out.push({m,a,later,results:res,status:res.length?'reported':later.length?'not_reported':'no_later_meeting'});
    }
  }
  return out;
}

/* ---------- גילוי שיטה על פני הקלטות ----------
   מהלך שהופיע בהקלטה אחת הוא תצפית מועמדת. „חוזר” דורש לפחות 2 הקלטות של 2 אנשים שונים.
   „מבוסס” דורש לפחות 5 הקלטות של 3 אנשים. הכול מחושב מחדש בכל שאלה, ולכן משתנה כשנוספות הקלטות. */
function methodStatus(rec,people){return rec>=5&&people>=3?'מבוסס':rec>=2&&people>=2?'חוזר':rec>=2?'חוזר אצל אדם אחד':'תצפית מועמדת'}
function methodPatterns(ms){
  const by=new Map();
  for(const m of ms)for(const it of m.analysis?.methodology||[]){if(!by.has(it.subtype))by.set(it.subtype,[]);by.get(it.subtype).push({m,it})}
  const pats=[...by.entries()].map(([sub,occ])=>{
    occ.sort((a,b)=>a.m.date.localeCompare(b.m.date));
    const rec=new Set(occ.map(o=>o.m.id)).size,people=new Set(occ.map(o=>o.m.person)).size;
    return{subtype:sub,label:METHOD[sub]?.label||sub,actor:METHOD[sub]?.actor,occ,recordings:rec,people,status:methodStatus(rec,people),
      first:occ[0].m.date,last:occ[occ.length-1].m.date,tags:[...new Set(occ.flatMap(o=>o.m.tags||[]))]};
  }).sort((a,b)=>b.recordings-a.recordings||b.people-a.people||b.occ.length-a.occ.length);
  // רצפים: מהלך ואחריו מהלך אחר, בתוך שלושה משפטים
  const seq=new Map();
  for(const m of ms){const arr=[...(m.analysis?.methodology||[])].sort((a,b)=>a.evidence.seg-b.evidence.seg);
    for(let i=0;i<arr.length-1;i++){const a=arr[i],b=arr[i+1];if(b.evidence.seg-a.evidence.seg>3||a.subtype===b.subtype)continue;
      const k=a.subtype+'>'+b.subtype;if(!seq.has(k))seq.set(k,{from:a.subtype,to:b.subtype,occ:[]});seq.get(k).occ.push({m,a,b})}}
  const sequences=[...seq.values()].map(x=>({...x,recordings:new Set(x.occ.map(o=>o.m.id)).size,people:new Set(x.occ.map(o=>o.m.person)).size}))
    .map(x=>({...x,status:methodStatus(x.recordings,x.people)})).sort((a,b)=>b.recordings-a.recordings);
  return{patterns:pats,sequences};
}
function methodCoverage(ms){
  const spk=ms.filter(m=>(m.analysis?.speakers||[]).length).length,meth=ms.filter(m=>(m.analysis?.methodology||[]).length).length;
  return{withSpeakers:spk,withMethod:meth,total:ms.length,text:`שכבת המתודולוגיה: ${meth} מתוך ${ms.length} הקלטות עובדו. רק ב־${spk} מהן מסומנים דוברים, ורק בהן אפשר לדעת מי אמר מה. הזיהוי הוא לפי כללים (${METHOD_VERSION}), ולכן כל סיווג הוא הסקה.`};
}
function segFinding(m,i,label,section){
  const sg=m.analysis.segments[i];
  return{label,text:sg.text,kind:'explicit',confidence:null,section,ev:{mid:m.id,itemId:'seg-'+i,seg:i,quote:sg.text,time:sg.time||null,speaker:sg.speaker||null,date:m.date,person:m.person,title:m.title,version:m.analysis.version,kind:'explicit'}};
}
function methodFocus(q){
  q=String(q||'');
  if(/(התנגד|לא מקבל|לא מסכים|כשאדם לא)/.test(q))return'client_resistance';
  if(/(נקודת מפנה|נקודות מפנה|מה קורה לפני|לפני שהאדם הבין|ההבנה)/.test(q))return'client_turning_point';
  if(/(מסגור|ממסגר|מסתכל אחרת|מסגרת)/.test(q))return'reframe';
  if(/(שאלות|שואל)/.test(q))return'question';
  if(/(מנמק|מסביר את העצה|נימוק לצד|עם נימוק)/.test(q))return'rationale';
  if(/(משנה כיוון|לשנות כיוון|מתאים את|התאמה|חריג לנסיבות|לנסיבות)/.test(q))return'adaptation';
  if(/(בדיקה בהמשך|קובע מעקב|קביעת מעקב)/.test(q))return'followup_plan';
  return null;
}

/* ---------- חבילת ראיות וחוזה סינתזה ----------
   שכבה 1 (כאן): בונה חבילת ראיות לכל שאלה, בלי קשר לסוג השאלה.
   שכבה 2 (שרת NAS, בעתיד): מקבלת את אותה חבילה, מוסיפה שליפה סמנטית,
   ומבקשת ממודל שפה לנסח. המודל רשאי לצטט רק מזהים מהחבילה.
   validateSynthesis אוכף את זה לפני שמשהו מוצג. */
const ITEM_KEYS=['problem','observations','advice','reasoning','outcomes','results','followups','contradictions','methodology'];
function evidenceId(m,it){return m.id+'#'+it.id}
function scopeItems(ms){
  const out=[];
  for(const m of ms){const an=m.analysis||{};
    for(const k of ITEM_KEYS){const arr=k==='problem'?(an.problem?[an.problem]:[]):(an[k]||[]);
      for(const it of arr)out.push({id:evidenceId(m,it),type:it.type||k,subtype:it.subtype||null,text:it.text,kind:it.kind,confidence:it.confidence,m,it})}}
  return out;
}
// שליפה כללית: עובדת לכל שאלה, גם כזו שאין לה כוונה מוגדרת
function retrieveEvidence(q,sc,opts={}){
  const ms=meetingsIn(sc),limit=opts.limit||24;
  const pq=prepQuery(String(q||'').replace(INTENT_WORDS,' '));
  const items=scopeItems(ms).map(x=>{
    let score=0;for(const vars of pq.vars)score+=fieldScore(x.text,vars)*2+fieldScore(x.m.title+' '+(x.m.tags||[]).join(' '),vars);
    return{...x,score};
  });
  const hits=items.filter(x=>x.score>0);
  const picked=(hits.length?hits:(pq.tokens.length?[]:items)).sort((a,b)=>b.score-a.score||b.m.date.localeCompare(a.m.date)).slice(0,limit);
  return{question:q,scope:sc,items:picked,considered:items.length,coverage:coverageOf(sc,ms)};
}
// הבקשה שתישלח לשרת. אין בה מפתחות, ורק ראיות מהיקף השאלה.
function buildSynthesisRequest(question,scope,bundle,intentHint){
  return{
    contract:'nitzotza.assistant.v1',question,scope,intent_hint:intentHint||null,
    evidence:bundle.items.map(x=>({id:x.id,recording_id:x.m.id,date:x.m.date,person:x.m.person,case_ids:casesOfRecording(x.m.id).map(c=>c.id),
      type:x.type,subtype:x.subtype,kind:x.kind,confidence:x.confidence??null,text:x.text,quote:x.it.evidence?.quote??null,
      time:x.it.evidence?.time??null,segment:x.it.evidence?.seg??null,extraction_version:x.m.analysis?.version??null})),
    coverage:bundle.coverage,
    rules:{source_of_truth:'evidence_only',cite_every_claim:true,verbatim_quotes_only:true,unknown_when_unsupported:true,no_new_recommendations_unless_asked:true}
  };
}
// אימות תשובה של מודל: כל משפט חייב לצטט מזהה ראיה מהחבילה, וכל ציטוט חייב להופיע מילה במילה במקור
function validateSynthesis(resp,req){
  const byId=new Map(req.evidence.map(e=>[e.id,e]));
  const out={answer:[],quotes:[],unknowns:[...(resp?.unknowns||[])],rejected:[]};
  for(const s of resp?.answer||[]){
    const cites=(s.cites||[]).filter(id=>byId.has(id));
    if(!cites.length){out.rejected.push({text:s.text,reason:'no_valid_citation'});continue}
    out.answer.push({text:s.text,cites});
  }
  for(const q of resp?.quotes||[]){
    const e=byId.get(q.evidence_id);const m=e&&data.meetings.find(x=>x.id===e.recording_id);
    const seg=m?.analysis?.segments?.[e.segment];
    if(!seg||!q.text||!seg.text.includes(q.text)){out.rejected.push({text:q.text,reason:'quote_not_verbatim'});continue}
    out.quotes.push(q);
  }
  if(out.rejected.length)out.unknowns.push(out.rejected.length+' טענות או ציטוטים של המודל לא נתמכו בראיות והוסרו.');
  return out;
}
// נקודת החיבור לשכבה 2. באתר הציבורי אין שרת, ולכן היא כבויה תמיד.
const SYNTHESIS={available:false,endpoint:null,reason:'ניסוח חופשי של תשובה יפעל רק בשרת ה־NAS. כאן מוצגות הראיות עצמן, מסודרות.'};

function askSecondBrain(question,scope){
  const q=String(question||'').trim();
  const intent=detectIntent(q);
  let sc=scopeForQuestion(q,scope||{type:'global'});
  const ans={question:q,intent:intent.k,intentLabel:intent.label,scope:sc,scopeLabel:scopeLabel(sc),answer:[],findings:[],related:[],unknowns:[],coverage:null,engine:{tier:1,name:ENGINE_LABEL,version:ANALYSIS_VERSION},synthesis:{mode:'deterministic',available:SYNTHESIS.available}};
  if(!q){ans.unknowns.push('לא נשאלה שאלה.');return ans}
  const personal=['briefing','previous','changed','open','why'].includes(intent.k);
  if(personal&&sc.type==='global'&&/(לו|לה|אצלו|אצלה|איתו|איתה|ממנו|ממנה|אותו|אותה)(\s|\?|$)/.test(q)){
    ans.answer.push('השאלה מתייחסת לאדם מסוים, אבל לא ברור לאיזה. אפשר לבחור אדם או לכתוב את השם בשאלה.');
    ans.related=allPeople().slice(0,8).map(p=>({label:p.name,meta:p.count+' פגישות',scope:{type:'person',id:p.name}}));
    ans.needsScope=true;return ans;
  }
  const win=parseWindow(q);
  const ms=applyWindow(meetingsIn(sc),win);
  ans.window=win;
  ans.coverage=coverageOf(sc,ms,{method:intent.k==='questions'||intent.k==='principles'});
  if(win)ans.coverage.text='חלון זמן: '+win.label+'. '+ans.coverage.text;
  if(!ms.length){ans.unknowns.push('אין הקלטות בהיקף הזה.');return ans}
  const chrono=[...ms].sort((a,b)=>a.date.localeCompare(b.date));
  const H={
    previous(){
      const m=ms[0],an=m.analysis||{};
      if(!an.advice?.length){ans.unknowns.push(`בפגישה האחרונה (${formatDate(m.date)}) לא זוהתה עצה.`);return}
      ans.answer.push(`בפגישה האחרונה${sc.type==='person'?' עם '+sc.id:''}, ב${formatFull(m.date)} („${m.title}”), ${an.advice.length===1?'זוהתה עצה אחת':'זוהו '+an.advice.length+' עצות או החלטות'}.`);
      for(const a of an.advice){ans.findings.push(finding(m,a,'עצה'));const r=reasonFor(an,a);if(r)ans.findings.push(finding(m,r,'נימוק'))}
      if(ms[1])ans.related.push({label:'הפגישה שלפניה: '+ms[1].title,meta:formatDate(ms[1].date),route:'case/'+ms[1].id});
    },
    why(){
      let n=0;
      for(const m of chrono){const an=m.analysis||{};for(const a of an.advice||[]){const r=reasonFor(an,a);ans.findings.push(finding(m,a,'עצה · '+formatDate(m.date)));
        if(r){ans.findings.push(finding(m,r,'הנימוק'));n++}else ans.unknowns.push(`לא נמצא נימוק מפורש לעצה מ־${formatDate(m.date)}.`)}}
      ans.answer.push(n?`נמצאו ${n} נימוקים לעצות ב${ans.scopeLabel==='כל המאגר'?'מאגר':'היקף „'+ans.scopeLabel+'”'}, מסודרים לפי תאריך.`:'לא נמצא נימוק מפורש לאף עצה בהיקף הזה.');
    },
    open(){
      const names=sc.type==='global'?null:new Set(ms.map(m=>m.person));
      const ids=new Set(ms.map(m=>m.id));
      const fs=data.followups.filter(f=>!f.done&&(!names||names.has(f.person))&&((sc.type!=='recording'&&sc.type!=='case')||ids.has(f.meetingId))).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
      ans.answer.push(fs.length?`${fs.length} מעקבים פתוחים${fs.some(f=>f.due&&f.due<todayISO())?', חלקם באיחור':''}.`:'אין מעקבים פתוחים בהיקף הזה.');
      for(const f of fs){
        const m=f.meetingId&&data.meetings.find(x=>x.id===f.meetingId);
        const src=m&&(m.analysis?.followups||[]).find(it=>it.text===f.title);
        ans.findings.push({label:f.person+' · '+dueLabel(f.due).t,text:f.title,kind:src?'explicit':'manual',confidence:src?src.confidence:null,ev:src?evOf(m,src):null});
        if(!src)ans.findings[ans.findings.length-1].note=m?'המעקב נוצר מתוך „'+m.title+'”, בלי משפט מקור מדויק.':'המעקב נוצר ידנית.';
      }
    },
    changed(){
      if(ms.length<2){ans.unknowns.push('יש רק פגישה אחת בהיקף הזה, ולכן אין למה להשוות.');H.previous();return}
      const [late,prev]=ms,la=late.analysis||{},pa=prev.analysis||{};
      ans.answer.push(`השוואה בין ${formatDate(prev.date)} ל־${formatDate(late.date)}.`);
      for(const a of pa.advice||[])ans.findings.push(finding(prev,a,'העצה בפגישה הקודמת'));
      if(la.results?.length)for(const r of la.results)ans.findings.push(finding(late,r,'מה דווח מאז'));
      else ans.unknowns.push('בפגישה האחרונה לא דווח על תוצאה של העצה הקודמת.');
      if(la.problem)ans.findings.push(finding(late,la.problem,'הבעיה כעת'));
      for(const a of la.advice||[])ans.findings.push(finding(late,a,'העצה האחרונה'));
      for(const c of la.contradictions||[])ans.findings.push(finding(late,c,'חריג שנאמר'));
    },
    briefing(){
      // הכנה לפגישה: אחזור זיכרון מקצועי בלבד, מחולק לפי נושאים. לא מוסיפה עצות.
      const sec=(name,f)=>{f.section=name;ans.findings.push(f)};
      const person=sc.type==='person'?sc.id:(ms[0]?.person||null);
      const p=person?allPeople().find(x=>x.name===person):null;
      ans.answer.push(p?`${p.name}: ${p.count} פגישות, מ־${formatDate(p.first)} עד ${formatDate(p.last)}${p.topic?'. נושא מרכזי: '+p.topic:''}.`:`סיכום לפי ${ans.scopeLabel}.`);
      const cs=sc.type==='case'?[caseById(sc.id)].filter(Boolean):person?casesOfPerson(person):[];
      for(const c of cs)sec('תיקים',{label:(c.status==='closed'?'סגור':'פתוח')+' · '+recordingsOfCase(c).length+' הקלטות',text:c.title,kind:'manual',ev:null,route:'file/'+c.id});
      const m=ms[0],an=m.analysis||{};
      sec('הפגישה האחרונה',{label:formatFull(m.date),text:m.title,kind:'manual',ev:null,route:'case/'+m.id});
      if(an.problem)sec('הפגישה האחרונה',finding(m,an.problem,'הבעיה'));
      for(const x of chrono){const xa=x.analysis||{};for(const o of xa.observations||[])sec('תצפיות',finding(x,o,formatDate(x.date)))}
      for(const x of chrono){const xa=x.analysis||{};for(const a of xa.advice||[]){const k=a.type==='decision'?'החלטות':'עצות ונימוקים';sec(k,finding(x,a,(a.type==='decision'?'החלטה':'עצה')+' · '+formatDate(x.date)));const r=reasonFor(xa,a);if(r)sec(k,finding(x,r,'נימוק'))}}
      for(const x of chrono)for(const r of x.analysis?.results||[])sec('תוצאות ידועות',finding(x,r,formatDate(x.date)));
      const names=new Set(ms.map(y=>y.person));
      for(const ch of adviceChanges().filter(c=>names.has(c.person))){sec('שינויים לאורך זמן',finding(ch.earlier,ch.a1,'קודם · '+formatDate(ch.earlier.date)));sec('שינויים לאורך זמן',finding(ch.later,ch.a2,'אחר כך · '+formatDate(ch.later.date)))}
      for(const x of chrono)for(const c of x.analysis?.contradictions||[])sec('חריגים',finding(x,c,formatDate(x.date)));
      const ids=new Set(ms.map(y=>y.id));
      const fs=data.followups.filter(f=>!f.done&&(sc.type==='case'?ids.has(f.meetingId):names.has(f.person)));
      for(const f of fs){const fm=f.meetingId&&data.meetings.find(x=>x.id===f.meetingId);const src=fm&&(fm.analysis?.followups||[]).find(it=>it.text===f.title);
        sec('פתוח ומשימות',src?finding(fm,src,dueLabel(f.due).t):{label:dueLabel(f.due).t,text:f.title,kind:'manual',confidence:null,ev:null})}
      const related=new Set(cs.flatMap(c=>c.people||[]));if(person)related.delete(person);
      for(const r of related)sec('אנשים קשורים',{label:'שותף לתיק',text:r,kind:'manual',ev:null,route:'person/'+encodeURIComponent(r)});
      const lastAdvice=chrono.flatMap(x=>(x.analysis?.advice||[]).map(a=>({x,a}))).pop();
      const reportedAfter=lastAdvice&&chrono.some(x=>x.date>lastAdvice.x.date&&(x.analysis?.results||[]).length);
      if(lastAdvice&&!reportedAfter)ans.unknowns.push(`עוד לא תועדה תוצאה לעצה האחרונה (${formatDate(lastAdvice.x.date)}).`);
      if(fs.length)ans.answer.push('שאלות להמשך, לפי מה שנשאר פתוח: '+fs.map(f=>f.title).join(' · '));
      ans.answer.push('ההכנה מציגה רק מה שתועד. היא לא מציעה עצות חדשות.');
    },
    timeline(){
      // ציר זמן מלא: כל פגישה היא קבוצה, ובתוכה מה נאמר בה, לפי הסדר
      const first=chrono[0],last=chrono[chrono.length-1];
      ans.answer.push(chrono.length===1?`פגישה אחת בהיקף, ב־${formatDate(first.date)}.`:`${chrono.length} פגישות, מ־${formatDate(first.date)} עד ${formatDate(last.date)}.`);
      let nA=0,nR=0;
      for(const m of chrono){const an=m.analysis||{},sec=formatDate(m.date)+' · '+m.title+(sc.type==='global'?' · '+m.person:'');
        ans.findings.push({section:sec,label:'הקלטה',text:m.title,kind:'manual',ev:null,route:'case/'+m.id});
        if(an.problem)ans.findings.push({...finding(m,an.problem,'בעיה'),section:sec});
        for(const a of an.advice||[]){nA++;ans.findings.push({...finding(m,a,a.type==='decision'?'החלטה':'עצה'),section:sec});const r=reasonFor(an,a);if(r)ans.findings.push({...finding(m,r,'נימוק'),section:sec})}
        for(const r of an.results||[]){nR++;ans.findings.push({...finding(m,r,'מה דווח'),section:sec})}
        for(const c of an.contradictions||[])ans.findings.push({...finding(m,c,'חריג'),section:sec});
        for(const f of data.followups.filter(x=>x.meetingId===m.id))ans.findings.push({section:sec,label:'מעקב · '+(f.done?'הושלם':dueLabel(f.due).t),text:f.title,kind:'manual',ev:null});
      }
      const names=new Set(chrono.map(m=>m.person)),ids=new Set(chrono.map(m=>m.id));
      const ch=adviceChanges().filter(x=>names.has(x.person)&&ids.has(x.later.id)&&ids.has(x.earlier.id)).length;
      ans.answer.push(`לאורך התקופה: ${cnt(nA,'עצה או החלטה אחת','עצות או החלטות')}, ${cnt(nR,'דיווח אחד','דיווחים')} על מה שקרה בפועל${ch?`, והעצה השתנתה ${ch===1?'פעם אחת':ch+' פעמים'}`:''}.`);
    },
    recurring(){
      const rc=recurringConcepts(ms);
      if(!rc.length){ans.answer.push('לא נמצא נושא שחוזר ביותר מהקלטה אחת בהיקף הזה.');return}
      ans.answer.push(`${cnt(rc.length,'נושא אחד חוזר','נושאים חוזרים')} ביותר מהקלטה אחת. „חוזר” כאן פירושו שהמילה או מילה נרדפת לה הופיעה בכמה הקלטות. זו התאמה לשונית, לא הכרעה.`);
      for(const c of rc.slice(0,6)){
        const sec=(c.tag?'תגית: ':'')+c.label;
        ans.findings.push({section:sec,label:`${c.meetings} הקלטות · ${cnt(c.people,'אדם אחד','אנשים')}`,text:c.people>1?'חוזר אצל כמה אנשים':'חוזר אצל אותו אדם',kind:'pattern',ev:null});
        const seen=new Set();for(const o of c.occ.sort((a,b)=>a.m.date.localeCompare(b.m.date))){
          const k=o.m.id+(o.it?o.it.id:'');if(seen.has(k))continue;seen.add(k);
          // לתגית אין משפט מקור, ולכן הראיה היא ההקלטה שמסומנת בה
          ans.findings.push(o.it?{...finding(o.m,o.it,o.m.person+' · '+formatDate(o.m.date)),section:sec}:{section:sec,label:o.m.person+' · '+formatDate(o.m.date)+' · מסומנת בתגית',text:o.m.title,kind:'manual',ev:null,route:'case/'+o.m.id})}
      }
      // עצות שחזרו: עצות מהקלטות שונות שחולקות לפחות שני מושגים
      const adv=chrono.flatMap(m=>(m.analysis?.advice||[]).map(a=>({m,a,k:new Set(conceptKeys(a.text).keys())})));
      for(let i=0;i<adv.length;i++)for(let j=i+1;j<adv.length;j++){if(adv[i].m.id===adv[j].m.id)continue;
        const shared=[...adv[i].k].filter(x=>adv[j].k.has(x));
        if(shared.length>=2){const sec='עצה שחזרה';ans.findings.push({...finding(adv[i].m,adv[i].a,adv[i].m.person+' · '+formatDate(adv[i].m.date)),section:sec});ans.findings.push({...finding(adv[j].m,adv[j].a,adv[j].m.person+' · '+formatDate(adv[j].m.date)),section:sec})}}
    },
    outcomes(){
      const list=adviceOutcomes(ms);
      if(!list.length){ans.answer.push('לא נמצאו עצות בהיקף הזה.');return}
      const rep=list.filter(x=>x.status==='reported').length;
      ans.answer.push(`${cnt(list.length,'עצה אחת','עצות')}. ${rep===1?'לאחת מהן':'ל־'+rep+' מהן'} תועד בהמשך מה קרה. הקישור בין עצה לתוצאה נעשה לפי סדר הפגישות של אותו אדם, ולכן הוא הסקה.`);
      for(const x of list){const sec='עצה · '+x.m.person+' · '+formatDate(x.m.date);
        ans.findings.push({...finding(x.m,x.a,'העצה'),section:sec});
        for(const r of x.results)ans.findings.push({...finding(r.m,r.it,'דווח ב־'+formatDate(r.m.date)),section:sec,note:'מקושר לעצה לפי סדר הזמן.'});
        if(x.status==='not_reported')ans.unknowns.push(`לעצה מ־${formatDate(x.m.date)} (${x.m.person}) היו פגישות המשך, אבל לא תועד בהן מה קרה.`);
        if(x.status==='no_later_meeting')ans.unknowns.push(`לעצה מ־${formatDate(x.m.date)} (${x.m.person}) עוד אין פגישת המשך.`);
      }
    },
    unresolved(){
      const ids=new Set(ms.map(m=>m.id)),names=new Set(ms.map(m=>m.person));
      const fs=data.followups.filter(f=>sc.type==='recording'||sc.type==='case'?ids.has(f.meetingId):sc.type==='global'||names.has(f.person));
      const open=fs.filter(f=>!f.done),done=fs.filter(f=>f.done);
      const noOutcome=adviceOutcomes(ms).filter(x=>x.status!=='reported');
      ans.answer.push(`${open.length} מעקבים פתוחים${open.some(f=>f.due&&f.due<todayISO())?' (חלקם באיחור)':''}, ${done.length} נסגרו, ו־${noOutcome.length} עצות שעוד לא תועד מה קרה איתן.`);
      for(const f of open){const fm=data.meetings.find(x=>x.id===f.meetingId);const src=fm&&(fm.analysis?.followups||[]).find(it=>it.text===f.title);ans.findings.push(src?{...finding(fm,src,f.person+' · '+dueLabel(f.due).t),section:'פתוח'}:{section:'פתוח',label:f.person+' · '+dueLabel(f.due).t,text:f.title,kind:'manual',ev:null})}
      for(const f of done)ans.findings.push({section:'נסגר',label:f.person,text:f.title,kind:'manual',ev:null});
      for(const x of noOutcome)ans.findings.push({...finding(x.m,x.a,x.m.person+' · '+formatDate(x.m.date)),section:'עצות בלי תוצאה מתועדת'});
    },
    firstSeen(){
      const topic=q.replace(/[?!.,״"׳']/g,' ').split(/\s+/).filter(w=>w.length>1&&!/^(מתי|התחיל|התחילה|התחילו|הופיע|הופיעה|הופיעו|לראשונה|מאיזה|שלב|הבעיה|הנושא|הזאת|הזה|הזו|של|אצל|אצלו|אצלה|עם)$/.test(w)).join(' ').trim();
      const keys=[...conceptKeys(topic).keys()];
      if(!keys.length){ans.unknowns.push('לא זיהיתי על איזה נושא השאלה. אפשר לכתוב את הנושא במפורש, למשל „מתי התחילו הוויכוחים?”.');return}
      const occ=[];
      for(const m of chrono){const an=m.analysis||{};for(const k of ITEM_KEYS){const arr=k==='problem'?(an.problem?[an.problem]:[]):(an[k]||[]);
        for(const it of arr){const ck=conceptKeys(it.text);if(keys.some(x=>ck.has(x)))occ.push({m,it})}}}
      if(!occ.length){ans.answer.push(`לא נמצאה הופעה של „${topic}” בהיקף הזה.`);return}
      const f=occ[0];
      ans.answer.push(`„${topic}” הופיע לראשונה ב־${formatFull(f.m.date)}, בהקלטה „${f.m.title}”${sc.type==='global'?' ('+f.m.person+')':''}. בסך הכול ${occ.length} הופעות ב־${new Set(occ.map(o=>o.m.id)).size} הקלטות.`);
      ans.unknowns.push('„לראשונה” מתייחס רק להקלטות שבמאגר. ייתכן שהנושא עלה עוד קודם, בשיחות שלא הוקלטו או לא יובאו.');
      for(const o of occ)ans.findings.push({...finding(o.m,o.it,formatDate(o.m.date)+' · '+o.m.person),section:'הופעות לפי סדר הזמן'});
    },
    adviceDossier(){
      // היקף של עצה אחת: העצה, הנימוק, הראיה, מה קרה אחריה, ואיך העצה התפתחה אצל אותו אדם
      const r=adviceRef(sc.id);if(!r){ans.unknowns.push('העצה לא נמצאה.');return}
      const {m,a}=r,an=m.analysis||{},why=reasonFor(an,a);
      ans.answer.push(`העצה ניתנה ל${m.person} ב${formatFull(m.date)}, בהקלטה „${m.title}”.`);
      ans.findings.push({...finding(m,a,'העצה'),section:'העצה'});
      if(why)ans.findings.push({...finding(m,why,'הנימוק'),section:'העצה'});else ans.unknowns.push('לא נמצא נימוק מפורש לעצה הזו.');
      for(const o of an.outcomes||[])ans.findings.push({...finding(m,o,'התוצאה המצופה'),section:'העצה'});
      const later=meetingsOf(m.person).filter(x=>x.date>m.date).sort((x,y)=>x.date.localeCompare(y.date));
      for(const x of later){for(const res of x.analysis?.results||[])ans.findings.push({...finding(x,res,'דווח ב־'+formatDate(x.date)),section:'מה קרה אחר כך'});
        for(const b of x.analysis?.advice||[])ans.findings.push({...finding(x,b,'עצה מאוחרת · '+formatDate(x.date)),section:'איך העצה התפתחה'})}
      if(!later.length)ans.unknowns.push('אין עדיין פגישה מאוחרת יותר עם '+m.person+', ולכן לא ידוע מה קרה אחרי העצה.');
      for(const c of casesOfRecording(m.id))ans.related.push({label:'תיק: '+c.title,meta:'',route:'file/'+c.id});
      ans.related.push({label:'ההקלטה',meta:formatDate(m.date),route:'case/'+m.id});
    },
    advice(){
      for(const m of chrono){const an=m.analysis||{};for(const a of an.advice||[]){ans.findings.push(finding(m,a,m.person+' · '+formatDate(m.date)));const r=reasonFor(an,a);if(r)ans.findings.push(finding(m,r,'נימוק'))}}
      const n=ans.findings.filter(f=>f.label!=='נימוק').length;
      ans.answer.push(n?`נמצאו ${n} עצות או החלטות, מהישנה לחדשה.`:'לא נמצאו עצות בהיקף הזה.');
    },
    changedMind(){
      const names=new Set(ms.map(m=>m.person));
      const ch=adviceChanges().filter(x=>names.has(x.person)&&(sc.type!=='recording'||x.later.id===sc.id||x.earlier.id===sc.id));
      for(const x of ch){ans.findings.push(finding(x.earlier,x.a1,x.person+' · קודם · '+formatDate(x.earlier.date)));ans.findings.push(finding(x.later,x.a2,x.person+' · אחר כך · '+formatDate(x.later.date)));
        const why=reasonFor(x.later.analysis||{},x.a2);
        if(why)ans.findings.push(finding(x.later,why,'הנימוק שנאמר בפגישה המאוחרת'));else ans.unknowns.push(`לא נאמר נימוק מפורש לשינוי אצל ${x.person} ב־${formatDate(x.later.date)}.`);
        const res=(x.later.analysis?.results||[]);for(const r of res)ans.findings.push(finding(x.later,r,'מה דווח לפני השינוי'))}
      for(const m of chrono)for(const c of m.analysis?.contradictions||[])ans.findings.push(finding(m,c,'חריג · '+m.person));
      ans.answer.push(ch.length?`נמצאו ${ch.length} רצפים שבהם העצה לאותו אדם השתנתה. הם מוצגים לפי סדר הזמן.`:'לא נמצאה עצה שהשתנתה בהיקף הזה.');
      ans.answer.push('המערכת לא מכריעה אם שינוי הוא סתירה, חידוד או התאמה לנסיבות.');
    },
    exceptions(){
      for(const m of chrono)for(const c of m.analysis?.contradictions||[])ans.findings.push(finding(m,c,m.person+' · '+formatDate(m.date)));
      ans.answer.push(ans.findings.length?`נמצאו ${ans.findings.length} חריגים שנאמרו במפורש.`:'לא נמצאו חריגים בהיקף הזה.');
    },
    principles(){
      const rows=data.principles.map(p=>{const cs=linkedCases(p).filter(m=>ms.includes(m));return{p,cs,people:new Set(cs.map(m=>m.person)).size}}).filter(x=>x.cs.length).sort((a,b)=>b.cs.length-a.cs.length);
      for(const x of rows){
        const status=x.people>=2?'חוזר אצל כמה אנשים':'מועמד · הופיע אצל אדם אחד בלבד';
        ans.findings.push({label:`${x.cs.length} הקלטות · ${x.people} אנשים · ${status}`,text:x.p.title,kind:'pattern',confidence:null,ev:null,route:'principle/'+x.p.id});
        const m=x.cs[0],a=m.analysis?.advice?.[0];if(a)ans.findings.push(finding(m,a,'דוגמה · '+m.person));
      }
      ans.answer.push(rows.length?`${rows.length} עקרונות מועמדים מקושרים להקלטות בהיקף. הקישור הוא לפי חפיפת מילים, ולכן הוא השערה.`:'לא נמצא עיקרון שמקושר להקלטות בהיקף הזה.');
    },
    method(){
      const cov=methodCoverage(ms);ans.coverage.methodology=cov.withMethod;ans.coverage.text+=' '+cov.text;
      const {patterns,sequences}=methodPatterns(ms);
      const focus=intent.k==='questions'?'question':methodFocus(q);
      const rule='מהלך שהופיע בהקלטה אחת הוא תצפית מועמדת. „חוזר” פירושו לפחות 2 הקלטות של 2 אנשים שונים. „מבוסס” דורש לפחות 5 הקלטות של 3 אנשים.';
      if(!patterns.length){ans.answer.push('לא זוהו מהלכי ייעוץ בהיקף הזה.');if(cov.withSpeakers<cov.total)ans.unknowns.push(cov.withSpeakers?`${cov.total-cov.withSpeakers} הקלטות בהיקף בלי דוברים מסומנים לא נבדקו.`:'בהיקף הזה אין דוברים מסומנים, ולכן אי אפשר לדעת מי אמר מה.');ans.unknowns.push(rule);return}
      const example=(o,label,sec)=>ans.findings.push({...finding(o.m,o.it,label),section:sec});
      const byPersonWording=/(ניסוח|מנסח|לפי סוג האדם|לפי האדם)/.test(q);
      if(focus){
        const p=patterns.find(x=>x.subtype===focus);
        if(!p){ans.answer.push(`לא זוהה „${METHOD[focus].label}” בהיקף הזה.`);ans.unknowns.push(rule);return}
        ans.answer.push(`${p.label}: ${cnt(p.occ.length,'הופעה אחת','הופעות')} ב־${cnt(p.recordings,'הקלטה אחת','הקלטות')} של ${cnt(p.people,'אדם אחד','אנשים')}. סטטוס: ${p.status}. נצפה מ־${formatDate(p.first)} עד ${formatDate(p.last)}${p.tags.length?'. הקשרים: '+p.tags.join(', '):''}.`);
        for(const o of p.occ){
          const sec=o.m.person+' · '+formatDate(o.m.date);
          example(o,p.label,sec);
          if(o.it.before){const b=(o.m.analysis.methodology||[]).find(x=>x.evidence.seg===o.it.before.seg);ans.findings.push(segFinding(o.m,o.it.before.seg,'מה אמר היועץ רגע לפני'+(b?' ('+METHOD[b.subtype].label+')':''),sec))}
          if(o.it.response){const r=(o.m.analysis.methodology||[]).find(x=>x.evidence.seg===o.it.response.seg);ans.findings.push(segFinding(o.m,o.it.response.seg,(p.actor==='client'?'מה עשה היועץ מיד אחרי':'תגובת הפונה')+(r?' ('+METHOD[r.subtype].label+')':''),sec))}
          for(const c of o.m.analysis?.contradictions||[])if(c.evidence.seg!==o.it.evidence.seg)ans.findings.push({...finding(o.m,c,'חריג באותה הקלטה'),section:sec});
        }
        if(p.actor==='client'){
          const key=focus==='client_resistance'?'response':'before';
          const moves=p.occ.map(o=>o.it[key]&&(o.m.analysis.methodology||[]).find(x=>x.evidence.seg===o.it[key].seg)).filter(Boolean);
          const cnts=new Map();for(const mv of moves)cnts.set(mv.subtype,(cnts.get(mv.subtype)||0)+1);
          if(cnts.size)ans.answer.push((focus==='client_resistance'?'מה היועץ עשה אחרי ההתנגדות: ':'מה קדם לנקודת המפנה: ')+[...cnts.entries()].map(([k,n])=>METHOD[k].label+' ('+n+')').join(', ')+'.');
        }
        const outs=adviceOutcomes(ms).filter(x=>p.occ.some(o=>o.m.id===x.m.id)&&x.status==='reported');
        for(const x of outs)for(const r of x.results)ans.findings.push({...finding(r.m,r.it,'דווח בפגישה מאוחרת'),section:'תוצאות שדווחו אחרי הקלטות עם המהלך'});
        if(p.status==='תצפית מועמדת')ans.unknowns.push('המהלך הופיע בהקלטה אחת בלבד, ולכן אי אפשר לקבוע שזו שיטה.');
      }else{
        ans.answer.push(`זוהו ${cnt(patterns.length,'סוג מהלך אחד','סוגי מהלכים')}. כל סוג מוצג עם מספר ההקלטות והאנשים, ודוגמאות מהתמלול.`);
        for(const p of patterns){
          const sec=p.label;
          ans.findings.push({section:sec,label:`${p.recordings} הקלטות · ${cnt(p.people,'אדם אחד','אנשים')} · ${p.status} · ${formatDate(p.first)}–${formatDate(p.last)}`,text:p.actor==='client'?'אירוע אצל הפונה':'מהלך של היועץ',kind:'pattern',ev:null});
          const shown=byPersonWording?[...new Map(p.occ.map(o=>[o.m.person,o])).values()]:p.occ.slice(0,2);
          for(const o of shown)example(o,o.m.person+' · '+formatDate(o.m.date),sec);
        }
        const rs=sequences.filter(x=>x.recordings>=2);
        for(const x of rs){const sec='רצף: '+METHOD[x.from].label+' ← '+METHOD[x.to].label;
          ans.findings.push({section:sec,label:`${x.recordings} הקלטות · ${cnt(x.people,'אדם אחד','אנשים')} · ${x.status}`,text:'אחרי „'+METHOD[x.from].label+'” בא „'+METHOD[x.to].label+'”',kind:'pattern',ev:null});
          for(const o of x.occ.slice(0,2)){ans.findings.push({...finding(o.m,o.a,o.m.person+' · '+formatDate(o.m.date)),section:sec});ans.findings.push({...finding(o.m,o.b,'ואחריו'),section:sec})}}
        if(rs.length)ans.answer.push(`${cnt(rs.length,'רצף אחד חוזר','רצפים חוזרים')} של שני מהלכים.`);
      }
      ans.unknowns.push(rule);
      if(cov.withSpeakers<cov.total)ans.unknowns.push(`${cov.total-cov.withSpeakers} הקלטות בהיקף בלי דוברים מסומנים לא נבדקו בשכבה הזו.`);
    },
    questions(){H.method()},
    _oldQuestions(){
      let n=0;const recs=new Set();
      for(const m of chrono){const segs=m.analysis?.segments||[];segs.forEach((s,i)=>{if(s.speaker&&s.speaker!==m.person&&/\?\s*$/.test(s.text)){n++;recs.add(m.id);ans.findings.push({label:m.person+' · '+formatDate(m.date)+(s.time?' · '+s.time:''),text:s.text,kind:'explicit',confidence:null,ev:{mid:m.id,seg:i,quote:s.text,time:s.time,speaker:s.speaker,date:m.date,person:m.person,title:m.title,version:m.analysis?.version,kind:'explicit'}})}})}
      const withSpk=chrono.filter(m=>(m.analysis?.speakers||[]).length).length;
      ans.answer.push(n?`נמצאו ${n} שאלות של היועץ ב־${recs.size} הקלטות.`:'לא נמצאו שאלות של היועץ.');
      ans.unknowns.push(`רק ב־${withSpk} מתוך ${chrono.length} הקלטות מסומנים דוברים, ולכן רק בהן אפשר לזהות מי שאל.`);
      if(recs.size<2)ans.unknowns.push('תבנית מתודולוגית נקבעת רק כשהיא חוזרת בכמה הקלטות. כאן אלה תצפיות מועמדות בלבד.');
    },
    similar(){
      const topic=q.replace(INTENT_WORDS,' ').replace(/[?.,]/g,' ').trim();
      if(sc.type!=='global'){
        const tags=new Set(ms.flatMap(m=>m.tags||[]));const own=new Set(ms.map(m=>m.id));
        const cand=data.meetings.filter(m=>!own.has(m.id)&&m.person!==(sc.type==='person'?sc.id:ms[0].person)).map(m=>({m,shared:(m.tags||[]).filter(t=>tags.has(t))})).filter(x=>x.shared.length).sort((a,b)=>b.shared.length-a.shared.length);
        for(const x of cand){const a=x.m.analysis?.advice?.[0];ans.findings.push(a?finding(x.m,a,x.m.person+' · נושא משותף: '+x.shared.join(', ')):{label:x.m.person,text:x.m.title,kind:'pattern',ev:null,route:'case/'+x.m.id})}
        ans.answer.push(cand.length?`נמצאו ${cand.length} הקלטות של אנשים אחרים עם נושא משותף.`:'לא נמצאו מקרים עם נושא משותף אצל אנשים אחרים.');
        return;
      }
      const res=searchAll(topic||q);
      for(const it of res.groups.meeting){const m=data.meetings.find(x=>x.id===it.id);const a=m?.analysis?.advice?.[0];ans.findings.push(a?finding(m,a,m.person+' · '+formatDate(m.date)):{label:it.meta,text:it.title,kind:'pattern',ev:null,route:it.route})}
      ans.answer.push(res.groups.meeting.length?`נמצאו ${res.groups.meeting.length} הקלטות שמתאימות ל„${topic||q}”, כולל צורות ומילים נרדפות.`:`לא נמצאו מקרים עבור „${topic||q}”.`);
    },
    problems(){
      for(const m of chrono){const an=m.analysis||{};if(an.problem)ans.findings.push(finding(m,an.problem,m.person+' · '+formatDate(m.date)));for(const o of an.observations||[])ans.findings.push(finding(m,o,'תצפית · '+formatDate(m.date)))}
      const tags=new Map();for(const m of ms)for(const t of m.tags||[])tags.set(t,(tags.get(t)||0)+1);
      const rec=[...tags.entries()].filter(([,n])=>n>1);
      ans.answer.push(rec.length?'נושאים שחוזרים ביותר מהקלטה אחת: '+rec.map(([t,n])=>t+' ('+n+')').join(', ')+'.':'אין נושא שחוזר ביותר מהקלטה אחת בהיקף הזה.');
      if(!ans.findings.length)ans.unknowns.push('לא זוהה ניסוח מפורש של בעיה.');
    },
    search(){
      // שאלה חופשית: לא מוגבלת לכוונות. שולפים את הראיות הרלוונטיות ביותר בהיקף, מכל הסוגים.
      const b=retrieveEvidence(q,sc);
      const TYPE={problem:'בעיה',observation:'תצפית',advice:'עצה',decision:'החלטה',reasoning:'נימוק',outcome:'תוצאה מצופה',result:'מה קרה',followup:'מעקב',contradiction:'חריג',methodology:'מהלך ייעוץ'};
      for(const x of [...b.items].sort((p,r)=>p.m.date.localeCompare(r.m.date)))ans.findings.push(finding(x.m,x.it,(TYPE[x.type]||x.type)+' · '+x.m.person+' · '+formatDate(x.m.date)));
      ans.answer.push(b.items.length?`לא זיהיתי סוג שאלה מוגדר, ולכן אלה ${b.items.length} הקטעים הרלוונטיים ביותר בהיקף, לפי סדר הזמן.`:'לא נמצאה ראיה שעונה על השאלה.');
      if(b.items.length&&!SYNTHESIS.available)ans.unknowns.push(SYNTHESIS.reason);
    }
  };
  if(sc.type==='advice'&&!['similar','changedMind'].includes(intent.k)){ans.intentLabel='תיק עצה: העצה, הנימוק ומה קרה אחריה';H.adviceDossier()}
  else (H[intent.k]||H.search)();
  // מזהי הראיות נשמרים בתשובה, כדי ששכבה 2 תוכל לנסח מהן בלי לשלוף מחדש
  ans.evidenceIds=[...new Set(ans.findings.filter(f=>f.ev).map(f=>f.ev.mid+'#'+f.ev.itemId))];
  if(sc.type==='person')ans.related.push({label:'פרופיל '+sc.id,meta:'',route:'person/'+encodeURIComponent(sc.id)});
  if(sc.type==='case')ans.related.push({label:'עמוד התיק',meta:'',route:'file/'+sc.id});
  if(sc.type!=='global')ans.related.push({label:'להרחיב לכל המאגר',meta:'',scope:{type:'global'}});
  if(!ans.findings.length&&!ans.unknowns.length&&!ans.answer.length)ans.unknowns.push('לא נמצאה ראיה.');
  return verifyEvidence(ans);
}
const ASK_SUGGEST={
  person:['מה אמרתי לו בפעם הקודמת?','מה עדיין פתוח?','אילו עצות כבר נתתי?','מה השתנה?','למה המלצתי את זה?','תכין אותי לפגישה הבאה','איך זה התפתח לאורך הזמן?','מה חוזר אצלו?','האם העצות שלי עבדו?','מה נסגר ומה עדיין פתוח?'],
  recording:['אילו מהלכי ייעוץ התרחשו כאן?','מה היו הבעיות?','מה המלצתי?','למה המלצתי את זה?','מה דורש מעקב?','אילו חריגים נאמרו?','מצא מקרים דומים'],
  case:['איך המקרה התפתח?','מה כבר ניסינו?','האם העצות עבדו?','מה נסגר ומה עדיין פתוח?','תכין אותי לפגישה הבאה','איפה שיניתי את דעתי?'],
  advice:['למה המלצתי את זה?','מה קרה אחרי העצה הזו?','איך העצה התפתחה?','איפה שיניתי את דעתי?','מצא מקרים דומים'],
  method:['איך אני בדרך כלל מגיב להתנגדות?','מה קורה לפני נקודת מפנה?','אילו שאלות אני נוהג לשאול?','איך אני עושה מסגור מחדש?','איך הניסוח שלי משתנה לפי האדם?','באילו מקרים אני משנה כיוון באמצע השיחה?'],
  global:['איך אני בדרך כלל מגיב להתנגדות?','מה חוזר הכי הרבה בייעוצים?','מה השתנה בחודש האחרון?','האם העצות שלי עבדו?','מצא מקרים דומים לריבים בזוגיות','אילו עקרונות חוזרים אצלי?','אילו חריגים קיימים?','איפה שיניתי את דעתי?','אילו שאלות אני נוהג לשאול?','מה עדיין פתוח?']
};
/* ---------- ממשק העוזר ---------- */
let askScope={type:'global'};
function openAsk(question,scope){
  const d=el('ask-dialog');if(!d)return;
  askScope=scope||scopeFromRoute();
  el('ask-input').value=question||'';
  if(!d.open)d.showModal();
  if(question)runAsk();else renderAskIdle();
  setTimeout(()=>el('ask-input').focus(),30);
}
function scopeChip(){
  return`<div class="ask-scope"><span>היקף:</span><strong>${esc(scopeLabel(askScope))}</strong>${askScope.type!=='global'?`<button type="button" class="link-btn" data-ask-scope="global">להרחיב לכל המאגר</button>`:''}</div>`;
}
function renderAskIdle(){
  const kind=ASK_SUGGEST[askScope.type]?askScope.type:'global';
  el('ask-body').innerHTML=scopeChip()+`<h3 class="pal-h">שאלות לדוגמה</h3><div class="example-row">${ASK_SUGGEST[kind].map(s=>`<button class="example" type="button" data-ask-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <p class="pal-tip">התשובות נבנות רק ממה שתועד בהקלטות, עם הפניה למשפט המקור. מה שלא נמצא מסומן כלא ידוע.</p>`;
  bindAsk();
}
function runAsk(){
  const q=el('ask-input').value.trim();if(!q)return renderAskIdle();
  const ans=askSecondBrain(q,askScope);
  askScope=ans.scope;
  const kindTagA=k=>k==='explicit'?'<span class="tag tag-exp">נאמר במפורש</span>':k==='inferred'?'<span class="tag tag-inf">הסקה של המערכת</span>':k==='pattern'?'<span class="tag tag-pat">תבנית</span>':'<span class="tag tag-inf">רשומה ידנית</span>';
  const f=ans.findings.map(x=>`<li class="ask-f">
      <div class="ask-f-label">${esc(x.label||'')}</div>
      <p class="ask-f-text">${esc(x.text)}</p>
      ${x.ev&&x.ev.quote&&x.ev.quote!==x.text?`<p class="why-q">״${esc(x.ev.quote)}״</p>`:''}
      <div class="kitem-foot">${kindTagA(x.kind)}${x.confidence?confHtml(x.confidence):''}
        ${x.ev?`<span class="ask-src">${esc(x.ev.person)} · ${formatDate(x.ev.date)}${x.ev.time?` · <span class="mono" dir="ltr">${esc(x.ev.time)}</span>`:''} · משפט ${x.ev.seg+1} · גרסה ${esc(x.ev.version)}</span><button class="link-btn" type="button" data-ask-src="${esc(x.ev.mid)}" data-ask-seg="${x.ev.seg}">${ic('quote')}ציון מקור</button>`:''}
        ${x.route?`<a class="link-btn" href="#/${x.route}" data-ask-close>פתיחה ${ic('fwd')}</a>`:''}
      </div>${x.note?`<p class="ask-note">${esc(x.note)}</p>`:''}
    </li>`).join('');
  // ממצאים עם section מוצגים בקבוצות (הכנה לפגישה, תיק עצה); השאר ברשימה אחת
  let findingsHtml='';
  if(ans.findings.some(x=>x.section)){const order=[];const g=new Map();ans.findings.forEach((x,i)=>{const k=x.section||'עוד';if(!g.has(k)){g.set(k,[]);order.push(k)}g.get(k).push(i)});
    const items=f.split('</li>').filter(x=>x.trim()).map(x=>x+'</li>');
    findingsHtml=order.map(k=>`<h3 class="pal-h">${esc(k)}</h3><ol class="ask-findings">${g.get(k).map(i=>items[i]).join('')}</ol>`).join('');}
  else if(ans.findings.length)findingsHtml=`<h3 class="pal-h">ממצאים וראיות</h3><ol class="ask-findings">${f}</ol>`;
  el('ask-body').innerHTML=`${scopeChip()}
    <p class="ask-intent">הבנתי: ${esc(ans.intentLabel)}</p>
    <div class="ask-answer">${ans.answer.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
    ${findingsHtml}
    ${ans.unknowns.length?`<h3 class="pal-h">לא ידוע</h3><ul class="ask-unknowns">${ans.unknowns.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>`:''}
    ${ans.related.length?`<h3 class="pal-h">${ans.needsScope?'לבחור אדם':'קשור'}</h3><div class="example-row">${ans.related.map(r=>r.scope?`<button class="example" type="button" data-ask-scope="${esc(r.scope.type)}" data-ask-scope-id="${esc(r.scope.id||'')}">${esc(r.label)}</button>`:`<a class="example" href="#/${r.route}" data-ask-close>${esc(r.label)}${r.meta?' · '+esc(r.meta):''}</a>`).join('')}</div>`:''}
    ${ans.coverage?`<p class="ask-coverage">${esc(ans.coverage.text)}</p>`:''}`;
  bindAsk();
}
function bindAsk(){
  const box=el('ask-body');
  box.querySelectorAll('[data-ask-q]').forEach(b=>b.onclick=()=>{el('ask-input').value=b.dataset.askQ;runAsk()});
  box.querySelectorAll('[data-ask-scope]').forEach(b=>b.onclick=()=>{askScope=b.dataset.askScope==='global'?{type:'global'}:{type:b.dataset.askScope,id:b.dataset.askScopeId};el('ask-input').value.trim()?runAsk():renderAskIdle()});
  box.querySelectorAll('[data-ask-src]').forEach(b=>b.onclick=()=>{el('ask-dialog').close();openSource(b.dataset.askSrc,+b.dataset.askSeg)});
  box.querySelectorAll('[data-ask-close]').forEach(a=>a.addEventListener('click',()=>el('ask-dialog').close()));
}
function bindAskDialog(){
  const d=el('ask-dialog');if(!d||d.__bound)return;d.__bound=true;
  d.addEventListener('click',e=>{if(e.target===d)d.close()});
  el('ask-form').addEventListener('submit',e=>{e.preventDefault();runAsk()});
  el('ask-btn').onclick=()=>openAsk('',scopeFromRoute());
}
function askCard(scope){
  const kind=ASK_SUGGEST[scope.type]?scope.type:'recording';
  return`<section class="ctx-card ask-card"><h2>שאל את המוח השני</h2>
    <div class="ask-card-list">${ASK_SUGGEST[kind].slice(0,4).map(s=>`<button type="button" class="ask-card-q" data-ask-open="${esc(s)}" data-scope-type="${scope.type}" data-scope-id="${esc(scope.id)}">${ic('spark')}<span>${esc(s)}</span></button>`).join('')}</div>
  </section>`;
}

/* ---------- מסכים ---------- */
// הצעות חיפוש: בנתוני הדוגמה קבועות. במצב שרת נבנות מהאנשים בהקלטות האחרונות.
function exampleQueries(ask){
  if(SOURCE.mode!=='server')return[
    ask?{q:'דניאל עצה',label:'מה ייעצתי לדניאל ולמה?'}:{q:'דניאל',label:'דניאל'},
    {q:'מריבות בזוגיות',label:'מריבות בזוגיות'},
    {q:'גבולות מול ההורים',label:'גבולות מול ההורים'},
    {q:'פחד לעזוב עבודה',label:'פחד לעזוב עבודה'}
  ];
  const ppl=[...new Set(data.meetings.slice().sort(byDateDesc).map(m=>m.person))].slice(0,4);
  return ppl.map((p,i)=>ask&&i===0?{q:p+' עצה',label:'מה ייעצתי ל'+p+' ולמה?'}:{q:p,label:p});
}
function homeView(){
  const open=data.followups.filter(f=>!f.done).sort((a,b)=>(a.due||'9').localeCompare(b.due||'9'));
  const overdue=open.filter(f=>f.due&&f.due<todayISO()).length;
  const examples=exampleQueries(true);
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
    <a href="#followups"><strong>${open.length}</strong> מעקבים פתוחים${overdue?`<span class="stat-badge overdue">${overdue} באיחור</span>`:''}</a>
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
  </div><div id="recordings-list">${recordingsList(f,person)}</div><div id="server-rec-results"></div>`;
}
function recServerSearch(){
  const f=navState.filters.recordings||'',person=navState.filters.recPerson||'';
  const shown=[...document.querySelectorAll?.('#recordings-list [data-case-row]')||[]].map(a=>a.dataset.caseRow);
  if(person){const b=el('server-rec-results');if(b)b.innerHTML='';return}
  queueServerSearch(f,'server-rec-results',shown);
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
  if(m.stub&&m.source==='server'&&!m.detailError)loadDetail(id).then(()=>{if(parseRoute().key==='case'&&parseRoute().param===id)render()});
  const an=m.analysis||{};
  const tab=navState.caseTab[id]||'knowledge';
  const nItems=(an.problem?1:0)+['observations','reasoning','advice','outcomes','results','followups','contradictions'].reduce((s,k)=>s+(an[k]||[]).length,0);
  const wait=m.stub&&!m.detailError;
  const tabs=[['knowledge','ידע שחולץ',wait?'…':nItems],['source','תמלול מקור',wait?'…':(an.segments||[]).length],['plaud','ניתוח PLAUD',wait?'…':m.plaud?'':'אין']];
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
    <div role="tabpanel">${m.stub?detailStatePanel(m):tab==='source'?sourcePanel(m):tab==='plaud'?plaudPanel(m):knowledgePanel(m)}</div>
  </div>`;
}
function detailStatePanel(m){
  const msg=m.detailError==='auth'?['נדרשת כניסה לשרת','השרת ביקש סיסמה. רענני את הדף והזיני אותה.']
    :m.detailError==='missing'?['ההקלטה לא נמצאה בשרת','ייתכן שהיא הוסרה. הרשימה תתעדכן בכניסה הבאה.']
    :m.detailError?['לא ניתן לטעון את ההקלטה','השרת לא ענה. אפשר לנסות שוב בעוד רגע.']
    :['טוען את ההקלטה…','התמלול המלא וניתוח PLAUD נטענים מהשרת רק כשפותחים הקלטה.'];
  return`<div class="panel">${emptyState(msg[0],msg[1])}</div>`;
}
function knowledgePanel(m){
  const an=m.analysis||{};
  const ks=an.knowledgeSource;
  const note=ks?`זוהה על ידי ${esc(ks.model)}, בינה מלאכותית שרצה אצלך במחשב. כל ציטוט נבדק מול התמליל${ks.dropped?`, ו־${cnt(ks.dropped,'ציטוט אחד שלא נמצא נזרק','ציטוטים שלא נמצאו נזרקו')}`:''}.`
    :'זוהה בכללים מקומיים. כל פריט נשלף מהתמלול ומקושר למשפט המקורי. „למה?” מציג את המשפט עצמו.';
  const steps=[
    ['הבעיה',an.problem?[an.problem]:[],{cat:'problem'}],
    ['תצפיות',an.observations,{cat:'observe'}],
    ['העצה',an.advice,{cls:'step-advice',cat:'advice'}],
    ['הנימוק',an.reasoning,{cat:'reason'}],
    ['התוצאה המצופה',an.outcomes,{cat:'outcome'}],
    ['מה קרה בפועל',an.results,{cat:'result'}],
    ['מעקב',an.followups,{cat:'follow'}],
    ['חריגים',an.contradictions,{cat:'except'}],
    ...(an.knowledgeSource?[['עקרונות שנוסחו',an.principles,{cat:'reason'}]]:[]),
    ['מהלכי ייעוץ (מועמדים)',an.methodology,{cat:'reason'}]
  ];
  const full=steps.filter(([,items])=>items&&items.length),empty=steps.filter(([,items])=>!items||!items.length).map(([l])=>l);
  const noSpeakers=!(an.speakers||[]).length&&empty.includes('מהלכי ייעוץ (מועמדים)');
  // קבוצות ריקות לא תופסות שורה כל אחת: הן מרוכזות בשורה אחת בסוף.
  const emptyLine=empty.length?`<p class="chain-empty"><strong>לא זוהו בהקלטה הזו:</strong> ${empty.map(esc).join(' · ')}${noSpeakers?'. מהלכי ייעוץ מזוהים רק כשהדוברים מסומנים בתמלול.':''}</p>`:'';
  return`<p class="section-note">${note}</p>
  <div class="chain">${full.map(([l,items,o])=>stepHtml(l,items,m.id,o)).join('')}</div>${full.length?'':`<div class="panel">${emptyState('לא חולץ ידע מההקלטה הזו','אפשר לעיין בתמלול המקור או בניתוח PLAUD.')}</div>`}${emptyLine}`;
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
    </li>`).join('')||`<li class="src-empty">${m.source==='server'&&m.hasTranscript===false?'אין תמלול מ־PLAUD להקלטה זו':'אין תמלול שמור להקלטה זו'}</li>`}
    </ol>
  </div>`;
}
function plaudPanel(m){
  return`<p class="section-note">הניתוח כפי ש־PLAUD הפיק אותו, בלי עריכה.</p>
  <div class="panel panel-pad">${m.plaud?`<p class="plaud-text">${esc(m.plaud)}</p>`:'<p class="src-empty">לא נשמר ניתוח PLAUD להקלטה זו</p>'}</div>`;
}

function fileView(id){
  const c=caseById(id);
  if(!c)return emptyState('התיק לא נמצא','','חזרה לאנשים','people');
  const ms=recordingsOfCase(c),chrono=[...ms].reverse();
  const ids=new Set(ms.map(m=>m.id));
  const adv=allAdvice().filter(x=>ids.has(x.m.id));
  const fs=data.followups.filter(f=>ids.has(f.meetingId)).sort((a,b)=>Number(a.done)-Number(b.done)||(a.due||'9').localeCompare(b.due||'9'));
  const results=chrono.flatMap(m=>(m.analysis?.results||[]).map(r=>({m,r})));
  return`<div class="detail">
    <a class="crumb" href="#people">${ic('back')} אנשים</a>
    <header class="d-head">
      <h2 class="d-title">${esc(c.title)}</h2>
      <div class="d-meta">${pill(c.status==='closed'?'תיק סגור':'תיק פתוח',c.status==='closed'?'':'accent')}
        ${(c.people||[]).map(n=>`<a class="meta-link" href="#/person/${encodeURIComponent(n)}">${ic('users')} ${esc(n)}</a>`).join('<i class="dot-sep"></i>')}
        <i class="dot-sep"></i><span>${ms.length} הקלטות</span>${(c.tags||[]).map(t=>pill(t)).join('')}</div>
      <p class="d-summary">תיק הוא נושא מתמשך. הוא יכול לכלול כמה אנשים וכמה הקלטות, והקלטה יכולה להשתייך לכמה תיקים.</p>
    </header>
    <div class="stack">
      <section>${sectionHead('ציר הזמן של התיק')}<div class="timeline">${chrono.map(m=>`<a class="tl-item" href="#/case/${esc(m.id)}"><span class="tl-date">${formatFull(m.date)} · ${esc(m.person)}</span><strong>${esc(m.title)}</strong>${m.summary?`<p>${esc(m.summary)}</p>`:''}</a>`).join('')||'<p class="muted-note">אין הקלטות בתיק.</p>'}</div></section>
      <section>${sectionHead('עצות ונימוקים')}<div class="panel">${adv.length?adv.map(x=>adviceRow(x)).join(''):emptyState('אין עצות בתיק','')}</div></section>
      <section>${sectionHead('תוצאות ידועות')}<div class="panel">${results.length?results.map(({m,r})=>`<div class="tip-row"><p class="tip-text">${esc(r.text)}</p><div class="tip-foot"><span>${formatDate(m.date)}</span><i class="dot-sep"></i><a href="#/case/${esc(m.id)}">${esc(m.title)}</a><button class="link-btn" type="button" data-src-case="${esc(m.id)}" data-src-seg="${r.evidence.seg}">${ic('quote')}ציון מקור</button></div></div>`).join(''):emptyState('עוד לא דווחו תוצאות','')}</div></section>
      <section>${sectionHead('מעקבים')}<div class="panel">${fs.length?fs.map(f=>followRow(f)).join(''):emptyState('אין מעקבים בתיק','')}</div></section>
    </div>
  </div>`;
}
function casesCard(list,title){
  if(!list.length)return'';
  return`<section class="ctx-card"><h2>${title}</h2><ul class="ctx-list">${list.map(c=>`<li><a href="#/file/${esc(c.id)}">${esc(c.title)}</a><span class="ctx-sub">${c.status==='closed'?'סגור':'פתוח'} · ${recordingsOfCase(c).length} הקלטות · ${(c.people||[]).map(esc).join(', ')}</span></li>`).join('')}</ul></section>`;
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
  const why=navState.filters.advWhy||'';
  const cov=SOURCE.mode==='server'?`<p class="tip-count">מבוסס על ${cnt(detailCount(),'הקלטה אחת','הקלטות')} שנטענו במלואן מתוך ${SOURCE.count}. הקלטה נוספת נכנסת לחשבון כשפותחים אותה.</p>`:'';
  return`<p class="section-note">העצות מסודרות לפי הקלטה. בכל הקלטה, עצות עם נימוק מופיעות ראשונות. לחיצה על הקלטה פותחת את העצות שלה.</p>${cov}
  <div class="page-tools">
    <input id="filter-advice" type="search" value="${esc(f)}" placeholder="סינון עצות" aria-label="סינון עצות">
    <select id="filter-tip-person" aria-label="סינון לפי אדם"><option value="">כל האנשים</option>${allPeople().map(p=>`<option ${p.name===person?'selected':''} value="${esc(p.name)}">${esc(p.name)}</option>`).join('')}</select>
    <select id="filter-tip-why" aria-label="סינון לפי נימוק"><option value="">כל העצות</option><option value="why" ${why==='why'?'selected':''}>רק עצות עם נימוק</option></select>
  </div>
  <div id="advice-list">${adviceList(f,person,why)}</div>`;
}
// עצות לפי הקלטה: כל הקלטה היא קבוצה נפתחת. בלי סינון הקבוצות סגורות, עם סינון הן פתוחות.
function adviceList(f,person,why=navState.filters.advWhy||''){
  const q=prepQuery(f);
  const list=allAdvice().filter(x=>(!person||x.m.person===person)&&(!why||x.reason)&&(!q.tokens.length||scoreRecord(q,[[x.a.text,1],[x.reason?.text,1],[x.m.title,1],[(x.m.tags||[]).join(' '),1]])>0));
  if(!list.length)return`<div class="panel">${emptyState('לא נמצאו עצות','')}</div>`;
  const groups=new Map();
  for(const x of list){if(!groups.has(x.m.id))groups.set(x.m.id,{m:x.m,items:[]});groups.get(x.m.id).items.push(x)}
  const open=q.tokens.length>0||groups.size===1;
  const head=`<p class="tip-count">${cnt(list.length,'עצה אחת','עצות')} ב־${cnt(groups.size,'הקלטה אחת','הקלטות')}</p>`;
  return head+[...groups.values()].map(({m,items})=>{
    items.sort((a,b)=>(b.reason?1:0)-(a.reason?1:0)||(a.a.evidence?.seg??0)-(b.a.evidence?.seg??0));
    const withWhy=items.filter(x=>x.reason).length;
    const first=items[0].a.text;
    return`<details class="tip-group panel"${open?' open':''}>
      <summary><span class="tip-g-main"><strong>${esc(m.title)}</strong><span class="tip-g-meta">${esc(m.person)} · ${formatDate(m.date)} · ${cnt(items.length,'עצה אחת','עצות')}${withWhy?' · '+cnt(withWhy,'אחת עם נימוק','עם נימוק'):''}</span><span class="tip-g-first">${esc(first.length>110?first.slice(0,110)+'…':first)}</span></span><a class="link-btn tip-g-open" href="#/case/${esc(m.id)}">להקלטה</a></summary>
      ${items.map(x=>adviceRow(x,{noPerson:true,noMeeting:true})).join('')}
    </details>`;
  }).join('');
}

function contradictionsView(){
  const ex=allExceptions(),ch=adviceChanges();
  return`<p class="section-note">כאן מופיעים מקרים שדורשים בדיקה שלך: חריגים שנאמרו בפגישות, ועצות שהשתנו אצל אותו אדם. המערכת לא מכריעה אם זו סתירה אמיתית.</p>
  <div class="stack">
    <section>${sectionHead('חריגים שנאמרו בפגישות')}
      <div class="panel">${ex.length?ex.map(({m,c})=>`<div class="tip-row"><p class="tip-text">${esc(c.text)}</p>
        <div class="tip-foot"><a href="#/person/${encodeURIComponent(m.person)}">${esc(m.person)}</a><i class="dot-sep"></i><span>${formatDate(m.date)}</span><i class="dot-sep"></i><a href="#/case/${esc(m.id)}">${esc(m.title)}</a>
        <button class="link-btn" type="button" data-src-case="${esc(m.id)}" data-src-seg="${c.evidence.seg}">${ic('quote')}ציון מקור</button></div></div>`).join(''):emptyState('לא זוהו חריגים','')}</div>
    </section>
    <section>${sectionHead('עצות שהשתנו לאורך זמן')}
      <div class="panel">${ch.length?ch.map(x=>`<div class="tip-row">
        <div class="tip-foot" style="margin-top:0"><a href="#/person/${encodeURIComponent(x.person)}">${esc(x.person)}</a></div>
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
  <div class="principle-grid">${cards||emptyState('עדיין אין עקרונות','')}</div>
  ${methodSection()}`;
}
function methodSection(){
  const {patterns,sequences}=methodPatterns(data.meetings);const cov=methodCoverage(data.meetings);
  const Q={question:'אילו שאלות אני נוהג לשאול?',reframe:'איך אני עושה מסגור מחדש?',rationale:'איך אני מנמק עצות?',adaptation:'באילו מקרים אני משנה כיוון באמצע השיחה?',followup_plan:'איך אני קובע בדיקה בהמשך?',client_resistance:'איך אני בדרך כלל מגיב להתנגדות?',client_turning_point:'מה קורה לפני נקודת מפנה?'};
  const card=p=>{const o=p.occ[0];return`<div class="principle-card method-card">
    <h3>${esc(p.label)}</h3>
    <p class="why-q">״${esc(o.it.text)}״</p>
    <div class="p-foot">${pill(p.status,p.status==='חוזר'||p.status==='מבוסס'?'accent':'ev')}<span>${p.recordings} הקלטות · ${cnt(p.people,'אדם אחד','אנשים')}</span>
      <button class="link-btn" type="button" data-ask-open="${esc(Q[p.subtype]||'איך אני מייעץ?')}" data-scope-type="global" data-scope-id="">${ic('spark')}דוגמאות וניתוח</button></div>
  </div>`};
  const seqs=sequences.filter(x=>x.recordings>=2);
  return`<div class="section-head block"><h2>דפוסי ייעוץ מההקלטות</h2><button class="see-link link-btn" type="button" data-ask-open="מה השיטה שלי? אילו מהלכי ייעוץ חוזרים?" data-scope-type="global" data-scope-id="">שאל על השיטה ${ic('fwd')}</button></div>
  <p class="section-note">${esc(cov.text)} מהלך שהופיע בהקלטה אחת הוא תצפית מועמדת. „חוזר” דורש לפחות 2 הקלטות של 2 אנשים.</p>
  <div class="principle-grid">${patterns.map(card).join('')||emptyState('לא זוהו מהלכים','מהלכים מזוהים רק בהקלטות עם דוברים מסומנים.')}</div>
  ${seqs.length?`<div class="section-head block"><h2>רצפים חוזרים</h2></div><div class="panel">${seqs.map(x=>`<div class="tip-row"><p class="tip-text">${esc(METHOD[x.from].label)} ← ${esc(METHOD[x.to].label)}</p><div class="tip-foot">${pill(x.status,'accent')}<span>${x.recordings} הקלטות · ${cnt(x.people,'אדם אחד','אנשים')}</span>${x.occ.map(o=>`<a href="#/case/${esc(o.m.id)}">${esc(o.m.person)} · ${formatDate(o.m.date)}</a>`).join('<i class="dot-sep"></i>')}</div></div>`).join('')}</div>`:''}`;
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
      ${sec('מקרים מקושרים',cases.length?cases.map(m=>{const a=m.analysis?.advice?.[0];return`<div class="tip-row" style="padding-inline:0"><a class="meta-link" href="#/case/${esc(m.id)}">${esc(m.title)}</a><div class="tip-foot" style="margin-top:3px"><span>${esc(m.person)}</span><i class="dot-sep"></i><span>${formatDate(m.date)}</span></div>${a?`<p class="tip-why">${esc(a.text)}</p>`:''}</div>`}).join(''):'<p class="muted-note">לא נמצאו מקרים עם חפיפה מספקת.</p>')}
      ${sec('חריגים מתוך המקרים',exc.length||(p.exceptions||[]).length?exc.map(({m,c})=>`<p class="tip-why">״${esc(c.text)}״ · <a href="#/case/${esc(m.id)}">${esc(m.person)}, ${formatDate(m.date)}</a></p>`).join('')+(p.exceptions||[]).map(e=>`<p class="tip-why">${esc(e)}</p>`).join(''):'<p class="muted-note">לא נאמר חריג באף מקרה מקושר.</p>')}
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
  const examples=exampleQueries(false);
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
    ${res.total?groupsHtml:`<div class="panel">${emptyState('לא נמצאו תוצאות','אפשר לנסות מילה אחת מרכזית או את השם המדויק.')}</div>`}<div id="server-search-results"></div>`
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
      parts.push(askCard({type:'recording',id:m.id}));
      parts.push(casesCard(casesOfRecording(m.id),'תיקים שההקלטה שייכת אליהם'));
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
    if(ms.length)parts.push(askCard({type:'person',id:name}));
    parts.push(casesCard(casesOfPerson(name),'תיקים'));
    parts.push(`<section class="ctx-card"><h2>מעקבים פתוחים</h2>${openF.length?`<ul class="ctx-list">${openF.map(f=>`<li>${esc(f.title)}<span class="ctx-sub ${dueLabel(f.due).cls}">${dueLabel(f.due).t}</span></li>`).join('')}</ul>`:'<p class="ctx-empty">אין.</p>'}</section>`);
    if(tags.size)parts.push(`<section class="ctx-card"><h2>נושאים חוזרים</h2><div class="example-row" style="margin:0">${[...tags.entries()].sort((a,b)=>b[1]-a[1]).map(([t,n])=>pill(t+(n>1?' · '+n:''),'accent')).join('')}</div></section>`);
    if(relMap.size)parts.push(`<section class="ctx-card"><h2>עקרונות שעשויים להתאים</h2><ul class="ctx-list">${[...relMap.values()].map(p=>`<li><a href="#/principle/${esc(p.id)}">${esc(p.title)}</a></li>`).join('')}</ul></section>`);
    parts.push(zmanimCard());
    return parts.join('');
  }
  if(r.key==='file'){
    const c=caseById(r.param);
    if(c){parts.push(askCard({type:'case',id:c.id}));parts.push(zmanimCard());return parts.join('')}
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
  if(r.key==='case'){const m=data.meetings.find(x=>x.id===r.param);title='הקלטות';eyebrow=m?m.person+' · '+formatDate(m.date):''}
  else if(r.key==='person'){title='אנשים';eyebrow=(r.param?r.param+' · ':'')+'הזיכרון לפני הפגישה'}
  else if(r.key==='file'){const c=caseById(r.param);title='תיקים';eyebrow=c?(c.people||[]).join(', '):''}
  else if(r.key==='principle'){title='עקרונות';eyebrow='עיקרון'}
  else{const t=ROUTE_TITLES[r.key]();title=t.t;eyebrow=t.e}
  el('page-title').textContent=title;
  el('eyebrow').textContent=eyebrow;
  if(r.key==='case'&&data.meetings.some(m=>m.id===r.param)){navState.lastCase=r.param;persistNav()}
  const views={
    home:homeView,recordings:recordingsView,people:peopleView,advice:adviceView,principles:principlesView,contradictions:contradictionsView,
    search:()=>searchView(lastSearch),followups:followupsView,
    case:()=>caseView(r.param),file:()=>fileView(r.param),person:()=>personView(r.param),principle:()=>principleView(r.param)
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
  qsa('[data-ask-open]').forEach(b=>b.onclick=()=>openAsk(b.dataset.askOpen||'',{type:b.dataset.scopeType,id:b.dataset.scopeId}));
  qsa('[data-delete-case]').forEach(b=>b.onclick=()=>deleteMeeting(b.dataset.deleteCase));
  const hero=el('hero-search');
  if(hero)hero.onsubmit=e=>{e.preventDefault();lastSearch=String(new FormData(e.target).get('q')||'');saveRecent(lastSearch);navigate('search')};
  const full=el('full-search');
  if(full)full.onsubmit=e=>{e.preventDefault();lastSearch=String(new FormData(e.target).get('q')||'');saveRecent(lastSearch);render()};
  const live=(id,key,fn,box)=>{const i=el(id);if(i)i.oninput=i.onchange=()=>{navState.filters[key]=i.value;persistNav();fn()}};
  live('filter-recordings','recordings',()=>{el('recordings-list').innerHTML=recordingsList(navState.filters.recordings||'',navState.filters.recPerson||'');recServerSearch()});
  if(parseRoute().key==='recordings')recServerSearch();
  if(parseRoute().key==='search'&&lastSearch)queueServerSearch(lastSearch,'server-search-results',searchAll(lastSearch).groups.meeting.map(g=>g.id));
  live('filter-rec-person','recPerson',()=>{el('recordings-list').innerHTML=recordingsList(navState.filters.recordings||'',navState.filters.recPerson||'')});
  live('filter-people','people',()=>{el('people-list').innerHTML=peopleList(navState.filters.people||'')});
  live('filter-advice','advice',()=>{el('advice-list').innerHTML=adviceList(navState.filters.advice||'',navState.filters.advPerson||'');bindSrcButtons()});
  live('filter-tip-person','advPerson',()=>{el('advice-list').innerHTML=adviceList(navState.filters.advice||'',navState.filters.advPerson||'');bindSrcButtons()});
  live('filter-tip-why','advWhy',()=>{el('advice-list').innerHTML=adviceList(navState.filters.advice||'',navState.filters.advPerson||'');bindSrcButtons()});
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
    data.followups.unshift({id:crypto.randomUUID(),person:String(fd.get('person')||''),title,due:String(fd.get('due')||addDays(todayISO(),7)),done:false,local:true});
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
  for(const f of analysis.followups)data.followups.unshift({id:crypto.randomUUID(),person,title:f.text,due:addDays(date,7),done:false,meetingId:meeting.id,local:true});
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
  for(const c of allCases())c.recordingIds=(c.recordingIds||[]).filter(x=>x!==id);
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
    name:'ask_second_brain',title:'שאל את המוח השני',
    description:'שאלה בעברית על היסטוריית הייעוץ. מחזיר תשובה שבנויה רק מראיות מתועדות, עם הפניה למשפט המקור וכיסוי. קריאה בלבד.',
    inputSchema:{type:'object',properties:{question:{type:'string',minLength:1},scope:{type:'object',properties:{type:{type:'string',enum:['global','person','recording','case','advice']},id:{type:'string'}},required:['type'],additionalProperties:false}},required:['question'],additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:true},
    execute({question,scope}){
      if(typeof question!=='string'||!question.trim())throw new Error('נדרשת שאלה');
      return askSecondBrain(question,scope&&scope.type?scope:{type:'global'});
    }
  });
  register({
    name:'create_follow_up',title:'יצירת מעקב',
    description:'יצירת משימת מעקב חדשה עבור אדם במאגר ועדכון מסך המעקבים.',
    inputSchema:{type:'object',properties:{person:{type:'string',minLength:1},title:{type:'string',minLength:1},due:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'}},required:['person','title','due'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(input){
      if(!input||typeof input.person!=='string'||!input.person.trim()||typeof input.title!=='string'||!input.title.trim()||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.due))throw new Error('נתוני המעקב אינם תקינים');
      const item={id:crypto.randomUUID(),person:input.person.trim(),title:input.title.trim(),due:input.due,done:false,local:true};
      data.followups.unshift(item);save();navigate('followups');
      return{id:item.id,status:'created'};
    }
  });
}

/* ---------- חיבור לשרת (NAS) ---------- */
const DAY_RE=/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const str=v=>typeof v==='string'?v.trim():'';
// ממיר תמונת מצב מהשרת למבנה הנתונים של האתר. זורק שגיאה אם החוזה אינו תואם.
function normalizeSnapshot(j,prev){
  if(!j||j.contract!==SERVER_CONTRACT||!Array.isArray(j.recordings))throw new Error('חוזה שרת לא מוכר');
  const prevM=new Map((prev&&Array.isArray(prev.meetings)?prev.meetings:[]).map(m=>[m.id,m]));
  const meetings=[];
  for(const r of j.recordings){
    const id=str(r.id),person=str(r.person),date=str(r.date).slice(0,10),transcript=typeof r.transcript==='string'?r.transcript:'';
    if(!id||!person||!DAY_RE.test(date)||!transcript.trim())continue;
    const m={id,person,date,title:str(r.title)||'הקלטה מ־'+formatDate(date),summary:str(r.summary),transcript,tags:Array.isArray(r.tags)?r.tags.filter(t=>typeof t==='string'):[],plaud:typeof r.plaud==='string'?r.plaud:'',source:'server'};
    const old=prevM.get(id);
    // אותו תמליל, אותה גרסת ניתוח: לא מנתחים מחדש.
    if(old&&old.transcript===transcript&&old.analysis&&old.analysis.version===ANALYSIS_VERSION)m.analysis=old.analysis;
    meetings.push(m);
  }
  // הקלטות שיובאו כאן במכשיר (לא מהשרת) נשארות.
  for(const m of prevM.values())if(m.source!=='server'&&!meetings.some(x=>x.id===m.id))meetings.push(m);
  const ids=new Set(meetings.map(m=>m.id));
  const cases=(Array.isArray(j.cases)?j.cases:[]).map(c=>({id:str(c.id),title:str(c.title),status:str(c.status)||'open',people:Array.isArray(c.people)?c.people.filter(x=>typeof x==='string'):[],recordingIds:(Array.isArray(c.recordingIds)?c.recordingIds:[]).filter(x=>ids.has(x))})).filter(c=>c.id&&c.title);
  // מעקבים: מהשרת, ועוד מעקבים שנוספו כאן במכשיר. סימון "בוצע" מקומי נשמר.
  const prevF=new Map((prev&&Array.isArray(prev.followups)?prev.followups:[]).map(f=>[f.id,f]));
  const followups=(Array.isArray(j.followups)?j.followups:[]).map(f=>({id:str(f.id),person:str(f.person),title:str(f.title),due:str(f.due).slice(0,10),done:!!f.done||!!prevF.get(str(f.id))?.done,meetingId:str(f.recordingId)||undefined})).filter(f=>f.id&&f.person&&f.title&&DAY_RE.test(f.due));
  const serverF=new Set(followups.map(f=>f.id));
  for(const f of prevF.values())if(f.local&&!serverF.has(f.id))followups.push(f);
  return{meetings,followups,cases,people:prev&&Array.isArray(prev.people)?prev.people:[],principles:prev&&Array.isArray(prev.principles)?prev.principles:[],seedVersion:SEED.seedVersion,generatedAt:str(j.generatedAt)||null};
}
function sourceNote(){
  const n=el('source-note');if(!n)return;
  const when=SOURCE.generatedAt?' · עודכן '+formatDate(SOURCE.generatedAt.slice(0,10)):'';
  const txt={
    local:['נשמר במכשיר בלבד','גרסת הדגמה עם נתוני דוגמה. אין להזין כאן מידע אמיתי.'],
    server:['מחובר לשרת','קריאה בלבד מה־NAS. '+cnt(SOURCE.count,'הקלטה אחת','הקלטות')+when+'.'],
    cached:['השרת לא זמין','מוצג העותק האחרון מהשרת. '+cnt(SOURCE.count,'הקלטה אחת','הקלטות')+when+'.'],
    auth:['נדרשת כניסה לשרת','השרת ביקש סיסמה. מוצגים נתוני הדוגמה.'],
    error:['השרת החזיר נתונים לא תקינים','מוצגים הנתונים המקומיים.']
  }[SOURCE.status]||[];
  n.dataset.state=SOURCE.status;
  n.innerHTML='<span class="privacy-dot" aria-hidden="true"></span><div><strong>'+esc(txt[0]||'')+'</strong>'+esc(txt[1]||'')+'</div>';
}
function serverCapable(){
  if(typeof location==='undefined'||typeof fetch!=='function')return false;
  if(!/^https?:$/.test(location.protocol))return false;
  // GitHub Pages הוא אתר ציבורי סטטי. אין בו שרת, ואין לשלוח ממנו בקשות לנתונים.
  return!/\.github\.io$/i.test(location.hostname);
}
/* ---------- רשימה קלה + פרטי הקלטה (חוזה v2) ----------
   הרשימה מכילה רק נתוני תצוגה. התמלול המלא וניתוח PLAUD נטענים רק כשפותחים הקלטה. */
const LIST_URL='./api/site/recordings';
const LIST_CONTRACT='nitzotza.list.v1',DETAIL_CONTRACT='nitzotza.recording.v1';
const LIST_PAGE=100,PREFETCH_RECENT=40,DETAIL_CAP=80,SNIPPET_MAX=300;
const detailJobs=new Map(),detailOrder=[];
const getJSON=async url=>{
  const res=await fetch(url,{cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json'}});
  if(res.status===401||res.status===403){const e=new Error('auth');e.status=res.status;throw e}
  if(!res.ok){const e=new Error('http');e.status=res.status;throw e}
  return res.json();
};
// פריט רשימה → הקלטה חלקית. גוף תמלול או ניתוח שנשלח בטעות ברשימה לא נקלט.
function listItemToMeeting(r){
  const id=str(r.id),date=str(r.date).slice(0,10);
  if(!id||!DAY_RE.test(date))return null;
  const snip=str(r.snippet||r.summary);
  return{id,person:str(r.person)||'לא משויך',date,time:str(r.time)||null,duration:typeof r.duration==='number'?r.duration:null,
    title:str(r.title)||'הקלטה מ־'+formatDate(date),summary:snip.length>SNIPPET_MAX?snip.slice(0,SNIPPET_MAX)+'…':snip,
    tags:Array.isArray(r.tags)?r.tags.filter(t=>typeof t==='string'):[],plaudFileId:str(r.plaudFileId)||null,
    status:str(r.status)||null,aiStatus:str(r.aiStatus)||null,hasTranscript:!!r.hasTranscript,hasPlaud:!!r.hasPlaud,hasKnowledge:!!r.hasKnowledge,
    transcript:'',plaud:'',stub:true,source:'server'};
}
async function fetchAllListPages(){
  const first=await getJSON(`${LIST_URL}?offset=0&limit=${LIST_PAGE}`);
  if(!first||first.contract!==LIST_CONTRACT||!Array.isArray(first.items))throw new Error('contract');
  const items=[...first.items],total=Number.isFinite(first.total)?first.total:items.length;
  // הדפים נטענים עד שהרשימה מלאה. אין מספר קבוע: המאגר גדל.
  while(items.length<total){
    const page=await getJSON(`${LIST_URL}?offset=${items.length}&limit=${LIST_PAGE}`);
    if(!page||!Array.isArray(page.items)||!page.items.length)break;
    items.push(...page.items);
  }
  return{first,items,total};
}
function buildFromList({first,items,total},prev){
  const prevM=new Map((prev&&Array.isArray(prev.meetings)?prev.meetings:[]).map(m=>[m.id,m]));
  const meetings=[];
  for(const r of items){
    const m=listItemToMeeting(r);if(!m)continue;
    const old=prevM.get(m.id);
    // פרטים שכבר נטענו בסשן הזה נשמרים, כדי שלא לטעון שוב.
    if(old&&old.detailLoaded){Object.assign(m,{transcript:old.transcript,plaud:old.plaud,analysis:old.analysis,stub:false,detailLoaded:true})}
    meetings.push(m);
  }
  for(const m of prevM.values())if(m.source!=='server'&&!meetings.some(x=>x.id===m.id))meetings.push(m);
  const ids=new Set(meetings.map(m=>m.id));
  const cases=(Array.isArray(first.cases)?first.cases:[]).map(c=>({id:str(c.id),title:str(c.title),status:str(c.status)||'open',people:Array.isArray(c.people)?c.people.filter(x=>typeof x==='string'):[],recordingIds:(Array.isArray(c.recordingIds)?c.recordingIds:[]).filter(x=>ids.has(x))})).filter(c=>c.id&&c.title);
  const prevF=new Map((prev&&Array.isArray(prev.followups)?prev.followups:[]).map(f=>[f.id,f]));
  const followups=(Array.isArray(first.followups)?first.followups:[]).map(f=>({id:str(f.id),person:str(f.person),title:str(f.title),due:str(f.due).slice(0,10),done:!!f.done||!!prevF.get(str(f.id))?.done,meetingId:str(f.recordingId)||undefined})).filter(f=>f.id&&f.person&&f.title&&DAY_RE.test(f.due));
  const serverF=new Set(followups.map(f=>f.id));
  for(const f of prevF.values())if(f.local&&!serverF.has(f.id))followups.push(f);
  return{meetings,followups,cases,people:prev?.people||[],principles:prev?.principles||[],seedVersion:SEED.seedVersion,generatedAt:str(first.generatedAt)||null,total};
}
function applyDetail(m,d){
  if(!d||d.contract!==DETAIL_CONTRACT||str(d.id)!==m.id)throw new Error('contract');
  m.transcript=typeof d.transcript==='string'?d.transcript:'';
  m.plaud=typeof d.plaud==='string'?d.plaud:'';
  m.hasTranscript=!!m.transcript.trim();m.hasPlaud=!!m.plaud.trim();
  for(const k of ['title','summary','time','status','aiStatus','plaudFileId'])if(typeof d[k]==='string'&&d[k].trim())m[k]=d[k].trim();
  if(typeof d.duration==='number')m.duration=d.duration;
  if(!applyKnowledge(m,d.knowledge))m.analysis=analyzeTranscript(m.transcript);
  m.stub=false;m.detailLoaded=true;m.detailError=null;
  // מגבלת זיכרון: רק ההקלטות האחרונות שנפתחו נשמרות במלואן.
  const i=detailOrder.indexOf(m.id);if(i>=0)detailOrder.splice(i,1);detailOrder.push(m.id);
  while(detailOrder.length>DETAIL_CAP){const oid=detailOrder.shift(),old=data.meetings.find(x=>x.id===oid);if(old&&old.id!==m.id)Object.assign(old,{transcript:'',plaud:'',analysis:analyzeTranscript(''),stub:true,detailLoaded:false})}
}
/* ---------- ידע שחולץ בבינה מלאכותית מקומית (חוזה nitzotza.knowledge.v1) ----------
   מופק על ה־Mac (LM Studio) ונשמר ב־NAS בנפרד מהנתונים הקנוניים. האתר לא סומך על המודל:
   כל ציטוט נבדק מול התמליל מילה במילה. ציטוט שלא נמצא נזרק. */
const KNOWLEDGE_CONTRACT='nitzotza.knowledge.v1';
const AI_TYPES={problem:'problem',advice:'advice',reasoning:'reasoning',outcome:'outcome',result:'result',followup:'followup',principle:'principle'};
const normQ=t=>String(t||'').replace(/[֑-ׇ]/g,'').replace(/[^֐-׿a-z0-9]+/gi,' ').trim();
function segIndexFor(segs,quote){
  const q=normQ(quote);if(q.length<6)return -1;
  const ns=segs.map(sg=>normQ(sg.text));
  let i=ns.findIndex(x=>x.includes(q));if(i>=0)return i;
  // ציטוט שחוצה כמה משפטים: מתחיל במשפט אחד וממשיך בבאים
  for(let k=0;k<ns.length;k++){if(!ns[k]||!q.startsWith(ns[k].slice(0,Math.min(ns[k].length,40))))continue;let acc=ns[k],j=k;while(acc.length<q.length&&j+1<ns.length)acc+=' '+ns[++j];if(acc.includes(q))return k}
  return -1;
}
function applyKnowledge(m,k){
  if(!k||k.contract!==KNOWLEDGE_CONTRACT||!Array.isArray(k.items))return false;
  const base=analyzeTranscript(m.transcript),segs=base.segments,full=normQ(m.transcript);
  const out={problem:[],advice:[],reasoning:[],outcome:[],result:[],followup:[],principle:[]};const advIds=[];let dropped=0;
  k.items.forEach((it,n)=>{
    const type=AI_TYPES[it&&it.type];const quote=str(it&&it.quote);
    if(!type||!quote||!full.includes(normQ(quote))){dropped++;return}
    const seg=segIndexFor(segs,quote);if(seg<0){dropped++;return}
    const sg=segs[seg];
    const item={id:type+'-ai-'+n,type,text:quote,kind:'explicit',confidence:80,source:'ai',model:str(k.model),summary:str(it.summary).slice(0,140)||null,
      evidence:{quote,time:sg.time,speaker:sg.speaker,seg}};
    if(type==='advice')advIds[n]=item.id;
    out[type].push(item);
  });
  // נימוק מקושר לעצה שהמודל הצביע עליה, רק אם העצה עצמה עברה אימות
  for(const r of out.reasoning){const src=k.items[+r.id.split('-ai-')[1]];const ref=Number.isInteger(src?.adviceIndex)?advIds[src.adviceIndex]:null;if(ref)r.forAdvice=ref}
  m.analysis={...base,problem:out.problem[0]||null,observations:out.problem.slice(1),reasoning:out.reasoning,advice:out.advice,outcomes:out.outcome,results:out.result,followups:out.followup,
    principles:out.principle,knowledgeSource:{kind:'ai',model:str(k.model)||'מודל מקומי',generatedAt:str(k.generatedAt)||null,dropped,kept:k.items.length-dropped}};
  return true;
}

function loadDetail(id){
  const m=data.meetings.find(x=>x.id===id);
  if(!m||!m.stub||m.source!=='server')return Promise.resolve(m);
  if(detailJobs.has(id))return detailJobs.get(id);
  const job=getJSON(`${LIST_URL}/${encodeURIComponent(id)}`)
    .then(d=>{applyDetail(m,d);return m})
    .catch(e=>{m.detailError=e.status===401||e.status===403?'auth':e.status===404?'missing':'error';return m})
    .finally(()=>detailJobs.delete(id));
  detailJobs.set(id,job);
  return job;
}
function detailCount(){return data.meetings.filter(m=>m.source==='server'&&m.detailLoaded).length}
// טעינה ברקע של ההקלטות האחרונות, אחת אחרי השנייה, כדי שדפי הידע יעבדו. השאר נטענות בפתיחה.
async function prefetchRecent(n=PREFETCH_RECENT){
  const recent=data.meetings.filter(m=>m.source==='server'&&m.stub&&m.hasTranscript).sort(byDateDesc).slice(0,n);
  for(const m of recent){await loadDetail(m.id);if(SOURCE.mode!=='server')return}
  softRender();
}
function softRender(){
  const a=document.activeElement;
  if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName||''))return;
  if(typeof el==='function'&&el('ask-dialog')?.open)return;
  render();
}
// חיפוש בשרת: מוצא הקלטות לפי תוכן גם כשהתמלול שלהן לא נטען לדפדפן.
const serverSearchCache=new Map();
async function serverSearch(q){
  q=String(q||'').trim();if(!q||SOURCE.mode!=='server')return[];
  if(serverSearchCache.has(q))return serverSearchCache.get(q);
  try{
    const r=await getJSON(`${LIST_URL}?q=${encodeURIComponent(q)}&offset=0&limit=50`);
    const ids=(Array.isArray(r.items)?r.items:[]).map(it=>{const m=listItemToMeeting(it);if(m&&!data.meetings.some(x=>x.id===m.id))data.meetings.push(m);return m?.id}).filter(Boolean);
    serverSearchCache.set(q,ids);if(serverSearchCache.size>30)serverSearchCache.delete(serverSearchCache.keys().next().value);
    return ids;
  }catch{return[]}
}
let serverSearchTimer=null;
function queueServerSearch(q,boxId,excludeIds){
  clearTimeout(serverSearchTimer);
  const box=el(boxId);if(!box)return;
  if(SOURCE.mode!=='server'||!String(q||'').trim()){box.innerHTML='';return}
  box.innerHTML='<p class="tip-count">מחפש גם בתוכן כל ההקלטות בשרת…</p>';
  serverSearchTimer=setTimeout(async()=>{
    const ids=await serverSearch(q);const b=el(boxId);if(!b)return;
    const ex=new Set(excludeIds||[]);
    const extra=ids.map(id=>data.meetings.find(m=>m.id===id)).filter(m=>m&&!ex.has(m.id));
    b.innerHTML=extra.length?`<h2 class="month-sep">נמצא גם בתוכן ההקלטות (חיפוש בשרת)</h2><div class="panel">${extra.map(meetingRow).join('')}</div>`:(ids.length?'':'<p class="tip-count">לא נמצאו התאמות נוספות בשרת.</p>');
  },300);
}

async function connectServer(){
  if(!serverCapable()){sourceNote();return SOURCE.status}
  try{
    const list=await fetchAllListPages();
    const next=buildFromList(list,SOURCE.mode==='server'?data:null);
    SOURCE.mode='server';SOURCE.status='server';SOURCE.api='list';SOURCE.generatedAt=next.generatedAt;SOURCE.count=next.meetings.filter(m=>m.source==='server').length;
    data=next;
    try{localStorage.setItem(SOURCE_KEY,'server')}catch{}
    ensureAllAnalysis();save();sourceNote();render();
    prefetchRecent();
    return SOURCE.status;
  }catch(e){
    if(e&&(e.status===401||e.status===403)){if(SOURCE.mode!=='server')SOURCE.status='auth';sourceNote();return SOURCE.status}
    // אין ממשק רשימה (404 או חוזה ישן): נופלים לתמונת המצב הישנה.
  }
  let res;
  try{res=await fetch(SERVER_URL,{cache:'no-store',credentials:'same-origin',headers:{Accept:'application/json'}})}
  catch{sourceNote();return SOURCE.status}
  if(res.status===401||res.status===403){if(SOURCE.mode!=='server')SOURCE.status='auth';sourceNote();return SOURCE.status}
  if(!res.ok){sourceNote();return SOURCE.status}
  try{
    const snap=normalizeSnapshot(await res.json(),SOURCE.mode==='server'?data:null);
    SOURCE.mode='server';SOURCE.status='server';SOURCE.api='snapshot';SOURCE.generatedAt=snap.generatedAt;SOURCE.count=snap.meetings.length;
    data=snap;
    try{localStorage.setItem(SOURCE_KEY,'server')}catch{}
    ensureAllAnalysis();save();
    sourceNote();render();
  }catch{if(SOURCE.mode!=='server')SOURCE.status='error';sourceNote()}
  return SOURCE.status;
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
bindAskDialog();
render();
sourceNote();
connectServer();
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
window.__consulting={applyKnowledge,segIndexFor,itemHtml,adviceRow,caseView,plaudPanel,sourcePanel,reasonFor,loadDetail,serverSearch,listItemToMeeting,fetchAllListPages,detailCount,persistable,DETAIL_CAP,normalizeSnapshot,connectServer,SOURCE,serverCapable,detectMethodology,methodPatterns,methodCoverage,methodFocus,METHOD,parseWindow,conceptKeys,recurringConcepts,adviceOutcomes,retrieveEvidence,buildSynthesisRequest,validateSynthesis,allCases,casesOfPerson,casesOfRecording,recordingsOfCase,SYNTHESIS,askSecondBrain,detectIntent,scopeFromRoute,SEED,load,save,analyzeTranscript,splitSegments,searchAll,tokenize,variants,relatedPrinciples,linkedCases,allPeople,allAdvice,adviceChanges,zmanimFor,hebrewDate,gematria,importMeeting,validBackup,get data(){return data},navigate,esc};
