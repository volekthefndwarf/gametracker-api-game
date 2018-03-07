const assert = require('chai').assert;
const jsf = require('json-schema-faker');

const schema = require('../src/schema'); 
const gameApi = require('../src/game'); 
require('dotenv').config({ path: '../.env' });
const gdsFixture = require('./fixtures/datastore-emulator');
const DSTestHelper = new gdsFixture.DSTestHelper('Game'); 

// functional tests for Game functions
describe('Game Test Suite', function() {
  describe('game input validators', () => {
    it('handles correct data ', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {
          [result, err] = gameApi.validate(mock); 
          assert.isTrue(result); 
          done();
        }); 
    }); 
  
    it('returns error on missing "name"', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {                   
          delete mock.name;         
          [result, err] = gameApi.validate(mock)
  
          try {
            assert.isFalse(result);        
            assert.equal(err.message, 'The request could not be processed.')
            assert.equal(err.first().keyword, 'required'); 
            assert.equal(err.first().schemaPath, '#/required');       
            done(); 
          } catch (e) {
            done(e);   
          }
          
        }); 
    });

    it('returns error on wrong type for "name"', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {             
          mock.name = null;         
          [result, err] = gameApi.validate(mock)
          
          try {
            assert.isFalse(result);        
            assert.equal(err.message, 'The request could not be processed.')
            assert.equal(err.first().keyword, 'type'); 
            assert.equal(err.first().schemaPath, '#/properties/name/type');
            done();         
          } catch(e) {
            done(e); 
          }
          
        }); 
    });
  
    it('returns error on missing "platform"', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {             
          delete mock.platform;         
          [result, err] = gameApi.validate(mock)
          
          try {
            assert.isFalse(result);        
            assert.equal(err.message, 'The request could not be processed.')
            assert.equal(err.first().keyword, 'required');           
            done();         
          } catch(e) {
            done(e); 
          }
          
        }); 
    });    

    it('returns error on wrong "platform"', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {             
          mock.platform = 'fake platform';         
          [result, err] = gameApi.validate(mock)
          
          try {
            assert.isFalse(result);        
            assert.equal(err.message, 'The request could not be processed.')
            assert.equal(err.first().keyword, 'enum');             
            done();         
          } catch(e) {
            done(e); 
          }
          
        }); 
    });
  
    it('returns error on missing "source"', (done) => {
      jsf
        .resolve(schema.Game)
        .then( (mock) => {             
          delete mock.source;
          [result, err] = gameApi.validate(mock)
          
          try {
            assert.isFalse(result);        
            assert.equal(err.message, 'The request could not be processed.')
            assert.equal(err.first().keyword, 'required');             
            done();         
          } catch(e) {
            done(e); 
          }
          
        }); 
    });  
  }); 
  /* game input validators end */
  
  /**
   * Test Suite for testing Game functionality
   * requires google datastore emulator is setup. 
   */
  describe("game services", function() {

    this.timeout(20000);

    // mocker container for mock game objects that are manually crafted
    const mocker = require('./mock/game'); 

    // setup the emulator for datastore using our fixture
    before( (done) => {      
      gdsFixture.begin(false, done); 
    });

    // teardown the datastore emulator for other runs
    after( (done) => {
      return gdsFixture.end(done); 
    }); 

    // before each test reset the datastore entities
    beforeEach( () => {
      return DSTestHelper.deleteAll();        
    }); 

    it('#addGame will add a game to google cloud datastore', (done) => {                   
      const mocker = require('./mock/game');       
      gameApi.addGame(mocker.singleGame)
        .then( (game) => {
          return DSTestHelper.entityKeyExists(mocker.singleGameKey);
        })
        .then((rslt) => {            
          assert.isTrue(rslt); 
          done(); 
        })
        .catch((err) => {
          console.error(err); 
          done(new Error(err.message));
        });            
    });     

    it('#addGame will error if game exists', (done) => {
      DSTestHelper.addOne(mocker.singleGameKey, mocker.singleGame)
        .then( () => {
          return gameApi.addGame(mocker.singleGame); 
        })      
        .then( () => {
          assert.fail(0,1, 'error should have been thrown');           
        })
        .catch( (err) => {
          return assert.instanceOf(err, Error); 
        })
        .then(done); 
    }); 
    
    it('#getGame will find an existing game by name and platform', (done) => {      

      DSTestHelper.addOne(mocker.singleGameKey, mocker.singleGame)
        .then( () => {
          return gameApi.getGame(mocker.singleGame.name, mocker.singleGame.platform);
        })
        .then( (game) => {
          assert.isObject(game); 
          assert.equal(game.key, mocker.singleGameKey); 
          assert.equal(game.name, mocker.singleGame.name); 
          done(); 
        })
        .catch(done); 
    }); 

    it('#updateGame correct an existing game with a new release year', (done) => {
      DSTestHelper.addOne(mocker.singleGameKey, mocker.singleGame)
        .then( () => {
            return gameApi.updateGame(mocker.singleGame.name, mocker.singleGame.platform, { 
              released: 1999
            });
        })
        .then( (game) => {
          // refetch the game from store to validate it was updated 
          return gameApi.getGame(mocker.singleGame.name, mocker.singleGame.platform);                       
        })
        .then( (game) => {          
          assert.isObject(game);
          assert.equal(game.released, 1999); 
          assert.equal(game.key, mocker.singleGameKey);             
          done();
        })
        .catch(done); 
    }); 

    it('#updateGame throw an error when existing game does not exist for update', (done) => {
      gameApi.updateGame(mocker.singleGame.name, mocker.singleGame.platform, {
        released: 1999
      })
      .then( (game) => {
        assert.fail(0,1, "This should not be reached")
      })
      .catch( (err) => {
        assert.instanceOf(err, TypeError); 
      })
      .then(done); 
    }); 
  
  }); 
  /* game services end */

}); 