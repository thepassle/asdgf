const s=document.createElement("template");s.innerHTML=`
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
`;class a extends HTMLElement{constructor(){super();this.test={},this.attachShadow({mode:"open"})}connectedCallback(){const t=s.content.cloneNode(!0),e=t.querySelector(".wrapper"),d=t.querySelector(".name");if(this.test?.passed&&e.classList.add("passed"),this.test?.skipped&&(e.classList.add("skipped"),e.classList.remove("passed")),this.test?.error){e.classList.add("error");const o=document.createElement("div");o.classList.add("error-message"),o.textContent=this.test?.error?.message;const r=document.createElement("div");r.classList.add("stack"),r.innerHTML=`<pre>${this.test?.error?.stack}</pre>`,e.appendChild(o),e.appendChild(r)}d.textContent=this.test?.name,this.shadowRoot.appendChild(t)}}customElements.define("test-report",a);
