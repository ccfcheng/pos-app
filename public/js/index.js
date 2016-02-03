new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
});

// Connecting to Dropbox
var client = new Dropbox.Client({key: 'eg4e7kgn9lay23i'});

function showError(error) {
  switch (error.status) {
  case Dropbox.ApiError.INVALID_TOKEN:
    // If you're using dropbox.js, the only cause behind this error is that
    // the user token expired.
    // Get the user through the authentication flow again.
    break;

  case Dropbox.ApiError.NOT_FOUND:
    // The file or folder you tried to access is not in the user's Dropbox.
    // Handling this error is specific to your application.
    break;

  case Dropbox.ApiError.OVER_QUOTA:
    // The user is over their Dropbox quota.
    // Tell them their Dropbox is full. Refreshing the page won't help.
    break;

  case Dropbox.ApiError.RATE_LIMITED:
    // Too many API requests. Tell the user to try again later.
    // Long-term, optimize your code to use fewer API calls.
    break;

  case Dropbox.ApiError.NETWORK_ERROR:
    // An error occurred at the XMLHttpRequest layer.
    // Most likely, the user's network connection is down.
    // API calls will not succeed until the user gets back online.
    break;

  case Dropbox.ApiError.INVALID_PARAM:
  case Dropbox.ApiError.OAUTH_ERROR:
  case Dropbox.ApiError.INVALID_METHOD:
  default:
    // Caused by a bug in dropbox.js, in your application, or in Dropbox.
    // Tell the user an error occurred, ask them to refresh the page.
  }
}

client.onError.addListener(function(error) {
  if (window.console) {  // Skip the "if" in node.js code.
    console.error(error);
  }
});

client.authenticate(function(error, client) {
  if (error) {
    // Replace with a call to your own error-handling code.
    //
    // Don't forget to return from the callback, so you don't execute the code
    // that assumes everything went well.
    return showError(error);
  }

  // Replace with a call to your own application code.
  //
  // The user authorized your app, and everything went well.
  // client is a Dropbox.Client instance that you can use to make API calls.
  // console.log('Authenticated:', client);
});

client.getAccountInfo(function(error, accountInfo) {
  if (error) {
    return showError(error);  // Something went wrong.
  }

  // console.log("Hello, " + accountInfo.name + "!");
});

// client.readdir("/Misc", function(error, entries) {
//   if (error) {
//     return showError(error);  // Something went wrong.
//   }

//   // console.log("Your Dropbox contains " + entries.join(", "));
//   console.log("Your Dropbox contains " + entries.join(", "));
// });

function dropboxDir(path) {
  client.readdir(path, function(error, entries) {
    if (error) {
      return showError(error);  // Something went wrong.
    }

    // console.log("Your Dropbox contains " + entries.join(", "));
    console.log("Contents of " + path + ': ' + entries);
  });
}

function readDropbox(path) {
  console.log('Reading file...');
  client.readFile(path, { arrayBuffer: true }, function(error, data) {
    if (error) {
      return showError(error);  // Something went wrong.
    }

    // console.log(typeof data);  // data has the file's contents

    var stream = new Uint8Array(data);
    var arr = new Array();
    for(var i = 0; i != stream.length; ++i) arr[i] = String.fromCharCode(stream[i]);
    var bstr = arr.join('');

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {type:'binary'});
    var worksheet = workbook.Sheets['Inventory'];
    /* DO SOMETHING WITH workbook HERE */

    var json_data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    console.log(json_data);
    console.log(makeRow(json_data));

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
function convertJSON(json) {
  var defaultRow = makeRow(json);
  var results = [];
  json.forEach(function(row, index) {
    // start on row below headers
    if (index > 1) {

    }
  });
}

readDropbox('/Dropbox - Company Documents (1)/POS INVENTORY MASTER.xls');
