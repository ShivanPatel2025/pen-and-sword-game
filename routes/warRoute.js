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

function checkBalance(key) {
    return new Promise((resolve, reject) => {
        let storedID = key; 
        resolve((newGold>=0) && (newMana>=0) && (newFlora>=0) && (newFauna>=0) && (newLumber>=0) && (newFood>=0) && (newOre>=0) && (newSilver>=0) && (newIron>=0) && (newBronze>=0) && (newSteel>=0))
      
    })
}


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
            let aggroCounter=0;
            db.serialize(()=>{
            db.each(`SELECT * FROM wars WHERE aggressorid=?`, storedID, function(err,rows) {
                if (!rows) {
                } else {
                    let warid = rows.warid;
                    let aggressorid= rows.aggressorid;
                    let defenderid= rows.defenderid;
                    let aggressorstability= rows.aggressorstability;
                    let defenderstability= rows.defenderstability;
                    let aggressormaps= rows.aggressormaps;
                    let defendermaps= rows.defendermaps;
                    let aggressorName;
                    let defenderName;
                    db.get('SELECT * FROM kingdoms WHERE id=?',aggressorid, function(err,rows){
                        aggressorName=rows.kingdom;
                    })
                    db.get('SELECT * FROM kingdoms WHERE id=?',defenderid, function(err,rows){
                        defenderName=rows.kingdom;
                    })
                    db.get('SELECT * FROM military WHERE id=?',storedID,function(err,rows){
                        let domesticAir;
                        let domesticGround;
                        let domesticSea;
                        let domesticSiege;
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
                            let groundAttackingPower= {
                                'name' : 'ground',
                                'value' : warriors.value*4+archers.value*2+cavalry.value*12+blacksmiths.value*3+priests.value*18+mages.value*20
                            } 
                            let airAttackingPower= {
                                'name' : 'air',
                                'value' : blimps.value*14+harpies.value*10+angels.value*8+dragons.value*13
                            }
                            let navalAttackingPower= {
                                'name' : 'sea',
                                'value': galleys.value*8+pirates.value*15+sea_serpents.value*40
                            } 
                            let domesticPower=[groundAttackingPower,airAttackingPower,navalAttackingPower]



                            let domesticGroundRaw = [warriors, archers, cavalry,blacksmiths,priests,mages];
                            domesticGround= domesticGroundRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticAirRaw = [blimps, harpies, angels, dragons];
                            domesticAir= domesticAirRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticSeaRaw = [galleys, pirates, sea_serpents];
                            domesticSea= domesticSeaRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticSiegeRaw = [catapults, trebuchets, cannons];
                            domesticSiege= domesticSiegeRaw.filter(e=>{
                                return e['value']!=0
                            })

                            
                            console.log(domesticGround);
                            db.get('SELECT * FROM military WHERE id=?',defenderid,function(err,rows){
                                let foreignAir;
                                let foreignGround;
                                let foreignSea;
                                let foreignSiege;
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
                                    let groundDefendingPower= {
                                        'name' : 'ground',
                                        'value': warriors.value*1+archers.value*6+cavalry.value*5+blacksmiths.value*10+priests.value*15+mages.value*15+angels.value*8+dragons.value*18+pirates.value*4
                                    }
                                    let airDefendingPower= {
                                        'name': 'air',
                                        'value':blimps.value*5+harpies.value*7+angels.value*8+dragons.value*18+archers.value*6+mages.value*15+galleys.value*8
                                    }
                                    let navalDefendingPower= {
                                        'name' : 'sea',
                                        'value' : galleys.value*8+pirates.value*4+sea_serpents.value*40+archers.value*6+angels.value*8
                                    }
                                    let foreignPower=[groundDefendingPower,airDefendingPower,navalDefendingPower]


                                    let foreignGroundRaw = [warriors, archers, cavalry,blacksmiths,priests,mages,angels,dragons,pirates];
                                    foreignGround= foreignGroundRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignAirRaw = [blimps, harpies, angels, dragons,archers,mages,galleys];
                                    foreignAir= foreignAirRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignSeaRaw = [galleys, pirates, sea_serpents,archers,angels];
                                    foreignSea= foreignSeaRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignSiegeRaw = [catapults, trebuchets, cannons];
                                    foreignSiege= foreignSiegeRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    warObject= {
                                        warid: warid,
                                        aggressorid: aggressorid,
                                        defenderid: defenderid,
                                        aggressorName: aggressorName,
                                        defenderName: defenderName,
                                        aggressorstability: aggressorstability,
                                        defenderstability: defenderstability,
                                        aggressormaps: aggressormaps,
                                        defendermaps: defendermaps,
                                        domesticGround: domesticGround,
                                        domesticAir: domesticAir,
                                        domesticSea: domesticSea,
                                        domesticSiege: domesticSiege,
                                        foreignGround: foreignGround,
                                        foreignAir: foreignAir,
                                        foreignSea: foreignSea,
                                        foreignSiege: foreignSiege,
                                        foreignPower: foreignPower,
                                        domesticPower: domesticPower
                                    }
                                    console.log("inside each loop")
                                    
                                    offensiveWars.push(warObject)
                                    
                            })
                    })
                }
            })

        

            db.each('SELECT * FROM wars WHERE defenderid=?',storedID, function(err,rows) {
                if (!rows) {
                } else {
                    let warid = rows.warid;
                    let aggressorid= rows.aggressorid;
                    let defenderid= rows.defenderid;
                    let aggressorstability= rows.aggressorstability;
                    let defenderstability= rows.defenderstability;
                    let aggressormaps= rows.aggressormaps;
                    let defendermaps= rows.defendermaps;
                    let aggressorName;
                    let defenderName;
                    db.get('SELECT * FROM kingdoms WHERE id=?',aggressorid, function(err,rows){
                        aggressorName=rows.kingdom;
                    })
                    db.get('SELECT * FROM kingdoms WHERE id=?',defenderid, function(err,rows){
                        defenderName=rows.kingdom;
                    })
                    db.get('SELECT * FROM military WHERE id=?',storedID,function(err,rows){
                        let domesticAir;
                        let domesticGround;
                        let domesticSea;
                        let domesticSiege;
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
                            let groundDefendingPower= {
                                'name' : 'ground',
                                'value': warriors.value*1+archers.value*6+cavalry.value*5+blacksmiths.value*10+priests.value*15+mages.value*15+angels.value*8+dragons.value*18+pirates.value*4
                            }
                            let airDefendingPower= {
                                'name': 'air',
                                'value':blimps.value*5+harpies.value*7+angels.value*8+dragons.value*18+archers.value*6+mages.value*15+galleys.value*8
                            }
                            let navalDefendingPower= {
                                'name' : 'sea',
                                'value' : galleys.value*8+pirates.value*4+sea_serpents.value*40+archers.value*6+angels.value*8
                            }
                            let domesticPower=[groundDefendingPower,airDefendingPower,navalDefendingPower]
                            let domesticGroundRaw = [warriors, archers, cavalry,blacksmiths,priests,mages,angels,dragons,pirates];
                            domesticGround= domesticGroundRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticAirRaw = [blimps, harpies, angels, dragons,archers,mages,galleys];
                            domesticAir= domesticAirRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticSeaRaw = [galleys, pirates, sea_serpents,archers,angels];
                            domesticSea= domesticSeaRaw.filter(e=>{
                                return e['value']!=0
                            })
                            let domesticSiegeRaw = [catapults, trebuchets, cannons];
                            domesticSiege= domesticSiegeRaw.filter(e=>{
                                return e['value']!=0
                            })

                            console.log(domesticGround);
                            db.get('SELECT * FROM military WHERE id=?',aggressorid,function(err,rows){
                                let foreignAir;
                                let foreignGround;
                                let foreignSea;
                                let foreignSiege;
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
                                    let groundAttackingPower= {
                                        'name' : 'ground',
                                        'value' : warriors.value*4+archers.value*2+cavalry.value*12+blacksmiths.value*3+priests.value*18+mages.value*20
                                    } 
                                    let airAttackingPower= {
                                        'name' : 'air',
                                        'value' : blimps.value*14+harpies.value*10+angels.value*8+dragons.value*13
                                    }
                                    let navalAttackingPower= {
                                        'name' : 'sea',
                                        'value': galleys.value*8+pirates.value*15+sea_serpents.value*40
                                    } 
                                    let foreignPower=[groundAttackingPower,airAttackingPower,navalAttackingPower]
                                    let foreignGroundRaw = [warriors, archers, cavalry,blacksmiths,priests,mages];
                                    foreignGround= foreignGroundRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignAirRaw = [blimps, harpies, angels, dragons];
                                    foreignAir= foreignAirRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignSeaRaw = [galleys, pirates, sea_serpents];
                                    foreignSea= foreignSeaRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    let foreignSiegeRaw = [catapults, trebuchets, cannons];
                                    foreignSiege= foreignSiegeRaw.filter(e=>{
                                        return e['value']!=0
                                    })
                                    warObject= {
                                        warid: warid,
                                        aggressorid: aggressorid,
                                        defenderid: defenderid,
                                        aggressorstability: aggressorstability,
                                        defenderstability: defenderstability,
                                        aggressormaps: aggressormaps,
                                        defendermaps: defendermaps,
                                        aggressorName: aggressorName,
                                        defenderName: defenderName,
                                        domesticGround: domesticGround,
                                        domesticAir: domesticAir,
                                        domesticSea: domesticSea,
                                        domesticSiege: domesticSiege,
                                        foreignGround: foreignGround,
                                        foreignAir: foreignAir,
                                        foreignSea: foreignSea,
                                        foreignSiege: foreignSiege,
                                        foreignPower: foreignPower,
                                        domesticPower: domesticPower
                                    }
                                    defensiveWars.push(warObject)
                            })
                    })
                }
            })
        
            setTimeout(function(){
                db.get('SELECT * FROM kingdoms',function(err,rows){
                let numOf=offensiveWars.length;
                let numDe=defensiveWars.length;
                
                console.log('SHOUld happen last')
                console.log( "offesnive war array " + offensiveWars)
                console.log( "defensive war array " + defensiveWars)
                console.log('num de ' + numDe)
                console.log('numof'+numOf)
                res.render('war', {loffensiveWars: offensiveWars, defensiveWars:defensiveWars,numDe,numOf})
                })},1000
            )
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
                if(rows==undefined) {
                    res.redirect ('/')
                    console.log('this bih not a kingdom')
                  } else{
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
                  }

            })
        }
    })
})

