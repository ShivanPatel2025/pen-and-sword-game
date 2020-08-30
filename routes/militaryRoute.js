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
  
  db.serialize(()=>{
    db.get(sqlGet, paramsGet, function(err,rows){
      console.log(rows);
      addedWarriors= Number(req.body.warriors) + Number(rows.warriors);
      addedArchers= Number(req.body.archers) + Number(rows.archers);
      addedCavalry= Number(req.body.cavalry) + Number(rows.cavalry);
      paramsRun = [Number(addedWarriors), Number(addedArchers), Number(addedCavalry), sess.userid];
      console.log(paramsRun);
    })
    db.run("UPDATE military SET warriors = ?, archers = ?, cavalry = ? WHERE id = ?", paramsRun, function (err) {
        if (err) {
          return console.error(err.message);
          console.log('Error Updating Military');
         }
         console.log("Military Updated. Information:");
         console.log([addedWarriors, addedArchers, addedCavalry, sess.userid]);
         res.redirect('/military')
        })
    db.get(sqlGet, paramsGet, function(err,rows){
        console.log(rows);
    })
})
  
}) 
    

module.exports = router;

