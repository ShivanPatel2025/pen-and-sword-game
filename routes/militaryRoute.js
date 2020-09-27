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

router.get('/military',urlencodedParser,function(req,res){
    let warriors,archers,cavalry;
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10)
      db.get(`SELECT * FROM military WHERE id = ?`, storedID, function(err,rows) {
        warriors = {
          'name': 'warriors',
          'value': rows.warriors
        } 
        archers = {
          'name': 'archers',
          'value': rows.archers
        } 
        cavalry = {
          'name': 'cavalry',
          'value': rows.cavalry
        } 
        res.render('military', {militaryStats:[warriors,archers,cavalry]});
      }) 
    })   
})

router.post('/enlistground', urlencodedParser, function(req,res){
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    storedID=parseInt(rows.id, 10)
    let addedWarriors, addedArchers, addedCavalry, addedBlacksmiths, addedPriests, addedMages, paramsRun;
    let sqlGet = "SELECT warriors, archers, cavalry, blacksmiths, priests, mages FROM military WHERE id = ?"
    let sqlRun = "UPDATE military SET warriors = (?), archers = (?), cavalry = (?), blacksmiths = (?), priests = (?), mages = (?) WHERE id = (?)"
    let paramsGet = storedID;
    let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
    let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
    
    db.serialize(()=>{
      db.get(sqlGet, paramsGet, function(err,rows){
        //console.log(rows);
        addedWarriors= Number(req.body.warriors) + Number(rows.warriors);
        addedArchers= Number(req.body.archers) + Number(rows.archers);
        addedCavalry= Number(req.body.cavalry) + Number(rows.cavalry);
        addedBlacksmiths = Number(req.body.blacksmiths) + Number(rows.blacksmiths);
        addedPriests = Number(req.body.priests) + Number(rows.priests);
        addedMages = Number(req.body.mages) + Number(rows.mages);
  
        paramsRun = [Number(addedWarriors), Number(addedArchers), Number(addedCavalry), Number(addedBlacksmiths), Number(addedPriests), Number(addedMages), storedID];
        db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
              currentGold=rows.gold;
              currentMana=rows.mana;
              currentLumber=rows.lumber;
              currentFauna=rows.fauna;
              currentSilver=rows.silver;
              currentIron=rows.iron;
              currentBronze=rows.bronze;
              currentSteel=rows.steel;
        })
        //console.log(paramsRun);
        let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0;
         goldCost = req.body.warriors*5+ req.body.archers*7+ req.body.cavalry*20+ req.body.blacksmiths*30 + req.body.priests*70 + req.body.mages*100;
         lumberCost= req.body.archers*2+ req.body.cavalry*10;
         faunaCost= req.body.cavalry*4;
         silverCost = req.body.priests*5+req.body.mages*12;
        //console.log(goldCost +" "+lumberCost + " "+faunaCost);
        //console.log(cost + "line 60");
        checkBalanceGround(goldCost,lumberCost,faunaCost, silverCost, storedID).then(check => {
          //console.log(check + "line 62");
          if (check === true) {
              newGold=currentGold-goldCost;
              newLumber=currentLumber-lumberCost;
              newFauna=currentFauna-faunaCost;
              newSilver=currentSilver-silverCost;
          db.run(sqlRun, paramsRun, function (err) {
            if (err) {
              return console.error(err.message);
              console.log('Error Updating Military');
             }
             console.log("Military Updated.");
             //console.log([addedWarriors, addedArchers, addedCavalry]);
             res.redirect('/military')
            })
            db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?)", [newGold,newLumber,newFauna, newSilver], function (err) {
              if (err) {
                  return console.error(err.message);
                  console.log('Error Subtracting Resources');
                 }
                 console.log("Cost Subtracted");
            })
          } else {
                console.log('Not Sufficient Funds')
                res.redirect('/military')
            }
        }).catch(console.error);
      })
  })
  }) 
}) 
    
//FUCTIONS
// function calculateGoldCost(warriors, archers, cavalry) {
//     let cost; 
//     cost += warriors*1;
//     cost+= archers*1;
//     cost+=cavalry*5;
//     return cost;
// }
// function calculateLumberCost(archers, cavalry) {
//   let cost;
//   cost+= archers*2;
//   cost+=cavalry*10;
//   return cost;
// }
// function calculateFaunaCost(cavalry) {
//   let cost;
//   cost+=cavalry*2;
//   return cost;
// }

