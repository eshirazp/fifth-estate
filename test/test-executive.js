const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const should = chai.should();
const {app, runServer, closeServer} = require('../server');

describe('Executive', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('GET: list all President and Vice Presidents', function() {
    return chai.request(app)
    .get('/prez')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.above(0);
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.have.all.keys('_id', 'usid', 'name', 'bio', 'terms', 'comments')
      });
    });
  });

});
