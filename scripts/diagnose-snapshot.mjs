// Diagnose a server snapshot against the site's own analysis, printing statistics only.
// Never prints transcript text. Usage: node scripts/diagnose-snapshot.mjs <snapshot.json> [dist/app.js]
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const [snapPath,appPath=new URL('../dist/app.js',import.meta.url)]=process.argv.slice(2);
if(!snapPath){console.error('usage: node scripts/diagnose-snapshot.mjs <snapshot.json> [app.js]');process.exit(2)}

const el=()=>({innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},
  setAttribute(){},getAttribute(){return null},addEventListener(){},removeEventListener(){},querySelector:()=>el(),querySelectorAll:()=>[],
  showModal(){},close(){},focus(){},scrollIntoView(){},closest:()=>null});
const els={},store={};
const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
const win={addEventListener(){},scrollTo(){},matchMedia:()=>({matches:false}),location:{hash:''}};
const sb={window:win,location:win.location,localStorage:ls,sessionStorage:ls,navigator:{},console,
  document:{getElementById:id=>els[id]||(els[id]=el()),querySelector:()=>el(),querySelectorAll:()=>[],addEventListener(){},documentElement:{dataset:{}},activeElement:{tagName:'BODY'}},
  crypto:{randomUUID:()=>Math.random().toString(36).slice(2)},matchMedia:win.matchMedia,setTimeout,clearTimeout,setInterval:()=>0,Intl,URL,Promise,structuredClone};
sb.globalThis=sb;vm.createContext(sb);
vm.runInContext(readFileSync(appPath,'utf8'),sb,{filename:'app.js'});
const app=sb.window.__consulting;

const raw=JSON.parse(readFileSync(snapPath,'utf8'));
const recs=Array.isArray(raw.recordings)?raw.recordings:[];
const ids=recs.map(r=>r.id),dupIds=ids.length-new Set(ids).size;
const dupTranscripts=recs.length-new Set(recs.map(r=>r.transcript)).size;
const snap=app.normalizeSnapshot(raw,null);
let segs=0,adv=0,advEmpty=0,advDupText=0,withReason=0,sameReason=0,labelled=0;
const labels=new Map(),perRec=[];
for(const m of snap.meetings){
  const an=app.analyzeTranscript(m.transcript);
  segs+=an.segments.length;
  if(an.speakers.length)labelled++;
  for(const s of an.speakers)labels.set(s,(labels.get(s)||0)+1);
  const texts=new Set(),reasons=new Map();
  for(const a of an.advice){
    adv++;
    if(!a.text||!a.text.trim())advEmpty++;
    if(texts.has(a.text))advDupText++;texts.add(a.text);
    const r=app.reasonFor(an,a);
    if(r){withReason++;reasons.set(r.text,(reasons.get(r.text)||0)+1)}
  }
  for(const n of reasons.values())if(n>1)sameReason+=n-1;
  perRec.push({id:m.id,date:m.date,segments:an.segments.length,advice:an.advice.length,speakers:an.speakers.length});
}
perRec.sort((a,b)=>b.advice-a.advice);
const out={
  contract:raw.contract,recordingsInSnapshot:recs.length,recordingsAccepted:snap.meetings.length,
  duplicateIds:dupIds,duplicateTranscripts:dupTranscripts,
  segments:segs,advice:adv,adviceEmptyText:advEmpty,adviceDuplicateTextWithinRecording:advDupText,
  adviceWithReason:withReason,reasonReusedWithinRecording:sameReason,
  recordingsWithSpeakerLabels:labelled,
  speakerLabels:[...labels].sort((a,b)=>b[1]-a[1]).slice(0,15).map(([k,n])=>({label:k,recordings:n})),
  topRecordingsByAdvice:perRec.slice(0,5),
  firstLineShapes:[...new Set(recs.slice(0,5).flatMap(r=>String(r.transcript||'').split('\n').slice(0,3)
    .map(l=>l.replace(/[֐-׿]+/g,'א').replace(/[A-Za-z]+/g,'a').replace(/\d/g,'9').slice(0,60))))]
};
console.log(JSON.stringify(out,null,2));
