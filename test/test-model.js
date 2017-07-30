const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');


const {DATABASE_URL} = require('../config');
const {Comment, Legislator} = require('../models/legislator');
const {runServer, app, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const should = chai.should();
chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

function seedLegislatorData() {
  console.info('seeding Legislator data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      usid: {
        bioguide: faker.lorem.words(),
        govtrack: faker.random.number(),
        opensecrets: faker.lorem.words(),
        votesmart: faker.random.number()
      },
      name: {
        first: faker.name.firstName(),
        middle: faker.name.firstName(),
        last: faker.name.lastName(),
        official_full: faker.name.lastName()
      },
      bio: {
        birthday: faker.date.past(),
        gender: "M",
        religion: "Christian",
      },
      terms: [{
        type: "sen",
        district: faker.random.number(),
        state: "CA",
        party: "Democrat"
      }],
      comments: []
    });
  }
  // this will return a promise
  return Legislator.insertMany(seedData);
}

function seedCommentData() {
  console.info('seeding Comment data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      usid: faker.lorem.words(),
      username: faker.internet.userName(),
      name: faker.name.firstName(),
      review: faker.lorem.sentence()
    });
  }
  // this will return a promise
  return Comment.insertMany(seedData);
}

describe('Legislator Model', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedLegislatorData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint for Congress Member', function() {
    it('GET: List all Congress Members', function() {
      return chai.request(app)
      .get('/legs')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys('id', 'bioguide', 'official_full', 'type', 'state', 'party', 'district', 'comments');
        });
      });
    });
  });
});

// describe('Comment Model', function() {
//
//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });
//
//   before(function() {
//     return seedLegislatorData();
//   });
//
//   beforeEach(function() {
//     return seedCommentData();
//   });
//
//   afterEach(function() {
//     return tearDownDb();
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   describe('GET Endpoint for Comment', function() {
//     it('GET: List all comments for one congress members', function() {
//       return Legislator
//       .findOne()
//       .exec()
//       .then(congress => {
//         return chai.request(app)
//         .get(`/legs/${congress.id}`)
//       })
//       .then(function(res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('array');
//         res.body.length.should.be.above(0);
//         res.body.forEach(function(item) {
//           item.should.be.a('object');
//           item.should.have.all.keys('usid', 'name', 'review', 'username');
//         });
//       });
//     });
//   });
//
//   describe('POST Endpoint for Comment', function() {
//     it('POST: Create a comment for one congress member', function() {
//       const newPost = {
//         usid: faker.lorem.words(),
//         username: faker.internet.userName(),
//         name: faker.name.firstName(),
//         review: faker.lorem.sentence()
//       };
//
//       return Legislator
//       .findOne()
//       .exec()
//       .then(congress => {
//         return chai.request(app)
//         .post(`/legs/${congress.id}`)
//       })
//       .then(function(res) {
//         res.should.have.status(201);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.should.include.keys('_id', 'usid', 'username', 'name', 'review');
//         res.body.usid.should.equal(newPost.usid);
//         res.body._id.should.not.be.null;
//         res.body.username.should.equal(newPost.username);
//         res.body.name.should.equal(newPost.name);
//         res.body.review.should.equal(newPost.review);
//         return Comment.findById(res.body._id).exec();
//       })
//       .then(function(post) {
//         post.usid.should.equal(newPost.usid);
//         post.username.should.equal(newPost.username);
//         post.name.should.equal(newPost.author.name);
//         post.review.should.equal(newPost.author.review);
//       });
//     });
//   });
//
//   describe('DELETE Endpoint for Comment', function() {
//     it('DELETE: Delete a comment for one congress member', function() {
//       return Legislator
//       .findOne()
//       .exec()
//       .then(congress => {
//         return chai.request(app)
//         .delete(`/legs/${congress.id}`)
//       })
//       .then(function(res) {
//         res.should.have.status(200);
//         res.should.be.json;
//         res.body.should.be.a('array');
//         res.body.length.should.be.above(0);
//         res.body.forEach(function(item) {
//           item.should.be.a('object');
//           item.should.have.all.keys('usid', 'name', 'review', 'username');
//         });
//       });
//     });
//   });
// });
