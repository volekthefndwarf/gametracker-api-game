const assert = require('chai').assert;
const dsutils = require('../src/datastore-utils'); 

// functional tests for Game functions
describe('Datastore Test Suite', function() {
  describe('#createKey', () => {
    it('createKey: handle one string should return same as input', () => {
      assert.equal(dsutils.createKey(['testkey']), 'testkey');
    });  
    
    it('createKey: handle one string with special characters', () => {
      assert.equal(dsutils.createKey(['testkey-1.,@#$ home run']), 'testkey1-home-run');
    }); 
  
    it('createKey: handle multiple strings', () => {
      assert.equal(dsutils.createKey(['test key', 'home', 'run']), 'test-key:home:run')
    });  
  }); 
}); 