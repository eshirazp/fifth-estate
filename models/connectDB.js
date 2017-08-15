"use strict";

var mongoose = require('mongoose');

// to use ES6 alongside Mongoose
mongoose.Promise = global.Promise;

/******************************************************************************
  connectDB
    This function connects to a database based on its databaseUrl parameter.
    Returns a promise so it can be bundled with starting the server in server.js 
********************************************************************************/
function connectDB(databaseUrl) {
  return mongoose.connect(databaseUrl, {useMongoClient: true})
  .then(() => {
    console.log('Mongoose connected to ' + databaseUrl);
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
  })
  .catch((err) => {
    console.log('Mongoose connection error: ' + err);
  });
}

/******************************************************************************
  gracefulShutdown
    This function disconnects the database and states the reason with the msg
    parameter. Reason can me a restart or app terminated.
    Returns a promise so it can be bundled with closing the server in server.js 
********************************************************************************/
function gracefulShutdown(msg) {
  return new Promise((resolve, reject) => {
    mongoose.connection.close((err) => {
      if(err) {
        return reject(err);
      }
      console.log('Mongoose disconnected through ' + msg);
      resolve();
    });
  });
}

//For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart')
  .then(() => process.kill(process.pid, 'SIGUSR2'))
  .catch((err) => console.error(err));
});
// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination')
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
});

// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown')
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
});

module.exports = {connectDB, gracefulShutdown};
