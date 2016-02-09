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
    return showError(error);
  }
  console.log("Hello, " + accountInfo.name + "!");
});


function readDropbox(path) {
  console.log('Beginning import...');
  client.readFile(path, { arrayBuffer: true }, function(error, data) {
    if (error) {
      return showError(error);
    }
    var stream = new Uint8Array(data);
    var arr = new Array();
    for(var i = 0; i != stream.length; ++i) arr[i] = String.fromCharCode(stream[i]);
    var bstr = arr.join('');
    var workbook = XLSX.read(bstr, {type:'binary'});
    var worksheet = workbook.Sheets['Inventory'];
    sales_data = sheetToJSON(worksheet);
  });
}

function makeRow(json) {
  var headers = json[1];
  var obj = {};
  headers.forEach(function(header) {
    obj[header] = '';
  });
  return obj;
}

function sheetToJSON(worksheet) {
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
}

var sales_data;

readDropbox('/Dropbox - Company Documents/POS INVENTORY MASTER.xls');

new Vue({
  el: '#app',
  data: {
    filtered_number: [],
    input_number: '',
    filtered_name: [],
    input_name: '',
    filtered_UPC: [],
    input_upc: '',
    filtered_description: [],
    input_description: '',
  },
  methods: {
    findByNumber: function() {
      var str = this.input_number;
      event.preventDefault();
      this.filtered_number = sales_data.filter(function(item) {
        return item['Item Number'] === str;
      });
      this.input_number = '';
    },

    findByUPC: function() {
      var str = this.input_UPC;
      event.preventDefault();
      this.filtered_UPC = sales_data.filter(function(item) {
        return item['UPC'] === str;
      });
      this.input_UPC = '';
    },

    findByName: function() {
      var str = this.input_name;
      event.preventDefault();
      this.filtered_name = sales_data.filter(function(item) {
        // figure out a way to filter by text of name
        return true;
      });
      this.input_name = '';
    },

    findByDescription: function() {
      var str = this.input_description;
      event.preventDefault();
      this.filtered_description = sales_data.filter(function(item) {
        // figure out a way to filter by text of description
        return true;
      });
      this.input_description = '';
    },

    resetSearches: function() {
      this.filtered_UPC = [];
      this.filtered_name = [];
      this.filtered_number = [];
      this.filtered_description = [];
      this.input_UPC = '';
      this.input_name = '';
      this.input_number = '';
      this.input_description = '';
    }
  }
});
