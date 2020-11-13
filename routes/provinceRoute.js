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

const generation = {
    'market' : 5,
    'bazar' : 40,
    'emporium' : 320,
    'plaza' : 3,
    'theatre' : 5,
    'coliseum' : 12
  }

const descriptions = {
    'plantation' : 'Plantations are estates designed to harvest plants. They are used to generate Flora for your kingdom. One plantation generates 4 flora each turn.',
    'pasture' : 'Pastures are large fields that enable livestock to flourish. They are used to generate Fauna for your kingdom. One pasture generates 2 fauna each turn.',
    'mine' : 'Mines are excavations where ore can be found. One mine can generate 12 ore each turn. This ore can be turned into silver, iron, or bronze through refineries.',
    'mana_rift' : 'Mana Rifts harness a mysterious energy source found in this realm. One mana rift generates 16 mana each turn that can power varius other buildings.',
    'lumber_mill' : 'Lumbermills allow your citizens to convert Flora into Lumber. One lumbermill turns 3 flora into 9 lumber each turn. Lumber is required for most constructions.',
    'slaughterhouse' : 'Slaughterhouses allow your citizens to convert Fauna into Food. One slaughterhouse turns 2 fauna into 15 food. Without adequate food, your provincial happiness will decrease.',
    'silver_refinery' : 'Silver Refineries allow your citizens to identify silver ore. One Silver Refinery turns 6 ore into 1 Silver each turn. Silver and Iron are used in late game units and buildings.',
    'iron_refinery' : 'Iron Refineries allow your citizens to identify iron ore. One Iron Refinery turns 6 ore into 1 Iron each turn. Silver and Iron are used in late game units and buildings.',
    'bronze_refinery' : 'Bronze Refineries allow your citizens to create bronze from ore. One Bronze Refinery turns 8 ore into 1 Bronze each turn.',
    'steel_refinery' : 'Steel Refineries allow your citizens to create steel from silver and iron. One Steel Refinery turns 4 iron and 1 silver into 1 steel each turn.',
    'market' : 'Markets are the simplest economic establishment in the game. Each market generates 5 gold for your kingdom each turn.',
    'bazar' : 'Bazars are a collection of small shops that function as a marketplace. Each bazar generates 40 gold for your kingdom each turn.',
    'emporium' : 'Emporiums are centers of exchange and commerce for your province. Each emporium generates 320 gold for your kingdom each turn.',
    'plaza' : 'Plazas are public squares with open space where your citizens can gather and socialize. Each Plaza generates 3 happiness among your citizens.',
    'theatre' : 'Theatres are outdoor area where plays and other dramatic performances are performed. Each theatre generates 5 happiness among your citizens.',
    'coliseum' : 'Coliseums are large stadiums where public events are held. Only one can be constructed per province and generates 12 happiness among your citizens.',
    'school' : 'Schools are the foundational unit of all education within a province. Each school generates 1 science each turn for your kingdom.',
    'library' : 'Libaries collect books, periodicals, and dramas for the masses to view. Each library generates 3 science each turn for your kingdom.',
    'laboratory' : 'Laboratories enable your citizens to engage in the higher sciences. Each laboratory generates 8 science each turn for your kingdom.',
    'barracks' : 'Barracks enable you to enlist warriors, archers, and cavalry. Each barracks can hold 3000 warriors (100 a turn), 3000 archers (100 a turn) and 750 cavalry (15 a turn).',
    'academy' : 'Academies enable you to enlist blacksmiths, priests, mages, and angels. Each Academy can hold 250 blacksmiths (5 a turn), 1500 priests (50 a turn), 1250 mages (50 a turn), and 300 angels (15 a turn).',
    'hatchery' : 'Hatcheries enable you to enlist dragons, harpies, and serpents. Each Hatchery can hold 40 dragons (1 a turn), 90 harpies (3 a turn), and 25 serpents (1 a turn).',
    'harbor' : 'Harbors enable you to enlist galleys and pirates. Each Harbor can hold 75 galleys (15 a turn) and 50 pirates (10 a turn).',
    'workshop' : 'Workshops enable you to construct Catapults, Trebuchets, and Cannons. Each workshop increases capacity by one.',
}

