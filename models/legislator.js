"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

// to use ES6 alongside Mongoose
mongoose.Promise = global.Promise;

/******************************************************************************
  legislatorSchema
    This is the schema used for each member of Congress. It has a subdocment 
    that is connected via Mongoose Population to the Comments Schema.
********************************************************************************/
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

/******************************************************************************
  commentsSchema
    This is the schema used for each member of Congress's comments. It is 
    connected via Mongoose Population to the Legislator Schema, via the 
    reference entry of usid.
********************************************************************************/
const commentsSchema = mongoose.Schema({
  "usid": { type: String, ref: 'Legislator' },
  "username": String,
  "name": String,
  "review": String
});

/******************************************************************************
  districtNum
    This is a virtual method specifically for the legislatorSchema that is used 
    to change the value of the districtNum if it is 0
********************************************************************************/
legislatorSchema.virtual('districtNum').get(function() {
  var districtNum = this.terms[this.terms.length-1].district;

  if(districtNum === 0)
    return "At Large";

  return this.terms[this.terms.length-1].district;
});

/******************************************************************************
  apiRepr
    This is a method specifically for the legislatorSchema that is used for all
    HTTP verbs to return an expected outcome
********************************************************************************/
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

/******************************************************************************
  getAllCongressMembers
    This is a method used by the HTTP verbs to retrieve all members of Congress
********************************************************************************/
function getAllCongressMembers() {
  return Legislator.find().exec();
}

/******************************************************************************
  createNewComment
    This is a method used by the HTTP verbs to create a comment
********************************************************************************/
function createNewComment(username, name, review, usid) {
  return Comment.create({
    "username": username,
    "name": name,
    "review": review,
    "usid": usid
  });
}

/******************************************************************************
  getCommentsForSingleCongress
    This is a method used by the HTTP verbs to find a comment on a specific
    usid, which means for a specific member of Congress
********************************************************************************/
function getCommentsForSingleCongress(id) {
  return Comment.find({usid: id}).exec();
}

/******************************************************************************
  updateCommentsForSingleCongress
    This is a method used by the HTTP verbs to update a comment on a specific
    cid, which means for a specific comment ID
********************************************************************************/
function updateCommentsForSingleCongress(username, name, review, usid, cid) {
  return Comment.findByIdAndUpdate(cid,
  {
    "username": username,
    "name": name,
    "review": review,
    "usid": usid
  },
  {upsert: true, new: true})
  .exec()
}

/******************************************************************************
  deleteCommentForSingleCongress
    This is a method used by the HTTP verbs to delete a comment on a specific
    cid, which means for a specific comment ID
********************************************************************************/
function deleteCommentForSingleCongress(cid) {
  return Comment.findByIdAndRemove(cid).exec();
}

const Comment = mongoose.model('Comment', commentsSchema);
const Legislator = mongoose.model('Legislator', legislatorSchema);

module.exports = {
  Comment,
  Legislator,
  getAllCongressMembers,
  getCommentsForSingleCongress,
  deleteCommentForSingleCongress,
  createNewComment,
  updateCommentsForSingleCongress
};
