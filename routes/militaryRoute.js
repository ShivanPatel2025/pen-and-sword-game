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
    db.get(`SELECT * FROM military WHERE id = ?`, sess.userid, function(err,rows) {
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

router.post('/enlistground', urlencodedParser, function(req,res){
  let addedWarriors, addedArchers, addedCavalry, addedBlacksmiths, addedPriests, addedMages, paramsRun;
  let sqlGet = "SELECT warriors, archers, cavalry, blacksmiths, priests, mages FROM military WHERE id = ?"
  let sqlRun = "UPDATE military SET warriors = (?), archers = (?), cavalry = (?), blacksmiths = (?), priests = (?), mages = (?) WHERE id = (?)"
  let paramsGet = sess.userid;
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

      paramsRun = [Number(addedWarriors), Number(addedArchers), Number(addedCavalry), Number(addedBlacksmiths), Number(addedPriests), Number(addedMages), sess.userid];
      db.get("SELECT * FROM resources WHERE id = ?", sess.userid, function(err,rows) {
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
      checkBalance(goldCost,lumberCost,faunaCost, silverCost).then(check => {
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
    //db.get(sqlGet, paramsGet, function(err,rows){
        //console.log(rows);
    //})
    })
    
})
  
}) 
    
//FUCTIONS
function calculateGoldCost(warriors, archers, cavalry) {
    let cost; 
    cost += warriors*1;
    cost+= archers*1;
    cost+=cavalry*5;
    return cost;
}
function calculateLumberCost(archers, cavalry) {
  let cost;
  cost+= archers*2;
  cost+=cavalry*10;
  return cost;
}
function calculateFaunaCost(cavalry) {
  let cost;
  cost+=cavalry*2;
  return cost;
}

function checkBalance(gold,lumber,fauna,silver) {
    return new Promise((resolve, reject) => {
        let goldCost=gold;
        let lumberCost=lumber;
        let faunaCost=fauna;
        let silverCost=silver;
        db.get("SELECT * FROM resources WHERE id = ?", sess.userid, function(err, rows) {
            
            resolve((rows.gold >= goldCost) && (rows.lumber>=lumberCost) && (rows.fauna>=faunaCost) && (rows.silver>=silverCost))
        })
    })
}

module.exports = router;