const maximums = {
    'plantation' : 8,
    'pasture' : 8,
    'mine' : 15,
    'mana_rift' : 6,
    'lumber_mill' : 10,
    'slaughterhouse' : 6,
    'silver_refinery' : 4,
    'iron_refinery' : 4,
    'bronze_refinery' : 4,
    'steel_refinery' : 8,
    'market' : 5,
    'bazar' : 4,
    'emporium' : 2,
    'plaza' : 6,
    'theatre' : 3,
    'coliseum' : 1,
    'school' : 12,
    'library' : 8,
    'laboratory' : 3,
    'barracks' : 5,
    'academy' : 6,
    'hatchery' : 4,
    'harbor' : 5,
    'workshop' : 1,
}

const costs = {
    'plantation': {
        gold: 15
    },
    'pasture' : {
        gold: 15
    },
    'mine' : {
        gold: 30
    },
    'mana_rift' : {
        gold: 50
    },
    'lumber_mill' : {
        gold: 30
    },
    'slaughterhouse' : {
        gold: 30
    },
    'silver_refinery' : {
        gold: 30,
        lumber:12,
    },
    'iron_refinery' :  {
        gold: 30,
        lumber:12,
    },
    'bronze_refinery' :  {
        gold: 30,
        lumber:12,
    },
    'steel_refinery' :  {
        gold: 80,
        lumber:40,
    },
    'market' : {
        gold: 20,
        lumber:30,
    },
    'bazar' : {
        gold: 220,
        lumber:80,
        iron: 5,
        silver: 5,
    },
    'emporium' : {
        gold: 870,
        lumber: 300,
        bronze: 30,
        steel: 25
    },
    'plaza' : {
        gold: 175,
        lumber: 400,
        bronze: 50,
        iron: 35
    },
    'theatre' : {
        gold: 265,
        lumber: 430,
        steel: 65,
        iron: 60
    },
    'coliseum' : {
        gold: 6000,
        lumber: 800,
        steel: 300,
        silver: 80
    },
    'school' : {
        gold: 150,
        lumber: 30,
    },
    'library' : {
        gold: 600,
        lumber: 200,
        bronze: 40
    },
    'laboratory' :  {
        gold: 1500,
        lumber: 250,
        steel: 90,
        silver: 40
    },
    'barracks' : {
        gold: 80,
        lumber: 15,
    },
    'academy' : {
        gold: 200,
        lumber: 70,
        iron: 10,
    },
    'hatchery' : {
        gold: 300,
        silver: 40,
        fauna: 15
    },
    'harbor' :  {
        gold: 600,
        lumber: 150,
        steel: 250,
    },
    'workshop' : {
        gold: 1000,
        lumber: 680,
        steel: 400,
    },
}

