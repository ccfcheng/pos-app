// server.js
//
// BASE SETUP
// ==============================================
var express = require('express');
var app = express();
var port =  process.env.PORT || 8080;
var path = require('path');
// ROUTES
// ==============================================
// sample route with a route the way we're used to seeing it
app.get('/sample', function(req, res) {
  res.send('this is a sample!');  
});

// we'll create our routes here
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/about', function(req, res) {
  res.send('this is the about page');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
