"use strict";

const mongoose = require('mongoose');

const legislatorSchema = mongoose.Schema ({
  "usid": {
    "bioguide": String,
    "govtrack": Number,
    "opensecrets": String,
    "votesmart": Number
  },
  "name": {
    "first": String,
    "middle": String,
    "last": String,
    "official_full": String,
  },
  "bio": {
    "birthday": Date,
    "gender": String,
    "religion": String
  },
  "terms": [{
    "type": String,
    "start": Date,
    "end": Date,
    "state": String,
    "district": Number,
    "party": String
  }],
  "comments": [{
    "name": {
      "first": String,
      "last": String
    },
    "review": String
  }]
});

const Legislator = mongoose.model('Legislator', legislatorSchema);

module.exports = {Legislator};
