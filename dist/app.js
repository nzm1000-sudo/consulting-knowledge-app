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

const icons={home:'⌂',recordings:'◉',people:'♙',principles:'✦',search:'⌕',followups:'✓'};
const labels={home:'בית',recordings:'הקלטות',people:'אנשים',principles:'עקרונות',search:'חיפוש',followups:'מעקבים'};
const nav=['home','recordings','people','principles','search','followups'];
let data=load();
let route=location.hash.slice(1)||'home';

function load(){try{return JSON.parse(localStorage.getItem('consultingKnowledge'))||structuredClone(SEED)}catch{return structuredClone(SEED)}}
function save(){localStorage.setItem('consultingKnowledge',JSON.stringify(data))}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function navHtml(mobile=false){return nav.map(key=>`<button class="nav-item ${route===key?'active':''}" data-route="${key}"><span class="nav-icon">${icons[key]}</span><span>${labels[key]}</span></button>`).join('')}
function formatDate(d){return new Intl.DateTimeFormat('he-IL',{day:'numeric',month:'long'}).format(new Date(d+'T12:00:00'))}
function meetingCard(m){return `<article class="meeting"><div class="meeting-top"><div><h3>${esc(m.title)}</h3><span class="meta">${esc(m.person)} · ${formatDate(m.date)}</span></div><span class="pill">${esc(m.tags?.[0]||'חדש')}</span></div><p>${esc(m.summary)}</p></article>`}
function followCard(f){return `<div class="follow-row row-between"><div><strong>${esc(f.title)}</strong><div class="meta">${esc(f.person)} · ${formatDate(f.due)}</div></div><input class="check" data-follow="${f.id}" type="checkbox" ${f.done?'checked':''} aria-label="סימון משימה כהושלמה"></div>`}

function home(){return `<section class="search-hero"><div><h2>מה תרצה למצוא היום?</h2><p>חפש עצות, מקרים, אנשים או עקרונות מתוך הפגישות שלך</p><form class="search-box" id="hero-search"><input name="q" aria-label="חיפוש במאגר" placeholder="למשל: מתי המלצתי להציב גבול?" autocomplete="off"><button aria-label="חיפוש">⌕</button></form></div><div class="search-examples"><small>חיפושים שאפשר לנסות</small><button class="example" data-query="עצה דומה">איפה כבר נתתי עצה דומה?</button><button class="example" data-query="גבול משפחה">מקרים על גבולות מול המשפחה</button></div></section><section class="stats"><div class="stat"><span>פגישות במאגר</span><strong>${data.meetings.length}</strong><em>מתוכן 3 החודש</em></div><div class="stat"><span>אנשים</span><strong>${data.people.length}</strong><em>תיקים פעילים</em></div><div class="stat"><span>עקרונות שזוהו</span><strong>${data.principles.length}</strong><em>נבנים עם הזמן</em></div><div class="stat"><span>מעקבים פתוחים</span><strong>${data.followups.filter(f=>!f.done).length}</strong><em>דורשים תשומת לב</em></div></section><div class="grid-two"><section><div class="section-head"><h2>פגישות אחרונות</h2><button data-route="recordings">לכל ההקלטות ←</button></div><div class="panel">${data.meetings.slice(0,3).map(meetingCard).join('')}</div></section><section><div class="section-head"><h2>מעקבים קרובים</h2><button data-route="followups">לכל המעקבים ←</button></div><div class="panel">${data.followups.filter(f=>!f.done).slice(0,3).map(followCard).join('')||'<div class="empty"><strong>הכול טופל</strong>אין מעקבים פתוחים.</div>'}</div></section></div>`}
function recordings(){return `<div class="page-tools"><input id="filter-recordings" placeholder="חיפוש בהקלטות…"><button class="button primary" id="inline-import">＋ תמלול חדש</button></div><div class="panel" id="recordings-list">${data.meetings.map(meetingCard).join('')}</div>`}
function people(){return `<div class="page-tools"><input id="filter-people" placeholder="חיפוש אדם…"></div><div class="panel" id="people-list">${data.people.map(p=>`<article class="person-row row-between"><div><strong>${esc(p.name)}</strong><div class="meta">נושא מרכזי: ${esc(p.topic)}</div></div><div><span class="pill">${p.meetings} פגישות</span><div class="meta" style="margin-top:7px">אחרונה: ${p.last}</div></div></article>`).join('')}</div>`}
function principles(){return `<div class="panel">${data.principles.map(p=>`<article class="principle"><div class="meeting-top"><div><h3>✦ ${esc(p.title)}</h3><span class="meta">הופיע ב־${p.uses} מקרים · ${p.positive} תוצאות חיוביות</span></div><span class="pill gold">ביטחון ${p.confidence}%</span></div><p>${esc(p.description)}</p></article>`).join('')}</div>`}
function followups(){return `<div class="panel">${data.followups.map(followCard).join('')}</div>`}
function searchView(q=''){const query=q.trim().toLowerCase();const results=query?data.meetings.filter(m=>JSON.stringify(m).toLowerCase().includes(query.split(' ')[0])):[];return `<form class="page-tools" id="full-search"><input name="q" value="${esc(q)}" placeholder="חיפוש חופשי בכל הידע…" autofocus><button class="button primary">חיפוש</button></form>${query?`<div class="result-count">נמצאו ${results.length} תוצאות ל„${esc(q)}”</div><div class="panel">${results.map(meetingCard).join('')||'<div class="empty"><strong>לא נמצאו תוצאות</strong>נסה ניסוח קצר יותר או מילה מרכזית.</div>'}</div>`:`<div class="panel empty"><strong>הידע שלך, בשפה חופשית</strong>אפשר לחפש אדם, בעיה, עצה, החלטה או תוצאה.</div>`}`}

