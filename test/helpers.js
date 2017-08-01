const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');
const {connectDB, gracefulShutdown} = require('../models/connectDB');


function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

function testConnectDB() {
  return connectDB(TEST_DATABASE_URL);
}

function testGracefulShutdown(msg) {
  return () => gracefulShutdown(msg);
}

module.exports = {tearDownDb, testConnectDB, testGracefulShutdown};
