# `@asdgf/ui`

UI components and custom reporters/loggers for usage with `@asdgf/core`.

## Example

```js
import { executeTests } from '@asdgf/core';
import '@asdgf/ui/test-report.js';

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

