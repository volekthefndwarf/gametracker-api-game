let dataCache; 

function createInstance() {
  if(!dataCache) {
    dataCache = new Map(); 
  }

  return dataCache; 
}

module.exports = createInstance(); 

