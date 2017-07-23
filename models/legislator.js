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
    "terms": Array,
    "comments": [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  });

const commentsSchema = mongoose.Schema({
  "usid": { type: String, ref: 'Legislator' },
  "username": String,
  "name": String,
  "review": String
});

const Comment = mongoose.model('Comment', commentsSchema);
const Legislator = mongoose.model('Legislator', legislatorSchema);

module.exports = {Comment, Legislator};
