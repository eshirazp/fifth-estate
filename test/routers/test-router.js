const {Comment, Legislator, getAllCongressMembers, getCommentsForSingleCongress, deleteCommentForSingleCongress, createNewComment, updateCommentsForSingleCongress} = require('../../models/legislator');
const {tearDownDb, testConnectDB, testGracefulShutdown} = require('../helpers');

const chai = require('chai');

chai.should();

describe('Legislator Model', function() {
  before(testConnectDB);
  afterEach(tearDownDb);
  after(testGracefulShutdown("test"));

  it('Testing the Legislator Model getAllCongressMembers function', function() {
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

  it('Testing the Comment Model createNewComment function ', function() {
    let lid;

    return Legislator
    .create({
      "name.first": "Elush"
    })
    .then(() => {
      const results = getAllCongressMembers();
      return results;
    })
    .then(res => {
      lid = res[0]._id;
      return createNewComment("eshirazp", "Elush", "Review", res[0]._id)
      .then(() => {
        const results = getCommentsForSingleCongress(lid);
        return results;
      })
      .then(res => {
        res.should.be.a('array');
        res[0].username.should.equal("eshirazp");
        res[0].name.should.equal("Elush");
        res[0].review.should.equal("Review");
      });
    });
  });

  it('Testing the Comment Model updateCommentsForSingleCongress function ', function() {
    let lid;

    return Legislator
    .create({
      "name.first": "Elush"
    })
    .then(() => {
      const results = getAllCongressMembers();
      return results;
    })
    .then(res => {
      lid = res[0]._id;
      return Comment
      .create({
        "name": "Elush Review",
        "usid": res[0]._id
      })
      .then(() => {
        const results = getCommentsForSingleCongress(lid);
        return results;
      })
      .then(res => {
        res.should.be.a('array');
        res[0].name.should.equal("Elush Review");
      });
    });
  });

  it('Testing the Comment Model with creating a new entry and then deleting it', function() {
    let lid;
    let cid;

    return Legislator
    .create({
      "name.first": "Elush"
    })
    .then(() => {
      const results = getAllCongressMembers();
      return results;
    })
    .then(res => {
      lid = res[0]._id;
      return Comment
      .create({
        "name": "Elush Review",
        "usid": res[0]._id
      })
      .then(() => {
        const results = getCommentsForSingleCongress(lid);
        return results;
      })
      .then(res => {
        cid = res[0]._id;
        const results = updateCommentsForSingleCongress("eshirazp", "Elush", "Review", lid, cid);
        return results;
      })
      .then(res => {
        const results = getCommentsForSingleCongress(lid);
        return results;
      })
      .then(res => {
        res.should.be.a('array');
        res[0].username.should.equal("eshirazp1");
        res[0].name.should.equal("Elush");
        res[0].review.should.equal("Review");
      });
    });
  });

  it('Testing the Comment Model with creating a new entry and then deleting it', function() {
    let lid;
    let cid;

    return Legislator
    .create({
      "name.first": "Elush"
    })
    .then(() => {
      const results = getAllCongressMembers();
      return results;
    })
    .then(res => {
      lid = res[0]._id;
      return Comment
      .create({
        "name": "Elush Review",
        "usid": res[0]._id
      })
      .then(() => {
        const results = getCommentsForSingleCongress(lid);
        return results;
      })
      .then(res => {
        cid = res[0]._id;
        const results = deleteCommentForSingleCongress(lid, cid);
        return results;
      })
      .then(res => {
        !Comment.findById(cid);
      });
    });
  });

});
