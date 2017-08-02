const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const {Comment, Legislator} = require('../models/legislator');
const {app} = require('../server');
const {testRunServer, testCloseServer, tearDownDb} = require('./helpers');

const should = chai.should();
chai.use(chaiHttp);

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
  seedData.push({
    usid: "12345A",
    username: faker.internet.userName(),
    name: faker.name.firstName(),
    review: faker.lorem.sentence()
  });
  // this will return a promise
  return Comment.insertMany(seedData);
}

describe('Legislator API', function() {
  before(testRunServer);
  beforeEach(function() {
    return seedLegislatorData();
  });
  afterEach(tearDownDb);
  after(testCloseServer);

  describe('GET endpoint for Congress Member', function() {
    it('GET: List all Congress Members', function() {
      return chai.request(app)
      .get('/legs')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
    });
  });
});

describe('Comment API', function() {
  before(testRunServer);
  beforeEach(function() {
    return seedCommentData();
  });
  afterEach(tearDownDb);
  after(testCloseServer);

  describe('POST Endpoint for Comment', function() {
    it('POST: Create a comment for one congress member', function() {
      const newPost = {
        usid: faker.lorem.words(),
        username: faker.internet.userName(),
        name: faker.name.firstName(),
        review: faker.lorem.sentence()
      };

      return chai.request(app)
        .post('/legs/12345A')
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
        });
    });
  });

  describe('GET Endpoint for Comment', function() {
    it('GET: List all comments for one congress members', function() {
      return chai.request(app)
      .get('/legs/12345A')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
    });
  });

  describe('PUT Endpoint for Comment', function() {
    it('PUT: Update a comment for one congress member', function() {
      const updateData = {
        usid: faker.lorem.words(),
        username: faker.internet.userName(),
        name: faker.name.firstName(),
        review: faker.lorem.sentence()
      };

      return Comment
        .findOne()
        .exec()
        .then(post => {
          updateData.id = post.id;

          return chai.request(app)
            .put(`/legs/12345A/${post.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
        });
    });
  });

  describe('DELETE Endpoint for Comment', function() {
    it('DELETE: Delete a comment for one congress member', function() {
      let post;

      return Comment
        .findOne()
        .exec()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/legs/12345A/${post.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Comment.findById(post.id);
        })
        .then(_post => {
          should.not.exist(_post);
        });
    });
  });
});
