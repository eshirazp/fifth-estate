"use strict";

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Legislator} = require('../models/legislator');

router.get('/', (req, res) => {
  Legislator
    .find()
    .exec()
    .then(congress => {
      res.json(congress);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Could not get list of Congress'});
    });
});

router.post('/', jsonParser, (req,res) => {
  const requiredFields = ["usid", "name"];
  for(let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(req.body);
    }
  }
  Executive.create({
    usid: req.body.usid,
    name: req.body.name
  })
  .then(president => res.status(201).json(president))
  .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

router.put('/:id', jsonParser, (req,res) => {
  const updated = {};
  const updateableFields = ["usid", "name"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  Executive
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(president => res.status(201).json(president))
    .catch(err => res.status(500).json({message: 'Could not update'}));
});

router.delete('/:id', (req, res) => {
  Executive.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => res.status(204).json({message: 'success'}))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'Could not delete'});
  });
});

module.exports = router;
