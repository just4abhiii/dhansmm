function dhanCustomType(t){return typeof t==="string"&&t.startsWith("custom_")&&t!=="custom_comments"}
function dhanPatternType(t){return dhanCustomType(t)?"views":t}
function dhanCustomKey(label,existing){const base="custom_"+(label.trim().toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")||"service");let key=base,n=2;while(existing.has(key))key=base+"_"+n++;return key}
function dhanRegisterCustom(items){for(const item of items||[]){const t=item.engagement_type;if(!dhanCustomType(t))continue;tc[t]={...tc.views,label:item.custom_label||t.slice(7).replace(/_/g," "),emoji:"",iconUrl:item.custom_icon_url||null};bx[t]=/impression|reach/.test(t)?50:100}}
