const y=(a=Date.now())=>()=>(Date.now()-a).toFixed(2)+"ms";globalThis.QUEUE=[];function m(a){const t={tests:[],suiteOnly:!1,only:[],...a},o=(e,i)=>{t.tests.push({name:e,handler:i})};return o.only=(e,i)=>{t.only.push({name:e,handler:i})},o.skip=(e,i)=>{t.tests.push({name:e,handler:()=>({skipped:!0})})},{suite:t,it:o,before:e=>{t.before=e},beforeEach:e=>{t.beforeEach=e},after:e=>{t.after=e},afterEach:e=>{t.afterEach=e}}}function E(a,t,o={}){const{suite:n,it:r,before:l,beforeEach:u,after:e,afterEach:i}=m({name:a,...o});QUEUE.push(n),t({it:r,before:l,beforeEach:u,after:e,afterEach:i})}const b=(a,t)=>E(a,t);b.only=(a,t)=>E(a,t,{suiteOnly:!0}),b.skip=(a,t)=>E(a,t,{skip:!0});async function w(a,{renderer:t}={}){const{name:o,only:n,tests:r,before:l,after:u,beforeEach:e,afterEach:i,skip:h}=a,f=n.length?n:r,s={name:o,skipped:0,failed:0,total:0,tests:[]};if(h)return t?.suiteStart?.({skip:h,name:o,only:n,tests:r}),s.skipped=f.length,s.tests=f.map(({name:p})=>({name:p,passed:!1,duration:"",error:!1,skipped:!0})),s.total=f.length,t?.suiteEnd?.(s),s;try{t?.suiteStart?.({skip:h,name:o,only:n,tests:r}),await l?.();for(const p of f){const c={name:p.name,passed:!0,skipped:!1,duration:"",error:!1},k=y();try{await e?.();const{skipped:d}=await p.handler()||{};c.duration=k(),c.skipped=!!d,c.passed=!d,c.skipped&&s.skipped++,await i?.()}catch(d){s.failed++,c.passed=!1,c.duration=k(),await i?.(),c.error={expected:d?.expects,...d,message:d.message,stack:d.stack}}finally{s.total++,t?.renderTest?.(c),s.tests.push(c)}}}finally{return await u?.(),t?.suiteEnd?.(s),s}}async function U({renderer:a}={}){const t=y(),o=[],n=[];let r=0,l=0,u=0;const e=QUEUE.filter(f=>f.suiteOnly),h=e.length>0?e:QUEUE;for(const f of h){const s=await w(f,{renderer:a});r+=s.total,l+=s.skipped,u+=s.failed,s.tests.forEach(({error:p})=>{p&&n.push(p)}),o.push(s)}return{status:"FINISHED",total:r,skipped:l,failed:u,errors:n,passed:u<1,duration:t(),results:o}}export{b as describe,U as executeTests};
