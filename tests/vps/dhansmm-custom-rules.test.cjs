const{test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const helpers=fs.readFileSync(require('node:path').join(__dirname,'dhansmm-custom-rules.js'),'utf8');const ctx={tc:{views:{label:'Views',icon:'Eye'}},bx:{views:100}};vm.createContext(ctx);vm.runInContext(helpers,ctx);
test('custom reach uses views pattern',()=>assert.equal(ctx.dhanPatternType('custom_reach'),'views'));
test('built-in comments retain their pattern',()=>assert.equal(ctx.dhanPatternType('comments'),'comments'));
test('custom comments remain comment mode',()=>assert.equal(ctx.dhanPatternType('custom_comments'),'custom_comments'));
test('duplicate service names receive a distinct key',()=>assert.equal(ctx.dhanCustomKey('Reach + Impressions',new Set(['custom_reach_impressions'])),'custom_reach_impressions_2'));
test('custom name and uploaded icon are registered',()=>{ctx.dhanRegisterCustom([{engagement_type:'custom_reach',custom_label:'Reach',custom_icon_url:'data:image/png;base64,abc'}]);assert.equal(ctx.tc.custom_reach.label,'Reach');assert.equal(ctx.tc.custom_reach.iconUrl,'data:image/png;base64,abc');assert.equal(ctx.bx.custom_reach,50)});

test('dhansmm impression custom defaults to 50 percent, others to 100',()=>{ctx.dhanRegisterCustom([{engagement_type:'custom_reach_impressions',custom_label:'Reach + Impressions'},{engagement_type:'custom_profile_visits',custom_label:'Profile Visits'}]);assert.equal(ctx.bx.custom_reach_impressions,50);assert.equal(ctx.bx.custom_profile_visits,100)});
