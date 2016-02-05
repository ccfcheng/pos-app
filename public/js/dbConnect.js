// Connecting to Dropbox
var client = new Dropbox.Client({key: 'eg4e7kgn9lay23i'});



function showError(error) {
  console.log(error);
}

client.onError.addListener(function(error) {
  console.error(error);
});

client.authenticate(function(error, client) {
  if (error) {
    return showError(error);
  }
  console.log('Authenticated:');
});

client.getAccountInfo(function(error, accountInfo) {
  if (error) {
    return showError(error);  // Something went wrong.
  }
  console.log("Hello, " + accountInfo.name + "!");
});


function readDropbox(path) {
  console.log('Beginning import...');
  client.readFile(path, { arrayBuffer: true }, function(error, data) {
    if (error) {
      return showError(error);  // Something went wrong.
    }
    var stream = new Uint8Array(data);
    var arr = new Array();
    for(var i = 0; i != stream.length; ++i) arr[i] = String.fromCharCode(stream[i]);
    var bstr = arr.join('');
    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:'binary'});
    var worksheet = workbook.Sheets['Inventory'];
    /* DO SOMETHING WITH workbook HERE */
    sales_data = sheetToJSON(worksheet);
  });
}

// Makes a default row object
function makeRow(json) {
  var headers = json[1];
  var obj = {};
  headers.forEach(function(header) {
    obj[header] = '';
  });
  return obj;
}

// Converts worksheet into JSON
function sheetToJSON(worksheet) {
  var json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
  var defaultRow = makeRow(json);
  var newRow = makeRow(json);
  var headers = json[1];
  var results = [];
  // start on row below headers
  // for each item starting from third item in json_data, loop through each array
  // from index 0 to index 22
  // if the item exists, store it
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
}

// findItemNumber(itemNumStr) returns array with matching objects
//function findItemNumber(str) {
  //return sales_data.filter(function(item) {
    //return item['Item Number'] === str;
  //});
//}
//// findItemBy(category, criteria) returns array with matching objects
//function findItemBy(category, criteria) {
  //return sales_data.filter(function(item) {
    //return item[category] === criteria;
  //});
//}

var sales_data;

readDropbox('/Dropbox - Company Documents/POS INVENTORY MASTER.xls');

new Vue({
  el: '#app',
  data: {
    filteredByNumber: [],
    input_number: ''
  },
  methods: {
    findByNumber: function() {
      var str = this.input_number;
      event.preventDefault();
      this.filteredByNumber = sales_data.filter(function(item) {
        return item['Item Number'] === str;
      });
    }
  }
});
