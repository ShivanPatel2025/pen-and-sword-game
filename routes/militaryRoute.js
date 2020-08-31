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
  let addedWarriors, addedArchers, addedCavalry, paramsRun;
  let sqlGet = "SELECT warriors, archers, cavalry FROM military WHERE id = ?"
  let sqlRun = "UPDATE military SET warriors = (?), archers = (?), cavalry = (?) WHERE id = (?)"
  let paramsGet = sess.userid;
  let currentGold,newGold;
  
  db.serialize(()=>{
    db.get(sqlGet, paramsGet, function(err,rows){
      //console.log(rows);
      addedWarriors= Number(req.body.warriors) + Number(rows.warriors);
      addedArchers= Number(req.body.archers) + Number(rows.archers);
      addedCavalry= Number(req.body.cavalry) + Number(rows.cavalry);
      paramsRun = [Number(addedWarriors), Number(addedArchers), Number(addedCavalry), sess.userid];
      db.get("SELECT * FROM resources WHERE id = ?", sess.userid, function(err,rows) {
            currentGold=rows.gold;
      })
      //console.log(paramsRun);
      let cost = calculateCost('warrior', req.body.warriors);
      //console.log(cost + "line 60");
      checkBalance(cost).then(check => {
        //console.log(check + "line 62");
        if (check === true) {
            newGold=currentGold-cost;
        db.run(sqlRun, paramsRun, function (err) {
          if (err) {
            return console.error(err.message);
            console.log('Error Updating Military');
           }
           console.log("Military Updated.");
           //console.log([addedWarriors, addedArchers, addedCavalry]);
           res.redirect('/military')
          })
          db.run("UPDATE resources SET gold = (?)", newGold, function (err) {
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
function calculateCost(unit, amount) {
    if (unit=='warrior') {
        return amount*1;
    }
}

function checkBalance(cost) {
    return new Promise((resolve, reject) => {
        let Cost=cost;
        let current;
        db.get("SELECT * FROM resources WHERE id = ?", sess.userid, function(err, rows) {
            current = rows.gold;
            resolve(rows.gold >= Cost)
        })
    })
}

module.exports = router;

