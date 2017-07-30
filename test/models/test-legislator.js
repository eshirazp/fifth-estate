const {Comment, Legislator} = require('../../models/legislator');
const chai = require('chai');

chai.should();

describe('Legislator Model', function() {
  it('Testing the Legislator apiRepr function', function() {
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
  });

  it('Testing the Legislator virtual districtNum function with district set to 0', function() {
    var legs = new Legislator({
      terms: [{
        state: "CA",
        party: "R",
        district: 0,
        type: "sen"
      }]
    });
    const results = legs.apiRepr();
    results.district.should.be.equal("At Large");
  });

  it('Testing the Legislator virtual districtNum function with district set to not 0', function() {
    var legs = new Legislator({
      terms: [{
        state: "CA",
        party: "R",
        district: 1,
        type: "sen"
      }]
    });
    const results = legs.apiRepr();
    results.district.should.be.equal(legs.terms[0].district);
  });

});
