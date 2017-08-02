"use strict";

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Comment, Legislator, getAllCongressMembers, getCommentsForSingleCongress, deleteCommentForSingleCongress, createNewComment, updateCommentsForSingleCongress} = require('../models/legislator');

/****************************************/
/* Retrieve for each member of Congress */
/****************************************/
router.get('/', (req, res) => {
  getAllCongressMembers()
  .then(congress => {
    res.json(congress.map(con => con.apiRepr()));
  })
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

/*************************/
/* CRUD for the comments */
/*************************/

// Create comment for single member of Congress
router.post('/:id', jsonParser, (req,res) => {
  const requiredFields = ["username", "name", "review"];
  for(let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(req.body);
    }
  }

  createNewComment(req.body.username, req.body.name, req.body.review, req.params.id)
  .then((congress) => res.status(201).json(congress))
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

//Retrieve all comments for single member of Congress
router.get('/:id', (req,res) => {
  getCommentsForSingleCongress(req.params.id)
  .then(congress => res.json(congress))
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

//Retrieve username comments for single member of Congress
router.get('/:id/:username', (req,res) => {
  Comment
  .find({usid: req.params.id, username: req.params.username})
  .exec()
  .then(congress => res.json(congress))
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

// Update comment for single member of Congress
router.put('/:id/:cid', jsonParser, (req,res) => {
  const updated = {};
  const updateableFields = ["username", "name", "review"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  updateCommentsForSingleCongress(req.body.username, req.body.name, req.body.review, req.params.id, req.params.cid)
  .then(comment => res.status(201).json(comment))
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

//Delete Comment for single member of Congress
router.delete('/:id/:cid', (req, res) => {
  deleteCommentForSingleCongress(req.params.cid)
  .then(() => {
    console.log(`Deleted blog post with id \`${req.params.cid}\``);
    res.status(204).end();
  });
});

module.exports = {router};
