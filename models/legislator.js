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

legislatorSchema.virtual('districtNum').get(function() {
  var districtNum = this.terms[this.terms.length-1].district;

  if(districtNum === 0)
    return "At Large";

  return this.terms[this.terms.length-1].district;
});

legislatorSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    bioguide: this.usid.bioguide,
    official_full: this.name.official_full,
    type: this.terms[this.terms.length-1].type,
    state: this.terms[this.terms.length-1].state,
    district: this.districtNum,
    party: this.terms[this.terms.length-1].party,
    comments: this.comments
  };
}

const Comment = mongoose.model('Comment', commentsSchema);
const Legislator = mongoose.model('Legislator', legislatorSchema);

module.exports = {Comment, Legislator};
