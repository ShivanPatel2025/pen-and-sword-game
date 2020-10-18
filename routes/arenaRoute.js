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

router.get('/arena',function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10);
        db.get(`SELECT * FROM wonders WHERE id=?`,storedID,function(err,rows){
            if (rows.colosseum==0) {
                console.log('Construct the Colosseum to access the Arena. It can be found in the Wonders tab.')
            }
            else {
                db.get('SELECT * FROM arena WHERE id=?',storedID,function(err,rows){
                    if(rows==undefined) {
                        console.log('You must hire a Gladiator');
                        res.render('arena_selection')
                    } else{
                        let name = rows.name;
                        let gender = rows.gender;
                        let weapon = rows.weapon;
                        let strength=rows.strength;
                        let defense=rows.defense;
                        let agility=rows.agility;
                        let intelligence=rows.intelligence;
                        let upgradepoints=rows.upgradepoints;
                        res.render('arena')
                    }
                })
            }
        })
      }
    }) 
})

router.post('/arena_selection',urlencodedParser, function(req,res){
  let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10);
        let name=req.body.name;
        let gender=req.body.gender;
        let weapon=req.body.weapon;
        let strength,defense,agility,intelligence;
        if (weapon=='bow') {
          strength=10;
          defense=5;
          agility=30;
          intelligence=20;
        } else if (weapon=='mace') {
          strength=30;
          defense=10;
          agility=15;
          intelligence=10;
        } else if (weapon=='sword') {
          strength=15;
          defense=20;
          agility=20;
          intelligence=10;
      }
      console.log(storedID,name,gender,weapon,strength, defense, agility, intelligence)
        db.run('INSERT INTO arena (id, name, gender, weapon, strength, defense, agility, intelligence) VALUES (?,?,?,?,?,?,?,?)',[storedID,name,gender,weapon,strength, defense, agility, intelligence],function(err){
          if(err){
            console.error(err.message)
          } else {
            res.redirect('/arena')
          }
        })
      }
    })
})

router.post('/hostmatch',urlencodedParser, function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10);
        db.get('SELECT * FROM matches WHERE host=?',storedID,function(err,rows){
            if (rows==undefined) {
                db.run('INSERT INTO matches host=?, strength=?, defense=?, agility=?, intelligence=?',[storedID, req.body.strength, req.body.defense, req.body.agility, req.body.intelligence]);
                res.render('/arena')
                console.log('Match posted')
            } else {
                res.render('/arena');
                console.log('You are already hosting a match');
            }
        })
      }
    })
})

router.get('/matches',urlencodedParser,function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10);
        let arrayOfMatches=[];
        db.each('SELECT * FROM matches',function(err,rows){
            hostid=rows.host;
            strength=rows.strength;
            defense=rows.defense;
            agility=rows.agility;
            intelligence=rows.intelligence;
            db.run('SELECT * FROM kingdoms WHERE id=?',hostid, function(err,row){
                let host=rows.kingdom;
                obj = {
                    host: host,
                    strength: strength,
                    defense: defense,
                    agility: agility,
                    intelligence: intelligence
                }
                arrayOfMatches.push(obj)
            })
        })
        res.render('matches', {arrayOfMatches})
      }
    })
})

router.post('/upgradestats',urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      if(rows==undefined) {
        res.redirect ('/')
        console.log('this bih not signed in')
      } else{
        storedID=parseInt(rows.id, 10);
        let stat=req.body.stat;
        db.get('SELECT * FROM arena WHERE id =?',storedID,function(err,rows){
            let numstat=rows[stat];
            if(rows.upgradepoints>0){
                numstat=numstat+Math.floor(Math.random()*(5-1)+1);
                db.run(`UPDATE arena SET ${stat}=? WHERE id=?`,[numstat,storedID], function(err){
                    if(err) {
                        console.err(err.message)
                    } else {
                        console.log(stat+' has been upgraded')
                    }
                })
            } else {
                res.render('arena');
                console.log('not sufficient upgrade points')
            }
        })
      }
    })
})

router.post('/startmatch',urlencodedParser, function(req,res){
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
      storedID=parseInt(rows.id, 10);
      db.get('SELECT * FROM arena WHERE id=?',storedID, function(err,rows){
        let actorStats=[rows.strength,rows.defense,rows.agility,rows.intelligence];
        let host=req.body.hostid;
        db.get('SELECT * FROM arena WHERE id=?',host, function(err,rows){
          let hostStats=[rows.strength,rows.defense,rows.agility,rows.intelligence];
          let actorPower=actorStats[0]+(Math.random()*(20-10)+10)+actorStats[1]+(Math.random()*(20-10)+10)+actorStats[2]+(Math.random()*(20-1)+1)+actorStats[3]+(Math.random()*(100-1)+1)
          let hostPower=hostStats[0]+(Math.random()*(20-10)+10)+hostStats[1]+(Math.random()*(20-10)+10)+hostStats[2]+(Math.random()*(20-1)+1)+hostStats[3]+(Math.random()*(100-1)+1)
          if (actorPower>hostPower){
            let prize=Math.floor(Math.random()*(hostPower-hostPower/2))
            db.get('SELECT * FROM resources WHERE id=?',storedID,function(err,rows){
              let newGold=rows.gold+prize;
              db.run('UPDATE resources SET gold=? WHERE id=?',[newGold,storedID],function(err) {
                if(err){
                  console.error(err.message)
                } else {
                  console.log(storedID +" was victor and won "+prize)
                  res.redirect('/arena')
                }
              })
            })
          }
          if (hostPower>=actorPower){
            let prize=Math.floor(Math.random()*(actorPower-actorPower/2))
            db.get('SELECT * FROM resources WHERE id=?',host,function(err,rows){
              let newGold=rows.gold+prize;
              db.run('UPDATE resources SET gold=? WHERE id=?',[newGold,host],function(err) {
                if(err){
                  console.error(err.message)
                } else {
                  console.log(host +" was victor and won "+prize)
                  res.redirect('/arena')
                }
              })
            })
          }
        })
      })
    }
  })
})

setInterval(function() {
    db.each('SELECT * FROM arena', function(err,rows) {
        let id =rows.id;
        let up=rows.upgradepoints;
        if (up<15) {
            up+=1;
        }
        db.run('UPDATE arena SET upgradepoints=? WHERE id=?',[up,id], function(err) {
            if (err) {
                console.log('couldnt update arena upgrade points')
            }else {
                console.log('updatres arena points')
            }
        })
    })
  },900000)

module.exports = router;