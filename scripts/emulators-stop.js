const exec = require("child_process").exec;
const util = require('util');

// no easy eay to reconnect this so we kill all the things 
exec('kill $(pgrep -f "CloudDatastore") &>/dev/null', (err, stdout, stderr) => {   
    console.log("Cleaning up all CloudDatastore emulators...");  
    (err) ? console.error(`failed to close datastore: ${err}`) : null;
    (stdout) ? console.log(`datastore info: ${stdout}`) : null; 
    (stderr) ? console.error(`datastore err: ${stderr}`) : null; 
    next();
}); 

function  next() {
  exec('/home/bcarter/.nvm/versions/node/v6.11.5/bin/functions stop', (error, stdout, stderr) => {
    (error) ? console.error(`failed to close functions: ${err}`) : null;
    (stdout) ? console.log(`functions info: ${stdout}`) : null; 
    (stderr) ? console.error(`functions err: ${stderr}`) : null; 
    process.exit(); 
  }); 
}




