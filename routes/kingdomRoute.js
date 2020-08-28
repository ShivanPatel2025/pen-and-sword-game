const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const { url } = require('inspector');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const session = require('express-session');
const { createDecipher } = require('crypto');
const { urlencoded } = require('body-parser');
const router = express.Router()
var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
router.get('/kingdom',urlencodedParser,function(req,res){
    let ground,air,sea;
    db.get(`SELECT * FROM military WHERE id = ?`, sess.userid, function(err,rows) {
      
      ground = rows.ground;
      air = rows.air;
      sea = rows.sea;
      console.log(rows,ground,air,sea);
      res.render('kingdom', {kingdomInfo: sess.userid, g: ground, a : air,s : sea});
    })  
})


module.exports = router;