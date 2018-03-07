
const moment = require('moment'); 

function formatKey(value) {
  let key = ''; 
  key = value.replace(/[^a-zA-Z0-9\s]/g, ''); 
  key = key.replace(/\s+/g, '-'); 
  return key; 
}

/**
 * Create a consistent key from an array of values separated by : 
 * @param string[] values 
 */
function createKey(values) {
  let key = []; 
  
  if(!Array.isArray(values)) {
    throw new Error('expected an array of values for createKey function'); 
    return; 
  }

  values.forEach(element => {
    key.push(formatKey(element));     
  });

  return key.join(":"); 
}

function addCreateTime(object) {
  let localObj = object; 
  localObj.created = new Date().toJSON(); 
  return localObj; 
}

function addUpdateTime(object) { 
  let localObj = object; 
  localObj.updated = new Date().toJSON(); 
  return localObj; 
}


module.exports = {
  createKey,
  addCreateTime,
  addUpdateTime
};
