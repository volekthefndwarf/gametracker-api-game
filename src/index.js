const Datastore = require('@google-cloud/datastore');

const datastore = Datastore({
  projectId: process.env.GCLOUD_PROJECT
});


function sendError(err, res) {
  res
    .status(500)
    .send(JSON.stringify({ error: err.toString()}))
    .end();
}

function sendSuccess(data, res) {
  res
    .status(200)
    .send(JSON.stringify(data))
    .end(); 
}


exports.addGame = function addGame(req, res) {
  if(!req.body) {
    throw new Error('Missing data can not enter into system'); 
  }

  const myKey = datastore.key(['game']);
  // Prepares the new entity
  datastore.save({
    key: myKey,
    data: {
      name: req.body.name, 
      description: req.body.description, 
      platform: req.body.platform,
      released: +req.body.released,
      source: req.body.source || 'unknown'
    }
  })
  .then(() => {
    datastore.get(myKey)
      .then((record) => sendSuccess(record, res)); 
  })
  .catch((err) => {
    sendError(err, res); 
  }); 
}
