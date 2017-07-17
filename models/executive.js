"use strict";

const mongoose = require('mongoose');

const executiveSchema = mongoose.Schema({
  "usid": {
    "bioguide": Number,
    "govtrack": Number,
    "opensecrets": String,
    "votesmart": Number
  },
  "name": {
    "first": String,
    "last": String,
  },
  "bio": {
    "birthday": Date,
    "gender": String,
  },
  "terms": [{
    "type": String,
    "start": Date,
    "end": Date,
    "party": String,
    "how": String
  }],
  "comments": [{
    "name": {
      "first": String,
      "last": String
    },
    "review": String
  }]
});

const Executive = mongoose.model('Executive', executiveSchema);

module.exports = {Executive};
