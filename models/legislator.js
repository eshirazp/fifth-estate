"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

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
    "comments": [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  });

const commentsSchema = mongoose.Schema({
  "_id": { type: Number, ref: 'Legislator' },
  "username": String,
  "name": String,
  "review": String,
  "legislators": [{ type: Number, ref: 'Legislator' }]
});

const Comment = mongoose.model('Comment', commentsSchema);
const Legislator = mongoose.model('Legislator', legislatorSchema);

module.exports = {Comment, Legislator};
