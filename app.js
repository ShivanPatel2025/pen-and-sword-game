const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static("public"));
//SQLITE
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//SQLITE

app.set('port', (process.env.PORT || 5000))


app.get('/', (req, res) => {
  res.sendFile('index.html');
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