// //Ideally this is like a popup not a seperate page
// router.post('/attack', urlencodedParser, function(req,res) {
//     console.log(req.body.warid + "line 116");
//     let storedID;
//     db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
//       if(rows==undefined) {
//         res.redirect ('/')
//         console.log('this bih not signed in')
//       } else{
//         storedID=parseInt(rows.id, 10)
//         db.serialize(()=>{
//             let domesticAir;
//             let domesticGround;
//             let domesticSea;
//             let domesticSiege;
//             let domesticMaps;
//             let domesticStability;
//             let foreignAir;
//             let foreignGround;
//             let foreignSea;
//             let foreignSiege; 
//             let foreignMaps;
//             let enemyID;
//             let foreignStability;
//             console.log(req.body.warid)
//             db.get(`SELECT * FROM wars WHERE warid=?`, req.body.warid, function(err,rows){
//                     if (rows.aggressorid==storedID){
//                         enemyID=rows.defenderid;
//                         domesticMaps=rows.aggressormaps;
//                         domesticStability=rows.aggressorstability;
//                         foreignMaps=rows.defendermaps;
//                         foreignStability=rows.defenderstability;
//                     }
//                     if (rows.defenderid==storedID) {
//                         enemyID=rows.aggressorid
//                         domesticMaps=rows.defendermaps;
//                         domesticStability=rows.defenderstability;
//                         foreignMaps=rows.aggressormaps;
//                         foreignStability=rows.aggressorstability;
//                     }
//                 console.log(enemyID)
//                 db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
//                     warriors = {
//                     'name': 'Warriors',
//                     'value': rows.warriors
//                     } 
//                     archers = {
//                     'name': 'Archers',
//                     'value': rows.archers
//                     } 
//                     cavalry = {
//                     'name': 'Cavalry',
//                     'value': rows.cavalry
//                     } 
//                     blacksmiths = {
//                         'name':'Blacksmith',
//                         'value': rows.blacksmiths
//                     }
//                     priests = {
//                         'name': 'Priests',
//                         'value':rows.priests
//                     }
//                     mages = {
//                         'name': 'Mages',
//                         'value': rows.mages
//                     }
//                     blimps = {
//                         'name': 'Blimps',
//                         'value': rows.blimps
//                     }
//                     harpies = {
//                         'name': 'Harpies',
//                         'value': rows.harpies
//                     }
//                     angels = {
//                         'name': 'Angels',
//                         'value': rows.angels
//                     }
//                     dragons = {
//                         'name': 'Dragons',
//                         'value': rows.dragons
//                     }
//                     galleys = {
//                         'name': 'Galleys',
//                         'value': rows.galleys
//                     }
//                     pirates = {
//                         'name': 'Pirates',
//                         'value': rows.pirates
//                     }
//                     sea_serpents = {
//                         'name': 'Sea Serpents',
//                         'value': rows.sea_serpents
//                     }
//                     catapults = {
//                         'name': 'Catapults',
//                         'value': rows.catapults
//                     }
//                     trebuchets= {
//                         'name': 'Trebuchets',
//                         'value':rows.trebuchets
//                     }
//                     cannons={
//                         'name': 'Cannons',
//                         'values': rows.cannons
//                     }
//                     domesticGround = [warriors, archers, cavalry,blacksmiths,priests,mages];
//                     domesticAir = [blimps, harpies, angels, dragons];
//                     domesticSea = [galleys, pirates, sea_serpents];
//                     domesticSiege = [catapults, trebuchets, cannons];
//                     console.log(domesticGround);
//             })
//                 db.get(`SELECT * FROM military WHERE id = ?`, enemyID, function(err,rows) {
//                     warriors = {
//                     'name': 'Warriors',
//                     'value': rows.warriors
//                     } 
//                     archers = {
//                     'name': 'Archers',
//                     'value': rows.archers
//                     } 
//                     cavalry = {
//                     'name': 'Cavalry',
//                     'value': rows.cavalry
//                     } 
//                     blacksmiths = {
//                         'name':'Blacksmith',
//                         'value': rows.blacksmiths
//                     }
//                     priests = {
//                         'name': 'Priests',
//                         'value':rows.priests
//                     }
//                     mages = {
//                         'name': 'Mages',
//                         'value': rows.mages
//                     }
//                     blimps = {
//                         'name': 'Blimps',
//                         'value': rows.blimps
//                     }
//                     harpies = {
//                         'name': 'Harpies',
//                         'value': rows.harpies
//                     }
//                     angels = {
//                         'name': 'Angels',
//                         'value': rows.angels
//                     }
//                     dragons = {
//                         'name': 'Dragons',
//                         'value': rows.dragons
//                     }
//                     galleys = {
//                         'name': 'Galleys',
//                         'value': rows.galleys
//                     }
//                     pirates = {
//                         'name': 'Pirates',
//                         'value': rows.pirates
//                     }
//                     sea_serpents = {
//                         'name': 'Sea Serpents',
//                         'value': rows.sea_serpents
//                     }
//                     catapults = {
//                         'name': 'Catapults',
//                         'value': rows.catapults
//                     }
//                     trebuchets= {
//                         'name': 'Trebuchets',
//                         'value':rows.trebuchets
//                     }
//                     cannons={
//                         'name': 'Cannons',
//                         'values': rows.cannons
//                     }
//                     foreignGround = [warriors, archers, cavalry,blacksmiths,priests,mages];
//                     foreignAir = [blimps, harpies, angels, dragons];
//                     foreignSea = [galleys, pirates, sea_serpents];
//                     foreignSiege = [catapults, trebuchets, cannons];
//                     res.render('attack', {domesticAir,domesticGround,domesticSea,domesticSiege,domesticMaps,domesticStability, foreignAir, foreignGround,foreignSea,foreignSiege,foreignMaps,foreignStability, warid:req.body.warid});
//             }) 
//             })

