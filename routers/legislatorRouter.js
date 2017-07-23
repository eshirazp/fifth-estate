"use strict";

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Comment, Legislator} = require('../models/legislator');

/************************************/
/* CRUD for each member of Congress */
/************************************/
// router.post('/', jsonParser, (req,res) => {
//   const requiredFields = ["usid", "name"];
//   for(let i=0; i < requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if(!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(req.body);
//     }
//   }
//   Legislator.create({
//     usid: req.body.usid,
//     name: req.body.name
//   })
//   .then(president => res.status(201).json(president))
//   .catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'Something went wrong'});
//     });
// });
// router.get('/:state', (req, res) => {
//   var arr = [];
//
//   Legislator
//     .find()
//     .exec()
//     .then(congress => {
//       for(var i=0; i < congress.length; i++) {
//         if(congress[i].terms[0].state == req.params.state)
//           arr.push(congress[i]);
//       }
//       res.status(200).json(arr);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({error: 'Could not get list of Congress'});
//     });
// });
// router.put('/:id', jsonParser, (req,res) => {
//   const updated = {};
//   const updateableFields = ["usid", "name"];
//   updateableFields.forEach(field => {
//     if (field in req.body) {
//       updated[field] = req.body[field];
//     }
//   });
//   Executive
//     .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
//     .exec()
//     .then(president => res.status(201).json(president))
//     .catch(err => res.status(500).json({message: 'Could not update'}));
// });
// router.delete('/:id', (req, res) => {
//   Executive.findByIdAndRemove(req.params.id)
//   .exec()
//   .then(() => res.status(204).json({message: 'success'}))
//   .catch(err => {
//     console.error(err);
//     res.status(500).json({error: 'Could not delete'});
//   });
// });
router.get('/', (req, res) => {
  Legislator
    .find()
    .exec()
    .then(congress => {
      res.status(200).json(congress);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Could not get list of Congress'});
    });
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
  .then((congress) => {
    res.status(201).json(congress);
  });
});
//Retrieve all comments for single member of Congress
router.get('/:id', (req,res) => {
  var arr = [];

  Comment
  .find({usid: req.params.id})
  .exec()
  .then(congress => {
    res.json(congress);
  });
});
//Retrieve username comments for single member of Congress
router.get('/:id/:username', (req,res) => {
  var arr = [];

  Comment
  .find({usid: req.params.id, username: req.params.username})
  .exec()
  .then(congress => {
    res.json(congress);
  });
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
