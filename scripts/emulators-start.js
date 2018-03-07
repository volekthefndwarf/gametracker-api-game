const Emulator = require('google-datastore-emulator'); 
const exec = require("child_process").exec;

emu = new Emulator({
  consistency: 0,
  debug: 1
}); 

emu.start()
.then( () => {
  // start functions
  return exec('/home/bcarter/.nvm/versions/node/v6.11.5/bin/functions start', (error, stdout, stderr) => {
    if(error) {
      console.error(`function emulator failed: ${error}`); 
    }
    console.log(`info: ${stdout}`); 
    console.log(`err: ${stderr}`); 
    process.exit();
  })
})
.catch( (err) => {
  console.log(err); 
}); 