//     })
//     }}) 
// })

router.post('/ground', urlencodedParser, function(req,res){
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
        if(domesticMaps>=12) {
            let newMaps=domesticMaps-12;
            db.serialize(()=>{
                db.get('SELECT * FROM wars WHERE warid=?', req.body.warid, function(err,rows){
                    if (rows.aggressorid==storedID){
                        enemyID=rows.defenderid;
                        db.run('UPDATE wars SET aggressormaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    if (rows.defenderid==storedID) {
                        enemyID=rows.aggressorid
                        db.run('UPDATE wars SET defendermaps=? WHERE warid=?',[newMaps,req.body.warid])
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
                        foreignGround[6]=rows.angels;
                        foreignGround[7]=rows.dragons;
                        foreignGround[8]=rows.pirates
                        let defendingPower=Number(foreignGround[0])*1+Number(foreignGround[1])*6+Number(foreignGround[2])*5+Number(foreignGround[3])*10+Number(foreignGround[4])*15+Number(foreignGround[5])*15+Number(foreignGround[6]*8)+Number(foreignGround[7]*18)+Number(foreignGround[8]*4);
                        let defenderBonus=2;
                        while(defenderBonus>=1.4) {
                            defenderBonus= Math.random()+1.001;
                        }
                        console.log(defendingPower)
                        console.log(attackingPower)
                        console.log(defenderBonus)
                        if (attackingPower>1.25*defenderBonus*defendingPower) {
                            console.log('EXTREME ViCOTRY')
                            //casualty rate for attacking melee (CRAM)
                            let CRAM = 1-Math.floor(Math.random()*(9-3)+1)/100
                            let CRAR = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(9-5)+5)/100
                            let newDomesticGround=[Math.floor(domesticGround[0]*CRAM), Math.floor(domesticGround[1]*CRAR), Math.floor(domesticGround[2]*CRAM), Math.floor(domesticGround[3]*CRAR), Math.floor(domesticGround[4]*CRAM), Math.floor(domesticGround[5]*CRAR)]
                            let newForeignGround=[Math.floor(foreignGround[0]*CRDM), Math.floor(foreignGround[1]*CRDR), Math.floor(foreignGround[2]*CRDM), Math.floor(foreignGround[3]*CRDR), Math.floor(foreignGround[4]*CRDM), Math.floor(foreignGround[5]*CRDR), Math.floor(foreignGround[6]*CRDO), Math.floor(foreignGround[7]*CRDO), Math.floor(foreignGround[8]*CRDO)]
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=? WHERE id=?', [newDomesticGround[0],newDomesticGround[1],newDomesticGround[2],newDomesticGround[3],newDomesticGround[4],newDomesticGround[5],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=?, angels=?, dragons=?, pirates=? WHERE id=?', [newForeignGround[0],newForeignGround[1],newForeignGround[2],newForeignGround[3],newForeignGround[4],newForeignGround[5],newForeignGround[6],newForeignGround[7],newForeignGround[8],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-14;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            
                        } else if (attackingPower>1.1*defenderBonus*defendingPower) {
                            console.log('Medium VICTORY')
                            let CRAM = 1-Math.floor(Math.random()*(12-7)+7)/100
                            let CRAR = 1-Math.floor(Math.random()*(7-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(17-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(12-9)+9)/100
                            let CRDO = 1-Math.floor(Math.random()*(6-3)+3)/100
                            let newDomesticGround=[Math.floor(domesticGround[0]*CRAM), Math.floor(domesticGround[1]*CRAR), Math.floor(domesticGround[2]*CRAM), Math.floor(domesticGround[3]*CRAR), Math.floor(domesticGround[4]*CRAM), Math.floor(domesticGround[5]*CRAR)]
                            let newForeignGround=[Math.floor(foreignGround[0]*CRDM), Math.floor(foreignGround[1]*CRDR), Math.floor(foreignGround[2]*CRDM), Math.floor(foreignGround[3]*CRDR), Math.floor(foreignGround[4]*CRDM), Math.floor(foreignGround[5]*CRDR), Math.floor(foreignGround[6]*CRDO), Math.floor(foreignGround[7]*CRDO), Math.floor(foreignGround[8]*CRDO)]
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=? WHERE id=?', [newDomesticGround[0],newDomesticGround[1],newDomesticGround[2],newDomesticGround[3],newDomesticGround[4],newDomesticGround[5],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=?, angels=?, dragons=?, pirates=? WHERE id=?', [newForeignGround[0],newForeignGround[1],newForeignGround[2],newForeignGround[3],newForeignGround[4],newForeignGround[5],newForeignGround[6],newForeignGround[7],newForeignGround[8],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            let newDefenderStability=foreignStability-10;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            } else {
                                db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            }
                        } else if (attackingPower>.8*defenderBonus*defendingPower) {
                            console.log('stalemate')
                            let CRAM = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(12-3)+3)/100
                            let CRDM = 1-Math.floor(Math.random()*(14-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(4-2)+2)/100
                            let newDomesticGround=[Math.floor(domesticGround[0]*CRAM), Math.floor(domesticGround[1]*CRAR), Math.floor(domesticGround[2]*CRAM), Math.floor(domesticGround[3]*CRAR), Math.floor(domesticGround[4]*CRAM), Math.floor(domesticGround[5]*CRAR)]
                            let newForeignGround=[Math.floor(foreignGround[0]*CRDM), Math.floor(foreignGround[1]*CRDR), Math.floor(foreignGround[2]*CRDM), Math.floor(foreignGround[3]*CRDR), Math.floor(foreignGround[4]*CRDM), Math.floor(foreignGround[5]*CRDR), Math.floor(foreignGround[6]*CRDO), Math.floor(foreignGround[7]*CRDO), Math.floor(foreignGround[8]*CRDO)]
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=? WHERE id=?', [newDomesticGround[0],newDomesticGround[1],newDomesticGround[2],newDomesticGround[3],newDomesticGround[4],newDomesticGround[5],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=?, angels=?, dragons=?, pirates=? WHERE id=?', [newForeignGround[0],newForeignGround[1],newForeignGround[2],newForeignGround[3],newForeignGround[4],newForeignGround[5],newForeignGround[6],newForeignGround[7],newForeignGround[8],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            let newDefenderStability=foreignStability-6;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
        
                            } else{
                                db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            }
                        } else {
                            console.log('loss');
                            let CRAM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(13-10)+10)/100
                            let CRDM = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDR = 1-Math.floor(Math.random()*(3-1)+1)/100 
                            let CRDO = 1-Math.floor(Math.random()*(3-1)+1)/100
                            let newDomesticGround=[Math.floor(domesticGround[0]*CRAM), Math.floor(domesticGround[1]*CRAR), Math.floor(domesticGround[2]*CRAM), Math.floor(domesticGround[3]*CRAR), Math.floor(domesticGround[4]*CRAM), Math.floor(domesticGround[5]*CRAR)]
                            let newForeignGround=[Math.floor(foreignGround[0]*CRDM), Math.floor(foreignGround[1]*CRDR), Math.floor(foreignGround[2]*CRDM), Math.floor(foreignGround[3]*CRDR), Math.floor(foreignGround[4]*CRDM), Math.floor(foreignGround[5]*CRDR), Math.floor(foreignGround[6]*CRDO), Math.floor(foreignGround[7]*CRDO), Math.floor(foreignGround[8]*CRDO)]
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=? WHERE id=?', [newDomesticGround[0],newDomesticGround[1],newDomesticGround[2],newDomesticGround[3],newDomesticGround[4],newDomesticGround[5],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=?, angels=?, dragons=?, pirates=? WHERE id=?', [newForeignGround[0],newForeignGround[1],newForeignGround[2],newForeignGround[3],newForeignGround[4],newForeignGround[5],newForeignGround[6],newForeignGround[7],newForeignGround[8],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            let newDefenderStability=foreignStability-0;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }else{
                                db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            }
                        }
                    })
                })
                res.redirect('/war')
            })
        } else {
            console.log('not sufficient military points')
            res.redirect('/war')

        }}
    })
})

