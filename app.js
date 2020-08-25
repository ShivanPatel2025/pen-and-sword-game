var express = require('express')
var app = express()
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/style.css'))

app.get('/', function(request, response) {
  response.sendFile(__dirname+"/register_test.html");
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
