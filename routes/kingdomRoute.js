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
  console.log(req.session.id);
  let kingdom,ruler,region;
  let warrior,archer,cavalry,blacksmith,priest,mage,blimp,harpy,angel,dragon,galley,pirate,sea_serpent,catapult,trebuchet,cannon;
  let government, economy, war; 
  let provinces,wonders;
  let gold,mana,flora,fauna,ore,silver,iron,bronze,steel;
  

  let titles = ["Policies",  "Military", "Provinces",  "Wonders", "C0nflicts", "!nternal Activity"]
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10);
      console.log(storedID+"line 45");
      db.serialize(()=> {
      db.get(`SELECT * FROM kingdoms WHERE id=?`, storedID , function(err,rows) {
        if (err) {
          console.error(err.message);
        }
        console.log(rows);
        console.log(storedID + "line49")
        kingdom = rows.kingdom;
        ruler = rows.ruler;
        region=rows.region;
        founded=rows.date;
      })
      db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
        warrior = {
          'name': 'Warriors',
          'value': rows.warriors
        } 
        archer = {
          'name': 'Archers',
          'value': rows.archers
        } 
        cavalry = {
          'name': 'Cavalry',
          'value': rows.cavalry
        }
        blacksmith = {
          'name' : 'Blacksmiths',
          'value' : rows.blacksmiths
        }
        priest = {
          'name' : 'Priests',
          'value' : rows.priests
        }
        mage = {
          'name' : 'Mages',
          'value' : rows.mages
        }
        blimp = {
          'name' : 'Blimps',
          'value' : rows.blimps
        }
        harpy = {
          'name' : 'Harpies',
          'value' : rows.harpies
        } 
        angel = {
          'name' : 'Angels',
          'value' : rows.angels
        }
        dragon = {
          'name' : 'Dragons',
          'value' : rows.dragons
        }
        galley = {
          'name' : 'Galleys',
          'value' : rows.galleys
        }
        pirate = {
          'name' : 'Pirates',
          'value' : rows.pirates
        }
        sea_serpent = {
          'name' : 'Sea Serpents',
          'value' : rows.sea_serpents
        }
        catapult = {
          'name' : 'Catapults',
          'value' : rows.catapults
        }
        trebuchet = {
          'name' : 'Trebuchets',
          'value' : rows.trebuchets
        }
        cannon = {
          'name' : 'Cannons',
          'value' : rows.cannons
        }
        
      }) 
      db.get(`SELECT * FROM Policies WHERE id = ?`, storedID, function(err,rows) {
        government = {
          'title': 'Govt',
          'name': rows.government,
          'values': {happiness:2,stability:3}
        } 
        economy = {
          'title': 'Econ',
          'name': rows.economy,
          'values': {happiness:2,stability:3}
        } 
        war = {
          'title': 'War',
          'name': rows.war,
          'values': {happiness:2,stability:3}
        } 
  
      })
      let arrayOfProvinces=[];
      db.each(`SELECT * from provinces WHERE userid = ?`, storedID, function(err,rows) {
        provinces = {
          name: rows.name,
          values : {
            territory: rows.land,
            happiness: rows.happiness,
            gold: 1
          }
        }
        console.log(provinces)
        console.log(arrayOfProvinces)
        arrayOfProvinces.push(provinces)
      })
      let arrayOfWonders=[];
      db.get(`SELECT * from wonders WHERE id = ?`, storedID, function(err,rows) {
        if (rows.eiffel_tower=='1'){
          wonders =  {
            name: 'Eiffel Tower',
            values : "This is Eiffel Tower"
          }
          arrayOfWonders.push(wonders)
        }
        if (rows.pyramids=='1'){
          wonders =  {
            name: 'Pyramids',
            values : "This is Pyramid"
          }
          arrayOfWonders.push(wonders)
        }
        if (rows.stone_henge=='1'){
          wonders =  {
            name: 'Stone Henge',
            values : "This is Stonge Henge"
          }
          arrayOfWonders.push(wonders)
        }
      })
      db.get(`SELECT * from resources WHERE id = ?`, storedID, function(err,rows) {
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
            lumber= {
              'name': 'lumber',
              'value': rows.lumber
            } 
            food= {
              'name': 'food',
              'value': rows.food
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
                res.render('kingdom', { kingdomInfo: storedID, 
                                        ground: [warrior,archer,cavalry,blacksmith,priest,mage], 
                                        air: [blimp,harpy,angel,dragon],
                                        sea: [galley,pirate,sea_serpent],
                                        siege: [catapult,trebuchet,cannon],
                                        policyStats : [government,economy,war], 
                                        provinceStats: arrayOfProvinces, 
                                        wonderStats: arrayOfWonders,  
                                        kingdomStats: [gold,mana,flora,fauna,lumber,food,ore,silver,iron,bronze,steel], 
                                        kingdom: kingdom, 
                                        ruler: ruler, 
                                        region: region, 
                                        founded:founded, 
                                        arrayOfTitles:titles});
      })
    })
  })
})

module.exports = router;