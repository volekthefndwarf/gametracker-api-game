const isString = require('util');
const fetch = require('node-fetch'); 
const config = require('./settings'); 
const ApIError = require('./api-error'); 
const lazyCache = require('./cache'); 

/**
 * MobyGames Client API for making api calls to MobyGames
 * @author volek.the.fn.dwarf@gmail.com
 */
class Client {

  constructor() {
    this.commonOptions = { limit: 100, offset: 0}; 
    this.GENRE_CACHE = 'genre:collection'; 
  }

  genres(options = {}) {
    return new Promise((resolve, reject) => {
      
      // check our lazy cache first 
      let genres = lazyCache.get(this.GENRE_CACHE); 
      if(genres) return resolve(genres); 

      // else resolve it at host level and cache response (does not change often)
      fetch(
        this._genreUrl(options)
      )
      .then(res => {
        return res.json(); 
      })
      .then((data) => {
        if (data.error) return reject(new APIError(data));

        lazyCache.set(this.GENRE_CACHE, data.genre); 
        console.log(data); 
        return resolve(data.genre); 
      })
    }); 
  }

  genreByName(genreName) {
    return new Promise((resolve, reject) => {
      this.genres()
        .then((genresData) => {
          if (!genresData.length) return resolve([]); 
        
          genresData.some((genre) => {
            if (genre.genre_name === genreName) {
              resolve(genre); 
              return true; 
            }            
          }); 
        })
        .catch(reject); 
    }); 
  }

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
  games(options = {}) {
    return new Promise((resolve, reject) => {
      fetch(
        this._gameUrl(options)
      )
      .then(res => {        
        return res.json();
      })
      .then(data => {
        if (data.error) reject(new APIError(data));
                  
        if(data && data.games.length) {
          return resolve(data.games); 
        } 
        return resolve([]); 
      })
      .catch(reject)
    }); 
  }

  /**
   * Get a game by title
   * @param {string} title 
   * @param {object} options 
   * @see this.games
   */
  gamesByTitle(title = '', options = {}) {  
    return this.games(Object.assign({ title }, options));       
  }

  /**
   * Get a game by the genre_id from moby games
   * @param {integer} genreId 
   * @param {object} options 
   * @promise {object} games 
   */
  gamesByGenreId(genreId, options = {}) {
    return this.games(Object.assign({ genre_id: genreId }, options)); 
  }

  /**
   * @param {string} genre name of a specific game genre or sub genre
   * @param {*} options 
   * @promise {object} games
   */
  gamesByGenre(genre, options = {}) {
    return false; 
  }

  _gameUrl(options = {}) {
    let gameOptions = Object.assign(this.commonOptions, {            
      format: 'normal', 
      group: null, 
      title: null, 
      id: null, 
      genre: null, 
      platform: null
    }, options); 
    return this._buildUrl('games', gameOptions); 
  }
  
  _genreUrl(options = {}) {
    let genreOptions = Object.assign(this.commonOptions, options); 
    return this._buildUrl('genres', genreOptions);     
  }

  _buildUrl(resource, options) {
    let query = []; 
    
    for (let key in options) {
      if(options[key] !== null) {
        query.push(`${key}=${options[key]}`); 
      }
    }
    
    return `${config.baseUri}${resource}?api_key=${config.apiKey}&` + query.join('&');         
  }


}

module.exports = Client; 