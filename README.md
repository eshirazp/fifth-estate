FIFTH ESTATE
https://aqueous-tundra-94039.herokuapp.com/

#INTRODUCTION
Fifth Estate is a web application designed to display all members of the United States of America Congress for each specific state. Each member of Congress comes with his/her name, position (Senator, Representative), state, state district number (for Representatives only), and political party. The end goal is to educate users on their elected officials.
Each member of Congress comes complete with his/her own set of comments created by users. Comments display the user's name and review, and existing comments can only be edited by the one's that have created them.

#HIGH LEVEL DESIGN
  Fifth Estate was created as a full stack application, complete with a Mongo database, Node/Express server, and HTML5/ CSS3 front end. The application starts from server.js, which connects to a specific database (models/connectDB.js), starts the server, and then sends the static front end (public folder). The routers folder is the REST API that connects the database to the front end.

#LOW LEVEL DESIGN
-server.js-
  The starting point of the web application. Sends the index.html as the homepage, and sends all /legs requests to the legislatorRouter.js. Opens/closes the server, but only after connecting/disconnecting the database.

-config.js-
  All global variables used in various parts of the code, that can change based on test, development, or production environments.


--------
-MODELS-
--------
--connectDB.js--
  Sole purpose is to connect and properly disconnect to the MongoDB. It uses the Mongoose connection methods to accomplish this. All methods return a promise to be used by server.js, and output a string to the console to describe the connection status of the database. The methods can properly disconnect the database if server restarts, server stops, or Heroku stops.

--legislator.js--
  Creates a schema to be used by each member of the legislative branch, and creates a schema for the comments. The legislative schema and the comments schema use the Mongoose Population to connect the two schemas with their usid keys. What this does is allow each member of Congress to contain their own collection of comments, similar to subdocments (but use Mongoose Population strategy instead).
  Each schema is complete with their own virtual methods to output data to the router, which is later used by the client side.


--------
-PUBLIC-
--------
--css--
---main.css---
  Various rulesets for the client side. All rulesets contains comments to specifically describe what the ruleset is targeting

---vendor/foundation.min.css---
  Used the Foundation 6 CSS for the x-y grid as well as modal used by index.html

--images--
--videoes--
  Images and videoes used by the banner heading

--views--
---index.html---
  The only view of the web application. It is meant to be a single page application of beautiful simplicity. Their is only a title banner with an image, title, and dropdown menu of all the states in America. Once the user selects the state, the results are shown below the title image and are separated by position, Senators or Representatives.

--js--
---api.js---
  This is the REST API on the client side that makes fetch calls to the database, via the routers/legislatorRouter.js. app.js calls upon this file to update it's stores object which then updates the DOM. api.js is the glue between the client side and the server side, in which it constantly grabs data from the server and feeds it to the client. Complete with methods to grab all members of Congress based on position and state, as well as make calls to create, retrieve, update, or delete specific comments for each of those members of Congress.

---app.js---
  This feeds directly into index.html, in which it contains it own local object, stores, to constantly update the DOM. app.js grabs initial data from the api.js to grab a list of legislators and their comments, and then store it locally. When a user makes a call to create, retrieve, update, or delete a comment, a call is made to api.js to update the database, but app.js also updates its own local copy of stores to quickly update the DOM without waiting for the database to complete. This is done to ensure the user enjoys a quicker experience.

---vendor/foundation.min.js---
  Used the Foundation 6 JS for the modal used by index.html


---------
-ROUTERS-
---------
--legislatorRouter.js--
  Makes direct HTTP verb calls to the MongoDB. For each member of Congress, only the GET verb is used. Point is the user should never be able to create, update, or delete a congress person. Only the server admin can do that manually based on elections. GET, POST, PUT, DELETE are all available however for each member of Congress since that is what users have control over.

#ROADMAP v1.1
1. Adding username and password authentication to be created or accessed before using the application
2. Adding congressional committees to each member of Congress
3. Share comments via Facebook
