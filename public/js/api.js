"use strict";

/* global window */

(function() {

  /******************************************************************************
    createCommentAPI
      Create Comment for the MongoDB using a fetch call with Congress Member 
      ID and Comment
  ********************************************************************************/
  window.createCommentAPI = function(id, comment) {
    var request = new Request('/legs/' + id, {
      method: 'POST',
      body: JSON.stringify(comment),
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    return fetch(request);
  };

  /******************************************************************************
    retrieveComments
      Retrieve Comment from the MongoDB using a fetch call with single 
      Congress Member ID
  ********************************************************************************/
  var retrieveComments = function(id) {
    var request = new Request('/legs/' + id, {
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
  };

  /******************************************************************************
    updateCommentAPI
      Update Comment from the MongoDB using a fetch call with single 
      Congress Member ID, single Comment ID, and new Comment. 
      Username and usernameEntry is for security 
  ********************************************************************************/
  window.updateCommentAPI = function(id, cid, comment, username, usernameEntry) {
    if(username != usernameEntry)
      return -1;

    var request = new Request('/legs/' + id + '/' + cid, {
      method: 'PUT',
      body: JSON.stringify(comment),
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request);
  };

  /******************************************************************************
    deleteCommentAPI
      Delete Comment from the MongoDB using a fetch call with single 
      Congress Member ID, single Comment ID. 
      Username and usernameEntry is for security 
  ********************************************************************************/
  window.deleteCommentAPI = function(id, cid, username, usernameEntry) {
    if(username != usernameEntry)
      return -1;

    var request = new Request('/legs/' + id + '/' + cid, {
      method: 'DELETE',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    return fetch(request);
  };

  /******************************************************************************
    retrieveByState
      Retrieve list of all Congress members based on the state and type (Senator 
      or Representative). Makes fetch request to grab all and then fliter in 
      internal methods within  
  ********************************************************************************/
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

        var idx = -1;
        for(var i=0; i < congress.length; i++) {
          if(congress[i].type === "sen" && congress[i].state === state) {
            if(com[++idx]) {
              congress[i].comments = com[idx];
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

        var idx = -1;
        for(var i=0; i < congress.length; i++) {
          if(congress[i].type === "rep" && congress[i].state === state) {
            if(com[++idx]) {
              congress[i].comments = com[idx];
            }
            arr.push(congress[i]);
          }
        }

        return Promise.resolve(arr);
      });
    };

    var request = new Request('/legs/', {
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
