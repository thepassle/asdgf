import {
  getConfig,
  sessionStarted,
  sessionFinished,
  sessionFailed,
} from '@web/test-runner-core/browser/session.js';
import { executeTests } from '../index.js';
import '../ui/test-report.js';

(async () => {
  // notify the test runner that we're alive
  sessionStarted();

  // fetch the config for this test run, this will tell you which file we're testing
  const { testFile, /* watch, debug, testFrameworkConfig */} = await getConfig();

  const failedImports = [];
  try {
    // load the test file as an es module
    await import(new URL(testFile, document.baseURI).href); 
  } catch(error) {
    console.log('Failed to import', error);
    failedImports.push({ file: testFile, error: { message: error.message, stack: error.stack } });
  }

  try {
    // run the actual tests, this is what you need to implement
    const testResults = await executeTests({
      renderer: {
        suiteStart: ({name}) => {
          /** log */
          console.log('\n' + name);

          /** render */
          const heading = document.createElement('h1');
          heading.textContent = name;
          document.body.appendChild(heading);
        },
        renderTest: (testResult) => {
          /** log */
          console.log(`${testResult.passed ? '✅' : '❌'} ${testResult.name}`)

          /** render */
          const report = document.createElement('test-report');
          report.test = testResult;
          document.body.appendChild(report);
        }
      }
    });

    sessionFinished({
      testResults:{
        suites: [],
        tests: testResults.results.flatMap(({tests}) => tests)
      },
      // errors: testResults.errors,
      testRun: testResults.total,
      passed: failedImports.length === 0 && testResults.passed,
      failedImports,
    });
  } catch (error) {
    console.log('Error executing tests', error);
    // notify an error occurred
    sessionFailed(error);
    return;
  }
})();