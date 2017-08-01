const {Comment, Legislator, getAllCongressMembers} = require('../../models/legislator');
const {tearDownDb, testConnectDB, testGracefulShutdown} = require('../helpers');

const chai = require('chai');

chai.should();

describe('Legislator Model', function() {
  before(testConnectDB);
  afterEach(tearDownDb);
  after(testGracefulShutdown("test"));


  it('Testing the Legislator Model with creating a new entry and checking if it is there', function() {
    return Legislator
    .create({
      "name.first": "Elush"
    })
    .then(() => {
      const results = getAllCongressMembers();
      return results;
    })
    .then(res => {
      res.should.be.a('array');
      res[0].name.first.should.equal("Elush");
    });
  });

});
