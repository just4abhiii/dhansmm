(function(){
var TXT="I strictly accept the Terms of Service, Privacy Policy, and Anti-Fraud Policy. I legally certify that I am the authorized owner or have permission for the target link, I am NOT using this service to defraud any company/brand or conduct spam/botting attacks, and I accept 100% sole legal, civil, and criminal responsibility for this order.";
var consentEnabled=true;
function required(ev){return ev==="api_key"||consentEnabled}
async function refreshSetting(){try{var r=await fetch("/legal-api/settings",{cache:"no-store"});if(r.ok){var d=await r.json();consentEnabled=d.enabled!==false;scan()}}catch(e){}}
var STATIC=["/terms","/privacy","/refund","/report-abuse"];
function email(){try{for(var i=0;i<localStorage.length;i++){var v=localStorage.getItem(localStorage.key(i));var m=v&&v.match(/"email":"([^"]+@[^"]+)"/);if(m)return m[1]}}catch(e){}var f=document.querySelector('input[type=email]');return f?f.value:""}
function log(ev){try{fetch("/legal-api/consent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:ev,email:email(),page:location.pathname,text:TXT}),keepalive:true})}catch(e){}}
function kind(b){var t=(b.innerText||"").trim().toLowerCase(),p=location.pathname;
 if(b.type==="submit"&&/create|sign ?up|register|get started|join/.test(t)&&!/sign ?in|log ?in/.test(t))return "signup";
 if(/^\/api/.test(p)&&/(generate|create|new|regenerate).*key|key/.test(t))return "api_key";
 if(!/^\/(admin|auth)/.test(p)&&b.closest("form,[role=dialog],main")&&/(place|submit|confirm|create|start)\s*(the\s*)?order|order now|buy now|^order$/.test(t))return "order";return null}
function box(ev){var l=document.createElement("label");l.className="dhan-legal";l.setAttribute("data-ev",ev);
 l.style.cssText="display:flex;gap:10px;align-items:flex-start;margin:10px 0;padding:10px 12px;border:1px solid rgba(220,38,38,.35);background:rgba(220,38,38,.06);border-radius:10px;font-size:12px;line-height:1.55;color:inherit;text-align:left;cursor:pointer";
 l.innerHTML='<input type="checkbox" style="margin-top:2px;width:28px;height:28px;flex-shrink:0;cursor:pointer;accent-color:#16a34a" aria-label="Accept legal terms"><span>I strictly accept the <a href="/terms" target="_blank" style="text-decoration:underline;font-weight:600">Terms of Service</a>, <a href="/privacy" target="_blank" style="text-decoration:underline;font-weight:600">Privacy Policy</a>, and <a href="/terms" target="_blank" style="text-decoration:underline;font-weight:600">Anti-Fraud Policy</a>. I legally certify that I am the authorized owner or have permission for the target link, I am NOT using this service to defraud any company/brand or conduct spam/botting attacks, and I accept 100% sole legal, civil, and criminal responsibility for this order.</span><span class="dhan-err" style="display:none"></span>';return l}
function panelControl(){
 var old=document.getElementById("dhan-legal-admin-link");if(old)old.remove();
 var panel=document.getElementById("dhan-legal-panel-control");
 if(!/^\/admin\/?$/.test(location.pathname)){if(panel)panel.remove();return}
 if(!panel){
  var heading=[].find.call(document.querySelectorAll("h3"),function(h){return h.textContent.trim()==="Maintenance Mode"});
  if(!heading)return;
  var maintenance=heading.closest('.admin-card');if(!maintenance)return;
  panel=document.createElement("div");panel.id="dhan-legal-panel-control";panel.className="rounded-xl border-2 border-sky-200 bg-white shadow-sm p-5 sm:p-6";
  panel.innerHTML='<div class="flex flex-col sm:flex-row sm:items-center gap-4"><div class="flex items-center gap-4 flex-1 min-w-0"><div class="text-sky-600 shrink-0"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7z"/><path d="M12 8v5m0 3h.01"/></svg></div><div><h3 class="text-lg font-bold text-slate-900">Signup &amp; Order Legal Declaration</h3><p data-note class="text-sm text-slate-600"></p><p data-error role="alert" class="text-sm text-red-700" hidden></p></div></div><div class="flex items-center gap-3"><span data-state class="text-sm font-medium text-slate-600"></span><button type="button" role="switch" aria-label="Signup and order legal declaration" class="inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:opacity-50"><span data-thumb class="block h-6 w-6 rounded-full bg-white shadow-sm transition-transform"></span></button></div></div>';
  maintenance.after(panel);
  panel.querySelector('button').addEventListener('click',async function(){
   var btn=this,error=panel.querySelector('[data-error]');btn.disabled=true;error.hidden=true;
   try{var token=localStorage.getItem('dhansmm_jwt');var response=await fetch('/legal-api/panel/settings',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(token||'')},body:JSON.stringify({enabled:!consentEnabled})});var data=await response.json();if(!response.ok)throw new Error(data.error||'Could not save setting');consentEnabled=data.enabled!==false;scan()}
   catch(e){error.textContent=e.message;error.hidden=false}finally{btn.disabled=false}
  });
 }
 var button=panel.querySelector('button');button.setAttribute('aria-checked',String(consentEnabled));button.classList.toggle('bg-sky-600',consentEnabled);button.classList.toggle('bg-slate-300',!consentEnabled);
 panel.querySelector('[data-thumb]').classList.toggle('translate-x-5',consentEnabled);
 var state=consentEnabled?'ON':'OFF',note=consentEnabled?'ON — legal checkbox and declaration required':'OFF — no checkbox or declaration at signup and checkout';
 if(panel.querySelector('[data-state]').textContent!==state)panel.querySelector('[data-state]').textContent=state;
 if(panel.querySelector('[data-note]').textContent!==note)panel.querySelector('[data-note]').textContent=note;
}
function scan(){
 panelControl();
document.querySelectorAll("button").forEach(function(b){var ev=kind(b);if(ev&&!required(ev))ev=null;if(b.__box&&(!ev||!document.contains(b.__box))){b.__box.remove();var m=b.parentNode&&b.parentNode.querySelector(".dhan-msg");if(m)m.remove();b.__box=null}if(ev&&!b.__box){var l=box(ev);b.__box=l;b.parentNode.insertBefore(l,b)}});
 document.querySelectorAll("footer").forEach(function(f){if(f.__dl)return;f.__dl=1;var d=document.createElement("div");d.style.cssText="font-size:12px;opacity:.75;margin-top:14px;text-align:center;line-height:1.6";
 d.innerHTML='DhanSMM is an automated technical intermediary (IT Act 2000, Sec. 79). Users are solely responsible for their orders. Misuse is logged and reported to authorities. &nbsp;<a href="/report-abuse" style="text-decoration:underline">Report Abuse</a> · <a href="mailto:dhansmmofficial@gmail.com" style="text-decoration:underline">dhansmmofficial@gmail.com</a>';f.appendChild(d)})}
function guard(e){var b=e.target.closest&&e.target.closest("button");if(e.type==="submit"){b=e.submitter||(e.target.querySelector&&[].find.call(e.target.querySelectorAll("button"),function(x){return x.__box}))}
 if(!b||!b.__box||!document.contains(b.__box)||!required(b.__box.getAttribute("data-ev")))return;var c=b.__box.querySelector("input");
 if(!c.checked){e.preventDefault();e.stopImmediatePropagation();b.__box.style.borderColor="#dc2626";b.__box.style.background="rgba(220,38,38,.14)";
  var m=b.__box.querySelector(".dhan-err");m.style.cssText="display:block;color:#dc2626;font-weight:700";if(!b.__box.querySelector(".dhan-msg")){var p=document.createElement("div");p.className="dhan-msg";p.style.cssText="color:#dc2626;font-weight:700;font-size:12px;margin-top:-4px;margin-bottom:8px";p.textContent="Please tick the legal declaration above to continue.";b.__box.after(p)}else{}b.__box.scrollIntoView({block:"center",behavior:"smooth"});return}
 if(e.type==="click"||!b.__logged){b.__logged=Date.now();log(b.__box.getAttribute("data-ev"));setTimeout(function(){b.__logged=0},1500)}}
document.addEventListener("click",guard,true);document.addEventListener("submit",guard,true);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;var u;try{u=new URL(a.href)}catch(x){return}
 if(u.origin===location.origin&&STATIC.indexOf(u.pathname)>=0&&!a.target){e.preventDefault();e.stopImmediatePropagation();location.href=u.pathname}},true);
function chk(){if(STATIC.indexOf(location.pathname)>=0&&!document.querySelector("meta[name=dhan-static]"))location.reload()}
["pushState","replaceState"].forEach(function(k){var o=history[k];history[k]=function(){var r=o.apply(this,arguments);setTimeout(chk,0);return r}});window.addEventListener("popstate",chk);
var T;new MutationObserver(function(){clearTimeout(T);T=setTimeout(scan,60)}).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener("DOMContentLoaded",scan);refreshSetting();setInterval(refreshSetting,15000);window.addEventListener("focus",refreshSetting);
})();
