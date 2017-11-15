
// How to make this production-ready?

// Get a notification if too many failures happen
// Heroku addons:create papertrail
// How to keep a record of searched for emails?
// Implement rate limiting?
// I saw somewhere that env files are not recommended in a production environment

require('dotenv').load();
var clearbit = require("clearbit")(process.env.CLEARBIT_KEY);
var express = require("express");
var cors = require("cors");

var app = express();
app.use(cors());

app.get("/reach", function(req, res) {

  var Combined = clearbit.Enrichment;
  Combined.find({email: req.query.email})
  .then(function(combined) {
    var response = combined;
    console.log(req.query.email +  ", " + response.person.id + ", " + response.company.id);
    res.end(JSON.stringify(response));
  })
  .catch(Combined.QueuedError, function(err) {
    console.log(err);
  })
  .catch(Combined.NotFoundError, function(err) {
    console.log(err);
  })
  .catch(function (err) {
    console.log(err);
  });

});

var server = app.listen(process.env.PORT || 5000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening on port %s", port);
});
