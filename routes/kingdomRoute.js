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

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public"));

let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
router.get('/kingdom',urlencodedParser,function(req,res){
  let kingdom,ruler,region;
  let warrior,archer,cavalry;
  let government, economy, war; 
  let provinces,wonders;
  let gold,mana,flora,fauna,ore,silver,iron,bronze,steel;
  

  let titles = ["POLICIES",  "MILITARY", "PROVINCES",  "WONDERS"]
  db.serialize(()=> {
    
    db.get(`SELECT * FROM kingdoms WHERE id = ?`, sess.userid, function(err,rows) {
      kingdom = rows.kingdom;
      ruler = rows.ruler;
      region=rows.region;
      founded=rows.date;
    })
    db.get(`SELECT * FROM military WHERE id = ?`, sess.userid, function(err,rows) {
      warrior = {
        'name': 'warrior',
        'value': rows.warriors
      } 
      archer = {
        'name': 'archer',
        'value': rows.archers
      } 
      cavalry = {
        'name': 'cavalry',
        'value': rows.cavalry
      } 
      
    }) 
    db.get(`SELECT * from Policies WHERE id = ?`, sess.userid, function(err,rows) {
      government = {
        'name': 'Government',
        'value': rows.government
      } 
      economy = {
        'name': 'Economy',
        'value': rows.economy
      } 
      war = {
        'name': 'War Strategy',
        'value': rows.war
      } 


    })
    db.get(`SELECT * from provinces WHERE id = ?`, sess.userid, function(err,rows) {
      provinces = rows;
    })
    db.get(`SELECT * from wonders WHERE id = ?`, sess.userid, function(err,rows) {
      wonders = rows;



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
              res.render('kingdom', { kingdomInfo: sess.userid, 
                                      militaryStats:[warrior,archer,cavalry], 
                                      policyStats :[government,economy,war], 
                                      provinceStats:provinces, 
                                      wonderStats: wonders,  
                                      kingdomStats: [gold,mana,flora,fauna,ore,silver,iron,bronze,steel], 
                                      kingdom: kingdom, 
                                      ruler: ruler, 
                                      region: region, 
                                      founded:founded, 
                                      arrayOfTitles:titles});
    })
    
  })
})

module.exports = router;