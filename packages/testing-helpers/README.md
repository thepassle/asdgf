# `@asdgf/testing-helpers`

> A stupid simple way to test

No magic, no nonsense.

Opinionated package of small, performant, minified, ESM-friendly reexported helper libraries

## ~~Sinon~~ ➡️ [Hanbi](https://www.npmjs.com/package/hanbi)

```js
import { spy, stub, stubMethod, restore } from '@asdgf/testing-helpers/hanbi/index.js';
```

## ~~Chai~~ ➡️ [uvu/assert](https://www.npmjs.com/package/uvu)
```js
import { assert } from '@asdgf/testing-helpers/uvu/assert/index.js';
```

## [@open-wc/testing-helpers](https://www.npmjs.com/package/@open-wc/testing-helpers) fixture
```js
import { fixture, fixtureCleanup, html } from '@asdgf/testing-helpers/open-wc/index.js';
```

## [@open-wc/testing-helpers](https://www.npmjs.com/package/@open-wc/testing-helpers) timing
```js
import { waitUntil, nextFrame, aTimeout } from '@asdgf/testing-helpers/open-wc/timing/index.js';
```

## Example usage

```js
import { describe } from '@asdgf/core';
import * as hanbi from '@asdgf/testing-helpers/hanbi/index.js';
import { assert } from '@asdgf/testing-helpers/uvu/assert/index.js';
import { fixture, fixtureCleanup } from '@asdgf/testing-helpers/open-wc/index.js';

class MyElement extends HTMLElement {
  getName() {
    return 'world';
  }
  connectedCallback() {
    this.innerHTML = `<h1>hello ${this.getName()}</h1>`;
  }
}
customElements.define('my-element', MyElement);

describe('my-element', ({it, afterEach}) => {
  afterEach(fixtureCleanup);

  it('renders correctly', async () =>{
    const el = await fixture('<my-element></my-element>');
    const stub = hanbi.stubMethod(el, 'getName').returns('foo');
    el.connectedCallback();
    assert(el.textContent, 'hello foo');
    stub.restore();
  });
});
```
