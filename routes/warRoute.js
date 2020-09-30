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

router.get('/war', function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
        } else {
            storedID=parseInt(rows.id, 10);
            let offensiveWars =[];
            let defensiveWars=[];
            db.serialize(()=>{
                db.each(`SELECT * FROM wars WHERE aggressorid=?`, storedID, function(err,rows) {
                    if (!rows) {
                    } else {
                        let warObject = {
                            warid: rows.warid,
                            aggressorid: rows.aggressorid,
                            defenderid: rows.defenderid,
                            aggressorstability: rows.aggressorstability,
                            defenderstability: rows.defenderstability,
                            aggressormaps: rows.aggressormaps,
                            defendermaps: rows.defendermaps
                        }
                        offensiveWars.push(warObject)
                        console.log(offensiveWars)
                    }
                })
                db.each('SELECT * FROM wars WHERE defenderid=?',storedID, function(err,rows) {
                    if (!rows) {
                    } else {
                        let warObject = {
                            warid: rows.warid,
                            aggressorid: rows.aggressorid,
                            defenderid: rows.defenderid,
                            aggressorstability: rows.aggressorstability,
                            defenderstability: rows.defenderstability,
                            aggressormaps: rows.aggressormaps,
                            defendermaps: rows.defendermaps
                        }
                        defensiveWars.push(warObject)
                        console.log(defensiveWars)
                    }
                })
                db.get('SELECT * FROM kingdoms', function(err,rows){
                    console.log(offensiveWars)
                    console.log(defensiveWars)
                    res.render('war', {loffensiveWars: offensiveWars, defensiveWars:defensiveWars})
                })
            })
        }
    })
})

router.get('/declarewar', function(req,res) {
    res.render('declarewar');
})

router.post('/declarewar', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
            storedID=parseInt(rows.id, 10);
            let recipient=req.body.whom;
            let type=req.body.type;
            db.get('SELECT * FROM kingdoms WHERE kingdom =?', recipient, function(err,rows) {
                let defenderid=rows.id;
                let type=rows.id;
                if (type = 'loot') {
                    db.run(`INSERT INTO wars (aggressorid, defenderid, aggressorstability, defenderstability, aggressormaps, defendermaps, type) VALUES (?,?,?,?,?,?,?)`, [storedID, defenderid, 50, 50, 10, 10, type], function(err){
                        res.redirect('/war')
                        console.log('war declared')
                    });
                } else if (type='damage') {
                    db.run(`INSERT INTO wars (aggressorid, defenderid, aggressorstability, defenderstability, aggressormaps, defendermaps, type) VALUES (?,?,?,?,?,?,?)`, [storedID, defenderid, 100, 100, 10, 10, type], function(err){
                        res.redirect('/war')
                        console.log('war declared')
                    })
                } else {
                    res.redirect('/war')
                    console.log('not a valid war type')
                }
            })
          }
    })
})

//Ideally this is like a popup not a seperate page
router.post('/attack', function(req,res) {
    res.render('attack')
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10)
        db.serialize(()=>{
            let domesticAir;
            let domesticGround;
            let domesticSea;
            let domesticSiege;
            let domesticMaps;
            let domesticStability;
            let foreginAir;
            let foreignGround;
            let foreignSea;
            let foreignSiege; 
            let foreignMaps;
            let foreignStability;
            db.get(`SELECT * FROM wars WHERE warid=?`, req.body.warid, function(err,rows){
                if(rows.aggressorid=storedID) {
                    domesticMaps=rows.aggressormaps;
                    domesticStability=rows.aggressorstability;
                    foreignMaps=rows.defendermaps;
                    foreignStability=rows.defenderstability;
                } else if (rows.defenderid=storedID){
                    domesticMaps=rows.defendermaps;
                    domesticStability=rows.defenderstability;
                    foreignMaps=rows.aggressormaps;
                    foreignStability=rows.aggressorstability;
                }
            })
            db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
                warriors = {
                'name': 'Warriors',
                'value': rows.warriors
                } 
                archers = {
                'name': 'Archers',
                'value': rows.archers
                } 
                cavalry = {
                'name': 'Cavalry',
                'value': rows.cavalry
                } 
                blacksmiths = {
                    'name':'Blacksmith',
                    'value': rows.blacksmiths
                }
                priests = {
                    'name': 'Priests',
                    'value':rows.priests
                }
                mages = {
                    'name': 'Mages',
                    'value': rows.mages
                }
                blimps = {
                    'name': 'Blimps',
                    'value': rows.blimps
                }
                harpies = {
                    'name': 'Harpies',
                    'value': rows.harpies
                }
                angels = {
                    'name': 'Angels',
                    'value': rows.angels
                }
                dragons = {
                    'name': 'Dragons',
                    'value': rows.dragons
                }
                galleys = {
                    'name': 'Galleys',
                    'value': rows.galleys
                }
                pirates = {
                    'name': 'Pirates',
                    'value': rows.pirates
                }
                sea_serpents = {
                    'name': 'Sea Serpents',
                    'value': rows.sea_serpents
                }
                catapults = {
                    'name': 'Catapults',
                    'value': rows.catapults
                }
                trebuchets= {
                    'name': 'Trebuchets',
                    'value':rows.trebuchets
                }
                cannons={
                    'name': 'Cannons',
                    'values': rows.cannons
                }
                domesticGround = [warriors, archers, cavalry,blacksmiths,priests,mages];
                domesticAir = [blimps, harpies, angels, dragons];
                domesticSea = [galleys, pirates, sea_serpents];
                domesticSiege = [catapults, trebuchets, cannons];
        })
            db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
                warriors = {
                'name': 'Warriors',
                'value': rows.warriors
                } 
                archers = {
                'name': 'Archers',
                'value': rows.archers
                } 
                cavalry = {
                'name': 'Cavalry',
                'value': rows.cavalry
                } 
                blacksmiths = {
                    'name':'Blacksmith',
                    'value': rows.blacksmiths
                }
                priests = {
                    'name': 'Priests',
                    'value':rows.priests
                }
                mages = {
                    'name': 'Mages',
                    'value': rows.mages
                }
                blimps = {
                    'name': 'Blimps',
                    'value': rows.blimps
                }
                harpies = {
                    'name': 'Harpies',
                    'value': rows.harpies
                }
                angels = {
                    'name': 'Angels',
                    'value': rows.angels
                }
                dragons = {
                    'name': 'Dragons',
                    'value': rows.dragons
                }
                galleys = {
                    'name': 'Galleys',
                    'value': rows.galleys
                }
                pirates = {
                    'name': 'Pirates',
                    'value': rows.pirates
                }
                sea_serpents = {
                    'name': 'Sea Serpents',
                    'value': rows.sea_serpents
                }
                catapults = {
                    'name': 'Catapults',
                    'value': rows.catapults
                }
                trebuchets= {
                    'name': 'Trebuchets',
                    'value':rows.trebuchets
                }
                cannons={
                    'name': 'Cannons',
                    'values': rows.cannons
                }
                foreignGround = [warriors, archers, cavalry,blacksmiths,priests,mages];
                foreginAir = [blimps, harpies, angels, dragons];
                foreignSea = [galleys, pirates, sea_serpents];
                foreignSiege = [catapults, trebuchets, cannons];
                res.render('attack', {domesticAir,domesticGround,domesticSea,domesticSiege,domesticMaps,domesticStability, foreginAir, foreignGround,foreignSea,foreignSiege,foreignMaps,foreignStability});
        })   
    })
    }}) 
})

module.exports = router; 