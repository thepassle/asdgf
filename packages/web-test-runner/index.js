import{getConfig as S,sessionStarted as U,sessionFinished as C,sessionFailed as L}from"@web/test-runner-core/browser/session.js";var h=(a=Date.now())=>()=>(Date.now()-a).toFixed(2)+"ms";globalThis.QUEUE=[];function k(a){let t={tests:[],suiteOnly:!1,only:[],...a},e=(o,i)=>{t.tests.push({name:o,handler:i})};return e.only=(o,i)=>{t.only.push({name:o,handler:i})},e.skip=(o,i)=>{t.tests.push({name:o,handler:()=>({skipped:!0})})},{suite:t,it:e,before:o=>{t.before=o},beforeEach:o=>{t.beforeEach=o},after:o=>{t.after=o},afterEach:o=>{t.afterEach=o}}}function b(a,t,e={}){let{suite:s,it:r,before:n,beforeEach:l,after:o,afterEach:i}=k({name:a,...e});QUEUE.push(s),t({it:r,before:n,beforeEach:l,after:o,afterEach:i})}var x=(a,t)=>b(a,t);x.only=(a,t)=>b(a,t,{suiteOnly:!0});async function w(a,{renderer:t}={}){let{name:e,only:s,tests:r,before:n,after:l,beforeEach:o,afterEach:i}=a,f=s.length?s:r,d={name:e,skipped:0,failed:0,total:0,tests:[]};try{t?.suiteStart?.({name:e,only:s,tests:r}),await n?.();for(let p of f){let c={name:p.name,passed:!0,skipped:!1,duration:"",error:!1},m=h();try{await o?.();let{skipped:u}=await p.handler()||{};c.duration=m(),c.skipped=!!u,c.skipped&&d.skipped++,await i?.()}catch(u){d.failed++,c.passed=!1,c.duration=m(),await i?.(),c.error={expected:u?.expects,...u,message:u.message,stack:u.stack}}finally{d.total++,t?.renderTest?.(c),d.tests.push(c)}}}finally{return await l?.(),t?.suiteEnd?.(d),d}}async function g({renderer:a}={}){let t=h(),e=[],s=[],r=0,n=0,l=0,o=QUEUE.filter(d=>d.suiteOnly),f=o.length>0?o:QUEUE;for(let d of f){let p=await w(d,{renderer:a});r+=p.total,n+=p.skipped,l+=p.failed,p.tests.forEach(({error:c})=>{c&&s.push(c)}),e.push(p)}return{status:"FINISHED",total:r,skipped:n,failed:l,errors:s,passed:l<1,duration:t(),results:e}}var y=document.createElement("template");y.innerHTML=`
  <style>
    :host {
      display: block;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 16px;
    }
    .wrapper {
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .passed {
      color: #0f5132;
      background-color: #d1e7dd;
      border: solid 1px;
      border-color: #badbcc;
    }
    .skipped {
      color: #41464b;
      background-color: #e2e3e5;
      border: solid 1px;
      border-color: #d3d6d8;
    }
    .error {
      color: #842029;
      background-color: #f8d7da;
      border: solid 1px;
      border-color: #f5c2c7;
    }
    .error-message {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .stack {
      overflow:auto;
      color: #636464;
      background-color: #fefefe;
      border-color: #fdfdfe;
      border-radius: 5px;
      padding: 5px 10px;
    }
    pre {
      font-size: 12px;
    }
  </style>
  <div class="wrapper">
    <div class="name"></div>
  </div>
`;var E=class extends HTMLElement{constructor(){super();this.test={},this.attachShadow({mode:"open"})}connectedCallback(){let t=y.content.cloneNode(!0),e=t.querySelector(".wrapper"),s=t.querySelector(".name");if(this.test?.passed&&e.classList.add("passed"),this.test?.skipped&&(e.classList.add("skipped"),e.classList.remove("passed")),this.test?.error){e.classList.add("error");let r=document.createElement("div");r.classList.add("error-message"),r.textContent=this.test?.error?.message;let n=document.createElement("div");n.classList.add("stack"),n.innerHTML=`<pre>${this.test?.error?.stack}</pre>`,e.appendChild(r),e.appendChild(n)}s.textContent=this.test?.name,this.shadowRoot.appendChild(t)}};customElements.define("test-report",E);(async()=>{U();let{testFile:a}=await S(),t=[];try{await import(new URL(a,document.baseURI).href)}catch(e){console.log("Failed to import",e),t.push({file:a,error:{message:e.message,stack:e.stack}})}try{let e=await g({renderer:{suiteStart:({name:s})=>{console.log(`
`+s);let r=document.createElement("h1");r.textContent=s,document.body.appendChild(r)},renderTest:s=>{console.log(`${s.passed?"\u2705":"\u274C"} ${s.name}`);let r=document.createElement("test-report");r.test=s,document.body.appendChild(r)}}});C({testResults:{suites:[],tests:e.results.flatMap(({tests:s})=>s)},testRun:e.total,passed:t.length===0&&e.passed,failedImports:t})}catch(e){console.log("Error executing tests",e),L(e);return}})();
