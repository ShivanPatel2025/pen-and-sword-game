const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const { url } = require('inspector');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const session = require('express-session');
const { createDecipher } = require('crypto');
const { urlencoded } = require('body-parser');
const { callbackify } = require('util');
const { Console } = require('console');
const router = express.Router()
var sqlite3 = require('sqlite3').verbose();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public"));

let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

router.get('/guild', function(req,res) {
  let errormessage='bro ur not in a guild'
    db.get('SELECT * FROM kingdoms where id= ?', sess.userid, function(err,row) {
      if (!row.guild) {
        res.render('guild', {errormessage})
      }
    })
})

router.post('/createGuild', urlencodedParser, function(req,res) {

})

module.exports = router;