const y=(n=Date.now())=>()=>(Date.now()-n).toFixed(2)+"ms";globalThis.QUEUE=[];function k(n,s,i={}){const t={name:n,tests:[],suiteOnly:!1,only:[],...i},r=(e,o)=>{t.tests.push({name:e,handler:o})};r.only=(e,o)=>{t.only.push({name:e,handler:o})},r.skip=(e,o)=>{t.tests.push({name:e,handler:()=>({skipped:!0})})};const f=e=>{t.before=e},u=e=>{t.beforeEach=e},h=e=>{t.after=e},d=e=>{t.afterEach=e};QUEUE.push(t),s({it:r,before:f,beforeEach:u,after:h,afterEach:d})}const m=(n,s)=>{k(n,s)};m.only=(n,s)=>{k(n,s,{suiteOnly:!0})},m.skip=(n,s)=>{k(n,s,{skip:!0})};async function E(n="",s){try{await s?.()}catch(i){const t=new Error(i);throw t.message=`in hook "${n}"

${i.message}`,t}}async function b(n,{renderer:s}={}){const{name:i,only:t,tests:r,before:f,after:u,beforeEach:h,afterEach:d,skip:e}=n,o=t.length?t:r,a={name:i,skipped:0,failed:0,total:0,tests:[]};if(e)return s?.suiteStart?.({skip:e,name:i,only:t,tests:r}),a.skipped=o.length,a.tests=o.map(({name:l})=>({name:l,passed:!1,duration:"",error:!1,skipped:!0})),a.total=o.length,s?.suiteEnd?.(a),a;s?.suiteStart?.({skip:e,name:i,only:t,tests:r}),await E("before",f);for(const l of o){const c={name:l.name,passed:!0,skipped:!1,duration:"",error:!1};await E("beforeEach",h);const w=y();try{const{skipped:p}=await l.handler()||{};c.skipped=!!p,c.passed=!p,c.skipped&&a.skipped++}catch(p){a.failed++,c.passed=!1,c.error={expected:p?.expects,...p,message:p.message,stack:p.stack}}finally{c.duration=w(),a.total++,s?.renderTest?.(c),a.tests.push(c)}await E("afterEach",d)}return await E("after",u),s?.suiteEnd?.(a),a}async function g({renderer:n}={}){const s=y(),i=[],t=[];let r=0,f=0,u=0;const h=QUEUE.filter(o=>o.suiteOnly),e=h.length>0?h:QUEUE;for(const o of e){const a=await b(o,{renderer:n});r+=a.total,f+=a.skipped,u+=a.failed,a.tests.forEach(({error:l})=>{l&&t.push(l)}),i.push(a)}return{status:"FINISHED",total:r,skipped:f,failed:u,errors:t,passed:u<1,duration:s(),results:i}}export{m as describe,g as executeTests};
