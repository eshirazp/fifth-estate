/* global window */

(function() {
  /*********************/
  /* CRUD for Comments */
  /*********************/
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

  /**************************/
  /* Retriving for Congress */
  /**************************/
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
