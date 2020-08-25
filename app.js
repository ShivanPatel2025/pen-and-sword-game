const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

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

//RUNNING SERVER
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
//RUNNING SERVER

//SENDING LOGIN PAGE
app.get('/', (req, res) => {
  res.sendFile('index.html');
})
//SENDING LOGIN PAGE


app.post('/sign-up', urlencodedParser, function (req, res){
  var reply='';
  reply += "Your name is" + req.body.user;
  reply += "Your E-mail id is" + req.body.password; 
  reply += "Your address is" + req.body.email;
  res.send(reply);
 //db.run('INSERT INTO users (email, password) VALUES ($email, $password)',
 // {	$email: req.body.email,
 //  $password: req.body.password}
});         
