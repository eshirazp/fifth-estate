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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/views/index.html');
});
app.use('/legs', router);

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

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
