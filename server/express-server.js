var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var messages = [];
var results = {
  results: messages
};
var objectId = 0;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("access-control-allow-headers", "content-type, accept");
  res.header("access-control-max-age", 10);
  next();
});

app.use("/", express.static(__dirname + '/../client'));

app.route('/classes/messages')
  .get(function(req, res) {
    res.send(results);
  })
  .post(function(req, res) {
    // console.log(req.body);
    var message = req.body;
    message.objectId = objectId++;
    messages.push(message);
    res.send('womp');
  });

// app.listen(3000);

var startIndex = 0;

var readDB = function() {
  var db;
  fs.readFile('database', 'utf-8', function(err, data) {
    if (err) throw err;
    // console.log(data);
    db = data.split('\n');
    for (var i = 0; i < db.length; i++) {
      messages.push(JSON.parse(db[i]));
    }
    startIndex = messages.length;
    objectId = messages.length;
    init();
  });
};

var updateDB = function() {
  for (startIndex; startIndex < messages.length; startIndex++) {
    var data = JSON.stringify(messages[startIndex]);
    fs.appendFile('database', '\n' + data, function(err) {
      if (err) throw err;
      // console.log('success meessage ' + startIndex);
    });
  }
};

readDB();

var init = function() {
  setInterval(updateDB, 1000);
  app.listen(3000);
};