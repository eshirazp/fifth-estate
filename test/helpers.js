const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');
const {runServer, app, closeServer} = require('../server');
const {connectDB, gracefulShutdown} = require('../models/connectDB');

/******************************************************************************
  testRunServer
    This function connects to a test database with starting the server in 
    server.js 
********************************************************************************/
function testRunServer() {
  return runServer(TEST_DATABASE_URL);
}

/******************************************************************************
  testCloseServer
    This function disconnects to a test database with starting the server in 
    server.js 
********************************************************************************/
function testCloseServer() {
  return closeServer();
}

/******************************************************************************
  tearDownDb
    This function resets a test database
********************************************************************************/
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

/******************************************************************************
  tearDownDb
    This function connects to a test database with models/connectDB.js
********************************************************************************/
function testConnectDB() {
  return connectDB(TEST_DATABASE_URL);
}

function testGracefulShutdown(msg) {
  return () => gracefulShutdown(msg);
}

module.exports = {testRunServer, testCloseServer, tearDownDb, testConnectDB, testGracefulShutdown};
