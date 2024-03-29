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
const { UnsupportedMediaType } = require('http-errors');
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
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
    storedID=parseInt(rows.id, 10);
    let errormessage='bro ur not in a guild'
    db.get('SELECT * FROM kingdoms where id= ?', storedID, function(err,row) {
      if (!row.guild) {
        res.render('noguild', {errormessage})
      } else {
        let playerGuild = row.guild;
        let position=row.position;
        db.get('SELECT * FROM guilds where guild = ?', playerGuild, function(err,rows) {
          if (err) {
            console.error(err.message);
          } else {
             let membercount=rows.membercount;
             let region = rows.region;
             let type= rows.type;
             //res.render('guild', {playerGuild, membercount, region, type,position})
             res.render('guild')
          }
        })
      }
    })
  }})
})
router.get('/leaderboard_table', urlencodedParser, function(req,res){

  //GET /leaderboard_table?max=10&min=1
  let min = req.query.min;
  let max = req.query.max;
  let dif = max-min;
  let i = 1;
  db.all(`SELECT * FROM guilds ORDER BY power LIMIT ${min}, ${dif}`, function(err,rows){
    const data ={
      headers:['Guild Leaderboards','Your Guild','Create a Guild'],
      rows: new Array(10).fill(undefined).mao(() => {

        return [
          rows.name(),
          rows.membership(),
          rows.power(),
        ]

      })
    }
    res.json(data)

    
    
    
  })

  
})

router.get('/create-guild', urlencodedParser, function(req,res) {
  res.render('guildcreation')
})

router.post('/finish-guild-creation', urlencodedParser, function(req,res){
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
    storedID=parseInt(rows.id, 10);
  let guild=req.body.guild;
  let type = req.body.type;
  let region = req.body.region;
  db.run('INSERT INTO guilds VALUES(?,?,?,?)', [guild,1,region,type], function(err) {
    if (err) {
      console.log('error at line 56');
    }
    db.run('UPDATE kingdoms SET guild =?, position=? WHERE id = ?', [guild, "leader", storedID], function(err) {
      if (err) {
        console.log('error at 60')
      }
    })
    res.redirect('/guild');
  });
  }})
})

router.get('/join-guild', urlencodedParser, function(req,res) {
  res.redirect('/guilds')
})

router.get('/guilds', function(req,res) {
  let arrayofguilds = [];
  db.serialize(()=>{
  db.each('SELECT * FROM guilds', function (err, rows) {
    console.log(rows.guild)
    arrayofguilds.push(rows.guild)
  })
  db.run("SELECT * FROM keys", function (err,row) {
  console.log(arrayofguilds)
  res.render('guilds', {arrayofguilds})
})
})
})

router.get('/leave-guild', function(req,res) {
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
    storedID=parseInt(rows.id, 10);
    db.get(`SELECT * FROM kingdoms where id =?`, storedID, function(err,rows) {
      let guild = rows.guild;
      db.get('SELECT * FROM guilds WHERE guild =?', guild, function(err,rows) {
        let membercount=rows.membercount;
        let newMC=membercount-1;
        db.run('UPDATE guilds SET membercount=?', newMC);
      })
    })
    db.run('UPDATE kingdoms SET guild=?, position =? WHERE id =?', [ , , storedID])
    res.redirect('/guild')
  }})
})

router.post('/joinspecificguild', urlencodedParser, function(req,res) {
  let guild = req.body.guild;
  let membercount=0;
  let storedID;
  db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
    if(rows==undefined) {
      res.redirect ('/')
      console.log('this bih not signed in')
    } else{
    storedID=parseInt(rows.id, 10);
    db.serialize(() => {
      db.run('UPDATE kingdoms SET guild=?, position=? WHERE id=?',[guild,"member", storedID],function(err) {
        if(err) {
          console.log('err at 87');
        }
        console.log('no err at 91');
    
      })
      db.get('SELECT * FROM guilds WHERE guild = ?', guild, function(err,rows) {
        if(err) {
          console.log('err at 91')
        }
        console.log('no err at 98');
    
        membercount = Number(rows.membercount)+1;
        console.log('newmembercount = '+membercount);
        db.run('UPDATE guilds SET membercount= ? WHERE guild = ?',[membercount, guild], function(err){
          if(err){
            console.log('err at 104')
          } else {
            console.log('no err at 106');
      
            res.redirect('/guild')
          }
        })
      })
      })
  }})
})
module.exports = router;