router.post('/construct',urlencodedParser,function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
        } else{
            storedID=parseInt(rows.id, 10);
            let dbname = req.body.dbname;
            let current = req.body.current;
            let provinceid=req.body.provinceid;
            db.get('SELECT * FROM resources WHERE id=?', storedID, function(err,rows){
                let currentGold=rows.gold;
                let currentMana=rows.mana;
                let currentFlora=rows.flora;
                let currentFauna=rows.fauna;
                let currentLumber=rows.lumber;
                let currentFood=rows.food;
                let currentSilver=rows.silver;
                let currentIron=rows.iron;
                let currentBronze=rows.bronze;
                let currentSteel=rows.steel;
                let newValues =[currentGold,currentMana, currentFlora, currentFauna, currentLumber, currentFood,currentSilver,currentIron,currentBronze,currentSteel];
                newValues[0] = cost[dbname]['gold'] ?  currentGold - cost[dbname]['gold']  : currentGold;
                newValues[1]= cost[dbname]['mana'] ?  currentMana - cost[dbname]['mana']  : currentMana;
                newValues[2]= cost[dbname]['flora'] ?  currentFlora - cost[dbname]['flora']  : currentFlora;
                newValues[3]= cost[dbname]['fauna'] ?  currentFauna - cost[dbname]['fauna']  : currentFauna;
                newValues[4]= cost[dbname]['lumber'] ?  currentLumber - cost[dbname]['lumber']  : currentLumber;
                newValues[5]= cost[dbname]['food'] ?  currentFood - cost[dbname]['food']  : currentFood;
                newValues[6]= cost[dbname]['silver'] ?  currentSilver - cost[dbname]['silver']  : currentSilver;
                newValues[7]= cost[dbname]['iron'] ?  currentIron - cost[dbname]['iron']  : currentIron;
                newValues[8]= cost[dbname]['bronze'] ?  currentBronze - cost[dbname]['bronze']  : currentBronze;
                newValues[9]= cost[dbname]['steel'] ?  currentSteel - cost[dbname]['steel']  : currentSteel;
                if (current<maximums[dbname]){
                    let newAmount=current++;
                    checkBuildingCost(newValues).then(check => {        
                        if (check === true) {
                          db.run(`UPDATE provinces SET ${dbname} = ? WHERE provinceid=?`,[newAmount,storedID], function(err) {
                             if (err) {
                              console.err(err.message)
                            }else {
                              console.log(dbname+" has been bought.");
                            }
                          });
                          db.run('UPDATE resources SET gold=?,mana=?,flora=?,fauna=?,lumber=?,food=?,silver=?,iron=?,bronze=?,steel=? WHERE id=?',[newValues[0],newValues[1],newValues[2],newValues[3],newValues[4],newValues[5],newValues[6],newValues[7],newValues[8],newValues[9],storedID], function(err){
                            if (err) {
                              console.err(err.message)
                            }else {
                              res.redirect('/province-view');
                              console.log(dbname+" has been bought.");
                            }
                          })
                        }
                        if (check===false) {
                          res.redirect('/province-view');
                          console.log('not sufficient funds');
                        }
                      }).catch(console.error); 
                } else {
                    console.log('you have the maximum amount of this structure')
                }
                
            })
            
        }
    })
})

router.get('/province', function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
              storedID=parseInt(rows.id, 10);
              let provinceArray=[];
              db.each('SELECT * FROM provinces WHERE userid=?',storedID,function(err,rows){
                  let name=rows.name;
                  let land=rows.land;
                  let id=rows.provinceid;
                  let gold = 12+rows.market*generation.market+rows.bazar*generation.bazar+rows.emporium*generation.emporium;
                  let happiness = 1+rows.plaza*generation.plaza+rows.theatre*generation.theatre+rows.coliseum*generation.coliseum;
                  obj = {
                      name : name,
                      land : land,
                      gold : gold,
                      happiness : happiness,
                      id: id
                  }
                  provinceArray.push(obj)
              })
              setTimeout(function(){
                res.render('province', {provinceArray})
                console.log(provinceArray)
              },1000)
          }
        })
}) 

