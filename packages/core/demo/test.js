import { describe, executeTests } from '../src/index.js';

describe('foo', ({it, before, after}) => {
  it('test one', () => { console.log('test one ran')} );
  it('test two', () => { throw new Error() } );
  it.skip('skip me', () => { console.log('❌❌❌ I should be skipped!')} );
});

executeTests().then(console.log);