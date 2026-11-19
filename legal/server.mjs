import http from "node:http";import fs from "node:fs";import crypto from "node:crypto";
import { isPanelAdmin } from './panel-auth.mjs';
const D="/var/www/dhansmm/legal-data";fs.mkdirSync(D,{recursive:true});
const PASS=fs.readFileSync(D+"/.admin_pass","utf8").trim();
const TG=process.env.TELEGRAM_BOT_TOKEN,CHAT=process.env.TELEGRAM_ADMIN_CHAT_ID;
const rd=f=>{try{return fs.readFileSync(D+"/"+f,"utf8").split("\n").filter(Boolean).map(l=>JSON.parse(l))}catch{return[]}};
const ap=(f,o)=>fs.appendFileSync(D+"/"+f,JSON.stringify(o)+"\n");
const s=(v,n)=>String(v??"").slice(0,n);
const hits=new Map();
const settings=()=>{try{return JSON.parse(fs.readFileSync(D+"/settings.json","utf8")).enabled!==false}catch{return true}};
function send(res,c,o){res.writeHead(c,{"Content-Type":"application/json","Cache-Control":"no-store"});res.end(JSON.stringify(o))}
http.createServer((req,res)=>{let b="";req.on("data",c=>{b+=c;if(b.length>20000)req.destroy()});req.on("end",async()=>{
 const ip=s(req.headers["x-real-ip"]||req.socket.remoteAddress,64),ua=s(req.headers["user-agent"],400),at=new Date().toISOString();
 let j={};try{j=b?JSON.parse(b):{}}catch{return send(res,400,{error:"bad json"})}
 const u=req.url.split("?")[0];
 if(req.method==="GET"&&u==="/legal-api/settings")return send(res,200,{enabled:settings()});
 const n=(hits.get(ip)||0)+1;hits.set(ip,n);if(n>60)return send(res,429,{error:"Too many requests"});
 if(u==="/legal-api/panel/settings"&&req.method==="POST"){
  if(!await isPanelAdmin(req.headers.authorization))return send(res,401,{error:"Admin login required"});
  if(typeof j.enabled!=="boolean")return send(res,400,{error:"enabled must be boolean"});
  fs.writeFileSync(D+"/settings.json.tmp",JSON.stringify({enabled:j.enabled,updated_at:at}),{mode:0o600});fs.renameSync(D+"/settings.json.tmp",D+"/settings.json");return send(res,200,{enabled:j.enabled});
 }
 if(req.method==="POST"&&u==="/legal-api/consent"){
  const ev=["signup","order","api_key"].includes(j.event)?j.event:"order";
  if(ev!=="api_key"&&!settings())return send(res,200,{ok:true,skipped:true});
  ap("consents.jsonl",{at,event:ev,email:s(j.email,200),page:s(j.page,200),text:s(j.text,1000),ip,ua});return send(res,200,{ok:true})}
 if(req.method==="POST"&&u==="/legal-api/report"){
  if(!j.reporter_name||!/^\S+@\S+\.\S+$/.test(j.reporter_email||"")||!j.target_link||!j.details)return send(res,400,{error:"Please fill all required fields"});
  const r={id:crypto.randomUUID().slice(0,8),at,status:"open",reporter_name:s(j.reporter_name,150),reporter_email:s(j.reporter_email,200),abuse_type:s(j.abuse_type,80),target_link:s(j.target_link,500),suspect_info:s(j.suspect_info,300),details:s(j.details,5000),ip,ua};
  ap("reports.jsonl",r);
  if(TG&&CHAT)fetch(`https://api.telegram.org/bot${TG}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:CHAT,text:`🚨 DhanSMM abuse report ${r.id}\n${r.abuse_type}\nFrom: ${r.reporter_name} <${r.reporter_email}>\nTarget: ${r.target_link}\nSuspect: ${r.suspect_info}\n\n${r.details.slice(0,1500)}`})}).catch(()=>{});
  return send(res,200,{ok:true,id:r.id})}
 if(u.startsWith("/legal-api/admin/")){
  const p=s(req.headers["x-admin-pass"],200);
  if(p.length!==PASS.length||!crypto.timingSafeEqual(Buffer.from(p),Buffer.from(PASS)))return send(res,401,{error:"unauthorized"});
  if(u==="/legal-api/admin/settings"&&req.method==="POST"){
   if(typeof j.enabled!=="boolean")return send(res,400,{error:"enabled must be boolean"});
   fs.writeFileSync(D+"/settings.json.tmp",JSON.stringify({enabled:j.enabled,updated_at:at}),{mode:0o600});fs.renameSync(D+"/settings.json.tmp",D+"/settings.json");return send(res,200,{enabled:j.enabled});
  }
  if(u==="/legal-api/admin/data")return send(res,200,{enabled:settings(),reports:rd("reports.jsonl").reverse(),consents:rd("consents.jsonl").slice(-300).reverse()});
  if(u==="/legal-api/admin/status"&&["resolved","blacklisted","open"].includes(j.status)){
   const all=rd("reports.jsonl").map(r=>r.id===j.id?{...r,status:j.status}:r);fs.writeFileSync(D+"/reports.jsonl",all.map(x=>JSON.stringify(x)).join("\n")+"\n");return send(res,200,{ok:true})}
 }
 send(res,404,{error:"not found"})})}).listen(8093,"127.0.0.1");
setInterval(()=>hits.clear(),60000);