function checkBalanceGround(gold,lumber,fauna,silver,key) {
    return new Promise((resolve, reject) => {
      let storedID=key;
        let goldCost=gold;
        let lumberCost=lumber;
        let faunaCost=fauna;
        let silverCost=silver;
        db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
          resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost))
        })
    })
}

router.post('/enlistair', urlencodedParser, function(req,res){
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
  storedID=parseInt(rows.id, 10)
  let addedBlimps=0, addedHarpies=0, addedAngels=0, addedDragons=0, paramsRun;
  let sqlGet = "SELECT blimps, harpies, angels, dragons FROM military WHERE id = ?"
  let sqlRun = "UPDATE military SET blimps = (?), harpies = (?), angels = (?), dragons = (?) WHERE id = (?)"
  let paramsGet = storedID;
  let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
  let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
  
  db.serialize(()=>{
    db.get(sqlGet, paramsGet, function(err,rows){
      //console.log(rows);
      addedBlimps= Number(req.body.blimps) + Number(rows.blimps);
      addedHarpies= Number(req.body.harpies) + Number(rows.harpies);
      addedAngels= Number(req.body.angels) + Number(rows.angels);
      addedDragons = Number(req.body.dragons) + Number(rows.dragons);

      paramsRun = [Number(addedBlimps), Number(addedHarpies), Number(addedAngels), Number(addedDragons), storedID];
      db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
            currentGold=rows.gold;
            currentMana=rows.mana;
            currentLumber=rows.lumber;
            currentFauna=rows.fauna;
            currentSilver=rows.silver;
            currentIron=rows.iron;
            currentBronze=rows.bronze;
            currentSteel=rows.steel;
      })
      //console.log(paramsRun);
      let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0, ironCost=0, bronzeCost=0, steelCost=0, manaCost=0;
       goldCost = req.body.blimps*130+ req.body.harpies*60+ req.body.angels*60+ req.body.dragons*85;
       lumberCost= req.body.blimps*10;
       faunaCost= req.body.harpies*3 + req.body.dragons*7;
       silverCost = req.body.angels*15;
       bronzeCost = req.body.dragons*20;
       steelCost=req.body.blimps*50;
       manaCost=req.body.harpies*5 + req.body.angels*15, req.body.dragons*20;
      //console.log(goldCost +" "+lumberCost + " "+faunaCost);
      //console.log(cost + "line 60");
      checkBalanceAir(goldCost,lumberCost,faunaCost, silverCost, bronzeCost, steelCost, manaCost, storedID).then(check => {
        //console.log(check + "line 62");
        if (check === true) {
            newGold=currentGold-goldCost;
            newLumber=currentLumber-lumberCost;
            newFauna=currentFauna-faunaCost;
            newSilver=currentSilver-silverCost;
            newBronze = currentBronze - bronzeCost;
            newSteel=currentSteel-steelCost;
            newMana = currentMana-manaCost;
        db.run(sqlRun, paramsRun, function (err) {
          if (err) {
            return console.error(err.message);
            console.log('Error Updating Military');
           }
           console.log("Military Updated.");
           //console.log([addedWarriors, addedArchers, addedCavalry]);
           res.redirect('/military')
          })
          db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?), bronze = (?), steel = (?), mana = (?)", [newGold,newLumber,newFauna, newSilver, newBronze, newSteel, newMana], function (err) {
            if (err) {
                return console.error(err.message);
                console.log('Error Subtracting Resources');
               }
               console.log("Cost Subtracted");
          })
        } else {
              console.log('Not Sufficient Funds')
              res.redirect('/military')
          }
      }).catch(console.error);
    })
    }) 
  })
}) 

function checkBalanceAir(gold,lumber,fauna,silver, bronze, steel, mana, key) {
  return new Promise((resolve, reject) => {
    let storedID=key;
      let goldCost=gold;
      let lumberCost=lumber;
      let faunaCost=fauna;
      let silverCost=silver;
      let bronzeCost=bronze;
      let steelCost = steel;
      let manaCost = mana;
      db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
        resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost) && (rows.bronze>=bronzeCost) && (rows.steel>=steelCost) && (rows.mana>=manaCost))
      })
    })
}

