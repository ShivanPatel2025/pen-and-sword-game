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

router.get('/guild', function(req,res) {
  let errormessage='bro ur not in a guild'
    db.get('SELECT * FROM kingdoms where id= ?', sess.userid, function(err,row) {
      if (!row.guild) {
        res.render('noguild', {errormessage})
      } else {
        let playerGuild = row.guild;
        db.get('SELECT * FROM guilds where guild = ?', playerGuild, function(err,rows) {
          if (err) {
            console.error(err.message);
          } else {
             let membercount=rows.membercount;
             let region = rows.region;
             let type= rows.type;
             res.render('guild', {playerGuild, membercount, region, type})
          }
        })
      }
    })
})

router.get('/create-guild', urlencodedParser, function(req,res) {
  res.render('guildcreation')
})

router.post('/finish-guild-creation', urlencodedParser, function(req,res){
  let guild=req.body.guild;
  let type = req.body.type;
  let region = req.body.region;
  db.run('INSERT INTO guilds VALUES(?,?,?,?)', [guild,1,region,type], function(err) {
    if (err) {
      console.log('error at line 56');
    }
    db.run('UPDATE kingdoms SET guild =? WHERE id = ?', [guild, sess.userid], function(err) {
      if (err) {
        console.log('error at 60')
      }
      res.redirect('/guild');
    })
  });
})

router.get('/join-guild', urlencodedParser, function(req,res) {
  res.redirect('/guilds')
})

router.get('/guilds', function(req,res) {
  let arrayofguilds =[];
  db.each('SELECT * FROM guilds', function (err,rows) {
    if (err) {
      console.log('error at 75')
    } else {
      arrayofguilds.push(rows.guild)
      res.render('guilds', {arrayofguilds})
    }
  })
})

router.post('/joinspecificguild', urlencodedParser, function(req,res) {
  let guild = req.body.guild;
  db.run('UPDATE kingdoms SET guild=? WHERE id=?',[guild,sess.userid],function(err) {
    if(err) {
      console.log('err at 87');
    }
    db.get('SELECT * FROM guilds WHERE guild = ?', guild, function(err,rows) {
      if(err) {
        console.log('err at 91')
      }
      let membercount = rows.membercount+1;
      db.run('UPDATE guilds SET membercount=? WHERE guild =?',[membercount,guild], function(err){
        if(err){
          console.log('err at 96')
        }
        res.redirect('/guild')
      })
    })
  })
})
module.exports = router;