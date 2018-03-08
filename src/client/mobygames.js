const isString = require('util');
const fetch = require('node-fetch'); 
const config = require('./settings'); 
/**
 * MobyGames Client API for making api calls to MobyGames
 * @author volek.the.fn.dwarf@gmail.com
 */
class Client {

  constructor() {} 

  /**
   * Fetch a game based on configuration options. 
   * @param {object} options
   * @example 
   * return games by moby ids
   * getGame({
   *    id: [ 1, 2, 3] // list of games by id to return 
   * }); 
   * @see http://www.mobygames.com/info/api#toc-games 
   */
  getGames(options) {
    return new Promise((resolve, reject) => {
      fetch(
        this._gameUrl(options)
      )
      .then(res => {        
        return res.json();
      })
      .then(data => {
        if(data.error) {
          return reject(new Error(data.message)); 
        }        
        if(data && data.games.length) {
          return resolve(data.games); 
        } 
        return resolve([]); 
      })
      .catch(reject)
    }); 
  }

  gamesByTitle(title, options = {}) {
    if(typeof title !== 'string') {
      throw new TypeError('Title must be a string');        
    }

    if(typeof options !== 'object') {
      throw new TypeError('gamesByTitle param options passed in was not an object.'); 
    }

    return this.getGames(Object.assign({ title }, options));       
  }

  _gameUrl(options) {
    let localParams = Object.assign({      
      limit: 100, 
      offset: 0, 
      format: 'normal', 
      group: null, 
      title: null, 
      id: null, 
      genre: null, 
      platform: null
    }, options); 

    let params = []; 
    for (let key in localParams) {
      if(localParams[key] !== null) {
        params.push(`${key}=${localParams[key]}`); 
      }
    }

    let result = `${config.baseUri}games?api_key=${config.apiKey}&` + params.join('&'); 
    return result; 
  }

}

module.exports = Client; 