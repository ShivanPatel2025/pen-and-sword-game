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
                        warObject = {
                            warid: rows.warid,
                            aggressorid: rows.aggressorid,
                            defenderid: rows.defenderid,
                            aggressorstability: rows.aggressorstability,
                            defenderstability: rows.defenderstability,
                            aggressormaps: rows.aggressormaps,
                            defendermaps: rows.defendermaps
                        }
                        offensiveWars.push(warObject)
                    }
                })
                db.each('SELECT * FROM wars WHERE defenderid=?',storedID, function(err,rows) {
                    if (!rows) {
                    } else {
                        warObject = {
                            warid: rows.warid,
                            aggressorid: rows.aggressorid,
                            defenderid: rows.defenderid,
                            aggressorstability: rows.aggressorstability,
                            defenderstability: rows.defenderstability,
                            aggressormaps: rows.aggressormaps,
                            defendermaps: rows.defendermaps
                        }
                        defensiveWars.push(warObject)
                    }
                })
                console.log(offensiveWars)
                console.log(defensiveWars)
                res.render('war', {offensiveWars: offensiveWars, defensiveWars:defensiveWars})
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
                    db.run(`INSERT INTO wars (aggressorid, defenderid, aggressorstability, defenderstability, aggressormaps, defendermaps, type) VALUES (?,?,?,?,?,?,?)`, [storedID, recipient, 50, 50, 10, 10, 'loot'], function(err){
                        res.redirect('/war')
                        console.log('war declared')
                    });
                } else if (type='damage') {
                    db.run(`INSERT INTO wars (aggressorid, defenderid, aggressorstability, defenderstability, aggressormaps, defendermaps, type) VALUES (?,?,?,?,?,?,?)`, [storedID, recipient, 100, 100, 10, 10, 'loot'], function(err){
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

module.exports = router; 