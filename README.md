# `asdgf`

> A stupid simple way to test

No magic, no nonsense.

## Demo

```js
import { describe, executeTests } from 'asdgf';
import { expect } from '@open-wc/testing';
import { sum } from 'sum';

describe('sum', ({it, before, /* beforeEach, after, afterEach */}) => {
  before(() => {
    console.log('hello world');
  });

  it('adds two numbers', () => {
    expect(sum(1,1)).to.equal(2);
  });
});

/**
 * Returns a test report
 */
executeTests().then(console.log);
```

You can also nest suites:
```js
describe('foo', ({it, /* before, beforeEach, after, afterEach */}) => {
  it('does foo', () => {
    expect(true).to.equal(true);
  });

  /** Make sure to destructure `it` from the suite */
  describe('bar', ({it}) => {
    it('does bar', () => {
      expect(true).to.equal(true);
    });
  });
});
```

## Example with web components

```js
import { describe } from 'asdgf';
import { expect, html } from '@open-wc/testing';
import { fixture, fixtureCleanup } from '@open-wc/testing-helpers/pure';

class MyEl extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `hello world`;
  }
}
customElements.define('my-el', MyEl);

describe('MyEl', ({it, afterEach}) => {
  afterEach(fixtureCleanup);

  it('renders', async () => {
    const el = await fixture(html`<my-el></my-el>`);
    expect(el.textContent).to.equal('hello world');
  });
});
```

## Renderer

You can provide a custom renderer to render progress in the browser, or log progress to the console.

```js

/**
 * Log progress to the console
 */
const renderer = {
  /** Runs before the suite starts, can be used for set up */
  suiteStart: ({name, only, tests}) => {
    console.log(`Starting suite: [${name}]`);
  },
  /** Runs after every ran test, whether it's skipped, passed, or failed */
  renderTest: (testResult) => {
    console.log(`${testResult.name}: ${testResult.passed ? '✅' : '❌'}`);
  },
  /** Runs after the entire suite has ran */
  suiteEnd: (testSuiteResult) => {
    console.log(`End of suite: [${testSuiteResult.name}]`);
  }
}

executeTests({renderer});
```

```js

/**
 * Render progress to the browser
 */
const renderer = {
  /** Runs after every ran test, whether it's skipped, passed, or failed */
  renderTest: (testResult) => {
    const result = document.createElement('test-result');
    result.test = testResult;
    document.body.appendChild(result);
  },
}

executeTests({renderer});
```

## Usage with [@web/test-runner](https://www.npmjs.com/package/@web/test-runner)

```
npm i -D asdgf
```

`web-test-runner.config.mjs`:
```js
export default {
  /** 
   * Point WTR to `asdgf` as the testFramework of choice 
   */
  testFramework: { path: 'node_modules/asdgf/wtr.js' },
};
```

## Prior art
This project was inspired by [uvu](https://github.com/lukeed/uvu). 