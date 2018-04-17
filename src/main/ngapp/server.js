var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";

//
// Serves all the dist directory as a web application
//
app.use(express.static(distDir));

//
// Catch-all route that ensures any paths added to the host
// in the address bar, eg. example.com/dataservices, are passed
// on to the angular app to handle.
//
// Ensures that manually entered addresses are handled by
// angular and express remains a simple passthrough.
//
app.get('*', function (req, res) {
  res.sendFile(distDir + '/index.html');
});

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
