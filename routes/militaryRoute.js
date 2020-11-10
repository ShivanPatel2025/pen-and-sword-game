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
const { RangeNotSatisfiable } = require('http-errors');
const router = express.Router()
var sqlite3 = require('sqlite3').verbose();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public"));

//const {calculateCost,checkBalance} = require('./functions/functions.js')
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const cost = {
  'warriors':{'gold':5},
  'archers':{'gold':7,'lumber':2},
  'cavalry': {'gold':20,'fauna':4, 'lumber':10},
  'blacksmiths':{'gold':30},
  'priests':{'gold':70,'silver':5},
  'mages':{'gold':100,'silver':12},
  'blimps':{'gold':130, 'lumber':30, 'steel':50},
  'harpies':{'gold':60,'mana':5,'fauna':3},
  'angels':{'gold':60,'mana':15,'silver':15},
  'dragons':{'gold':85,'fauna':7,'mana':20, 'bronze':20},
  'galleys':{'gold':50, 'lumber':40, 'steel':30},
  'pirates':{'gold':25, 'lumber':70, 'steel':10},
  'sea_serpents':{'gold':60, 'mana':250, 'fauna':5},
  'catapults':{'gold':250,'lumber':310},
  'trebuchets':{'gold':600,'lumber':400},
  'cannons':{'gold':1000,'iron':75,'steel':150}
}