router.post('/view-province',urlencodedParser,function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
              storedID=parseInt(rows.id, 10);
              let provinceid=req.body.id;
              let rawArray=[];
              let manuArray=[];
              let econArray=[];
              let researchArray=[];
              let entArray=[];
              let milArray=[];
              db.serialize(() => {
              db.get('SELECT * FROM kingdoms WHERE id=?',storedID,function(err,rows){
              db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid,function(err,rows){
                  //Plantation
                  let name = 'Plantation';
                  let description = descriptions.plantation;
                  let current=rows.plantation;
                  let max = maximums.plantation;
                  let cost = costs.plantation;
                  let status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  rawArray.push(obj);
                  
                  //Pasture
                   name = 'Pasture';
                   description = descriptions.pasture;
                   current=rows.pasture;
                   max = maximums.pasture;
                   cost = costs.pasture;
                   status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  rawArray.push(obj);
                  
                  //MINE
                   name = 'Mine';
                   description = descriptions.mine;
                   current=rows.mine;
                   max = maximums.mine;
                   cost = costs.mine;
                   status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  rawArray.push(obj);
                  
                  //MANARIFT
                   name = 'Mana Rift';
                   description = descriptions.mana_rift;
                   current=rows.mana_rift;
                   max = maximums.mana_rift;
                   cost = costs.mana_rift;
                   status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  rawArray.push(obj);
                  
                  //LUMBERMILL
                   name = 'Lumbermill';
                   description = descriptions.lumber_mill;
                   current=rows.lumber_mill;
                   max = maximums.lumber_mill;
                   cost = costs.lumber_mill;
                   status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  manuArray.push(obj);
                    //SLAUGHTERHOSUE
                   name = 'Slaughterhouse';
                   description = descriptions.slaughterhouse;
                   current=rows.slaughterhouse;
                   max = maximums.slaughterhouse;
                   cost = costs.slaughterhouse;
                   status = 'unlocked';
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  manuArray.push(obj);
                })
              db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                   status='locked'
                  if (rows.econ1!=0){
                      status = 'unlocked'
                  }
                  db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid,function(err,rows){
                  //SILVERREFINERY
                   name = 'Silver Refinery';
                   description = descriptions.silver_refinery;
                   current = rows.silver_refinery;
                   max = maximums.silver_refinery;
                   cost = costs.silver_refinery;
                   status = status;
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  manuArray.push(obj)
                    //IRONREFINERY
                   name = 'Iron Refinery';
                   description = descriptions.iron_refinery;
                   current = rows.iron_refinery;
                   max = maximums.iron_refinery;
                   cost = costs.iron_refinery;
                   status = status;
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  manuArray.push(obj)
                    //BRONZEREFINERY
                   name = 'Bronze Refinery';
                   description = descriptions.bronze_refinery;
                   current = rows.bronze_refinery;
                   max = maximums.bronze_refinery;
                   cost = costs.bronze_refinery;
                   status = status;
                  obj = {
                      name : name,
                      description : description,
                      current : current,
                      max : max,
                      cost : cost,
                      status : status
                  }
                  manuArray.push(obj)
                  })
              })
              db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                 status='locked'
                if (rows.econ3!=0){
                    status = 'unlocked'
                }
                db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid,function(err,rows){
                //STEELREFINERY
                 name = 'Steel Refinery';
                 description = descriptions.steel_refinery;
                 current = rows.steel_refinery;
                 max = maximums.steel_refinery;
                 cost = costs.steel_refinery;
                 status = status;
                obj = {
                    name : name,
                    description : description,
                    current : current,
                    max : max,
                    cost : cost,
                    status : status
                }
                manuArray.push(obj)
            db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid,function(err,rows){
                //MARKET
                 name = 'Market';
                 description = descriptions.market;
                 current=rows.market;
                 max = maximums.market;
                 cost = costs.market;
                 status = 'unlocked';
                obj = {
                    name : name,
                    description : description,
                    current : current,
                    max : max,
                    cost : cost,
                    status : status
                }
                econArray.push(obj);
                //BAZAR & EMPORIUM CHECKING
                db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                    let statusE='locked';
                    let statusB='locked';
                    if (rows.econ2!=0){
                        statusB='unlocked'
                    }
                    if(rows.econ4!=0) {
                        statusE='unlocked'
                    }
                    db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid, function(err,rows){
                        name = 'Bazar';
                        description = descriptions.bazar;
                        current=rows.bazar;
                        max = maximums.bazar;
                        cost = costs.bazar;
                        status = statusB;
                        obj = {
                            name : name,
                            description : description,
                            current : current,
                            max : max,
                            cost : cost,
                            status : status
                        }
                        econArray.push(obj);
                        name = 'Emporium';
                        description = descriptions.emporium;
                        current=rows.emporium;
                        max = maximums.emporium;
                        cost = costs.emporium;
                        status = statusE;
                        obj = {
                            name : name,
                            description : description,
                            current : current,
                            max : max,
                            cost : cost,
                            status : status
                        }
                        econArray.push(obj);
                    })
                })
                //SCIENCE THINGS
                //SCHOOL
                name = 'School';
                description = descriptions.school;
                current=rows.school;
                max = maximums.school;
                cost = costs.school;
                status = 'unlocked';
                obj = {
                   name : name,
                   description : description,
                   current : current,
                   max : max,
                   cost : cost,
                   status : status
               }
               researchArray.push(obj);
               //LIBRARY AND LABORATORY
               db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                let statusLI='locked';
                let statusLA='locked';
                if (rows.sci1!=0){
                    statusLI='unlocked'
                }
                if(rows.sci2!=0) {
                    statusLA='unlocked'
                }
                db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid, function(err,rows){
                    name = 'Library';
                    description = descriptions.library;
                    current=rows.library;
                    max = maximums.library;
                    cost = costs.library;
                    status = statusLI;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    researchArray.push(obj);
                    name = 'Laboratory';
                    description = descriptions.laboratory;
                    current=rows.laboratory;
                    max = maximums.laboratory;
                    cost = costs.laboratory;
                    status = statusLA;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    researchArray.push(obj);
                })
            })
            //ENTERTAINMENT SHIT
            name = 'Plaza';
                description = descriptions.plaza;
                current=rows.plaza;
                max = maximums.plaza;
                cost = costs.plaza;
                status = 'unlocked';
                obj = {
                   name : name,
                   description : description,
                   current : current,
                   max : max,
                   cost : cost,
                   status : status
               }
               entArray.push(obj);
            })
            //THEATRE AND COLISEUM
            db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                let statusT='locked';
                let statusC='locked';
                if (rows.ent1!=0){
                    statusT='unlocked'
                }
                if(rows.ent2!=0) {
                    statusC='unlocked'
                }
                db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid, function(err,rows){
                    name = 'Theatre';
                    description = descriptions.theatre;
                    current=rows.theatre;
                    max = maximums.theatre;
                    cost = costs.theatre;
                    status = statusT;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    entArray.push(obj);
                    name = 'Coliseum';
                    description = descriptions.coliseum;
                    current=rows.coliseum;
                    max = maximums.coliseum;
                    cost = costs.coliseum;
                    status = statusC;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    entArray.push(obj);
                })
            })
            //MILITARY
            name = 'Barracks';
                description = descriptions.barracks;
                current=rows.barracks;
                max = maximums.barracks;
                cost = costs.barracks;
                status = 'unlocked';
                obj = {
                   name : name,
                   description : description,
                   current : current,
                   max : max,
                   cost : cost,
                   status : status
               }
               milArray.push(obj);
                           //UNLOCKS MILITAR
            db.get('SELECT * FROM research WHERE id=?',storedID,function(err,rows){
                let statusA='locked';
                let statusHa='locked';
                let statusHar='locked';
                let statusW='locked';
                if (rows.mil1!=0){
                    statusA='unlocked'
                }
                if(rows.mil2!=0) {
                    statusHa='unlocked'
                }
                if (rows.mil3!=0){
                    statusHar='unlocked'
                }
                if(rows.mil4!=0) {
                    statusW='unlocked'
                }
                db.get('SELECT * FROM provinces WHERE provinceid=?',provinceid, function(err,rows){
                    name = 'Academy';
                    description = descriptions.academy;
                    current=rows.academy;
                    max = maximums.academy;
                    cost = costs.academy;
                    status = statusA;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    milArray.push(obj);
                    //Hatchery
                    name = 'Hatchery';
                    description = descriptions.hatchery;
                    current=rows.hatchery;
                    max = maximums.hatchery;
                    cost = costs.hatchery;
                    status = statusHa;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    milArray.push(obj);
                    //Harbor
                    name = 'Harbor';
                    description = descriptions.harbor;
                    current=rows.harbor;
                    max = maximums.harbor;
                    cost = costs.harbor;
                    status = statusHar;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    milArray.push(obj);
                    //Workshop
                    name = 'Workshop';
                    description = descriptions.workshop;
                    current=rows.workshop;
                    max = maximums.workshop;
                    cost = costs.workshop;
                    status = statusW;
                    obj = {
                        name : name,
                        description : description,
                        current : current,
                        max : max,
                        cost : cost,
                        status : status
                    }
                    milArray.push(obj);
                })
            })
        }) 
    })

    setTimeout(function(){
        db.get('SELECT * FROM kingdoms WHERE id=?',storedID,function(err,rows){
            let leader=rows.ruler
            let happiness =req.body.happiness;
            let gold= req.body.gold;
            let land = req.body.land;
            let name = req.body.name
            res.render('view-province', {rawArray,manuArray,researchArray,milArray,entArray,econArray,provinceid,leader,happiness,gold,land,name})

        })
     console.log(rawArray,manuArray,researchArray,milArray,entArray,econArray)},1000)
    
        })
    })
    }
})
})