router.post('/air', urlencodedParser, function(req,res){
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
        if(domesticMaps>=9) {
            let newMaps=domesticMaps-9;
            db.serialize(()=>{
                db.get('SELECT * FROM wars WHERE warid=?', req.body.warid, function(err,rows){
                    if (rows.aggressorid==storedID){
                        enemyID=rows.defenderid;
                        db.run('UPDATE wars SET aggressormaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    if (rows.defenderid==storedID) {
                        enemyID=rows.aggressorid
                        db.run('UPDATE wars SET defendermaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    //console.log(enemyID)
                })
                db.get('SELECT * FROM military WHERE id=?', storedID, function(err,rows){
                    console.log(enemyID)
                    domesticAir[0]=rows.blimps;
                    domesticAir[1]=rows.harpies;
                    domesticAir[2]=rows.angels;
                    domesticAir[3]=rows.dragons;
                    //console.log(domesticGround)
                    let attackingPower=Number(domesticAir[0])*14+Number(domesticAir[1])*10+Number(domesticAir[2])*8+Number(domesticAir[3])*13;
                    db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                        console.log(rows);
                        foreignAir[0]=rows.blimps;
                        foreignAir[1]=rows.harpies;
                        foreignAir[2]=rows.angels;
                        foreignAir[3]=rows.dragons;
                        foreignAir[4]=rows.archers;
                        foreignAir[5]=rows.mages;
                        foreignAir[6]=rows.galleys;
                        let defendingPower=Number(foreignAir[0])*5+Number(foreignAir[1])*7+Number(foreignAir[2])*8+Number(foreignAir[3])*18+Number(foreignAir[4])*6+Number(foreignAir[5])*15+Number(foreignAir[6]*8);
                        let defenderBonus=2;
                        while(defenderBonus>=1.4) {
                            defenderBonus= Math.random()+1.001;
                        }
                        console.log(defendingPower)
                        console.log(attackingPower)
                        console.log(defenderBonus)
                        if (attackingPower>1.25*defenderBonus*defendingPower) {
                            console.log('EXTREME ViCOTRY')
                            //casualty rate for attacking melee (CRAM)
                            let CRAM = 1-Math.floor(Math.random()*(9-3)+1)/100
                            let CRAR = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(9-5)+5)/100
                            let newDomesticAir=[Math.floor(domesticAir[0]*CRAM), Math.floor(domesticAir[1]*CRAR), Math.floor(domesticAir[2]*CRAM), Math.floor(domesticAir[3]*CRAR)]
                            let newForeignAir=[Math.floor(foreignAir[0]*CRDM), Math.floor(foreignAir[1]*CRDR), Math.floor(foreignAir[2]*CRDM), Math.floor(foreignAir[3]*CRDR), Math.floor(foreignAir[4]*CRDM), Math.floor(foreignAir[5]*CRDR), Math.floor(foreignAir[6]*CRDO)]
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newDomesticAir[0],newDomesticAir[1],newDomesticAir[2],newDomesticAir[3],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=?, archers=?, mages=?, galleys=? WHERE id=?', [newForeignAir[0],newForeignAir[1],newForeignAir[2],newForeignAir[3],newForeignAir[4],newForeignAir[5],newForeignAir[6],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            console.log(foreignStability)
                            let newDefenderStability=foreignStability-10;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            
                        } else if (attackingPower>1.1*defenderBonus*defendingPower) {
                            console.log('Medium VICTORY')
                            let CRAM = 1-Math.floor(Math.random()*(12-7)+7)/100
                            let CRAR = 1-Math.floor(Math.random()*(7-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(17-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(12-9)+9)/100
                            let CRDO = 1-Math.floor(Math.random()*(6-3)+3)/100
                            let newDomesticAir=[Math.floor(domesticAir[0]*CRAM), Math.floor(domesticAir[1]*CRAR), Math.floor(domesticAir[2]*CRAM), Math.floor(domesticAir[3]*CRAR)]
                            let newForeignAir=[Math.floor(foreignAir[0]*CRDM), Math.floor(foreignAir[1]*CRDR), Math.floor(foreignAir[2]*CRDM), Math.floor(foreignAir[3]*CRDR), Math.floor(foreignAir[4]*CRDM), Math.floor(foreignAir[5]*CRDR), Math.floor(foreignAir[6]*CRDO)]
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newDomesticAir[0],newDomesticAir[1],newDomesticAir[2],newDomesticAir[3],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=?, archers=?, mages=?, galleys=? WHERE id=?', [newForeignAir[0],newForeignAir[1],newForeignAir[2],newForeignAir[3],newForeignAir[4],newForeignAir[5],newForeignAir[6],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-6;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        } else if (attackingPower>.8*defenderBonus*defendingPower) {
                            console.log('stalemate')
                            let CRAM = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(12-3)+3)/100
                            let CRDM = 1-Math.floor(Math.random()*(14-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(4-2)+2)/100
                            let newDomesticAir=[Math.floor(domesticAir[0]*CRAM), Math.floor(domesticAir[1]*CRAR), Math.floor(domesticAir[2]*CRAM), Math.floor(domesticAir[3]*CRAR)]
                            let newForeignAir=[Math.floor(foreignAir[0]*CRDM), Math.floor(foreignAir[1]*CRDR), Math.floor(foreignAir[2]*CRDM), Math.floor(foreignAir[3]*CRDR), Math.floor(foreignAir[4]*CRDM), Math.floor(foreignAir[5]*CRDR), Math.floor(foreignAir[6]*CRDO)]
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newDomesticAir[0],newDomesticAir[1],newDomesticAir[2],newDomesticAir[3],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=?, archers=?, mages=?, galleys=? WHERE id=?', [newForeignAir[0],newForeignAir[1],newForeignAir[2],newForeignAir[3],newForeignAir[4],newForeignAir[5],newForeignAir[6],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-4;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        } else {
                            console.log('loss');
                            let CRAM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(13-10)+10)/100
                            let CRDM = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDR = 1-Math.floor(Math.random()*(3-1)+1)/100
                            let CRDO = 1-Math.floor(Math.random()*(3-1)+1)/100
                            let newDomesticAir=[Math.floor(domesticAir[0]*CRAM), Math.floor(domesticAir[1]*CRAR), Math.floor(domesticAir[2]*CRAM), Math.floor(domesticAir[3]*CRAR)]
                            let newForeignAir=[Math.floor(foreignAir[0]*CRDM), Math.floor(foreignAir[1]*CRDR), Math.floor(foreignAir[2]*CRDM), Math.floor(foreignAir[3]*CRDR), Math.floor(foreignAir[4]*CRDM), Math.floor(foreignAir[5]*CRDR), Math.floor(foreignAir[6]*CRDO)]
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newDomesticAir[0],newDomesticAir[1],newDomesticAir[2],newDomesticAir[3],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=?, archers=?, mages=?, galleys=? WHERE id=?', [newForeignAir[0],newForeignAir[1],newForeignAir[2],newForeignAir[3],newForeignAir[4],newForeignAir[5],newForeignAir[6],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-0;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        }
                    })
                })
                res.redirect('/war')
            })
        } else {
            console.log('not sufficient military points')
            res.redirect('/war')

        }
        }
    })
})

