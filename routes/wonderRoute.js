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

router.get('/wonders', function(req,res) {
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
      storedID=parseInt(rows.id, 10)
      db.get('SELECT * FROM wonders WHERE id =?', storedID, function(err,rows) {
        pyramids = {
          'name': 'Pyramids',
          'description': 'Ancient masonry structures located in the deserts. Increase provincial happiness by 3.',
          'purchased': rows.pyramids

        }
        colosseum = {
          'name': 'Colosseum',
          'description' : 'A limestone amphitheatre repurposed for gladiatorial contests. Unlocks the Arena and boost provincial happiness by 1.',
          'purchased': rows.colosseum
        }
        fountain_of_youth = {
          'name' : 'Fountain of Youth',
          'description' : 'A hidden spring that brings life and youth to those around it. Increases provincial happiness by 5.',
          'purchased': rows.fountain_of_youth_of_youth
        }
        el_dorado = {
          'name' : 'El Dorado',
          'description' : 'An ancient city of gold, El Dorado hold the secret to immeasureable wealth. Boosts gold output by 3%.',
          'purchased': rows.el_dorado
        }
        res.render('wonders', {wonders:[pyramids,colosseum,fountain_of_youth,el_dorado]})
      })
    }
  })
})


router.post('/purchasewonder',urlencodedParser, function(req,res) {
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
      storedID=parseInt(rows.id, 10)
      let name= req.body.name;
      db.get('SELECT * FROM wonders WHERE id=?', storedID, function(err,rows) {
        if (rows[name]==1) {
          console.log('u already own this man');
        } else {
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
            newValues[0] = cost[name]['gold'] ?  currentGold -cost[name]['gold']  : currentGold;
            newValues[1]=cost[name]['mana'] ?  currentMana - cost[name]['mana']  : currentMana;
            newValues[2]=cost[name]['flora'] ?  currentFlora - cost[name]['flora']  : currentFlora;
            newValues[3]=cost[name]['fauna'] ?  currentFauna - cost[name]['fauna']  : currentFauna;
            newValues[4]=cost[name]['lumber'] ?  currentLumber - cost[name]['lumber']  : currentLumber;
            newValues[5]=cost[name]['food'] ?  currentFood - cost[name]['food']  : currentFood;
            newValues[6]=cost[name]['silver'] ?  currentSilver - cost[name]['silver']  : currentSilver;
            newValues[7]=cost[name]['iron'] ?  currentIron - cost[name]['iron']  : currentIron;
            newValues[8]=cost[name]['bronze'] ?  currentBronze - cost[name]['bronze']  : currentBronze;
            newValues[9]=cost[name]['steel'] ?  currentSteel - cost[name]['steel']  : currentSteel;
            checkWonderCost(newValues).then(check => {        
              if (check === true) {
                db.run(`UPDATE wonders SET ${name} = ? WHERE id=?`,[1,storedID], function(err) {
                  if (err) {
                   console.err(err.message)
                 }else {
                   console.log('shit has been bought');
                 }
               });
              }
              if (check===false) {
                res.redirect('/wonders');
                console.log('not sufficient funds');
              }
            }).catch(console.error); 
          })
        }
      })
    }
  })
})

function checkWonderCost(array) {
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

module.exports = router; 