////////////////////////////////////////////////////////
  

router.get('/provinces',urlencodedParser,function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let currentProvinceCount;
    let i=0;
    let improvementsRaw =['plantation', 'pasture', 'mine', 'mana_rift'];
    let improvementsRefine = ['lumber_mill','slaughterhouse', 'silver_refinery', 'steel_refinery', 'iron_refinery', 'bronze_refinery'];
    let improvementsEcon = ['market', 'bazaar', 'emporium'];
    let improvementsEntertainment =['plaza', 'theatre', 'coliseum'];
    let improvementsResearch = ['school', 'library', 'laboratory'];
    let improvementsHousing = ['barracks','academy','hatchery', 'harbor', 'workshop'];
    let provinces = { 
        countArray: [],
        provinceNames: [],
         provinceLands: [],
         provinceHappiness: []}
    // let provinceNames=[];
    // let provinceLands=[];
    // let provinceHappiness=[];
    db.serialize(() => {
      db.each(`SELECT * FROM provinces WHERE userid = ?`, storedID, function(err,rows) {
        //console.log(rows)
        provinces.countArray.push(i);
        i++;
        provinces.provinceNames.push(rows.name);
        provinces.provinceLands.push(rows.land);
        provinces.provinceHappiness.push(rows.happiness);
        //console.log(provinceNames);
      })
      db.get(`SELECT * FROM kingdoms WHERE id = ?`, storedID, function(err,rows) {
        //console.log(rows.provinces);
        let current = Number(rows.provinces);
        //console.log(current);
        currentProvinceCount = {
            'count': current,
          } 
        res.render('provinces', {currentProvinceCount, provinces, improvementsRaw, improvementsRefine, improvementsEcon, improvementsEntertainment, improvementsResearch, improvementsHousing});
      }) 
    })
    }})
})

