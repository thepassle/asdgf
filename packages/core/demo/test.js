import { describe, executeTests } from '../src/index.js';

describe('foo', ({it, before, after, beforeEach, afterEach}) => {

  // before(() => {throw new Error('asdf sdaf sadf ')});
  // beforeEach(() => {throw new Error('beforeEach')});
  // afterEach(() => {throw new Error('afterEach')});
  // after(() => {throw new Error('after')});

  describe('bar', ({it}) => {
    it('test one', () => { console.log('test one ran')} );
  });

  it('test one', () => { console.log('test one ran')} );
  it('test two', () => { throw new Error() } );
  it.skip('skip me', () => { console.log('❌❌❌ I should be skipped!')} );
});

executeTests({renderer: 
  {
    /** Runs before the suite starts, can be used for set up */
    suiteStart: ({name, only, tests}) => {
      console.log(name);
    },
    /** Runs after every ran test, whether it's skipped, passed, or failed */
    renderTest: ({skipped, passed, name}) => {
      const emoji = skipped ? '⚫️' : passed ? '✅' : '❌';
  
      console.log(`  ${emoji} ${name}`);
    },
    /** Runs after the entire suite has ran */
    suiteEnd: (testSuiteResult) => {
      console.log('\n')
    },
  }
}).then(console.log);