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
  let gold,mana,flora,fauna,ore,silver,iron,bronze,steel;
  db.serialize(()=> {
  db.get(`SELECT * FROM military WHERE id = ?`, sess.userid, function(err,rows) {
    ground = rows.ground;
    air = rows.air;
    sea = rows.sea;
    console.log(rows,ground,air,sea);
  }) 
  db.get(`SELECT * from resources WHERE id = ?`, sess.userid, function(err,rows) {
             gold=rows.gold;
            mana=rows.mana;
           flora=rows.flora;
             fauna=rows.fauna;
          ore=rows.ore;
            silver=rows.silver;
             iron=rows.iron;
           bronze=rows.bronze;
           steel=bronze.steel;
            res.render('kingdom', {kingdomInfo: sess.userid, g : ground, a : air,s : sea, gold : gold, mana : mana, flora : flora, fauna: fauna, ore:ore, silver:silver,iron:iron, bronze:bronze,silver:silver});
       })
      })
})

module.exports = router;