router.post('/new-province', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let provinceCost;
        let currentGold;
        let provinces;
        db.serialize(()=> {
        db.get('SELECT gold FROM resources WHERE id =(?)',storedID, function(err,rows) {
            currentGold=rows.gold;
        })
        db.get('SELECT provinces FROM kingdoms WHERE id = (?)', storedID, function(err,rows) {
            if (err) {
                console.log('Error creating province line 28');
                console.error(err.message);
            } 
            provinceCost=Math.round(3*(Math.pow(1.4,(Number(rows.provinces)+1))));
            provinces=Number(rows.provinces)+1;
            let newGold = currentGold-provinceCost;
            checkBalance(provinceCost, storedID).then(check=>{
                if (check===true) {
                    db.run('UPDATE kingdoms SET provinces = (?) WHERE id = (?)',[provinces, storedID],function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated province count')
                    })
                    db.run('UPDATE resources SET gold = (?) WHERE id=(?)',[newGold, storedID], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated resources')
                    })
                    db.run('INSERT INTO provinces (userid, name, land, happiness) VALUES (?,?,?,?)', [storedID, req.body.provinceName, 100, '100'], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('inserted province');
                    })
                    res.redirect('/provinces')
                } else {
                    console.log('Not Sufficient Funds')
                    res.redirect('/provinces')
                }
            }).catch(console.error);
        })
    })
    }})
})

function checkBalance(incost,keys) {
    return new Promise((resolve, reject) => {
        let storedID=keys;
            let cost=incost;
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {     
                resolve(rows.gold >= cost)
            })
    })
}

router.post('/buyLand', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
        storedID=parseInt(rows.id, 10);
        let increase = req.body.land;
    let name = req.body.provinceName
    let current;
    let cost;
    let currentGold;
    let newLand;
    let newGold;
    db.get('SELECT * FROM provinces WHERE userid = ? AND name = ?', [storedID, name], function(err,rows) {
        current = Number(rows.land);
        //console.log(current + "line 131");
        cost = ((Number(current)+Number(increase))*1.5) - (Number(current)*1.5);
        console.log(cost + "line 134");
        newLand = Number(current)+Number(increase);
        console.log(newLand + "line 137")
        checkBalanceLand(cost, storedID).then(check=>{
            if (check===true) {
                db.serialize(()=> {
                db.get('SELECT * FROM resources WHERE id = ?', storedID, function(err,row) {
                    //console.log(row);
                    currentGold=row.gold;
                    console.log(currentGold);
                    newGold=currentGold-cost;
                    console.log(newGold + " line 144");
                    db.run('UPDATE resources SET gold = (?) WHERE id=(?)',[newGold, storedID], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated resources')
                    })
                    db.run('UPDATE provinces SET land = (?) WHERE userid = ? AND name = ?',[newLand, storedID, name], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated land')
                        res.redirect('/provinces')
                    })
                })
                })
            }
            else {
                console.log('Not Sufficient Funds')
                res.redirect('/provinces')
            }
        }).catch(console.error);
    })
    }})
    
})