router.post('/enlistsea', urlencodedParser, function(req,res){
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
  storedID=parseInt(rows.id, 10)
  console.log(storedID);
  let addedGalleys, addedPirates, addedSea_Serpents, paramsRun;
  let sqlGet = "SELECT galleys, harpies, pirates, sea_serpents FROM military WHERE id = ?"
  let sqlRun = "UPDATE military SET galleys = (?), pirates = (?), sea_serpents = (?) WHERE id = (?)"
  let paramsGet = storedID;
  let currentGold, currentMana, currentLumber, currentFauna,currentSilver,currentIron,currentBronze,currentSteel;
  let newGold,newMana,newLumber,newFauna,newSilver,newIron,newBronze,newSteel;
  
  db.serialize(()=>{
    db.get(sqlGet, paramsGet, function(err,rows){
      //console.log(rows);
      addedGalleys= Number(req.body.galleys) + Number(rows.galleys);
      addedPirates= Number(req.body.pirates) + Number(rows.pirates);
      addedSea_Serpents= Number(req.body.sea_serpents) + Number(rows.sea_serpents);

      paramsRun = [Number(addedGalleys), Number(addedPirates), Number(addedSea_Serpents), storedID];
      db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err,rows) {
            currentGold=rows.gold;
            currentMana=rows.mana;
            currentLumber=rows.lumber;
            currentFauna=rows.fauna;
            currentSilver=rows.silver;
            currentIron=rows.iron;
            currentBronze=rows.bronze;
            currentSteel=rows.steel;
      })
      //console.log(paramsRun);
      let goldCost=0,lumberCost=0,faunaCost=0,silverCost=0, ironCost=0, bronzeCost=0, steelCost=0, manaCost=0;
       goldCost = req.body.galleys*50+ req.body.pirates*25+ req.body.sea_serpents*60;
       lumberCost= req.body.galleys*40+req.body.pirates*70;
       faunaCost= req.body.sea_serpents*5;
       steelCost=req.body.galleys*30+req.body.pirates*10;
       manaCost=req.body.sea_serpents*250;
      //console.log(goldCost +" "+lumberCost + " "+faunaCost);
      //console.log(cost + "line 60");
      checkBalanceSea(goldCost,lumberCost,faunaCost, silverCost, bronzeCost, steelCost, manaCost,storedID).then(check => {
        //console.log(check + "line 62");
        if (check === true) {
            newGold=currentGold-goldCost;
            newLumber=currentLumber-lumberCost;
            newFauna=currentFauna-faunaCost;
            newSilver=currentSilver-silverCost;
            newBronze = currentBronze - bronzeCost;
            newSteel=currentSteel-steelCost;
            newMana = currentMana-manaCost;
        db.run(sqlRun, paramsRun, function (err) {
          if (err) {
            return console.error(err.message);
            console.log('Error Updating Military');
           }
           console.log("Military Updated.");
           //console.log([addedWarriors, addedArchers, addedCavalry]);
           res.redirect('/military')
          })
          db.run("UPDATE resources SET gold = (?), lumber = (?), fauna = (?), silver =(?), bronze = (?), steel = (?), mana = (?)", [newGold,newLumber,newFauna, newSilver, newBronze, newSteel, newMana], function (err) {
            if (err) {
                return console.error(err.message);
                console.log('Error Subtracting Resources');
               }
               console.log("Cost Subtracted");
          })
        } else {
              console.log('Not Sufficient Funds')
              res.redirect('/military')
          }
      }).catch(console.error);
    })
    }) 
  })
}) 

function checkBalanceSea(gold,lumber,fauna,silver, bronze, steel, mana, key) {
  return new Promise((resolve, reject) => {
    console.log(key);
    let storedID=key;
      let goldCost=gold;
      let lumberCost=lumber;
      let faunaCost=fauna;
      let silverCost=silver;
      let bronzeCost=bronze;
      let steelCost = steel;
      let manaCost = mana;
      db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
        resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost) && (rows.bronze>=bronzeCost) && (rows.steel>=steelCost) && (rows.mana>=manaCost))
      })
  })
}

module.exports = router;