router.get('/military',urlencodedParser,function(req,res){
    let warriors,archers,cavalry;
    let storedID;
   
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
      storedID=parseInt(rows.id, 10)
      db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
        warriors = {
          'name': 'Warrior',
          'value': rows.warriors,
          'attackingpower': 4,
          'defendingpower': 1,
          'canattack' : 'Ground',
          //'icon': warrior.png,
          'description': 'Strong frontliners. Armed with the sharpest swords, crafted with the finest metal. Strength in numbers.',
          'cost': [{gold:5}]
        } 
        archers = {
          'name': 'Archer',
          'value': rows.archers,
          'attackingpower': 2,
          'defendingpower': 6,
          'canattack' : 'Ground, Air, & Sea',
          //'icon': archer.png,
          'description': 'Ranged ground unit with deadly precision housed in the barracks. Offers strong support for the frontlines.',
          'cost': [{gold:7}, {lumber:2}]
        } 
        cavalry = {
          'name': 'Cavalry',
          'value': rows.cavalry,
          'attackingpower': 12,
          'defendingpower': 5,
          'canattack' : 'Ground',
          //'icon': cavalry.png,
          'description': 'Knights armed with the speediest steeds to be bred. Strong offensive capabilities with decent health.',
          'cost': [{gold:20}, {fauna: 4}, {lumber:10}]
        } 
        blacksmiths = {
          'name': 'Blacksmith',
          'value': rows.blacksmiths,
          'attackingpower': 3,
          'defendingpower': 10,
          'canattack' : 'Ground',
          //'icon': blacksmith.png,
          'description': 'Defensive support unit. Capable of looting ore and metals when attacking. Weak offensive abilities.',
          'cost': [{gold:30}]
        } 
        priests = {
          'name': 'Priest',
          'value': rows.priests,
          'attackingpower': 18,
          'defendingpower': 15,
          'canattack' : 'Ground',
          //'icon': priest.png,
          'description': 'Robust, well-rounded fighter. Utilizes the power of the Mystic to wreak havoc on enemy armies.',
          'cost': [{gold:70, silver:5}]
        }
        mages = {
          'name': 'Mage',
          'value': rows.mages,
          'attackingpower': 20,
          'defendingpower': 15,
          'canattack' : 'Ground & Air',
          //'icon': mage.png,
          'description': 'Most powerful ground unit in the game. Calls upon the elements to unleash fire and wind upon any opponent they face.',
          'cost': [{gold:100, silver:12}]
        }
        blimps = {
          'name': 'Blimp',
          'value': rows.blimps,
          'attackingpower': 14,
          'defendingpower': 5,
          'canattack' : 'Air',
          //'icon': blimp.png,
          'description': 'Tanky air unit with massive health. Minimal utility on defense. Offers cover when attacking.',
          'cost': [{gold:130, lumber:30, steel:50}]
        }
        harpies = {
          'name': 'Harpy',
          'value': rows.harpies,
          'attackingpower': 10,
          'defendingpower': 7,
          'canattack' : 'Air',
          //'icon': harpy.png,
          'description': 'Half bird, half human. Known for charging and their enemies, talons first. Rumors have it they are cannibals as well.',
          'cost': [{gold:60, mana: 5, fauna:3}]
        }
        angels = {
          'name': 'Angel',
          'value': rows.angels,
          'attackingpower': 8,
          'defendingpower': 8,
          'canattack' : 'Ground, Air, & Sea',
          //'icon': angel.png,
          'description': 'Most powerful ground unit in the game. Calls upon the elements to unleash fire and wind upon any opponent they face.',
          'cost': [{gold:60, mana:15, silver: 15}]
        }
        dragons = {
          'name': 'Dragon',
          'value': rows.dragons,
          'attackingpower': 13,
          'defendingpower': 18,
          'canattack' : 'Ground & Air',
          //'icon': dragon.png,
          'description': 'A magestic beast. Capable of breathing massive waves of fire. Fears only the Sea Serpent.',
          'cost': [{gold:85, fauna:7, mana:20, bronze: 20}]
        }
        galleys = {
          'name': 'Galley',
          'value': rows.galleys,
          'attackingpower': 8,
          'defendingpower': 8,
          'canattack' : 'Air & Sea',
          //'icon': galley.png,
          'description': 'A magestic beast. Capable of breathing massive waves of fire. Fears only the Sea Serpent.',
          'cost': [{gold:50, lumber:40, steel:30}]
        }
        pirates = {
          'name': 'Pirate',
          'value': rows.pirates,
          'attackingpower': 15,
          'defendingpower': 4,
          'canattack' : 'Ground & Sea',
          //'icon': pirate.png,
          'description': 'Looters, raiders, and drunkards. Capable of stealing while on offense. Minimal defensive efficiency.',
          'cost': [{gold:25, lumber:70, steel:10}]
        }
        sea_serpents = {
          'name': 'Sea Serpent',
          'value': rows.sea_serpents,
          'attackingpower': 40,
          'defendingpower': 40,
          'canattack' : 'Sea',
          //'icon': sea_serpent.png,
          'description': 'Most feared creature throughout the kingdoms. Rules the sea and the only rival to the mighty dragon.',
          'cost': [{gold:60, mana:250, fauna:5}]
        }
        catapults = {
          'name': 'Catapult',
          'value':rows.catapults,
          'stabilitychange': 2,
          'strength': '2-5%',
          'description': 'Earliest siege unit available. Reduces enemy stability by 2. Caps at 2 per province.',
          'cost': [{gold:250,lumber:310}]
        }
        trebuchets = {
          'name': 'Trebuchet',
          'value':rows.trebuchets,
          'stabilitychange': 3,
          'strength': '5-7%',
          'description': 'Moderate siege unit. An improved upon version of the catapult. Caps at 2 per province.',
          'cost': [{gold:600,lumber:400}]
        }
        cannons = {
          'name': 'Cannon',
          'value':rows.cannons,
          'stabilitychange': 5,
          'strength': '7-10%',
          'description': 'Most advanced siege unit invented yet. Fires heated balls of metal at the enemy. Caps at 1 per province.',
          'cost': [{gold:1000,iron:75,steel:150}]
        }
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
          db.get(`SELECT * FROM kingdoms WHERE id=?`, storedID, function(err,rows){
            let leader=rows.ruler;
            let groundAttackingPower= warriors.value*4+archers.value*2+cavalry.value*12+blacksmiths.value*3+priests.value*18+mages.value*20;
            let groundDefendingPower= warriors.value*1+archers.value*6+cavalry.value*5+blacksmiths.value*10+priests.value*15+mages.value*15+angels.value*8+dragons.value*18+pirates.value*4;
            let airAttackingPower= blimps.value*14+harpies.value*10+angels.value*8+dragons.value*13;
            let airDefendingPower= blimps.value*5+harpies.value*7+angels.value*8+dragons.value*18+archers.value*6+mages.value*15+galleys.value*8;
            let navalAttackingPower= galleys.value*8+pirates.value*15+sea_serpents.value*40;
            let navalDefendingPower= galleys.value*8+pirates.value*4+sea_serpents.value*40+archers.value*6+angels.value*8;
            res.render('military', {kingdomStats: [gold,mana,flora,fauna,lumber,food,ore,silver,iron,bronze,steel],leader,groundAttackingPower,groundDefendingPower, airAttackingPower, airDefendingPower,navalAttackingPower, navalDefendingPower, groundTroops:[warriors,archers,cavalry,blacksmiths,priests,mages], airTroops: [blimps,harpies,angels,dragons], seaTroops: [galleys,pirates,sea_serpents], siegeTroops: [catapults, trebuchets, cannons]});
          })
        })
      }) 
    }})   
})

