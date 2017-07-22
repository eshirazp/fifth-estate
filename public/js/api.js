/* global window */

(function() {
  window.retrieveByState = function(state, type) {

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
})();
