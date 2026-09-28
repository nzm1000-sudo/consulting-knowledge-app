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
//            --model <LM Studio model id>  --out ~/nitzotza/knowledge  --limit N  --ids id1,id2
//            --since YYYY-MM-DD  --force  --chunk 9000  --max-tokens 8000  --think (allow the model's thinking phase)
import http from 'node:http';
import https from 'node:https';
import {createHash} from 'node:crypto';
import {mkdirSync,existsSync,readFileSync,writeFileSync,chmodSync,unlinkSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';

const PROMPT_VERSION='k5';
const arg=(k,d)=>{const i=process.argv.indexOf('--'+k);return i>0?(process.argv[i+1]??true):d};
const opt={
  server:arg('server','http://100.83.186.78:3000').replace(/\/$/,''),
  user:arg('user','nitzotza'),pass:process.env.NITZOTZA_PASS||'',
  lm:arg('lm','http://127.0.0.1:1234').replace(/\/$/,''),model:arg('model','dictalm-3.0-24b-thinking'),
  out:String(arg('out',join(homedir(),'nitzotza','knowledge'))).replace(/^~/,homedir()),
  limit:+arg('limit',0)||0,ids:arg('ids','')?String(arg('ids','')).split(','):null,since:arg('since',''),force:process.argv.includes('--force'),
  chunkChars:+arg('chunk',9000)||9000,maxTokens:+arg('max-tokens',8000)||8000,think:process.argv.includes('--think')
};
if(!opt.pass){console.error('Set NITZOTZA_PASS (the site password) in the environment.');process.exit(2)}
mkdirSync(opt.out,{recursive:true,mode:0o700});
const partialDir=join(opt.out,'.partial');mkdirSync(partialDir,{recursive:true,mode:0o700});

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
- reasoning: הנימוק של היועץ לעצה מסוימת. adviceIndex: מספר הפריט של העצה ברשימה שלך (מתחיל מ־0). בכל פריט אחר adviceIndex הוא -1.
- outcome: מה העצה אמורה להשיג, כפי שנאמר.
- result: מה קרה בפועל בעקבות עצה קודמת, כפי שהפונה מדווח.
- followup: התחייבות מפורשת לחזור לנושא או לבדוק אותו בהמשך.
- principle: עיקרון כללי שהיועץ מנסח, שמתאים גם למקרים אחרים.
כללים מחייבים:
1. quote הוא העתקה מדויקת, מילה במילה, מתוך שורה אחת בלבד של התמליל (דובר אחד). בלי תיקון, בלי קיצור באמצע, בלי חיבור של שני מקומות או שני דוברים.
2. אל תכלול: שאלות, ברכות, שלום ותודה, שיחת חולין, סיפורים ודוגמאות שאינם עצה, ציטוטים של אנשים אחרים.
3. advice ו־principle רק מדברי היועץ. problem ו־result בדרך כלל מדברי הפונה.
4. אם אינך בטוח, אל תכלול. עדיף מעט פריטים נכונים.
5. summary: תקציר של הפריט בעברית, עד 10 מילים, בלי מידע שלא נאמר.
6. consultant: תווית הדובר שהוא היועץ, כפי שהיא כתובה בתמליל. היועץ הוא הרב, ניצוצא שלום יוסף ברבי. בתמלילים הוא מסומן "היועץ", "הרב", בשמו המלא, או Speaker 1, ולפעמים Speaker 2. בהרבה תמלילים כל השיחה מסומנת "דובר" בלי הפרדה, ובתמלילים ארוכים אותו אדם מפוצל לכמה תוויות Speaker. לכן זהה אותו לפי התוכן: מי שמייעץ, מברך ומכוון, ולא לפי התווית.
7. הקלטה ארוכה יכולה להכיל כמה פגישות ברצף עם אנשים שונים. אל תחבר בעיה של אדם אחד לעצה שניתנה לאדם אחר.
החזר JSON בלבד, לפי המבנה.`;
// מבנה קשיח: כל השדות חובה, בלי null. adviceIndex = -1 כשאין עצה מקושרת.
const SCHEMA={type:'object',additionalProperties:false,properties:{consultant:{type:'string'},items:{type:'array',items:{type:'object',additionalProperties:false,properties:{
  type:{type:'string',enum:TYPES},quote:{type:'string'},summary:{type:'string'},adviceIndex:{type:'integer'}},required:['type','quote','summary','adviceIndex']}}},required:['consultant','items']};

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
let useSchema=true;
async function ask(chunk,part,parts){
  // מודלים כמו Qwen מדלגים על שלב החשיבה עם /no_think. זה מהיר פי כמה ומונע חשיבה שממלאת את כל הזיכרון.
  const user=`חלק ${part} מתוך ${parts} של התמליל:\n\n${chunk}${opt.think?'':'\n\n/no_think'}`;
  const payload={model:opt.model,temperature:0,max_tokens:opt.maxTokens,messages:[{role:'system',content:SYSTEM},{role:'user',content:user}]};
  if(useSchema)payload.response_format={type:'json_schema',json_schema:{name:'knowledge',strict:true,schema:SCHEMA}};
  let r=await request(opt.lm+'/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(r.status===400&&useSchema){
    // השרת לא קיבל את מבנה ה־JSON: ממשיכים בלי, ומפענחים את ה־JSON מהטקסט.
    useSchema=false;delete payload.response_format;
    console.log(`note: LM Studio rejected json_schema (${lmError(r.text)}); continuing without it`);
    r=await request(opt.lm+'/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }
  if(r.status!==200)throw new Error(`LM Studio ${r.status}: ${lmError(r.text)}`);
  const ch=JSON.parse(r.text).choices?.[0]||{};
  if(ch.finish_reason==='length')throw new Error('model reply cut off (max tokens); try --chunk 6000');
  return parseModelJSON(ch.message?.content);
}
// הודעת השגיאה של LM Studio בלבד, בלי תוכן מהתמליל
const lmError=t=>{try{const e=JSON.parse(t).error;return String(e?.message||e||'').replace(/[\u0590-\u05FF].*/,'').slice(0,160)}catch{return String(t).replace(/[\u0590-\u05FF].*/,'').slice(0,160)}};

async function listAll(){
  const items=[];let total=Infinity;
  while(items.length<total){const p=await api(`/api/site/recordings?offset=${items.length}&limit=100`);total=p.total;if(!p.items?.length)break;items.push(...p.items)}
  return items;
}

const t0=Date.now();
try{
  const models=JSON.parse((await request(opt.lm+'/v1/models')).text).data?.map(m=>m.id)||[];
  if(!models.includes(opt.model)){console.error(`model "${opt.model}" is not loaded in LM Studio. Loaded: ${models.join(', ')||'none'}. Use --model <one of these>.`);process.exit(2)}
}catch(e){console.error('LM Studio is not reachable at '+opt.lm+'. Start the server in LM Studio (Developer tab).');process.exit(2)}
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
    const parts=chunks(transcript);const s0=Date.now();
    console.log(`${r.id.slice(0,8)}: ${parts.length} parts`);
    // כל קטע נשמר מיד כשהוא מסתיים. אם המחשב קורס, ההרצה הבאה ממשיכה מהקטע הבא.
    const partialFile=join(partialDir,r.id+'.json');
    let partial={sha,promptVersion:PROMPT_VERSION,model:opt.model,chunkChars:opt.chunkChars,done:[]};
    try{const p=JSON.parse(readFileSync(partialFile,'utf8'));if(p.sha===sha&&p.promptVersion===PROMPT_VERSION&&p.model===opt.model&&p.chunkChars===opt.chunkChars)partial=p}catch{}
    for(let i=partial.done.length;i<parts.length;i++){
      const c0=Date.now();
      const res=await ask(parts[i],i+1,parts.length);
      partial.done.push({consultant:res.consultant||'',items:res.items||[]});
      writeFileSync(partialFile,JSON.stringify(partial),{mode:0o600});
      console.log(`  ${r.id.slice(0,8)} part ${i+1}/${parts.length}: ${(res.items||[]).length} items, ${Math.round((Date.now()-c0)/1000)}s`);
    }
    const all=[];let consultant='';
    for(const d of partial.done){consultant=consultant||d.consultant;const base=all.length;
      for(const it of d.items)all.push({...it,adviceIndex:Number.isInteger(it.adviceIndex)&&it.adviceIndex>=0?it.adviceIndex+base:null})}
    // ציטוט חייב להופיע בתוך שורה אחת של התמליל: דובר אחד, בלי לחבר קטעים.
    const lines=transcript.split('\n').map(norm);const seen=new Set();const items=[];let dropped=0;const remap=new Map();
    all.forEach((it,n)=>{
      const q=String(it.quote||'').trim();const nq=norm(q);const k=it.type+'|'+nq;
      const isQuestion=/\?\s*$/.test(q)&&['advice','principle','reasoning'].includes(it.type);
      if(!TYPES.includes(it.type)||nq.length<6||isQuestion||!lines.some(l=>l.includes(nq))||seen.has(k)){dropped++;return}
      seen.add(k);remap.set(n,items.length);items.push({type:it.type,quote:q,summary:String(it.summary||'').trim().slice(0,140),adviceIndex:it.adviceIndex});
    });
    for(const it of items)it.adviceIndex=Number.isInteger(it.adviceIndex)&&remap.has(it.adviceIndex)?remap.get(it.adviceIndex):null;
    const out={contract:'nitzotza.knowledge.v1',id:r.id,model:opt.model,promptVersion:PROMPT_VERSION,transcriptSha256:sha,generatedAt:new Date().toISOString(),consultant,seconds:Math.round((Date.now()-s0)/1000),kept:items.length,dropped,items};
    writeFileSync(file,JSON.stringify(out),{mode:0o600});chmodSync(file,0o600);
    try{unlinkSync(partialFile)}catch{}
    stats.done++;stats.kept+=items.length;stats.dropped+=dropped;
    console.log(`${r.id}: parts ${parts.length}, kept ${items.length}, dropped ${dropped}, ${out.seconds}s`);
  }catch(e){stats.failed++;console.log(`${r.id}: failed (${String(e.message).slice(0,80)})`)}
}
console.log(`done ${stats.done}, skipped ${stats.skipped}, failed ${stats.failed}, kept ${stats.kept}, dropped ${stats.dropped}, total ${Math.round((Date.now()-t0)/60000)} min`);