router.post('/discharge', urlencodedParser, function(req,res) {
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
      storedID=parseInt(rows.id, 10)
      for (i in req.body) {
        let troop=i;
        let enlistment=Number(req.body[`${i}`]);
        let currentTroop=0;
        db.get('SELECT * FROM military WHERE id=?',[storedID], function(err,rows){
          currentTroop=rows[troop];
          let newTroop=Number(currentTroop)-Number(enlistment);
          if(newTroop<0) {
            console.log('u cant have negative troops')
            res.redirect('/military')
          } else {
            db.run(`UPDATE military SET ${troop} =? where id =?`, [newTroop,storedID]);
            console.log('troops sold');
            res.redirect('/military')
          }
        })
      }

    }
  })
})

router.post('/enlist', urlencodedParser, function(req,res) {
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
      storedID=parseInt(rows.id, 10)
      console.log(req.body);
      for (i in req.body) {
        let troop=i;
        let enlistment=Number( req.body[`${i}`]);
        let currentTroop=0;
        db.get('SELECT * FROM military WHERE id=?',[storedID], function(err,rows){
          currentTroop=rows[troop];
          let newTroop=Number(currentTroop)+Number(enlistment);
          console.log(currentTroop,enlistment)
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
              newValues[0] = cost[troop]['gold'] ?  currentGold - Number(enlistment)*cost[troop]['gold']  : currentGold;
              newValues[1]=cost[troop]['mana'] ?  currentMana - Number(enlistment)*cost[troop]['mana']  : currentMana;
              newValues[2]=cost[troop]['flora'] ?  currentFlora - Number(enlistment)*cost[troop]['flora']  : currentFlora;
              newValues[3]=cost[troop]['fauna'] ?  currentFauna - Number(enlistment)*cost[troop]['fauna']  : currentFauna;
              newValues[4]=cost[troop]['lumber'] ?  currentLumber - Number(enlistment)*cost[troop]['lumber']  : currentLumber;
              newValues[5]=cost[troop]['food'] ?  currentFood - Number(enlistment)*cost[troop]['food']  : currentFood;
              newValues[6]=cost[troop]['silver'] ?  currentSilver - Number(enlistment)*cost[troop]['silver']  : currentSilver;
              newValues[7]=cost[troop]['iron'] ?  currentIron - Number(enlistment)*cost[troop]['iron']  : currentIron;
              newValues[8]=cost[troop]['bronze'] ?  currentBronze - Number(enlistment)*cost[troop]['bronze']  : currentBronze;
              newValues[9]=cost[troop]['steel'] ?  currentSteel - Number(enlistment)*cost[troop]['steel']  : currentSteel;
              console.log(currentGold)
              console.log(enlistment)
              console.log(newValues)
              checkEnlistmentCost(newValues).then(check => {        
                if (check === true) {
                  console.log(newTroop)
                  db.run(`UPDATE military SET ${troop} = ? WHERE id=?`,[newTroop,storedID], function(err) {
                     if (err) {
                      console.err(err.message)
                    }else {
                      console.log('241')
                      console.log('shit has been bought');
                    }
                  });
                  console.log('241')
                  db.run('UPDATE resources SET gold=?,mana=?,flora=?,fauna=?,lumber=?,food=?,silver=?,iron=?,bronze=?,steel=? WHERE id=?',[newValues[0],newValues[1],newValues[2],newValues[3],newValues[4],newValues[5],newValues[6],newValues[7],newValues[8],newValues[9],storedID], function(err){
                    if (err) {
                      console.err(err.message)
                    }else {console.log('243')
                      res.redirect('/military');
                      console.log('shit has been bought');
                    }
                  })
                }
                if (check===false) {
                  res.redirect('/military');
                  console.log('not sufficient funds');
                }
              }).catch(console.error); 
          })
        })
      }
    }
  })
})

