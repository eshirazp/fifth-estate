const chai = require('chai');
const chaiHttp = require('chai-http');

const {DATABASE_URL} = require('../config');
const {runServer, app, closeServer} = require('../server');
//const {createCommentAPI} = require('../public/js/api');

const should = chai.should();

// describe('Legislator Model', function() {
//   before(function() {
//     return runServer(DATABASE_URL);
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   it('createCommentAPI', function() {
//     var comment = {
//       username: "eshirazp",
//       name: "Elush Shirazpour",
//       review: "Hes great!"
//     };
//     //createCommentAPI(597d193fee6c5fc2b9f043af, comment);
//
// });
