# `@asdgf/web-test-runner`

`asdgf` integration for [@web/test-runner](https://www.npmjs.com/package/@web/test-runner).

## Configuration

```
npm i -D @asdgf/web-test-runner
```

`web-test-runner.config.mjs`:
```js
export default {
  /** 
   * Point WTR to `asdgf` as the testFramework of choice 
   */
  testFramework: { path: 'node_modules/@asdgf/web-test-runner/index.js' },
};
```
