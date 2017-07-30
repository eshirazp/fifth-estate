var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

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

module.exports = {connectDB, gracefulShutdown};
