var express = require('express');
var app = express();
var port =  process.env.PORT || 8080;
var path = require('path');
var router = express.Router();

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);