function checkEnlistmentCost(array) {
  return new Promise((resolve, reject) => {
      let gold=array[0];
      let mana=array[1];
      let flora=array[2];
      let fauna=array[3];
      let lumber=array[4];
      let food=array[5];
      let silver =array[6];
      let iron =array[7];
      let bronze =array[8];
      let steel=array[9];
      resolve((gold>=0) && (mana>=0) && (flora>=0) && (fauna>=0) && (lumber>=0) && (food>=0) && (silver>=0) && (iron>=0) && (bronze>=0) && (steel>=0)) 
  })
}

// router.post('/enlistground', urlencodedParser, function(req,res){
//   let storedID;
//   db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
//     if(rows==undefined) {
//       res.redirect ('/')
//       console.log('this bih not signed in')
//     } else{
//     storedID=parseInt(rows.id, 10)
//     let addedWarriors, addedArchers, addedCavalry, addedBlacksmiths, addedPriests, addedMages, paramsRun;
//     let sqlGet = "SELECT warriors, archers, cavalry, blacksmiths, priests, mages FROM military WHERE id = ?"
//     let sqlRun = "UPDATE military SET warriors = (?), archers = (?), cavalry = (?), blacksmiths = (?), priests = (?), mages = (?) WHERE id = (?)"
//     let paramsGet = storedID;
//     let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
//     let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
    
//     db.serialize(()=>{
//       db.get(sqlGet, paramsGet, function(err,rows){
//         //console.log(rows);
//         addedWarriors= Number(req.body.warriors) + Number(rows.warriors);
//         addedArchers= Number(req.body.archers) + Number(rows.archers);
//         addedCavalry= Number(req.body.cavalry) + Number(rows.cavalry);
//         addedBlacksmiths = Number(req.body.blacksmiths) + Number(rows.blacksmiths);
//         addedPriests = Number(req.body.priests) + Number(rows.priests);
//         addedMages = Number(req.body.mages) + Number(rows.mages);
  
//         paramsRun = [Number(addedWarriors), Number(addedArchers), Number(addedCavalry), Number(addedBlacksmiths), Number(addedPriests), Number(addedMages), storedID];
//         db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
//               currentGold=rows.gold;
//               currentMana=rows.mana;
//               currentLumber=rows.lumber;
//               currentFauna=rows.fauna;
//               currentSilver=rows.silver;
//               currentIron=rows.iron;
//               currentBronze=rows.bronze;
//               currentSteel=rows.steel;
//         })
//         //console.log(paramsRun);
//         let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0;
//          goldCost = req.body.warriors*5+ req.body.archers*7+ req.body.cavalry*20+ req.body.blacksmiths*30 + req.body.priests*70 + req.body.mages*100;
//          lumberCost= req.body.archers*2+ req.body.cavalry*10;
//          faunaCost= req.body.cavalry*4;
//          silverCost = req.body.priests*5+req.body.mages*12;
//         //console.log(goldCost +" "+lumberCost + " "+faunaCost);
//         //console.log(cost + "line 60");
//         checkBalanceGround(goldCost,lumberCost,faunaCost, silverCost, storedID).then(check => {
//           //console.log(check + "line 62");
//           if (check === true) {
//               newGold=currentGold-goldCost;
//               newLumber=currentLumber-lumberCost;
//               newFauna=currentFauna-faunaCost;
//               newSilver=currentSilver-silverCost;
//           db.run(sqlRun, paramsRun, function (err) {
//             if (err) {
//               return console.error(err.message);
//               console.log('Error Updating Military');
//              }
//              console.log("Military Updated.");
//              //console.log([addedWarriors, addedArchers, addedCavalry]);
//              res.redirect('/military')
//             })
//             db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?)", [newGold,newLumber,newFauna, newSilver], function (err) {
//               if (err) {
//                   return console.error(err.message);
//                   console.log('Error Subtracting Resources');
//                  }
//                  console.log("Cost Subtracted");
//             })
//           } else {
//                 console.log('Not Sufficient Funds')
//                 res.redirect('/military')
//             }
//         }).catch(console.error);
//       })
//   })
//   }}) 
// }) 
    
// //FUCTIONS
// // function calculateGoldCost(warriors, archers, cavalry) {
// //     let cost; 
// //     cost += warriors*1;
// //     cost+= archers*1;
// //     cost+=cavalry*5;
// //     return cost;
// // }
// // function calculateLumberCost(archers, cavalry) {
// //   let cost;
// //   cost+= archers*2;
// //   cost+=cavalry*10;
// //   return cost;
// // }
// // function calculateFaunaCost(cavalry) {
// //   let cost;
// //   cost+=cavalry*2;
// //   return cost;
// // }