function render(search=''){if(!nav.includes(route))route='home';document.getElementById('desktop-nav').innerHTML=navHtml();document.getElementById('mobile-nav').innerHTML=navHtml(true);document.getElementById('page-title').textContent=route==='home'?'בוקר טוב':labels[route];document.getElementById('eyebrow').textContent=route==='home'?'הידע שצברת, מוכן לעבודה':'מאגר הייעוץ';const views={home,recordings,people,principles,search:()=>searchView(search),followups};document.getElementById('view').innerHTML=views[route]();bind()}
function go(next,q=''){route=next;location.hash=next;render(q);window.scrollTo(0,0)}
function bind(){document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));document.querySelectorAll('[data-follow]').forEach(c=>c.onchange=()=>{const f=data.followups.find(x=>x.id===c.dataset.follow);f.done=c.checked;save();toast(c.checked?'המעקב הושלם':'המעקב נפתח מחדש')});document.getElementById('inline-import')?.addEventListener('click',openImport);document.getElementById('hero-search')?.addEventListener('submit',e=>{e.preventDefault();go('search',new FormData(e.target).get('q'))});document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>go('search',b.dataset.query));document.getElementById('full-search')?.addEventListener('submit',e=>{e.preventDefault();render(new FormData(e.target).get('q'))});document.getElementById('filter-recordings')?.addEventListener('input',e=>{document.getElementById('recordings-list').innerHTML=data.meetings.filter(m=>JSON.stringify(m).toLowerCase().includes(e.target.value.toLowerCase())).map(meetingCard).join('')});document.getElementById('filter-people')?.addEventListener('input',e=>{document.getElementById('people-list').innerHTML=data.people.filter(p=>p.name.includes(e.target.value)).map(p=>`<article class="person-row"><strong>${esc(p.name)}</strong><div class="meta">${esc(p.topic)} · ${p.meetings} פגישות</div></article>`).join('')})}
function openImport(){const form=document.getElementById('import-form');form.reset();form.elements.date.value=new Date().toISOString().slice(0,10);document.getElementById('import-dialog').showModal()}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}

document.getElementById('new-transcript').onclick=openImport;
document.getElementById('file-input').onchange=async e=>{const file=e.target.files[0];if(file)document.querySelector('[name=transcript]').value=await file.text()};
document.getElementById('import-form').onsubmit=e=>{const submitter=e.submitter;if(submitter?.value==='cancel')return;e.preventDefault();const fd=new FormData(e.target);const transcript=fd.get('transcript').trim();const person=fd.get('person').trim();const sentences=transcript.split(/[.!?\n]+/).filter(Boolean);const advice=sentences.find(s=>/המלצ|סיכמ|כדאי|צריך/.test(s))||sentences[0]||'תמלול חדש נשמר';const meeting={id:crypto.randomUUID(),title:fd.get('title'),person,date:fd.get('date'),transcript,summary:advice.trim(),tags:[/גבול/.test(transcript)?'גבולות':'תמלול חדש']};data.meetings.unshift(meeting);let p=data.people.find(x=>x.name===person);if(p){p.meetings++;p.last=formatDate(meeting.date)}else data.people.unshift({name:person,meetings:1,last:formatDate(meeting.date),topic:meeting.tags[0]});if(/מעקב|בפגישה הבאה|לבדוק/.test(transcript))data.followups.unshift({id:crypto.randomUUID(),person,title:'מעקב בעקבות '+meeting.title,due:meeting.date,done:false});save();document.getElementById('import-dialog').close();toast('התמלול נותח ונשמר');go('recordings')};
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(next&&next!==route){route=next;render()}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
if(document.modelContext?.registerTool){
  const register=tool=>Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});
  register({
    name:'search_consulting_knowledge',title:'חיפוש במאגר הייעוץ',
    description:'חיפוש בפגישות השמורות לפי אדם, נושא, עצה או תוכן התמלול.',
    inputSchema:{type:'object',properties:{query:{type:'string',minLength:1}},required:['query'],additionalProperties:false},
    annotations:{readOnlyHint:true,untrustedContentHint:true},
    execute({query}){if(typeof query!=='string'||!query.trim())throw new Error('נדרש ביטוי חיפוש');const q=query.trim().toLowerCase();const results=data.meetings.filter(m=>JSON.stringify(m).toLowerCase().includes(q)).map(({id,title,person,date,summary})=>({id,title,person,date,summary}));go('search',query);return{count:results.length,results}}
  });
  register({
    name:'create_follow_up',title:'יצירת מעקב',
    description:'יצירת משימת מעקב חדשה עבור אדם במאגר ועדכון מסך המעקבים.',
    inputSchema:{type:'object',properties:{person:{type:'string',minLength:1},title:{type:'string',minLength:1},due:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'}},required:['person','title','due'],additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(input){if(!input||typeof input.person!=='string'||typeof input.title!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(input.due))throw new Error('נתוני המעקב אינם תקינים');const item={id:crypto.randomUUID(),person:input.person.trim(),title:input.title.trim(),due:input.due,done:false};data.followups.unshift(item);save();go('followups');return{id:item.id,status:'created'}}
  });
}
render();