router.post('/sea', urlencodedParser, function(req,res){
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
        if(domesticMaps>=8) {
            db.serialize(()=>{
                let newMaps=domesticMaps-8;
                db.get('SELECT * FROM wars WHERE warid=?', req.body.warid, function(err,rows){
                    if (rows.aggressorid==storedID){
                        enemyID=rows.defenderid;
                        db.run('UPDATE wars SET aggressormaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    if (rows.defenderid==storedID) {
                        enemyID=rows.aggressorid
                        db.run('UPDATE wars SET defendermaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    //console.log(enemyID)
                })
                db.get('SELECT * FROM military WHERE id=?', storedID, function(err,rows){
                    console.log(enemyID)
                    domesticSea[0]=rows.galleys;
                    domesticSea[1]=rows.pirates;
                    domesticSea[2]=rows.sea_serpents;
                    //console.log(domesticGround)
                    let attackingPower=Number(domesticSea[0])*8+Number(domesticSea[1])*15+Number(domesticSea[2])*40;
                    db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                        console.log(rows);
                        foreignSea[0]=rows.galleys;
                        foreignSea[1]=rows.pirates;
                        foreignSea[2]=rows.sea_serpents;
                        foreignSea[3]=rows.archers;
                        foreignSea[4]=rows.angels;
                        let defendingPower=Number(foreignSea[0])*8+Number(foreignSea[1])*4+Number(foreignSea[2])*40+Number(foreignSea[3])*6+Number(foreignSea[4])*8;
                        let defenderBonus=2;
                        while(defenderBonus>=1.4) {
                            defenderBonus= Math.random()+1.001;
                        }
                        console.log(defendingPower)
                        console.log(attackingPower)
                        console.log(defenderBonus)
                        if (attackingPower>1.25*defenderBonus*defendingPower) {
                            console.log('EXTREME ViCOTRY')
                            //casualty rate for attacking melee (CRAM)
                            let CRAM = 1-Math.floor(Math.random()*(9-3)+3)/100
                            let CRAR = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(9-5)+5)/100
                            let newDomesticSea=[Math.floor(domesticSea[0]*CRAR), Math.floor(domesticSea[1]*CRAM), Math.floor(domesticSea[2]*CRAM)]
                            let newForeignSea=[Math.floor(foreignSea[0]*CRDR), Math.floor(foreignSea[1]*CRDM), Math.floor(foreignSea[2]*CRDM), Math.floor(foreignSea[3]*CRDO), Math.floor(foreignSea[4]*CRDO)]
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=? WHERE id=?', [newDomesticSea[0],newDomesticSea[1],newDomesticSea[2],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=?, archers=?, angels=? WHERE id=?', [newForeignSea[0],newForeignSea[1],newForeignSea[2],newForeignSea[3],newForeignSea[4],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-9;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                            
                        } else if (attackingPower>1.1*defenderBonus*defendingPower) {
                            console.log('Medium VICTORY')
                            let CRAM = 1-Math.floor(Math.random()*(12-7)+7)/100
                            let CRAR = 1-Math.floor(Math.random()*(7-1)+1)/100
                            let CRDM = 1-Math.floor(Math.random()*(17-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(12-9)+9)/100
                            let CRDO = 1-Math.floor(Math.random()*(6-3)+3)/100
                            let newDomesticSea=[Math.floor(domesticSea[0]*CRAR), Math.floor(domesticSea[1]*CRAM), Math.floor(domesticSea[2]*CRAM)]
                            let newForeignSea=[Math.floor(foreignSea[0]*CRDR), Math.floor(foreignSea[1]*CRDM), Math.floor(foreignSea[2]*CRDM), Math.floor(foreignSea[3]*CRDO), Math.floor(foreignSea[4]*CRDO)]
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=? WHERE id=?', [newDomesticSea[0],newDomesticSea[1],newDomesticSea[2],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=?, archers=?, angels=? WHERE id=?', [newForeignSea[0],newForeignSea[1],newForeignSea[2],newForeignSea[3],newForeignSea[4],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-7;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        } else if (attackingPower>.8*defenderBonus*defendingPower) {
                            console.log('stalemate')
                            let CRAM = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(12-3)+3)/100
                            let CRDM = 1-Math.floor(Math.random()*(14-10)+10)/100
                            let CRDR = 1-Math.floor(Math.random()*(15-10)+10)/100
                            let CRDO = 1-Math.floor(Math.random()*(4-2)+2)/100
                            let newDomesticSea=[Math.floor(domesticSea[0]*CRAR), Math.floor(domesticSea[1]*CRAM), Math.floor(domesticSea[2]*CRAM)]
                            let newForeignSea=[Math.floor(foreignSea[0]*CRDR), Math.floor(foreignSea[1]*CRDM), Math.floor(foreignSea[2]*CRDM), Math.floor(foreignSea[3]*CRDO), Math.floor(foreignSea[4]*CRDO)]
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=? WHERE id=?', [newDomesticSea[0],newDomesticSea[1],newDomesticSea[2],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=?, archers=?, angels=? WHERE id=?', [newForeignSea[0],newForeignSea[1],newForeignSea[2],newForeignSea[3],newForeignSea[4],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-3;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        } else {
                            console.log('loss');
                            let CRAM = 1-Math.floor(Math.random()*(20-10)+10)/100
                            let CRAR = 1-Math.floor(Math.random()*(13-10)+10)/100
                            let CRDM = 1-Math.floor(Math.random()*(5-1)+1)/100
                            let CRDR = 1-Math.floor(Math.random()*(3-1)+1)/100
                            let CRDO = 1-Math.floor(Math.random()*(3-1)+1)/100
                            let newDomesticSea=[Math.floor(domesticSea[0]*CRAR), Math.floor(domesticSea[1]*CRAM), Math.floor(domesticSea[2]*CRAM)]
                            let newForeignSea=[Math.floor(foreignSea[0]*CRDR), Math.floor(foreignSea[1]*CRDM), Math.floor(foreignSea[2]*CRDM), Math.floor(foreignSea[3]*CRDO), Math.floor(foreignSea[4]*CRDO)]
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=? WHERE id=?', [newDomesticSea[0],newDomesticSea[1],newDomesticSea[2],storedID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('attacker took damage')
                            })
                            db.run('UPDATE military SET galleys=?, pirates=?, sea_serpents=?, archers=?, angels=? WHERE id=?', [newForeignSea[0],newForeignSea[1],newForeignSea[2],newForeignSea[3],newForeignSea[4],enemyID], function(err){
                                if(err) {
                                    console.error(err.message)
                                }
                                console.log('defender took damage')
                            })
                            //console.log(foreignStability)
                            let newDefenderStability=foreignStability-0;
                            if (newDefenderStability<0) {
                                newDefenderStability=0;
                                db.run('DELETE FROM wars WHERE warid=?',req.body.warid)
                            }
                            //console.log(newDefenderStability)
                            db.run('UPDATE wars SET defenderstability=? WHERE warid=?', [newDefenderStability, req.body.warid])
                        }
                    })
                })
                res.redirect('/war')
            })
        }else {
                console.log('not sufficient military points')
                res.redirect('/war')
            }
        
        }
    })
})

