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

// JS-XSLX Setup
var XLSX = require('xlsx');
// URL for test file hosted on dropbox
// var url = 'https://www.dropbox.com/s/jmm55r6fjiqd1yp/test_data.xlsx?dl=1';
// var https = require('https');

// https.get(url, function(res) {

//   var data = [];
  
//   res.on('data', function(chunk) {
//     data.push(chunk);
//   });

//   res.on('end', function() {
//     data = Buffer.concat(data);
//     console.log(data.toString());
//   });

// });

var workbook = XLSX.readFile('./public/assets/test_data.xlsx');
// console.log(workbook.SheetNames);
// This is the reference to the inventory sheet
var worksheet = workbook.Sheets[workbook.SheetNames[3]];
var json_data = XLSX.utils.sheet_to_json(worksheet);
// console.log('In JSON:', json_data);
for (var cell in worksheet) {
  console.log(cell + ':', JSON.stringify(worksheet[cell].v));
}
