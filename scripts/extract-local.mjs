#!/usr/bin/env node
// Local AI extraction for the consulting site. Runs on the Mac, next to LM Studio.
// Reads recordings from the site API on the NAS (read-only), asks a local model for knowledge items,
// keeps only items whose quote appears verbatim in the transcript, and writes one JSON file per recording
// (contract nitzotza.knowledge.v1). It never modifies the NAS database or the canonical files.
// It prints counts only, never transcript or analysis text.
//
// Usage:
//   NITZOTZA_PASS=... node scripts/extract-local.mjs --limit 3
//   options: --server http://100.83.186.78:3000  --user nitzotza  --lm http://127.0.0.1:1234
//            --model dictalm-3.0-24b-thinking  --out ~/nitzotza/knowledge  --limit N  --ids id1,id2
//            --since YYYY-MM-DD  --force
import http from 'node:http';
import https from 'node:https';
import {createHash} from 'node:crypto';
import {mkdirSync,existsSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';

const PROMPT_VERSION='k1';
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?(process.argv[i+1]??true):d};
const opt={
  server:arg('server','http://100.83.186.78:3000').replace(/\/$/,''),
  user:arg('user','nitzotza'),pass:process.env.NITZOTZA_PASS||'',
  lm:arg('lm','http://127.0.0.1:1234').replace(/\/$/,''),model:arg('model','dictalm-3.0-24b-thinking'),
  out:String(arg('out',join(homedir(),'nitzotza','knowledge'))).replace(/^~/,homedir()),
  limit:+arg('limit',0)||0,ids:arg('ids','')?String(arg('ids','')).split(','):null,since:arg('since',''),force:process.argv.includes('--force'),
  chunkChars:+arg('chunk',18000)||18000
};
if(!opt.pass){console.error('Set NITZOTZA_PASS (the site password) in the environment.');process.exit(2)}
mkdirSync(opt.out,{recursive:true,mode:0o700});

// HTTP without the 5-minute header timeout of fetch: a thinking model can take longer.
function request(url,{method='GET',headers={},body=null}={}){
  return new Promise((resolve,reject)=>{
    const u=new URL(url);const lib=u.protocol==='https:'?https:http;
    if(body)headers={...headers,'Content-Length':Buffer.byteLength(body)};
    const req=lib.request(u,{method,headers},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,text:Buffer.concat(chunks).toString('utf8')}))});
    req.setTimeout(0);req.on('error',reject);if(body)req.write(body);req.end();
  });
}
const auth='Basic '+Buffer.from(opt.user+':'+opt.pass).toString('base64');
async function api(path){
  const r=await request(opt.server+path,{headers:{Authorization:auth,Accept:'application/json'}});
  if(r.status!==200)throw new Error(`server ${r.status} for ${path.split('?')[0]}`);
  try{return JSON.parse(r.text)}catch{throw new Error(`server returned non-JSON (${r.text.length} chars)`)}
}

const TYPES=['problem','advice','reasoning','outcome','result','followup','principle'];
const SYSTEM=`אתה מנתח שיחות ייעוץ בעברית של רב ויועץ. תפקידך לחלץ ידע מקצועי מתוך התמליל, ורק ממנו.
סוגי פריטים:
- problem: הקושי או השאלה שהפונה מביא, במילים שלו.
- advice: עצה, המלצה או הנחיה מפורשת של היועץ לפונה.
- reasoning: הנימוק של היועץ לעצה מסוימת. חובה לציין adviceIndex: מספר הפריט של העצה ברשימה שלך (מתחיל מ־0).
- outcome: מה העצה אמורה להשיג, כפי שנאמר.
- result: מה קרה בפועל בעקבות עצה קודמת, כפי שהפונה מדווח.
- followup: התחייבות מפורשת לחזור לנושא או לבדוק אותו בהמשך.
- principle: עיקרון כללי שהיועץ מנסח, שמתאים גם למקרים אחרים.
כללים מחייבים:
1. quote הוא העתקה מדויקת, מילה במילה, של משפט או חלק רציף ממשפט בתמליל. בלי תיקון, בלי קיצור באמצע, בלי חיבור של שני מקומות.
2. אל תכלול: שאלות, ברכות, שלום ותודה, שיחת חולין, סיפורים ודוגמאות שאינם עצה, ציטוטים של אנשים אחרים.
3. advice ו־principle רק מדברי היועץ. problem ו־result בדרך כלל מדברי הפונה.
4. אם אינך בטוח, אל תכלול. עדיף מעט פריטים נכונים.
5. summary: תקציר של הפריט בעברית, עד 10 מילים, בלי מידע שלא נאמר.
6. consultant: תווית הדובר שהוא היועץ, כפי שהיא כתובה בתמליל.
החזר JSON בלבד, לפי המבנה.`;
const SCHEMA={type:'object',properties:{consultant:{type:'string'},items:{type:'array',items:{type:'object',properties:{
  type:{type:'string',enum:TYPES},quote:{type:'string'},summary:{type:'string'},adviceIndex:{type:['integer','null']}},required:['type','quote','summary']}}},required:['items']};

