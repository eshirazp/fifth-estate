"use strict";

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Comment, Legislator} = require('../models/legislator');

/* CRUD for each member of Congress */
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
  Legislator.create({
    usid: req.body.usid,
    name: req.body.name
  })
  .then(president => res.status(201).json(president))
  .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});
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
router.get('/:id', (req,res) => {
  Legislator
    .findById(req.params.id)
    .exec()
    .then(congress => {
      res.json(congress);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Could not find that member of Congress'});
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

/* CRUD for the comments */
router.get('/:id/:username', (req,res) => {
  var arr = [];

  Comment
  .find({username: req.params.username})
  .exec()
  .then(congress => {
    res.json(congress);
  });

  // Legislator
  // .findById(req.params.id)
  //   .select('comments')
  //   .exec()
  //   .then(congress => {
  //     for(var i=0; i < congress.comments.length; i++) {
  //       if(congress.comments[i].username === req.params.username) {
  //         arr.push(congress.comments[i]);
  //       }
  //     }
  //     res.status(200).json(arr);
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     res.status(500).json({error: 'Could not find that username review of that member of Congress'});
  //   });
});

// Create Comment
router.post('/:id', jsonParser, (req,res) => {
  const requiredFields = ["username", "name", "review"];
  for(let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body[0])) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(req.body);
    }
  }

  console.log(req.params.id);
  console.log(req.body[0]);

  Legislator
    .findOneAndUpdate(
      {"_id": req.params.id},
      {
        "$push": {
          "comments": req.body[0]
        }
      },
      function(err, congress) {
        if(err) {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
        }
        res.status(201).json(congress);
      }
    );
});

router.put('/:id/:cid', jsonParser, (req,res) => {
  const updated = {};
  const updateableFields = ["username", "name", "review"];
  updateableFields.forEach(field => {
    if (field in req.body.comments) {
      updated[field] = req.body[field];
    }
  });
  Legislator
    .findOneAndUpdate(
      {"_id": req.params.id, "comments._id": req.params.cid},
      {
        "$set": {
          "comments": req.body.comments
        }
      },
      function(err, congress) {
        if(err) {
          console.error(err);
          res.status(500).json({error: 'Something went wrong'});
        }
        res.status(201).json(congress);
      }
    );
});



module.exports = router;
