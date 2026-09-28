#!/usr/bin/env node
// Speaker-label survey across all recordings: how is the consultant labelled?
// Reads every transcript from the site API (read-only), runs the site's own analysis on it,
// and prints counts only. No transcript text, no names other than speaker labels.
//
// Usage: NITZOTZA_PASS=... node scripts/speaker-survey.mjs [--server http://100.83.186.78:3000] [--user nitzotza]
import http from 'node:http';
import https from 'node:https';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?process.argv[i+1]:d};
const server=arg('server','http://100.83.186.78:3000').replace(/\/$/,''),user=arg('user','nitzotza'),pass=process.env.NITZOTZA_PASS||'';
if(!pass){console.error('Set NITZOTZA_PASS (the site password) in the environment.');process.exit(2)}
const auth='Basic '+Buffer.from(user+':'+pass).toString('base64');
const get=url=>new Promise((res,rej)=>{const u=new URL(url);(u.protocol==='https:'?https:http).get(u,{headers:{Authorization:auth,Accept:'application/json'}},r=>{const c=[];r.on('data',d=>c.push(d));r.on('end',()=>r.statusCode===200?res(JSON.parse(Buffer.concat(c).toString('utf8'))):rej(new Error('HTTP '+r.statusCode)))}).on('error',rej)});

// load the site's analysis code, exactly as the browser runs it
const el=()=>({innerHTML:'',textContent:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){},contains:()=>false},setAttribute(){},getAttribute(){return null},addEventListener(){},removeEventListener(){},querySelector:()=>el(),querySelectorAll:()=>[],showModal(){},close(){},focus(){},scrollIntoView(){},closest:()=>null});
const store={},ls={getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},removeItem(){}},win={addEventListener(){},scrollTo(){},matchMedia:()=>({matches:false}),location:{hash:''}};
const sb={window:win,location:win.location,localStorage:ls,sessionStorage:ls,navigator:{},console,document:{getElementById:()=>el(),querySelector:()=>el(),querySelectorAll:()=>[],addEventListener(){},documentElement:{dataset:{}},activeElement:{tagName:'BODY'}},crypto:{randomUUID:()=>'x'},matchMedia:win.matchMedia,setTimeout,clearTimeout,setInterval:()=>0,Intl,URL,Promise,structuredClone};
sb.globalThis=sb;vm.createContext(sb);vm.runInContext(readFileSync(new URL('../dist/app.js',import.meta.url),'utf8'),sb);
const app=sb.window.__consulting;

const items=[];let total=Infinity;
while(items.length<total){const p=await get(`${server}/api/site/recordings?offset=${items.length}&limit=100`);total=p.total;if(!p.items?.length)break;items.push(...p.items)}
const inc=(m,k,n=1)=>m.set(k,(m.get(k)||0)+n);
const labelRecs=new Map(),consultant=new Map(),firstSpeaker=new Map(),combos=new Map(),speakerCount=new Map();
let withLabels=0,noLabels=0,explicitConsultant=0,inferred=0,none=0,failed=0,done=0;
for(const it of items){
  if(!it.hasTranscript)continue;
  try{
    const d=await get(`${server}/api/site/recordings/${encodeURIComponent(it.id)}`);
    const an=app.analyzeTranscript(d.transcript||'');
    const labels=an.speakers||[];
    if(labels.length)withLabels++;else noLabels++;
    inc(speakerCount,String(labels.length));
    for(const l of labels)inc(labelRecs,l);
    inc(combos,[...labels].sort().join(' + ')||'(no labels)');
    const first=an.segments.find(s=>s.speaker)?.speaker;if(first)inc(firstSpeaker,first);
    if(an.consultant){inc(consultant,(an.consultant.labels||[an.consultant.label]).join(' + ')+(an.consultant.inferred?' (inferred)':' (label)'));an.consultant.inferred?inferred++:explicitConsultant++}else none++;
  }catch{failed++}
  if(++done%50===0)console.log(`...${done}`);
}
const top=(m,n=15)=>[...m].sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k,v])=>`  ${v}\t${k}`).join('\n');
console.log(`\nrecordings: ${items.length}, analysed: ${done-failed}, failed: ${failed}`);
console.log(`with speaker labels: ${withLabels}, without: ${noLabels}`);
console.log(`consultant found by label (הרב/היועץ/name): ${explicitConsultant}, inferred from advice: ${inferred}, not found: ${none}`);
console.log(`\nspeaker labels (number of recordings where each appears):\n${top(labelRecs)}`);
console.log(`\nwho the site takes as consultant:\n${top(consultant)}`);
console.log(`\nfirst labelled speaker in the recording:\n${top(firstSpeaker)}`);
console.log(`\nlabel combinations:\n${top(combos,10)}`);
console.log(`\nnumber of distinct speakers per recording:\n${top(speakerCount)}`);
