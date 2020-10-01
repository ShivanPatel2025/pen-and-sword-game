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
                        //console.log(offensiveWars)
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
                        //console.log(defensiveWars)
                    }
                })
                db.get('SELECT * FROM kingdoms', function(err,rows){
                    //console.log(offensiveWars)
                    //console.log(defensiveWars)
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
                console.log(storedID)
                console.log(defenderid)
                db.get(`SELECT * FROM wars WHERE (aggressorid=? AND defenderid=?) OR (defenderid=? AND aggressorid=?)`, [storedID,defenderid,storedID,defenderid], function(err,rows) {
                    console.log(rows);
                    if(rows) {
                        console.log('u are already engaged in warfare with this person')
                        res.redirect('/war')
                    }else if (storedID==defenderid){
                        console.log('you cant attack urself')
                        res.redirect('/war')
                    }else{
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
        }
    })
})

//Ideally this is like a popup not a seperate page
router.post('/attack', urlencodedParser, function(req,res) {
    console.log(req.body.warid + "line 116");
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
            let foreignAir;
            let foreignGround;
            let foreignSea;
            let foreignSiege; 
            let foreignMaps;
            let foreignStability;
            console.log(req.body.warid)
            db.get(`SELECT * FROM wars WHERE warid=?`, req.body.warid, function(err,rows){
                console.log(rows);
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
                console.log(domesticGround);
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
                foreignAir = [blimps, harpies, angels, dragons];
                foreignSea = [galleys, pirates, sea_serpents];
                foreignSiege = [catapults, trebuchets, cannons];
                res.render('attack', {domesticAir,domesticGround,domesticSea,domesticSiege,domesticMaps,domesticStability, foreignAir, foreignGround,foreignSea,foreignSiege,foreignMaps,foreignStability, warid:req.body.warid});
        })   
    })
    }}) 
})

router.post('/groundbattle', urlencodedParser, function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10)
        let domesticAir=[];
        let domesticGround=[];
        let domesticSea=[];
        let domesticSiege=[];
        let domesticMaps=req.body.domesticMaps;
        let domesticStability=req.body.domesticStability;
        let foreignAir=[];
        let foreignGround=[];
        let foreignSea=[];
        let foreignSiege=[]; 
        let foreignMaps=req.body.foreignMaps;
        let foreignStability=req.body.foreignStability;
        let enemyID;
        db.serialize(()=>{
        db.get('SELECT * FROM wars WHERE warid=?', req.body.warid, function(err,rows){
            if (rows.aggressorid==storedID){
                enemyID=rows.defenderid;
            }
            if (rows.defenderid==storedID) {
                enemyID=rows.aggressorid
            }
            //console.log(enemyID)
        })
        db.get('SELECT * FROM military WHERE id=?', storedID, function(err,rows){
            console.log(enemyID)
            domesticGround[0]=rows.warriors;
            domesticGround[1]=rows.archers;
            domesticGround[2]=rows.cavalry;
            domesticGround[3]=rows.blacksmiths;
            domesticGround[4]=rows.priests;
            domesticGround[5]=rows.mages;
            //console.log(domesticGround)
            let attackingPower=Number(domesticGround[0])*4+Number(domesticGround[1])*2+Number(domesticGround[2])*12+Number(domesticGround[3])*3+Number(domesticGround[4])*18+Number(domesticGround[5])*20;
            db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                console.log(rows);
                foreignGround[0]=rows.warriors;
                foreignGround[1]=rows.archers;
                foreignGround[2]=rows.cavalry;
                foreignGround[3]=rows.blacksmiths;
                foreignGround[4]=rows.priests;
                foreignGround[5]=rows.mages;
                let defendingPower=Number(foreignGround[0])*.05+Number(foreignGround[1])*6+Number(foreignGround[2])*5+Number(foreignGround[3])*10+Number(foreignGround[4])*15+Number(foreignGround[5])*15;
                let defenderBonus=2;
                while(defenderBonus>=1.4) {
                    defenderBonus= Math.random()+1.001;
                }
                console.log(defendingPower)
                console.log(attackingPower)
                console.log(defenderBonus)
                if (attackingPower>1.25*defenderBonus*defendingPower) {
                    console.log('EXTREME ViCOTRY')
                } else if (attackingPower>1.1*defenderBonus*defendingPower) {
                    console.log('Medium VICTORY')
                } else if (attackingPower>.08*defenderBonus*defendingPower) {
                    console.log('stalemate')
                }
            })
        })
    })}
    })
})

app.post('/airfight', urlencodedParser, function(req,res){

})

app.post('/navalbattle', urlencodedParser, function(req,res){

})

app.post('/siegeprovince', urlencodedParser, function(req,res){

})


module.exports = router; 