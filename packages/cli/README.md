# `@asdgf/cli`

> A stupid simple way to test

No magic, no nonsense.

## Usage

```
asdgf
```

## Configuration

### CLI

| Command/option   | Type       | Description                                                 | Example                     |
| ---------------- | ---------- | ----------------------------------------------------------- | --------------------------- |
| --globs          | string[]   | Globs to analyze                                            | `--globs "**/*.test.js"`    |
| --exclude        | string[]   | Globs to exclude                                            | `--exclude "!foo.test.js"`  |
| --watch          | boolean    | Run tests in watch mode                                     | `--watch`                   |
| --watchfiles     | string[]   | Rerun tests when any of these files change                  | `--watchfiles "src/**/*"`   |

Example:
```
asdgf --watch --exclude "!foo.test.js"
```

### Config file
`asdgf.config.js`:
```js
export default {
  watch: true,
  watchfiles: ['src/**/*'],
  globs: ['**/*.test.js'],
  exclude: ['!foo.test.js'],
  reporter: {
    /** Runs before all suites run */
    start: () => {
      console.log('start\n');
    },
    /** Runs before the suite starts, can be used for set up */
    suiteStart: ({name, only, tests}) => {
      console.log(`Starting suite: "${name}"`);
    },
    /** Runs after every ran test, whether it's skipped, passed, or failed */
    renderTest: (testResult) => {
      console.log(`  ${testResult.passed ? '✅' : '❌'} "${testResult.name}"`);
    },
    /** Runs after the entire suite has ran */
    suiteEnd: (testSuiteResult) => {
      console.log('\n')
    },
    /** Runs after all suites have ran */
    end: () => {
      console.log('end');
    }
  };
}
```
