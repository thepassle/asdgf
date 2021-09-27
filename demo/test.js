import { describe, executeTests } from '../index.js';

describe('foo', ({it, before, describe, after}) => {
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

executeTests().then(console.log);