function checkBalanceLand(incost,key) {
    return new Promise((resolve, reject) => {
        let storedID=key;
            let cost=incost;
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
            resolve(rows.gold >= cost)
        })
    })
}

router.post('/buyImprovement', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
        storedID=parseInt(rows.id, 10);
        let name = req.body.provinceName;
    console.log(name);
    let building = req.body.improvementsName;
    console.log(building);
    let buildingCount;
    let totalImprovements;
    let land;
    let costArray;
    //console.log(name);
    db.get(`SELECT * FROM provinces WHERE userid = ? AND name = ?`, [storedID, name], function(err,rows) {
        if (err) {
            console.error(err.message + "line 135");
        }
        totalImprovements = Number(rows.plantation)
                            +Number(rows.pasture)
                            +Number(rows.mine)
                            +Number(rows.mana_rift)
                            +Number(rows.lumber_mill)
                            +Number(rows.slaughterhouse)
                            +Number(rows.silver_refinery)
                            +Number(rows.steel_refinery)
                            +Number(rows.iron_refinery)
                            +Number(rows.bronze_refinery)
                            +Number(rows.plaza)
                            +Number(rows.theatre)
                            +Number(rows.coliseum)
                            +Number(rows.market)
                            +Number(rows.bazar)
                            +Number(rows.emporium)
                            +Number(rows.school)
                            +Number(rows.library)
                            +Number(rows.laboratory)
                            +Number(rows.barracks)
                            +Number(rows.academy)
                            +Number(rows.hatchery)
                            +Number(rows.harbor)
                            +Number(rows.workshop);
        buildingCount = rows[building]+1;
        land=rows.land;
        console.log(totalImprovements);
        console.log(land);
        let currentGold=0,currentLumber=0,currentSteel=0;
        let newGold=0,newLumber=0,newSteel=0;
        db.get('SELECT * FROM resources WHERE id = ?', storedID, function(err,rows) {
            currentGold=Number(rows.gold);
            currentLumber=Number(rows.lumber);
            currentSteel=Number(rows.steel);
            if(building=='plantation') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
                console.log(currentGold);
                console.log(costArray[0]);
                console.log(newGold);
            }
            if(building=='pasture') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='mine') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='mana_rift') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='lumber_mill') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='slaughterhouse') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='silver_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='steel_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='iron_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='bronze_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='plaza') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='theatre') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='market') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='bazar') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='emporium') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='school') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='library') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='laboratory') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='barracks') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='academy') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='hatchery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='harbor') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='workshop') {
                costArray =[100000,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            checkBalanceImp(costArray, storedID).then(check=>{
                //now check if sufficient land
                if(check===true){
                    if(totalImprovements<(land/20)) {
                        db.all(`UPDATE provinces SET ${building} = ? WHERE userid = ? AND name = ?`, [buildingCount,storedID, name], function(err) {
                            if (err) {
                                console.error(err.message+" line 169");
                            }
                            res.redirect('/provinces')
                            console.log('buildingbought');
                        });
                        } else {
                            console.log('not enough land');
                            res.redirect('/provinces')
                
                        } 
                        db.run('UPDATE resources SET gold = (?), lumber=(?), steel=(?) WHERE id=(?)',[newGold,newLumber,newSteel,storedID], function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                            console.log('updated resources')
                        }) 
                }      
                }).catch(console.error)
        })  
    })
    }})
})


function checkBalanceImp(costArray, key) {
    return new Promise((resolve, reject) => {
        let storedID=key;
            let arrayOfCosts = costArray;
            let goldCost=arrayOfCosts[0];
            let lumberCost=arrayOfCosts[1];
            let steelCost = arrayOfCosts[2];
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
                resolve((rows.gold >= goldCost) && (rows.lumber >= lumberCost) && (rows.steel >= steelCost))
            })
        })  
}


module.exports = router;