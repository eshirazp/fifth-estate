"use strict";

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Comment, Legislator} = require('../models/legislator');

/****************************************/
/* Retrieve for each member of Congress */
/****************************************/
router.get('/', (req, res) => {
  Legislator
    .find()
    .exec()
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

  Comment.create({
    "username": req.body.username,
    "name": req.body.name,
    "review": req.body.review,
    "usid": req.params.id
  })
  .then((congress) => res.status(201).json(congress))
  .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

function getCommentsForSingleCongress(id) {
  return Comment.find({usid: id}).exec();
}

//Retrieve all comments for single member of Congress
router.get('/:id', (req,res) => {
  Comment
  .find({usid: req.params.id})
  .exec()
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
  Comment.findByIdAndUpdate(req.params.cid,
    {
      "username": req.body.username,
      "name": req.body.name,
      "review": req.body.review,
      "usid": req.params.id
    },
    {upsert: true, new: true})
    .exec()
    .then(comment => res.status(201).json(comment))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

//Delete Comment for single member of Congress
router.delete('/:id/:cid', (req, res) => {
  Comment
    .findByIdAndRemove(req.params.cid)
    .exec()
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.cid}\``);
      res.status(204).end();
    });
});

module.exports = router;
