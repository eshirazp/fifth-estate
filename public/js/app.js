"use strict";

const ENTER_KEY = 13;
const MAX_COMMENTS = 5;

/* Local store which is used by renderHTML */
var store = {};


/******************************************************************************
  commentResults
    Acquire Comments HTML Strings for renderHTML
********************************************************************************/
function commentResults(comments) {
  var commentsListBeg = '<div class="js-comments-list">'
  var commentBeg='<div class="comment">';
  var updateButton = (selectedUserName, selectedCommentID) => `<button data-open="myModal" data-username=${selectedUserName} data-cid=${selectedCommentID} class="js-update-button comment-button update-button">Update</button>`;
  var deleteButton = (selectedUserName, selectedCommentID) => `<button data-open="myModal-delete" data-username=${selectedUserName} data-cid=${selectedCommentID} class="js-delete-button comment-button delete-button">Delete</button>`;
  var addButton = '<button data-open="myModal" class="js-add-button comment-button add-button">Add Comment</button>';
  var divEnd = '</div>';

  var commentsHTML = "";
  var len = comments.length;

  if(len > MAX_COMMENTS) {
    len = MAX_COMMENTS;
  }
  for(var i=0; i < len; i++) {
    commentsHTML += commentsListBeg + commentBeg + '\
    <p class="comment-text"><b>' + comments[i].name + '</b>: \
    <i>' + comments[i].review + '</i></p>' + '\
    ' + divEnd + updateButton(comments[i].username, comments[i]._id) + deleteButton(comments[i].username, comments[i]._id) + divEnd;
  }
  commentsHTML += addButton;
  return commentsHTML;
}

/******************************************************************************
  senatorsResults
    Acquire Senators HTML Strings for renderHTML
********************************************************************************/
function senatorsResults() {
  var cardSetupBeg = (selectedID, selectedType) => `<div data-id=${selectedID} data-type=${selectedType} class="results-card medium-2 small-3 cell">`;
  var divEnd = '</div>';
  var senatorsHTML = "";

  for(var i=0; i < store.sen.length; i++) {
    var commentsHTML = commentResults(store.sen[i].comments);

    senatorsHTML += cardSetupBeg(store.sen[i].id, store.sen[i].type) + '\
      <img src="https://theunitedstates.io/images/congress/450x550/' + store.sen[i].bioguide + '.jpg" alt="">' + '\
      <p class="results-text">' + store.sen[i].official_full + '</p>' + '\
      <p class="results-text">Senator</p>' + '\
      <p class="results-text">' + store.sen[i].state + '</p>' + '\
      <p class="results-text">' + store.sen[i].party + '</p>' + '\
      ' + commentsHTML + divEnd;
  }

  return senatorsHTML;
}

/******************************************************************************
  representativesResults
    Acquire Representatives HTML Strings for renderHTML
********************************************************************************/
function representativesResults() {
  var cardSetupBeg = (selectedID, selectedType) => `<div data-id=${selectedID} data-type=${selectedType} class="results-card medium-2 small-3 cell">`;
  var divEnd = '</div>';
  var representativesHTML = "";

  for(var i=0; i < store.rep.length; i++) {
    var commentsHTML = commentResults(store.rep[i].comments);

    representativesHTML += cardSetupBeg(store.rep[i].id, store.rep[i].type) + '\
      <img src="https://theunitedstates.io/images/congress/450x550/' + store.rep[i].bioguide + '.jpg" alt="">' + '\
      <p class="results-text">' + store.rep[i].official_full + '</p>' + '\
      <p class="results-text">Representative' + '\
      <p class="results-text">' + store.rep[i].state + '- District ' +  store.rep[i].district + '</p>' +  '\
      <p class="results-text">' + store.rep[i].party + '</p>' + '\
      ' + commentsHTML + divEnd;
  }

  return representativesHTML;
}

/******************************************************************************
  hideSearching
    Hide the searching notification for the banner
********************************************************************************/
function hideSearching() {
  $('.js-searching').addClass("hidden");
}

/******************************************************************************
  revealSearching
    No longer hide the searching notification for the banner
********************************************************************************/
function revealSearching() {
  $('.js-searching').removeClass("hidden");
}

/******************************************************************************
  revealResultsHeaders
    No longer hide the results for the DOM
********************************************************************************/
function revealResultsHeaders() {
  $('.js-results-header').removeClass("hidden");
}

/******************************************************************************
  renderHTML
    Use the store object to completely redraw the DOM
********************************************************************************/
function renderHTML() {
  let senatorsHTML = senatorsResults();
  let representativesHTML = representativesResults();

  $('.js-senators-div').empty();
  $('.js-representatives-div').empty();

  revealSearching();
  revealResultsHeaders();
  $('.js-senators-div').html(senatorsHTML);
  $('.js-representatives-div').html(representativesHTML);

  setTimeout(function() {
    hideSearching();
  }, 1000);
}

/******************************************************************************
  configureStore
    Update the store with new information using the API
********************************************************************************/
function configureStore(state) {
  var errorHandler = (err) => console.error("Could not get state congress: " + err);
  store.state = state;
  var getSenState = retrieveByState(store.state, "Senators");
  var getRepState = retrieveByState(store.state, "Representatives");

  Promise.all([getSenState, getRepState])
  .then((arr) => {
    store.sen = arr[0];
    store.rep = arr[1];
    renderHTML();
  })
  .catch(errorHandler);
}