// function checkBalanceGround(gold,lumber,fauna,silver,key) {
//     return new Promise((resolve, reject) => {
//       let storedID=key;
//         let goldCost=gold;
//         let lumberCost=lumber;
//         let faunaCost=fauna;
//         let silverCost=silver;
//         db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
//           resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost))
//         })
//     })
// }

// router.post('/enlistair', urlencodedParser, function(req,res){
//   let storedID;
//   db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
//     if(rows==undefined) {
//       res.redirect ('/')
//       console.log('this bih not signed in')
//     } else{
//   storedID=parseInt(rows.id, 10)
//   let addedBlimps=0, addedHarpies=0, addedAngels=0, addedDragons=0, paramsRun;
//   let sqlGet = "SELECT blimps, harpies, angels, dragons FROM military WHERE id = ?"
//   let sqlRun = "UPDATE military SET blimps = (?), harpies = (?), angels = (?), dragons = (?) WHERE id = (?)"
//   let paramsGet = storedID;
//   let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
//   let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
  
//   db.serialize(()=>{
//     db.get(sqlGet, paramsGet, function(err,rows){
//       //console.log(rows);
//       addedBlimps= Number(req.body.blimps) + Number(rows.blimps);
//       addedHarpies= Number(req.body.harpies) + Number(rows.harpies);
//       addedAngels= Number(req.body.angels) + Number(rows.angels);
//       addedDragons = Number(req.body.dragons) + Number(rows.dragons);

//       paramsRun = [Number(addedBlimps), Number(addedHarpies), Number(addedAngels), Number(addedDragons), storedID];
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
//             currentGold=rows.gold;
//             currentMana=rows.mana;
//             currentLumber=rows.lumber;
//             currentFauna=rows.fauna;
//             currentSilver=rows.silver;
//             currentIron=rows.iron;
//             currentBronze=rows.bronze;
//             currentSteel=rows.steel;
//       })
//       //console.log(paramsRun);
//       let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0, ironCost=0, bronzeCost=0, steelCost=0, manaCost=0;
//        goldCost = req.body.blimps*130+ req.body.harpies*60+ req.body.angels*60+ req.body.dragons*85;
//        lumberCost= req.body.blimps*30;
//        faunaCost= req.body.harpies*3 + req.body.dragons*7;
//        silverCost = req.body.angels*15;
//        bronzeCost = req.body.dragons*20;
//        steelCost=req.body.blimps*50;
//        manaCost=req.body.harpies*5 + req.body.angels*15, req.body.dragons*20;
//       //console.log(goldCost +" "+lumberCost + " "+faunaCost);
//       //console.log(cost + "line 60");
//       checkBalanceAir(goldCost,lumberCost,faunaCost, silverCost, bronzeCost, steelCost, manaCost, storedID).then(check => {
//         //console.log(check + "line 62");
//         if (check === true) {
//             newGold=currentGold-goldCost;
//             newLumber=currentLumber-lumberCost;
//             newFauna=currentFauna-faunaCost;
//             newSilver=currentSilver-silverCost;
//             newBronze = currentBronze - bronzeCost;
//             newSteel=currentSteel-steelCost;
//             newMana = currentMana-manaCost;
//         db.run(sqlRun, paramsRun, function (err) {
//           if (err) {
//             return console.error(err.message);
//             console.log('Error Updating Military');
//            }
//            console.log("Military Updated.");
//            //console.log([addedWarriors, addedArchers, addedCavalry]);
//            res.redirect('/military')
//           })
//           db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?), bronze = (?), steel = (?), mana = (?)", [newGold,newLumber,newFauna, newSilver, newBronze, newSteel, newMana], function (err) {
//             if (err) {
//                 return console.error(err.message);
//                 console.log('Error Subtracting Resources');
//                }
//                console.log("Cost Subtracted");
//           })
//         } else {
//               console.log('Not Sufficient Funds')
//               res.redirect('/military')
//           }
//       }).catch(console.error);
//     })
//     }) 
//   }})
// }) 

