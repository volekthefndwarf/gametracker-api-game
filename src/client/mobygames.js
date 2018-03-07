const fetch = require('node-fetch'); 
const config = require('../settings.json'); 
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
        _gameUrl(options)
      )
      .then(res => resolve(res.json()))
      .catch(reject); 
    }); 
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

    let params; 
    for(key in localParams) {
      if(localParams[key] !== null) {
        params.push(`${key}=${localParams[key]}`); 
      }
    }

    return `${config.baseUri}games?` + params.join['&'] + `api_key=${config.apiKey}`; 
  }

}

module.exports = Client; 