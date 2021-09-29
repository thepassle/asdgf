const E=(s=Date.now())=>()=>(Date.now()-s).toFixed(2)+"ms";globalThis.QUEUE=[];function b(s){const t={tests:[],suiteOnly:!1,only:[],...s},a=(e,n)=>{t.tests.push({name:e,handler:n})};return a.only=(e,n)=>{t.only.push({name:e,handler:n})},a.skip=(e,n)=>{t.tests.push({name:e,handler:()=>({skipped:!0})})},{suite:t,it:a,before:e=>{t.before=e},beforeEach:e=>{t.beforeEach=e},after:e=>{t.after=e},afterEach:e=>{t.afterEach=e}}}function y(s,t,a={}){const{suite:r,it:c,before:l,beforeEach:u,after:e,afterEach:n}=b({name:s,...a});QUEUE.push(r),t({it:c,before:l,beforeEach:u,after:e,afterEach:n})}const k=(s,t)=>y(s,t);k.only=(s,t)=>y(s,t,{suiteOnly:!0});async function m(s,{renderer:t}={}){const{name:a,only:r,tests:c,before:l,after:u,beforeEach:e,afterEach:n}=s,h=r.length?r:c,i={name:a,skipped:0,failed:0,total:0,tests:[]};try{t?.suiteStart?.({name:a,only:r,tests:c}),await l?.();for(const f of h){const o={name:f.name,passed:!0,skipped:!1,duration:"",error:!1},d=E();try{await e?.();const{skipped:p}=await f.handler()||{};o.duration=d(),o.skipped=!!p,o.skipped&&i.skipped++,await n?.()}catch(p){i.failed++,o.passed=!1,o.duration=d(),await n?.(),o.error={expected:p?.expects,...p,message:p.message,stack:p.stack}}finally{i.total++,t?.renderTest?.(o),i.tests.push(o)}}}finally{return await u?.(),t?.suiteEnd?.(i),i}}async function w({renderer:s}={}){const t=E(),a=[],r=[];let c=0,l=0,u=0;const e=QUEUE.filter(i=>i.suiteOnly),h=e.length>0?e:QUEUE;for(const i of h){const f=await m(i,{renderer:s});c+=f.total,l+=f.skipped,u+=f.failed,f.tests.forEach(({error:o})=>{o&&r.push(o)}),a.push(f)}return{status:"FINISHED",total:c,skipped:l,failed:u,errors:r,passed:u<1,duration:t(),results:a}}export{k as describe,w as executeTests};