// function checkBalanceAir(gold,lumber,fauna,silver, bronze, steel, mana, key) {
//   return new Promise((resolve, reject) => {
//     let storedID=key;
//       let goldCost=gold;
//       let lumberCost=lumber;
//       let faunaCost=fauna;
//       let silverCost=silver;
//       let bronzeCost=bronze;
//       let steelCost = steel;
//       let manaCost = mana;
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
//         resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost) && (rows.bronze>=bronzeCost) && (rows.steel>=steelCost) && (rows.mana>=manaCost))
//       })
//     })
// }

// router.post('/enlistsea', urlencodedParser, function(req,res){
//   let storedID;
//   db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
//     if(rows==undefined) {
//       res.redirect ('/')
//       console.log('this bih not signed in')
//     } else{
//   storedID=parseInt(rows.id, 10)
//   console.log(storedID);
//   let addedGalleys, addedPirates, addedSea_Serpents, paramsRun;
//   let sqlGet = "SELECT galleys, pirates, sea_serpents FROM military WHERE id = ?"
//   let sqlRun = "UPDATE military SET galleys = (?), pirates = (?), sea_serpents = (?) WHERE id = (?)"
//   let paramsGet = storedID;
//   let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
//   let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
  
//   db.serialize(()=>{
//     db.get(sqlGet, paramsGet, function(err,rows){
//       //console.log(rows);
//       addedGalleys= Number(req.body.galleys) + Number(rows.galleys);
//       addedPirates= Number(req.body.pirates) + Number(rows.pirates);
//       addedSea_Serpents= Number(req.body.sea_serpents) + Number(rows.sea_serpents);

//       paramsRun = [Number(addedGalleys), Number(addedPirates), Number(addedSea_Serpents), storedID];
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
//             currentGold=rows.gold;
//             currentMana=rows.mana;
//             currentLumber=rows.lumber;
//             currentFauna=rows.fauna;
//             currentSilver=rows.silver;
//             currentIron=rows.iron;
//             currentBronze=rows.bronze;
//             currentSteel=rows.steel;
//       })
//       //console.log(paramsRun);
//       let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0, ironCost=0, bronzeCost=0, steelCost=0, manaCost=0;
//        goldCost = req.body.galleys*50+ req.body.pirates*25+ req.body.sea_serpents*60;
//        lumberCost= req.body.galleys*40+req.body.pirates*70;
//        faunaCost= req.body.sea_serpents*5;
//        steelCost=req.body.galleys*30+req.body.pirates*10;
//        manaCost=req.body.sea_serpents*250;
//       //console.log(goldCost +" "+lumberCost + " "+faunaCost);
//       //console.log(cost + "line 60");
//       checkBalanceSea(goldCost,lumberCost,faunaCost, silverCost, bronzeCost, steelCost, manaCost,storedID).then(check => {
//         //console.log(check + "line 62");
//         if (check === true) {
//             newGold=currentGold-goldCost;
//             newLumber=currentLumber-lumberCost;
//             newFauna=currentFauna-faunaCost;
//             newSilver=currentSilver-silverCost;
//             newBronze = currentBronze - bronzeCost;
//             newSteel=currentSteel-steelCost;
//             newMana = currentMana-manaCost;
//         db.run(sqlRun, paramsRun, function (err) {
//           if (err) {
//             return console.error(err.message);
//             console.log('Error Updating Military');
//            }
//            console.log("Military Updated.");
//            //console.log([addedWarriors, addedArchers, addedCavalry]);
//            res.redirect('/military')
//           })
//           db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?), bronze = (?), steel = (?), mana = (?)", [newGold,newLumber,newFauna, newSilver, newBronze, newSteel, newMana], function (err) {
//             if (err) {
//                 return console.error(err.message);
//                 console.log('Error Subtracting Resources');
//                }
//                console.log("Cost Subtracted");
//           })
//         } else {
//               console.log('Not Sufficient Funds')
//               res.redirect('/military')
//           }
//       }).catch(console.error);
//     })
//     }) 
//   }})
// }) 

// function checkBalanceSea(gold,lumber,fauna,silver, bronze, steel, mana, key) {
//   return new Promise((resolve, reject) => {
//     console.log(key);
//     let storedID=key;
//       let goldCost=gold;
//       let lumberCost=lumber;
//       let faunaCost=fauna;
//       let silverCost=silver;
//       let bronzeCost=bronze;
//       let steelCost = steel;
//       let manaCost = mana;
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
//         resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost) && (rows.bronze>=bronzeCost) && (rows.steel>=steelCost) && (rows.mana>=manaCost))
//       })
//   })
// }

