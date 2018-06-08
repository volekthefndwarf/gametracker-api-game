const Client = require('../src/client/mobygames'); 
const config = require('../src/client/settings'); 
const assert = require('chai').assert;
const nock = require('nock'); 

// functional tests for Game functions
describe('MobyAPIClient', function() {
  beforeEach( () => {
    this.moby = new Client(); 
   const nock = require('./nock/mobyapi');  
    // nock.disableNetConnect();
  });

  afterEach(()=>{
    // nock.cleanAll();
    // nock.restore();
  });

  describe('/Games requests', () => {
    it('will create a valid game url for title ', () => {      
      assert.equal(
        this.moby._gameUrl({ title: 'deus ex' }),
        `${config.baseUri}games?api_key=${config.apiKey}&limit=100&offset=0&format=normal&title=deus ex`
      ); 
    }); 

    it('will create a valid game url for id', () => {
      assert.equal(
        this.moby._gameUrl({ id: 1 }),
        `${config.baseUri}games?api_key=${config.apiKey}&limit=100&offset=0&format=normal&id=1`
      );      
    }); 

    it('will create get 10 results for a platform ', () => {
      assert.equal(
        this.moby._gameUrl({ limit: 10, platformId: 10 }),
        `${config.baseUri}games?api_key=${config.apiKey}&limit=10&offset=0&format=normal&platformId=10`
      );      
    }); 

    it('will get a brief formatted url for groupId ', () => {
      assert.equal(
        this.moby._gameUrl({ format: 'brief', groupId: 159 }),
        `${config.baseUri}games?api_key=${config.apiKey}&limit=100&offset=0&format=brief&groupId=159`
      );      
    }); 
    
    it('#gamesByTitle returns a Promise', () => {
      let result = this.moby
        .gamesByTitle('Dragon Valor', { format: 'brief' }) 
        .catch( (err) => {
          throw err; 
        })
      assert.instanceOf(result, Promise);         
    });  
    
    it('#gamesByTitle returns a result', (done) => {
      let result = this.moby
        .gamesByTitle('Dragon Valor', { format: 'brief' })
        .then( (games) => {          
          const game = games.pop();           
          assert.equal(game.game_id, 6575);          
          done();
        })
        .catch(done)        
    }); 

    it('#gamesByGenreId returns a collection of games', (done) => {      
      const result = this.moby
      .gamesByGenreId(1, { format: 'brief' })
      .then( (games) => {
        assert.isArray(games); 
        assert.equal(games.length, 2);
        assert.equal(games[0].title, "The X-Files Game");           
        done(); 
      })
      .catch(done);       
      
    }); 

    it('#gamesByGenre returns a for a specific genre name', (done) => {
      const result = this.moby
        .gamesByGenre('RPG', { format: 'brief' })
        .then( (games) => {
          assert.isArray(games); 
          assert.equal(games.length, 2);  
          done();                   
        })
        .catch(done);        
    }); 

    it('#gamesByPlatformId returns a collection of games', (done) => {
      done(); 
    });   
  })
  describe('/Genre requests', () => {
    it('#genres return a promise for generes call', (done) => {
      const result = this.moby
        .genres()
        .then((data) => {
          console.log(data);          
          done();
        })
        .catch(done);       
      assert.instanceOf(result, Promise); 
    })
  }); 
}); 
  