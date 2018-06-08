const nock = require('nock'); 

var scope = nock('https://api.mobygames.com')

// brief example
.persist()
.get('/v1/games')
.query( (queryObject) => {  
    if(queryObject.title == 'Dragon Valor' && queryObject.format == 'brief') {
      return true; 
    } 

    return false;     
})
.reply(200, {
  "games": [
      {
          "game_id": 6575,
          "moby_url": "http://www.mobygames.com/game/dragon-valor",
          "title": "Dragon Valor"
      }
  ]
}, { 'Content-Type': 'application/json' })

.get('/v1/games')
.query( (q) => {
  return (q.genre_id == 1); 
})
.reply(200, {
  "games": [
      {
          "game_id": 1,
          "moby_url": "http://www.mobygames.com/game/x-files-game",
          "title": "The X-Files Game"
      },
      {
          "game_id": 2,
          "moby_url": "http://www.mobygames.com/game/who-framed-roger-rabbit",
          "title": "Who Framed Roger Rabbit"
      }
  ]
})
.get('/v1/genres6')
.query(true)
.reply(200, {
  "genres": [
      {
          "genre_category": "Basic Genres",
          "genre_category_id": 1,
          "genre_description": "Action games main mechanics revolve around one or more of the following:<ul>\n<li>Accuracy</li>\n<li>Movement</li>\n<li>Quick Decisions</li>\n<li>Reflexes</li>\n<li>Timing</li></ul>This genre is only to be used for games that don't fit in the other action-based basic genres such as Racing/Driving, Role-Playing (RPG) and Sports.",
          "genre_id": 1,
          "genre_name": "Action"
      },
      {
          "genre_category": "Basic Genres",
          "genre_category_id": 1,
          "genre_description": "Adventure games emphasize experiencing a story through dialogue and puzzle solving. Gameplay mechanics emphasize decision over action. Puzzle solving usually revolves around combining or manipulating items to advance the story. Some sub-genres like visual novels often skip on the puzzle solving and focus fully on interactive narrative. The name Adventure stems from the game Adventure (a.k.a. <i>Colossal Cave</i>), and not to the unrelated film/book genre Adventure.",
          "genre_id": 2,
          "genre_name": "Adventure"
      },
      {
          "genre_category": "Basic Genres",
          "genre_category_id": 1,
          "genre_description": "Simulation games can be one of many different types of simulations. What all simulations have in common is that they are more realistically modeled to real life situations and/or variables than most games. Simulation games can model a wide variety of different situations and variables, most common are:<ul>\n<li>Business/Trade Simulations</li>\n<li>Construction Simulations</li>\n<li>Life Simulations</li>\n<li>Management Simulations</li>\n<li>Sports Simulations</li>\n<li>Vehicle Simulators and Vehicular Combat Simulators</li>\n<li>War Simulations (Wargames)</li></ul>",
          "genre_id": 3,
          "genre_name": "Simulation"
      }]
}); 

module.exports = nock;
