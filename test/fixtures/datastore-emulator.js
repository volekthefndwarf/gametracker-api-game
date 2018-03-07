const Datastore = require('@google-cloud/datastore');
const Emulator = require('google-datastore-emulator'); 

let emu; 
  
function begin(paramDebug = 0, callback) {
  emu = new Emulator({
    consistency: 0,
    debug: paramDebug
  }); 

  emu
    .start()
    .then( () => {
      callback()
    })
    .catch( (err) => {
      callback(`failed to start the datastore emulator: process error - ${err}`); 
    });  

  return; 
}

function end(callback) {
  emu
    .stop()
    .then( () => {
      callback();
    })
    .catch( (err) => {
      callback(`failed to stop datastore emulator: process error - ${err}`); 
    }); 
}

class DSTestHelper {

  constructor(kind) {
    this.datastore = new Datastore({
      projectId: process.env.GCLOUD_PROJECT
    });     
    this.kind = kind; 
  }

  entityKeyExists(key) {
    return new Promise( (resolve, reject) => {
      this.datastore.get(
        this.datastore.key([this.kind, key]), 
        (err, entity) => {
          
          (err) ? reject(err) : resolve( (entity !== undefined) );
        }
      ); 
    });     
  }

  deleteAll() {    
    const keys = []; 
    const query = this.datastore.createQuery(this.kind); 
    query.select('__key__');

    return new Promise( (resolve, reject) => {
      query.run()
        .then( (data) => {        
          const entities = data[0]; 
          if(entities.length) {
            for(let i = 0; i < entities.length; i++) {                  
              keys.push(entities[i][this.datastore.KEY]);
            }   
          }
        })
        .then( (data) => {
          if(keys.length) {            
            return this.datastore.delete(keys);
          }
        }) 
        .then(resolve)
        .catch(reject);
    });    
  }

  addOne(key, data) {
    return this.datastore.save({
      key: this.datastore.key([this.kind, key]),
      data
    }); 
  }

}



module.exports = {
  DSTestHelper,
  begin,
  end
};