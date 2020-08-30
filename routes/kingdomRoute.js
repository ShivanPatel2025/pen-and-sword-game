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
  let kingdom,ruler,region
  let titles = ["POLICIES", "PROVINCES", "INTERNAL ACTIVITES", "MILITARY", "CURRENT CONFLICTS", "WONDERS"]
  db.serialize(()=> {
  db.get(`SELECT * FROM military WHERE id = ?`, sess.userid, function(err,rows) {
    ground = {
      'name': 'ground',
      'value': rows.ground
    } 
    air = {
      'name': 'air',
      'value': rows.air
    } 
    sea = {
      'name': 'sea',
      'value': rows.sea
    } 
    console.log(rows,ground,air,sea);
  }) 
  db.get(`SELECT * FROM kingdoms WHERE id = ?`, sess.userid, function(err,rows) {
    kingdom = rows.kingdom;
    ruler = rows.ruler;
    region=rows.region;
    founded=rows.date;
  })
  db.get(`SELECT * from resources WHERE id = ?`, sess.userid, function(err,rows) {
        gold= {
          'name': 'gold',
          'value': rows.gold
        } 
        mana= {
          'name': 'mana',
          'value': rows.mana
        } 
        flora= {
          'name': 'flora',
          'value': rows.flora
        }  
        fauna= {
          'name': 'fauna',
          'value': rows.fauna
        } 
        ore= {
          'name': 'ore',
          'value': rows.ore
        } 
        silver= {
          'name': 'silver',
          'value': rows.silver
        } 
        iron= {
          'name': 'iron',
          'value': rows.iron
        } 
        bronze= {
          'name': 'bronze',
          'value': rows.bronze
        } 
        steel= {
          'name': 'steel',
          'value': rows.steel
        } 
            res.render('kingdom', {kingdomInfo: sess.userid, ground:ground, air:air, sea:sea,  kingdomStats: [gold,mana,flora,fauna,ore,silver,iron,bronze,steel], kingdom: kingdom, ruler: ruler, region: region, founded:founded, arrayOfTitles:titles});
       })
      })
})

module.exports = router;