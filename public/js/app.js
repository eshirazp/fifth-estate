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
        "name": "David Vigodneir",
        "review": "Hes great!"
      },
      {
        "name": "Anna Castro",
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

var retrieveByState = function(state, type) {

  var retrieveBySenator = function(congress) {
    let arr = [];
    for(let i=0; i < congress.length; i++) {
      if(congress[i].terms[congress[i].terms.length-1].type === "sen") {
        arr.push(parseResult(congress[i]));
      }
    }
    return arr;
  };

  var retrieveByRepresentative = function(congress) {
    let arr = [];
    for(let i=0; i < congress.length; i++) {
      if(congress[i].terms[congress[i].terms.length-1].type === "rep") {
        arr.push(parseResult(congress[i]));
      }
    }
    return arr;
  };

  let arr = [];
  for(let i=0; i < legs.length; i++) {
    if(legs[i].terms[legs[i].terms.length-1].state === state) {
      arr.push(legs[i]);
    }
  }
  if(type === "Senators") { return retrieveBySenator(arr); }
  if(type === "Representatives") { return retrieveByRepresentative(arr); }
}


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

var retrieveComments = function(id) {
  let legIdx = findByIdIndex(id);
  if(legIdx === -1) { return; }

  return legs[legIdx].comments;
}

var updateComment = function(id, comment) {
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

function revealResults(state) {
  let cardSetupBeg = '<div class="results-card medium-3 small-4 cell">';
  let cardSetupEnd = '</div>';

  let senators = retrieveByState(state, "Senators");
  let senatorsHTML = "";

  for(let i=0; i < senators.length; i++) {
    senatorsHTML += cardSetupBeg + '<img src="https://theunitedstates.io/images/congress/original/D000598.jpg" alt="">' + '<p class="results-text">' + senators[i].official_full + '</p>' + '<p class="results-text">Senator' + '<p class="results-text">' + senators[i].state + '</p>' + '<p class="results-text">' + senators[i].party + '</p>' + cardSetupEnd;
  }

  let representatives = retrieveByState(state, "Representatives");
  let representativesHTML = "";

  for(let i=0; i < representatives.length; i++) {
    representativesHTML += cardSetupBeg + '<img src="https://theunitedstates.io/images/congress/original/D000598.jpg" alt="">' + '<p class="results-text">' + representatives[i].official_full + '</p>' + '<p class="results-text">Representative' + '<p class="results-text">' + representatives[i].state + '- District ' +  representatives[i].district + '</p>' +  '<p class="results-text">' + representatives[i].party + '</p>' + cardSetupEnd;
  }

  $('.js-senators-div').empty();
  $('.js-representatives-div').empty();

  $('.js-senators-div').html(senatorsHTML);
  $('.js-representatives-div').html(representativesHTML);
}


$(function() {
  $("#js-dropdown-submit").click(function(event) {
    event.preventDefault();
    var state = $(this).parent('#js-dropdown-form').find('select[name="states"] option:selected').val();
    revealResults(state);
  });
});

var debugCRUD = function() {
  var exampleComment1_1 = {"name": "Sean Delshad", "review": "no man!"};
  var exampleComment1_2 = {"name": "Sean Delshad", "review": "I can do better"};
  var exampleComment2_1 = {"name": "Josh Yacoby", "review": "He wants to raise health insurance"};

  console.log(retrieveAll());
  console.log(retrieveOne(12345));
  console.log(createComment(12345, exampleComment1_1));
  console.log(retrieveComments(12345));
  console.log(updateComment(12345, exampleComment1_2));
  console.log(updateComment(12345, exampleComment2_1));
  console.log(deleteComment(12345, exampleComment1_2));

  console.log("Senators");
  console.log(retrieveByState("CA", "Senators"));
  console.log("Representatives");
  console.log(retrieveByState("CA", "Representatives"));
}