/******************************************************************************
  congressIdx
    Acquire the index of the stores object for a specific congress member
********************************************************************************/
function congressIdx(id, type) {
  if(type === "sen") {
    for(var i=0; i < store.sen.length; i++) {
      if(store.sen[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  if(type === "rep") {
    for(var i=0; i < store.rep.length; i++) {
      if(store.rep[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  return -1;
}

/******************************************************************************
  commentIdx
    Acquire the index of the stores object for a specific comment
********************************************************************************/
function commentIdx(conIdx, type, commentID) {
  if(type === "sen") {
    for(var i=0; i < store.sen[conIdx].comments.length; i++) {
      if(store.sen[conIdx].comments[i]._id === commentID) {
        return i;
      }
    }
    return -1;
  }

  if(type === "rep") {
    for(var i=0; i < store.rep[conIdx].comments.length; i++) {
      if(store.rep[conIdx].comments[i]._id === commentID) {
        return i;
      }
    }
    return -1;
  }

}

/******************************************************************************
  createComment
    Add a comment to the stores object, while also calling the
    createComment API
********************************************************************************/
function createComment(comment) {
  var conIdx = congressIdx(store.currentID, store.currentType);

  if(store.currentType === 'sen') {
    store.sen[conIdx].comments.push(comment);
  }
  if(store.currentType === 'rep') {
    store.rep[conIdx].comments.push(comment);
  }

  createCommentAPI(store.currentID, comment);
  renderHTML();
}

/******************************************************************************
  updateComment
    Update a comment to the stores object, while also calling the
    updateComment API
********************************************************************************/
function updateComment(comment, username) {
  var conIdx = congressIdx(store.currentID, store.currentType);
  var comIdx = commentIdx(conIdx, store.currentType, store.currentCommentID);

  if(updateCommentAPI(store.currentID, store.currentCommentID, comment, store.currentUsername, username) == -1)
    return;

  if(store.currentType === 'sen') {
    store.sen[conIdx].comments[comIdx].name = comment.name;
    store.sen[conIdx].comments[comIdx].review = comment.review;
  }

  if(store.currentType === 'rep') {
    store.rep[conIdx].comments[comIdx].name = comment.name;
    store.rep[conIdx].comments[comIdx].review = comment.review;
  }
  renderHTML();
}

/******************************************************************************
  deleteComment
    Delete a comment to the stores object, while also calling the
    deleteComment API
********************************************************************************/
function deleteComment(username) {
  var conIdx = congressIdx(store.currentID, store.currentType);
  var comIdx = commentIdx(conIdx, store.currentType, store.currentCommentID);

  if(deleteCommentAPI(store.currentID, store.currentCommentID, store.currentUsername, username) == -1)
    return;

  if(store.currentType === 'sen') {
    store.sen[conIdx].comments.splice(comIdx, 1);
  }

  if(store.currentType === 'rep') {
    store.rep[conIdx].comments.splice(comIdx, 1);
  }
  renderHTML();
}

/******************************************************************************
  Event Handlers
********************************************************************************/
$(function() {
  var updateTrueOrCreateFalseFlag;

  /* Submit button on the dropdown menu in the title banner */
  $("#js-dropdown-submit").click(function(event) {
    event.preventDefault();
    var state = $(this).parent('#js-dropdown-form').find('select[name="states"] option:selected').val();
    configureStore(state);
    var etop = $('.content').offset().top;
    $('html, body').animate({
	     scrollTop: etop
	  }, 1000);
  });

  /* Pressing ENTER key on the dropdown menu in the title banner */
  $("#js-dropdown-form").keypress(function(event) {
    if(event === ENTER_KEY) {
      event.preventDefault();
      var state = $(this).find('select[name="states"] option:selected').val();
      configureStore(state);
      var etop = $('.content').offset().top;
      $('html, body').animate({
  	     scrollTop: etop
  	  }, 1000);
    }
  });

  /* Add Comment */
  $(".content").on("click", ".js-add-button", (function(event) {
    event.preventDefault();
    store.currentUsername = $(this).parent('.results-card').attr('data-username');
    store.currentID = $(this).parent('.results-card').attr('data-id');
    store.currentType = $(this).parent('.results-card').attr('data-type');
    updateTrueOrCreateFalseFlag = false;
  }));

  /* Update Comment */
  $(".content").on("click", ".js-update-button", (function(event) {
    event.preventDefault();
    store.currentUsername = $(this).attr('data-username');
    store.currentCommentID = $(this).attr('data-cid');
    store.currentID = $(this).parent('.js-comments-list').parent('.results-card').attr('data-id');
    store.currentType = $(this).parent('.js-comments-list').parent('.results-card').attr('data-type');
    updateTrueOrCreateFalseFlag = true;
  }));

  /* Delete Comment */
  $(".content").on("click", ".js-delete-button", (function(event) {
    event.preventDefault();
    store.currentUsername = $(this).attr('data-username');
    store.currentCommentID = $(this).attr('data-cid');
    store.currentID = $(this).parent('.js-comments-list').parent('.results-card').attr('data-id');
    store.currentType = $(this).parent('.js-comments-list').parent('.results-card').attr('data-type');
  }));

  /* Delete Comment Modal */
  $('.js-submit-modal-delete').submit(function(event) {
    event.preventDefault();
    var username = $(this).parent().find('.username').val();
    deleteComment(username);
    $('#myModal-delete').foundation('close');
  });

  /* Add or Update Button Modal */
  $('.js-submit-modal').submit(function(event) {
    event.preventDefault();
    var username = $(this).parent().find('.username').val();
    var name = $(this).parent().find('.name').val();
    var review = $(this).parent().find('.review').val();
    comment = {
      "_id": store.currentCommentID,
      "username": username,
      "name": name,
      "review": review
    };

    if(updateTrueOrCreateFalseFlag)
      updateComment(comment, username);
    else
      createComment(comment);

    $('#myModal').foundation('close');
  });
});
