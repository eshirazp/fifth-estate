"use strict";

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const {connectDB, gracefulShutdown} = require('./models/connectDB');
const {router} = require('./routers/legislatorRouter');

const {DATABASE_URL, PORT} = require('./config');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

/* Send index.html for the homepage */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/views/index.html');
});
/* Use the legislatorRouter when the /legs URL is used */
app.use('/legs', router);

/******************************************************************************
  runServer
    This function is a series of promises that first connects to the database,
    via models/connectDB.js. Then start the server.
    Returns a promise
********************************************************************************/
let server;
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    connectDB(databaseUrl).then(() => {
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
    });
  });
}

/******************************************************************************
  closeServer
    This function is a series of promises that first disconnects the database,
    via models/connectDB.js. Then close the server.
    Returns a promise
********************************************************************************/
function closeServer() {
  gracefulShutdown().then(() => {
    server.close((err) => {
      if(err) {
        return console.error(err)
      }
      return;
    });
  });
}

/* Checks if the server was started from a test or production platform */
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
