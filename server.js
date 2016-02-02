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

var workbook = XLSX.readFile('./public/assets/test_data.xlsx');
// console.log(workbook.SheetNames);
// This is the reference to the inventory sheet
var worksheet = workbook.Sheets[workbook.SheetNames[3]];
// var json_data = XLSX.utils.sheet_to_json(worksheet);
// console.log('In JSON:', json_data);
// var json_data = {};

// Grabs headers from an excel worksheet
var getHeaders = function(worksheet) {
  var headers = [];
  for (var cell in worksheet) {
    if (cell.substr(1) === '1') {
      headers.push(worksheet[cell].v);
    }
  }
  return headers;
};

// Splits a worksheet into rows
var splitRows = function(worksheet) {
  var result = [];
  var row = [];
  for (var cell in worksheet) {
    if (cell[0] === 'A' && row.length !== 0) {
      // We're on a new row, reset row array and start pushing
      result.push(row);
      row = [];
    }
    row.push(worksheet[cell].v);
  }
  return result;
};

// Makes a default row object
var makeRow = function(worksheet) {
  var obj = {};
  var headers = getHeaders(worksheet);
  headers.forEach(function(header) {
    obj[header] = '';
  });
  return obj;
};

// Converts worksheet into JSON
var convertJSON = function(worksheet) {
  var row = makeRow(worksheet);
  var headers = getHeaders(worksheet);
  var json_array = [];
  for (var cell in worksheet) {
    switch (cell[0]) {
      case "A":
        row[headers[0]] = worksheet[cell].v;
        break;
      case "B":
        row[headers[1]] = worksheet[cell].v;
        break;
      case "C":
        row[headers[2]] = worksheet[cell].v;
        break;
      case "D":
        row[headers[3]] = worksheet[cell].v;
        break;
      case "E":
        row[headers[4]] = worksheet[cell].v;
        break;
      case "F":
        row[headers[5]] = worksheet[cell].v;
        break;
      case "G":
        row[headers[6]] = worksheet[cell].v;
        break;
      case "H":
        row[headers[7]] = worksheet[cell].v;
        break;
      case "I":
        row[headers[8]] = worksheet[cell].v;
        break;
      case "J":
        row[headers[9]] = worksheet[cell].v;
        break;
      case "K":
        row[headers[10]] = worksheet[cell].v;
        break;
      case "L":
        row[headers[11]] = worksheet[cell].v;
        break;
      case "M":
        row[headers[12]] = worksheet[cell].v;
        break;
      case "N":
        row[headers[13]] = worksheet[cell].v;
        break;
      case "O":
        row[headers[14]] = worksheet[cell].v;
        break;
      case "P":
        row[headers[15]] = worksheet[cell].v;
        break;
      case "Q":
        row[headers[16]] = worksheet[cell].v;
        break;
      case "R":
        row[headers[17]] = worksheet[cell].v;
        break;
      case "S":
        row[headers[18]] = worksheet[cell].v;
        break;
      case "T":
        row[headers[19]] = worksheet[cell].v;
        break;
      case "U":
        row[headers[20]] = worksheet[cell].v;
        break;
      case "V":
        row[headers[21]] = worksheet[cell].v;
        break;
      case "W":
        row[headers[22]] = worksheet[cell].v;
        json_array.push(row);
        row = makeRow(worksheet);
        break;
      default:
        break;
    }
  }
  return json_array;
};

console.log(convertJSON(worksheet));
// console.log('Headers:', getHeaders(worksheet));
// console.log('Rows:', splitRows(worksheet));
// var cells = [];
// for (var cell in worksheet) {
//   cells.push(cell.substr(1));
// }
// console.log(cells.join(', '));
// for (var cell in worksheet) {
//   console.log(cell + ':', worksheet[cell].v);
// }
