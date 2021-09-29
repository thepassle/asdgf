const timer = (now = Date.now()) => () => (Date.now() - now).toFixed(2) + 'ms';
globalThis.QUEUE = [];

/**
 * @typedef {import('./types').Renderer} Renderer
 * @typedef {import('./types').ExecutionOptions} ExecutionOptions
 * @typedef {import('./types').Report} Report
 * @typedef {import('./types').Suite} Suite
 * @typedef {import('./types').TestSuiteResult} TestSuiteResult
 * @typedef {import('./types').TestFn} TestFn
 * @typedef {import('./types').Describe} Describe
 * @typedef {import('./types').Handler} Handler
 * @typedef {import('./types').Setup} Setup
 */

/**
 * Creates the suite, and related functions for a suite
 * @param {Partial<Suite>} options
 * @return {Setup} setup
 */
function setup(options) {
  const suite = { tests:[], suiteOnly: false, only: [], ...options };

  const it = (name, handler) => {
    suite.tests.push({name, handler});
  }
  it.only = (name, handler) => { suite.only.push({name, handler}) };
  it.skip = (name, _) => { suite.tests.push({name, handler: () => ({skipped: true})}) };

  const before = handler => { suite.before = handler; }
  const beforeEach = handler => { suite.beforeEach = handler; }
  const after = handler => { suite.after = handler; }
  const afterEach = handler => { suite.afterEach = handler; }

  return { suite, it, before, beforeEach, after, afterEach };
}

function createDescribe(name, handler, options = {}) {
  const {suite, it, before, beforeEach, after, afterEach } = setup({name, ...options});
  QUEUE.push(suite);
  handler({it, before, beforeEach, after, afterEach});
}

/** @type {Describe} describe */
export const describe = (name, handler) => createDescribe(name, handler);
describe.only = (name, handler) => createDescribe(name, handler, {suiteOnly: true})
/** @TODO .skip */

/**
 * Runs the given tests in a suite, and its lifecycle hooks like before, beforeEach, after, afterEach
 * 
 * @param {Suite} suite
 * @param {ExecutionOptions} options
 * @return {Promise<TestSuiteResult>} testSuiteResult
 */
async function run(suite, {renderer} = {}) {
  const { name, only, tests, before, after, beforeEach, afterEach } = suite;
  const testsToRun = only.length ? only : tests;

  const testSuiteResult = {
    name,
    skipped: 0,
    failed: 0,
    total: 0,
    tests: []
  }

  try {
    renderer?.suiteStart?.({name, only, tests});
    await before?.();

    for (const test of testsToRun) {
      const testResult = {
        name: test.name,
        passed: true,
        skipped: false,
        duration: '',
        error: false  
      }

      const time = timer();
      try {
        await beforeEach?.();
        
        const { skipped } = await test.handler() || {};
        testResult.duration = time();
        testResult.skipped = !!skipped;
        if(testResult.skipped) testSuiteResult.skipped++;
        await afterEach?.();
      } catch (err) {
        testSuiteResult.failed++;
        testResult.passed = false;
        testResult.duration = time();

        await afterEach?.();
        
        testResult.error = {expected: err?.expects, ...err, message: err.message, stack: err.stack};
      } finally {
        testSuiteResult.total++;
        renderer?.renderTest?.(testResult);
        testSuiteResult.tests.push(testResult);
      }
    }
  } finally {
    await after?.();

    renderer?.suiteEnd?.(testSuiteResult); 
    return testSuiteResult;
  }
}

/** 
 * Kicks of execution of scheduled suites 
 * @param {ExecutionOptions} options
 * @return {Promise<Report>} report
 */
export async function executeTests({ renderer } = {}) {
  const time = timer();
  const results = [];
  const errors = [];
  let total = 0, skipped = 0, failed = 0;

  /** 
   * Check if there are suites marked with `.only`, if so, only run those
   * Otherwise, run all suites in QUEUE
   */
  const onlySuites = QUEUE.filter(suite => suite.suiteOnly);
  const hasOnlySuites = onlySuites.length > 0;
  const suitesToRun = hasOnlySuites ? onlySuites : QUEUE;

  /**
   * Loop through all suites and run all tests/lifecycle hooks inside them 
   */
  for(const suite of suitesToRun) {
    const suiteResult = await run(suite, {renderer});

    total += suiteResult.total;
    skipped += suiteResult.skipped;
    failed += suiteResult.failed;

    suiteResult.tests.forEach(({error}) => {
      error && errors.push(error);
    });

    results.push(suiteResult);
  }

  return { 
    status: 'FINISHED',
    total,
    skipped,
    failed,
    errors,
    passed: failed < 1,
    duration: time(),
    results,
  }
}