const norm=t=>String(t||'').replace(/[֑-ׇ]/g,'').replace(/[^֐-׿a-z0-9]+/gi,' ').trim();
function chunks(transcript){
  const lines=transcript.split('\n');const out=[];let cur=[],len=0;
  for(const l of lines){if(len+l.length>opt.chunkChars&&cur.length){out.push(cur.join('\n'));cur=cur.slice(-2);len=cur.join('\n').length}cur.push(l);len+=l.length+1}
  if(cur.length)out.push(cur.join('\n'));return out;
}
function parseModelJSON(text){
  const t=String(text||'').replace(/<think>[\s\S]*?<\/think>/g,'').trim();
  const a=t.indexOf('{'),b=t.lastIndexOf('}');if(a<0||b<a)throw new Error('no JSON in model reply');
  return JSON.parse(t.slice(a,b+1));
}
async function ask(chunk,part,parts){
  const body=JSON.stringify({model:opt.model,temperature:0,max_tokens:24000,
    messages:[{role:'system',content:SYSTEM},{role:'user',content:`חלק ${part} מתוך ${parts} של התמליל:\n\n${chunk}`}],
    response_format:{type:'json_schema',json_schema:{name:'knowledge',strict:true,schema:SCHEMA}}});
  const r=await request(opt.lm+'/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body});
  if(r.status!==200)throw new Error(`LM Studio ${r.status}`);
  const msg=JSON.parse(r.text).choices?.[0]?.message||{};
  return parseModelJSON(msg.content);
}

async function listAll(){
  const items=[];let total=Infinity;
  while(items.length<total){const p=await api(`/api/site/recordings?offset=${items.length}&limit=100`);total=p.total;if(!p.items?.length)break;items.push(...p.items)}
  return items;
}

const t0=Date.now();
let targets=(await listAll()).filter(r=>r.hasTranscript);
if(opt.ids)targets=targets.filter(r=>opt.ids.includes(r.id));
if(opt.since)targets=targets.filter(r=>r.date>=opt.since);
if(opt.limit)targets=targets.slice(0,opt.limit);
console.log(`recordings to consider: ${targets.length}`);
const stats={done:0,skipped:0,failed:0,kept:0,dropped:0};
for(const r of targets){
  const file=join(opt.out,r.id+'.json');
  try{
    const d=await api(`/api/site/recordings/${encodeURIComponent(r.id)}`);
    const transcript=d.transcript||'';const sha=createHash('sha256').update(transcript).digest('hex');
    if(!opt.force&&existsSync(file)){try{const old=JSON.parse(readFileSync(file,'utf8'));if(old.transcriptSha256===sha&&old.promptVersion===PROMPT_VERSION&&old.model===opt.model){stats.skipped++;continue}}catch{}}
    const parts=chunks(transcript);const all=[];let consultant='';const s0=Date.now();
    for(let i=0;i<parts.length;i++){
      const res=await ask(parts[i],i+1,parts.length);consultant=consultant||res.consultant||'';
      const base=all.length;
      for(const it of res.items||[])all.push({...it,adviceIndex:Number.isInteger(it.adviceIndex)?it.adviceIndex+base:null});
    }
    const full=norm(transcript);const seen=new Set();const items=[];let dropped=0;const remap=new Map();
    all.forEach((it,n)=>{
      const q=String(it.quote||'').trim();const k=it.type+'|'+norm(q);
      if(!TYPES.includes(it.type)||norm(q).length<6||!full.includes(norm(q))||seen.has(k)){dropped++;return}
      seen.add(k);remap.set(n,items.length);items.push({type:it.type,quote:q,summary:String(it.summary||'').trim().slice(0,140),adviceIndex:it.adviceIndex});
    });
    for(const it of items)it.adviceIndex=Number.isInteger(it.adviceIndex)&&remap.has(it.adviceIndex)?remap.get(it.adviceIndex):null;
    const out={contract:'nitzotza.knowledge.v1',id:r.id,model:opt.model,promptVersion:PROMPT_VERSION,transcriptSha256:sha,generatedAt:new Date().toISOString(),consultant,seconds:Math.round((Date.now()-s0)/1000),kept:items.length,dropped,items};
    writeFileSync(file,JSON.stringify(out),{mode:0o600});chmodSync(file,0o600);
    stats.done++;stats.kept+=items.length;stats.dropped+=dropped;
    console.log(`${r.id}: parts ${parts.length}, kept ${items.length}, dropped ${dropped}, ${out.seconds}s`);
  }catch(e){stats.failed++;console.log(`${r.id}: failed (${String(e.message).slice(0,80)})`)}
}
console.log(`done ${stats.done}, skipped ${stats.skipped}, failed ${stats.failed}, kept ${stats.kept}, dropped ${stats.dropped}, total ${Math.round((Date.now()-t0)/60000)} min`);
