/* global window */

(function() {
  var legs = [
    {
      "usid": {
        "bioguide": "12345A",
        "govtrack": 12345,
        "opensecrets": "12345A",
        "votesmart": 123456
      },
      "name": {
        "first": "Elush",
        "middle": "K",
        "last": "Shirazpour",
        "official_full": "Elush Shirazpour",
      },
      "bio": {
        "birthday": 1989-01-21,
        "gender": "M",
        "religion": "None"
      },
      "terms": [{
        "type": "sen",
        "start": 1989-01-21,
        "end": 3001-01-21,
        "state": "CA",
        "district": 0,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "vgod",
          "name": "David Vigodneir",
          "review": "Hes great!"
        },
        {
          "username": "acastro",
          "name": "Anna Castro",
          "review": "Great lover!"
        }
      ]
    },
    {
      "usid": {
        "bioguide": "12346A",
        "govtrack": 12346,
        "opensecrets": "12346A",
        "votesmart": 123457
      },
      "name": {
        "first": "Anna",
        "middle": "K",
        "last": "Castro",
        "official_full": "Anna Castro",
      },
      "bio": {
        "birthday": 1989-01-21,
        "gender": "F",
        "religion": "None"
      },
      "terms": [{
        "type": "sen",
        "start": 1989-01-21,
        "end": 3001-01-21,
        "state": "CA",
        "district": 0,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "vgod",
          "name": "Davidz Vigodneir",
          "review": "Hes great!"
        },
        {
          "username": "acastro",
          "name": "Annaz Castro",
          "review": "Great lover!"
        }
      ]
    },
    {
      "usid": {
        "bioguide": "22345A",
        "govtrack": 22345,
        "opensecrets": "22345A",
        "votesmart": 223456
      },
      "name": {
        "first": "Samson",
        "middle": "D",
        "last": "Shirazpour",
        "official_full": "Samson Shirazpour",
      },
      "bio": {
        "birthday": 1986-07-02,
        "gender": "M",
        "religion": "None"
      },
      "terms": [{
        "type": "rep",
        "start": 1986-07-02,
        "end": 3001-01-21,
        "state": "CA",
        "district": 6,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "natash",
          "name": "Negar Atashpanjeh",
          "review": "Hes aight!"
        }
      ]
    },
    {
      "usid": {
        "bioguide": "62345A",
        "govtrack": 62345,
        "opensecrets": "62345A",
        "votesmart": 623456
      },
      "name": {
        "first": "Elush",
        "middle": "K",
        "last": "Shirazpour",
        "official_full": "AL Elush Shirazpour",
      },
      "bio": {
        "birthday": 1989-01-21,
        "gender": "M",
        "religion": "None"
      },
      "terms": [{
        "type": "sen",
        "start": 1989-01-21,
        "end": 3001-01-21,
        "state": "AL",
        "district": 0,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "vgod",
          "name": "David Vigodneir",
          "review": "Hes great!"
        },
        {
          "username": "acastro",
          "name": "Anna Castro",
          "review": "Great lover!"
        }
      ]
    },
    {
      "usid": {
        "bioguide": "62346A",
        "govtrack": 62346,
        "opensecrets": "62346A",
        "votesmart": 623457
      },
      "name": {
        "first": "Anna",
        "middle": "K",
        "last": "Castro",
        "official_full": "AL Anna Castro",
      },
      "bio": {
        "birthday": 1989-01-21,
        "gender": "F",
        "religion": "None"
      },
      "terms": [{
        "type": "sen",
        "start": 1989-01-21,
        "end": 3001-01-21,
        "state": "AL",
        "district": 0,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "vgod",
          "name": "David Vigodneir",
          "review": "Hes great!"
        },
        {
          "username": "acastro",
          "name": "Anna Castro",
          "review": "Great lover!"
        }
      ]
    },
    {
      "usid": {
        "bioguide": "72345A",
        "govtrack": 72345,
        "opensecrets": "72345A",
        "votesmart": 723456
      },
      "name": {
        "first": "Samson",
        "middle": "D",
        "last": "Shirazpour",
        "official_full": "AL Samson Shirazpour",
      },
      "bio": {
        "birthday": 1986-07-02,
        "gender": "M",
        "religion": "None"
      },
      "terms": [{
        "type": "rep",
        "start": 1986-07-02,
        "end": 3001-01-21,
        "state": "AL",
        "district": 6,
        "party": "Democrat"
      }],
      "comments": [
        {
          "username": "natash",
          "name": "Negar Atashpanjeh",
          "review": "Hes aight!"
        }
      ]
    }
  ]
  /********************/
  /* Helper Functions */
  /********************/
  var parseResult = function(legObj) {
    return {
      "bioguide": legObj.usid.bioguide,
      "official_full": legObj.name.official_full,
      "type": legObj.terms[legObj.terms.length-1].type,
      "state": legObj.terms[legObj.terms.length-1].state,
      "district": legObj.terms[legObj.terms.length-1].district,
      "party": legObj.terms[legObj.terms.length-1].party,
      "comments": legObj.comments
    }
  }

  var findByIdIndex = function(id) {
    for(let i=0; i < legs.length; i++) {
      if(id === legs[i].usid.govtrack)
        return i;
    }
    const message = `Wrong id \`${id}\` in request body`
    console.log(message);
    return -1;
  };

  /**************************/
  /* Retriving for Congress */
  /**************************/
  var retrieveAll = function() {
    let arr = [];
    for(let i=0; i < legs.length; i++) {
      arr.push(parseResult(legs[i]));
    }
    return arr;
  };

  var retrieveOne = function(id) {
    let legIdx = findByIdIndex(id);

    if(legIdx === -1) { return; }

    return parseResult(legs[legIdx]);
  };

  /*********************/
  /* CRUD for Comments */
  /*********************/
  var checkRequiredFieldsComments = function(comment) {
    const requiredFields = ['name', 'review'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in comment)) {
        const message = `Missing \`${field}\` in request body`
        console.log(message);
        return false;
      }
    }
    return true;
  };

  var retrieveExistingComment = function(leg, comment) {
    for(let i=0; i < leg.comments.length; i++) {
      if(leg.comments[i].name === comment.name) {
        return i;
      }
    }
    const message = `Review name \`${comment.name}\` in request body does not exist`
    console.log(message);
    return -1;
  };

  var createComment = function(id, comment) {
    let legIdx = findByIdIndex(id);
    if(legIdx === -1) { return; }

    if(!(checkRequiredFieldsComments(comment))) { return; }

    legs[legIdx].comments.push(comment);
    return parseResult(legs[legIdx]);
  };

  var retrieveComments2 = function(id) {
    let legIdx = findByIdIndex(id);
    if(legIdx === -1) { return; }

    return legs[legIdx].comments;
  }

  var updateCommentAPI = function(id, comment) {
    let legIdx = findByIdIndex(id);
    if(legIdx === -1) { return; }

    if(!(checkRequiredFieldsComments(comment))) { return; }

    let newCommentIdx = retrieveExistingComment(legs[legIdx],comment);
    if(newCommentIdx === -1) { return; }
    legs[legIdx].comments[newCommentIdx] = comment;
    return parseResult(legs[legIdx]);
  };

  var deleteComment = function(id, comment) {
    let legIdx = findByIdIndex(id);
    if(legIdx === -1) { return; }

    let newCommentIdx = retrieveExistingComment(legs[legIdx],comment);
    if(newCommentIdx === -1) { return; }

    legs[legIdx].comments.splice(newCommentIdx, 1);
    return parseResult(legs[legIdx]);
  };


  var retrieveComments = function(id) {
    var request = new Request('http://localhost:8080/legs/' + id, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request)
    .then(function(response) {
      return response.json().then(function(arr) {
        return Promise.resolve(arr);
      });
    });
  }

  window.retrieveByState = function(state, type) {

    var retrieveBySenator = function(congress) {
      var commentList = [];

      for(var i=0; i < congress.length; i++) {
        if(congress[i].type === "sen" && congress[i].state === state) {
          commentList.push(retrieveComments(congress[i].id));
        }
      }

      return Promise.all(commentList)
      .then((com) => {
        var arr = [];

        for(var i=0; i < congress.length; i++) {
          if(congress[i].type === "sen" && congress[i].state === state) {
            if(com[i]) {
              congress[i].comments = com[i];
            }
            else {
              congress[i].comments = [];
            }
            arr.push(congress[i]);
          }
        }

        return Promise.resolve(arr);
      });
    };

    var retrieveByRepresentative = function(congress) {
      var commentList = [];

      for(var i=0; i < congress.length; i++) {
        if(congress[i].type === "rep" && congress[i].state === state) {
          commentList.push(retrieveComments(congress[i].id));
        }
      }

      return Promise.all(commentList)
      .then((com) => {
        var arr = [];

        for(var i=0; i < congress.length; i++) {
          if(congress[i].type === "rep" && congress[i].state === state) {
            if(com[i]) {
              congress[i].comments = com[i];
            }
            else {
              congress[i].comments = [];
            }
            arr.push(congress[i]);
          }
        }

        return Promise.resolve(arr);
      });
    };

    var request = new Request('http://localhost:8080/legs/', {
    	method: 'GET',
    	mode: 'cors',
    	redirect: 'follow',
    	headers: new Headers({
    		'Content-Type': 'application/json'
    	})
    });

    return fetch(request)
    .then(function(response) {
      return response.json().then(function(arr) {
        if(type === "Senators") { return retrieveBySenator(arr); }
        if(type === "Representatives") { return retrieveByRepresentative(arr); }
      });
    });
  }
})();
