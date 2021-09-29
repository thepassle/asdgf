const template = document.createElement('template');
template.innerHTML = /*html*/ `
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
`;

class TestReport extends HTMLElement {
  constructor() {
    super();
    this.test = {};
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const t = template.content.cloneNode(true);
    const wrapper = t.querySelector('.wrapper');
    const name = t.querySelector('.name');

    if (this.test?.passed) {
      wrapper.classList.add('passed');
    }

    if (this.test?.skipped) {
      wrapper.classList.add('skipped');
      wrapper.classList.remove('passed');
    }

    if (this.test?.error) {
      wrapper.classList.add('error');

      const error = document.createElement('div');
      error.classList.add('error-message');
      error.textContent = this.test?.error?.message;

      const stack = document.createElement('div');
      stack.classList.add('stack');
      stack.innerHTML = `<pre>${this.test?.error?.stack}</pre>`;

      wrapper.appendChild(error);
      wrapper.appendChild(stack);
    }

    name.textContent = this.test?.name;
    this.shadowRoot.appendChild(t);
  }
}

customElements.define('test-report', TestReport);