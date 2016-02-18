var express = require('express');
// var db = require('./server/dbConnect');
var XLSX = require('xlsx');
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

// Code to pull out into ./server/dbConnect.js

var Dropbox = require('dropbox');

var client = new Dropbox.Client({
  // Should grab these from process.env
    key: "eg4e7kgn9lay23i",
    secret: "bioix6bzp3x5oe3"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

client.authenticate(function(error, client) {
  if (error) {
    console.log('Authentication Error:', error);
    return;
  }
  console.log('Authenticated:');
  initializeDB();
});

client.onError.addListener(function(error) {
  console.error('Error:', error);
});

var initializeDB = function() {
  console.log('Beginning import...');
  client.getAccountInfo(function(error, accountInfo) {
    if (error) {
      console.log('Account Error:', error);
      return;
    }
    console.log("Hello, " + accountInfo.name + "!");
  });

  // client.readdir("/Dropbox - Company Documents", function(error, entries) {
  //   if (error) {
  //     console.log('Read directory Error:', error);
  //     return;
  //   }
  //   console.log("Files:", entries.join(", "));
  // });

  var path = '/Dropbox - Company Documents/POS INVENTORY MASTER.xls';

  client.readFile(path, { arrayBuffer: true }, function(error, data) {
    if (error) {
      console.log('readFile error:', error);
      return;
    }
    var stream = new Uint8Array(data);
    // console.log('data:', data);
    var arr = new Array();
    for(var i = 0; i != stream.length; ++i) arr[i] = String.fromCharCode(stream[i]);
    var bstr = arr.join('');
    var workbook = XLSX.read(bstr, {type:'binary'});
    var worksheet = workbook.Sheets['Inventory'];
    var json = sheetToJSON(worksheet);
    // console.log('entries:', json.length);
    console.log('0:', json[0]);
    console.log('1:', json[1]);
    console.log('2:', json[2]);
    console.log('3:', json[3]);
    console.log('4:', json[4]);
    console.log('5:', json[5]);
  });
};

var makeRow = function(json) {
  var headers = json[1];
  var obj = {};
  headers.forEach(function(header) {
    obj[header] = '';
  });
  return obj;
};

var sheetToJSON = function(worksheet) {
  var json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
  var defaultRow = makeRow(json);
  var newRow = makeRow(json);
  var headers = json[1];
  var results = [];
  for (var i = 2; i < json.length; i++) {
    for (var index = 0; index < 23; index++) {
      if (json[i][index] !== undefined) {
        newRow[headers[index]] = json[i][index];
      }
    }
    results.push(newRow);
    newRow = Object.assign({}, defaultRow);
  }
  console.log('Finished import:');
  return results;
};