// router.post('/enlistsiege', urlencodedParser, function(req,res){
//   let storedID;
//   db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
//     if(rows==undefined) {
//       res.redirect ('/')
//       console.log('this bih not signed in')
//     } else{
//   storedID=parseInt(rows.id, 10)
//   console.log(storedID);
//   let addedCatapults, addedTrebuchets, addedCannons, paramsRun;
//   let sqlGet = "SELECT catapults, trebuchets, cannons FROM military WHERE id = ?"
//   let sqlRun = "UPDATE military SET catapults = (?), trebuchets = (?), cannons = (?) WHERE id = (?)"
//   let paramsGet = storedID;
//   let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
//   let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
  
//   db.serialize(()=>{
//     db.get(sqlGet, paramsGet, function(err,rows){
//       //console.log(rows);
//       addedCatapults= Number(req.body.catapults) + Number(rows.catapults);
//       addedTrebuchets= Number(req.body.trebuchets) + Number(rows.trebuchets);
//       addedCannons= Number(req.body.cannons) + Number(rows.cannons);

//       paramsRun = [Number(addedCatapults), Number(addedTrebuchets), Number(addedCannons), storedID];
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
//             currentGold=rows.gold;
//             currentMana=rows.mana;
//             currentLumber=rows.lumber;
//             currentFauna=rows.fauna;
//             currentSilver=rows.silver;
//             currentIron=rows.iron;
//             currentBronze=rows.bronze;
//             currentSteel=rows.steel;
//       })
//       //console.log(paramsRun);
//       let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0, ironCost=0, bronzeCost=0, steelCost=0, manaCost=0;
//        goldCost = req.body.catapults*250+ req.body.trebuchets*600+ req.body.cannons*1000;
//        lumberCost= req.body.catapults*310+req.body.trebuchets*400;
//        steelCost=req.body.cannons*150;
//        ironCost = req.body.cannons*75;
//       //console.log(goldCost +" "+lumberCost + " "+faunaCost);
//       //console.log(cost + "line 60");
//       checkBalanceSiege(goldCost,lumberCost,faunaCost, silverCost, bronzeCost, steelCost, manaCost, ironCost, storedID).then(check => {
//         //console.log(check + "line 62");
//         if (check === true) {
//             newGold=currentGold-goldCost;
//             newLumber=currentLumber-lumberCost;
//             newFauna=currentFauna-faunaCost;
//             newSilver=currentSilver-silverCost;
//             newBronze = currentBronze - bronzeCost;
//             newSteel=currentSteel-steelCost;
//             newMana = currentMana-manaCost;
//             newIron=currentIron-ironCost;
//         db.run(sqlRun, paramsRun, function (err) {
//           if (err) {
//             return console.error(err.message);
//             console.log('Error Updating Military');
//            }
//            console.log("Military Updated.");
//            //console.log([addedWarriors, addedArchers, addedCavalry]);
//            res.redirect('/military')
//           })
//           db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?), iron = (?), steel = (?), mana = (?)", [newGold,newLumber,newFauna, newSilver, newIron, newSteel, newMana], function (err) {
//             if (err) {
//                 return console.error(err.message);
//                 console.log('Error Subtracting Resources');
//                }
//                console.log("Cost Subtracted");
//           })
//         } else {
//               console.log('Not Sufficient Funds')
//               res.redirect('/military')
//           }
//       }).catch(console.error);
//     })
//     }) 
//   }})
// }) 

// function checkBalanceSiege(gold,lumber,fauna,silver, bronze, steel, mana, iron, key) {
//   return new Promise((resolve, reject) => {
//     console.log(key);
//     let storedID=key;
//       let goldCost=gold;
//       let lumberCost=lumber;
//       let faunaCost=fauna;
//       let silverCost=silver;
//       let bronzeCost=bronze;
//       let steelCost = steel;
//       let manaCost = mana;
//       let ironCost = iron;
//       db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
//         resolve((rows.gold >= goldCost) && (rows.iron>=ironCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost) && (rows.bronze>=bronzeCost) && (rows.steel>=steelCost) && (rows.mana>=manaCost))
//       })
//   })
// }

module.exports = router;

