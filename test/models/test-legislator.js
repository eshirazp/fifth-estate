const {Comment, Legislator} = require('../../models/legislator');
const chai = require('chai');

chai.should();

describe('Test', function() {
  it('Test 1', function() {
    true.should.equal(true);
  });

  it('Test2', function() {
    var legs = new Legislator({
      terms: [{
        state: "CA",
        party: "R",
        district: 0,
        type: "sen"
      }]
    });
    const results = legs.apiRepr();
    results.should.be.a('object');
    results.should.have.all.keys('id', 'bioguide', 'official_full', 'type', 'state', 'party', 'district', 'comments');
  })
});