router.post('/siege', urlencodedParser, function(req,res){
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
        if (domesticMaps>=18) {
            db.serialize(()=>{
                let newMaps=domesticMaps-8;
                db.get('SELECT * FROM wars WHERE warid=?', req.body.warid, function(err,rows){
                    if (rows.aggressorid==storedID){
                        enemyID=rows.defenderid;
                        db.run('UPDATE wars SET aggressormaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    if (rows.defenderid==storedID) {
                        enemyID=rows.aggressorid
                        db.run('UPDATE wars SET defendermaps=? WHERE warid=?',[newMaps,req.body.warid])
                    }
                    //console.log(enemyID)
                })
            db.get('SELECT * FROM military WHERE id=?', storedID, function(err,rows){
                let siege=[];
                siege[0]=rows.catapults;
                siege[1]=rows.trebuchets;
                siege[2]=rows.catapults;
                let type=req.body.medium;
                let newDefenderStability=foreignStability - siege[0]*2+siege[1]*3+siege[2]*5;
                let causaltyCoefficient;
                if (siege[2]!=0) {
                    causaltyCoefficient = 1-Math.floor(Math.random()*(10-7)+7)/100
                } else if (siege[1]!=0)  {
                    causaltyCoefficient = 1-Math.floor(Math.random()*(7-5)+5)/100
                } else if (siege[0]!=0) {
                    causaltyCoefficient = 1-Math.floor(Math.random()*(5-2)+2)/100
                }
                db.run('UPDATE wars SET defenderstability=? WHERE warid=?',[newDefenderStability, req.body.warid])
                if (type=='ground') {
                    db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                        let Ground=[];
                        Ground[0]=rows.warriors;
                        Ground[1]=rows.archers;
                        Ground[2]=rows.cavalry;
                        Ground[3]=rows.blacksmiths;
                        Ground[4]=rows.priests;
                        Ground[5]=rows.mages;
                        let newGround=[Math.floor(Ground[0]*causaltyCoefficient),Math.floor(NumberGround[1]*causaltyCoefficient),Math.floor(Ground[2]*causaltyCoefficient),Math.floor(Ground[3]*causaltyCoefficient),Math.floor(Ground[4]*causaltyCoefficient),Math.floor(Ground[5]*causaltyCoefficient)]
                        db.run('UPDATE military SET warriors=?, archers=?, cavalry=?, blacksmiths=?, priests=?, mages=? WHERE id=?', [newGround[0],newGround[1],newGround[2],newGround[3],newGround[4],newGround[5],enemyID])
                    })
                } else if (type=='air') {
                    db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                        let Air=[];
                        Air[0]=rows.blimps;
                        Air[1]=rows.harpies;
                        Air[2]=rows.angels;
                        Air[3]=rows.dragons;
                        let newAir=[Math.floor(Air[0]*causaltyCoefficient),Math.floor(Air[1]*causaltyCoefficient),Math.floor(Air[2]*causaltyCoefficient),Math.floor(Air[3]*causaltyCoefficient)]
                        db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newAir[0],newAir[1],newAir[2],newAir[3],enemyID])
                    })
                } else if (type =='sea') {
                    db.get('SELECT * FROM military WHERE id=?', enemyID, function(err,rows){
                        let Sea=[];
                        Sea[0]=rows.galleys;
                        Sea[1]=rows.pirates;
                        Sea[2]=rows.sea_serpents;
                        let newSea=[Math.floor(Sea[0]*causaltyCoefficient),Math.floor(Sea[1]*causaltyCoefficient),Math.floor(Sea[2]*causaltyCoefficient),Math.floor(Sea[3]*causaltyCoefficient)]
                        db.run('UPDATE military SET blimps=?, harpies=?, angels=?, dragons=? WHERE id=?', [newSea[0],newSea[1],newSea[2],enemyID])
                    })
                }
            })
          })
        } else {
            console.log('not sufficient military points')
            res.redirect('/war')
        }
      }
    })
})

setInterval(function() {
    db.each('SELECT * FROM wars', function(err,rows) {
        let id = rows.warid;
        let aggroMaps=rows.aggressormaps;
        let defendMaps=rows.defendermaps;
        if (aggroMaps<36) {
            aggroMaps+=1;
        }
        if (defendMaps<36) {
            defendMaps+=1;
        }
        db.run('UPDATE wars SET aggressormaps=?, defendermaps=? WHERE warid=?',[aggroMaps, defendMaps, id], function(err) {
            if (err) {
                console.log('couldnt update military points')
            }else {
                console.log('updatres military points')
            }
        })
    })
  },120000)

module.exports = router; 