const {DATABASE_URL} = require('../config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL, {useMongoClient: true});

// CONNECTION EVENTS
mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + DATABASE_URL));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// function connectDB() {
//   return new Promise((resolve, reject) => {
//     mongoose.connect(DATABASE_URL, {useMongoClient: true}, err => {
//       if (err) {
//         return reject(err);
//       }
//       resolve();
//     });
//   });
// }
//
// connectDB().then(() => {
//   mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + DATABASE_URL))
//   .on('error', (err) => console.log('Mongoose connection error: ' + err))
//   .on('disconnected', () => console.log('Mongoose disconnected'));
// })

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
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
