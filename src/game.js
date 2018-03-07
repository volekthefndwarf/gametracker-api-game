const Datastore = require('@google-cloud/datastore');
const Emulator = require('google-datastore-emulator'); 
const Ajv = require('ajv'); 
const ajv = new Ajv({allErrors: true, jsonPointers: true}); 
const schema = require('./schema'); 
const dsutils = require('./datastore-utils'); 
const ValidationError = require('./error/validation-error'); 

// setup error handling for object validation
require('ajv-errors')(ajv); 

const datastore = Datastore({
  projectId: process.env.GCLOUD_PROJECT
});
const kind = 'Game'; 

// console.log(require('util').inspect(datastore, {
//   showHidden: false, depth: null
// }));

/**
 * Get a game based on the name and platform
 * @param {string} name 
 * @param {string} platform 
 * @promise {object} game 
 */
function getGame(name, platform) {
  const gameKey = dsutils.createKey([name, platform]); 
  const key = datastore.key([kind, gameKey]); 

  return new Promise( (resolve, reject) => {    
    datastore.get(key, (err, entity) => {
      if(err) {
        reject(err); 
      } else {
        resolve(entity); 
      }
    })
  }); 
}

/**
 * Validates a game object against schema returns boolean and errors 
 * @param {object} game 
 * @schema game.json
 * @returns [boolean, ValidationError|undefined]
 */
function validate(game) {
  let validationError; 
  ajv.validate(schema.Game, game); 

  // if the data did not conform to our schema 
  if(ajv.errors && ajv.errors.length) {
    const err = ajv.errors.pop(); 
    validationError = new ValidationError(err); 
  }
  return [
    ajv.validate(schema.Game, game), 
    validationError
  ];    
}

/**
 * Add a game to the game registry for site 
 * @param {Game} object 
 * @schema game.json
 * @promise {object} game 
 */
function addGame(game) {
  return new Promise( (resolve, reject) => {
    [valid, err] = validate(game); 
    if(!valid) {
      return reject(err); 
    }

    const gameKey = dsutils.createKey([game.name, game.platform]);
    
    // check and reject for existing game
    getGame(game.name, game.platform)
      .then( (entity) =>  {       
        if(entity && entity.name) {        
          return reject(
            Error(`Game: ${entity.name} for platform: ${entity.platform} already has been created.`)
          );
        }

        const key = datastore.key([kind, gameKey]); 
        const gameEntity = dsutils.addCreateTime(game); 

        datastore.save({
          key: key,
          data: gameEntity
        }, (err) => {
          if(err) {
             reject(err); 
          } else {
            gameEntity.key = gameKey;             
            resolve(gameEntity); 
          }
        }); 
      })
      .catch( (err) =>  {
        reject(err);
      });
    }); 
} 

/**
 * Will update a given game based on the name/platform combination
 * @param {string} name 
 * @param {string} platform 
 * @param {object} data - partial data update to record 
 * @schema game.json
 * @promise {object} game 
 */
function updateGame(name, platform, data) {
  if(!name || !platform) {
    throw new Error('Missing name or platform required to make to changes'); 
  }

  const gameKey = dsutils.createKey([name,platform]); 
  const key = datastore.key([kind, gameKey]); 
  let gameEntity; 

  return new Promise( (resolve, reject) => {
    this.getGame(name, platform)
      .then( (game) => {              
        
        if(!game) {
          return reject( new TypeError("game object is not an object")); 
        }

        gameEntity = Object.assign(game, data);         
        gameEntity = dsutils.addUpdateTime(gameEntity);         
        return datastore.save({
          key: key,
          data: gameEntity
        }); 
      })
      .then((result, data) => {        
        resolve(gameEntity); 
      })
      .catch(reject); 
  }); 
}

function deleteGame(gameId) {

}

function refreshGame() {

}

function searchGames(query) {

}

module.exports = {
  validate,
  getGame, 
  addGame,
  updateGame,
  deleteGame,
  refreshGame,
  searchGames
}; 




//addGame({});



  // const myKey = datastore.key(['game']);
  // // Prepares the new entity
  // datastore.save({
  //   key: myKey,
  //   data: {
  //     name: req.body.name, 
  //     description: req.body.description, 
  //     platform: req.body.platform,
  //     released: +req.body.released,
  //     source: req.body.source || 'unknown'
  //   }
  // })
  // .then(() => {
  //   datastore.get(myKey)
  //     .then((record) => sendSuccess(record, res)); 
  // })
  // .catch((err) => {
  //   sendError(err, res); 
  // }); 

