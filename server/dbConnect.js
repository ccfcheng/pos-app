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
  console.log('Authenticated:', client);
});

client.onError.addListener(function(error) {
  console.error('Error:', error);
});

client.getAccountInfo(function(error, accountInfo) {
  if (error) {
    console.log('Account Error:', error);
    return;
  }
  console.log("Hello, " + accountInfo.name + "!");
  console.log("Account Info:", accountInfo);
});

client.readdir("/", function(error, entries) {
  if (error) {
    console.log('Read directory Error:', error);
    return;
  }
  console.log("Contents of /:", entries.join(", "));
});
