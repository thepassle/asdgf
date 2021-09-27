# `asdgf`

> A stupid simple way to test

No magic, no globals, no nonsense.

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

## Renderer

You can provide a custom renderer to render logic to the browser, or log progress to the console.

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