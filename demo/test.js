import { describe, executeTests } from '../index.js';
import '../ui/test-report.js';

describe('foo', ({it, before, after}) => {
  before(() => {console.log('before')});
  after(() => {console.log('after')});

  it('test one', () => { console.log('test one ran')} );
  it('test two', () => { console.log('test two ran')} );
  it.skip('skip me', () => { console.log('❌❌❌ I should be skipped!')} );

  describe('bar', ({it}) => {
    it('bar one', () => { console.log('bar one ran')});
  });
});

describe('bla', ({it}) => { 
  it('bla one', () => {console.log('❌❌❌ I should be skipped')});
  it.only('bla two', () => {console.log('bla two run')});
});

describe('huehueheuhe', ({it}) => {
  it('foo', () =>{});
  it('foo2', () =>{throw new Error('boo')});
});

executeTests({
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
}).then(console.log);

