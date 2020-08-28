const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const { url } = require('inspector');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const session = require('express-session');
const { createDecipher } = require('crypto');
const { urlencoded } = require('body-parser');
var TWO_HOURS = 7200000;
const {
  PORT = 5000,
  NODE_ENV = 'development',

  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!quiet,it\'asecret!',
  SESS_LIFETIME = TWO_HOURS
} = process.env

app.use(express.static("public"));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: 'SESS_SECRET',
  cookie: {
    maxAge: 1000000000000,
    sameSITE: true,
    secure: true
  }

}));
//SQLITE
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//SQLITE

//RUNNING SERVER
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
//RUNNING SERVER

//SENDING LOGIN PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'keys.html'));
  sess=req.session;
})
//SENDING LOGIN PAGE

app.post('/home', urlencodedParser, function (req, res){
  let userkey=req.body.key;
  let sql = ('SELECT * FROM keys WHERE key = ?');
  db.get(sql, [userkey], (err, row) => {
    if (err) {
      return console.error(err.message);
    } else if (row) {
      res.sendFile(path.join(__dirname, '/public', 'home.html'));
    }
    else {
      res.send("not a valid key");

    }
  
  });
});


app.post('/create-a-nation', urlencodedParser, function (req, res){
  /*var reply='';
  reply += "Your name is" + req.body.user;
  reply += "Your E-mail id is" + req.body.password; 
  reply += "Your address is" + req.body.email;
  //res.send(reply);*/
  res.sendFile(path.join(__dirname, '/public', 'creation.html'));
  let data = [req.body.email, req.body.password];
  let sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  let sql1 = `SELECT id FROM users WHERE email = (?)`;
  let data1 = [req.body.email];
  let sql2 = `INSERT INTO kingdoms (id) VALUES (?)`;
  let realid=0;
  db.serialize(() => {
  db.run(sql, data, function(err) {
    if (err) {
      return console.error(err.message);
    }})
  db.get(sql1, data1, function (err,rows) {
    if (err) {
       return console.error(err.message);
       console.log('realid is the issue');
    }
    //console.log(rows);
    realid=rows.id;
    sess.userid = realid;
    console.log("Session created. Session ID:");
    console.log(sess.userid);
    //console.log(realid);
    db.run(`INSERT INTO kingdoms (id) VALUES (?)`, realid, function (err) {
      if (err) {
        return console.error(err.message);
        console.log(ooga);
       }})
    db.run(`INSERT INTO military (id, ground, air, sea)`, [realid,0,0,0], function (err) {
      if (err) {
        return console.error(err.message);
    }
      console.log('Military values of 0 inputted!')})
  })
  console.log('Row(s) updated');
})});

app.post('/kingdom-page',urlencodedParser, function (req, res) {
  //console.log(sess.userid);
  db.run(`UPDATE kingdoms SET kingdom = ?, ruler = ?, region = ? WHERE id = ?`, [req.body.kingdom, req.body.ruler, req.body.region, sess.userid], function (err) {
    if (err) {
      return console.error(err.message);
      console.log('error inserting into kingdoms');
     }
     res.sendFile(path.join(__dirname, '/public', 'kingdom.html'));
     console.log("Kingdom Created. Information:");
     console.log([req.body.kingdom, req.body.ruler, req.body.region, sess.userid]);
    })
  })

  app.post('/sign-in',urlencodedParser, function (req,res) {
    let sql = ('SELECT * FROM users WHERE email = ? AND password = ?');
    let data = [req.body.email, req.body.pass];
    db.get(sql, data, (err, row) => {
      if (err) {
        return console.error(err.message);
      } else if (row) {
        res.sendFile(path.join(__dirname, '/public', 'kingdom.html'));
        let sql1 = `SELECT id FROM users WHERE email = (?)`;
        let data1 = [req.body.email];
        db.get(sql1, data1, function (err,rows) {
          if (err) {
             return console.error(err.message);
             console.log('realid is the issue');
          }
          //console.log(rows);
          realid=rows.id;
          sess.userid = realid;
          console.log("Session created. Session ID:");
          console.log(sess.userid);});
        //res.redirect('/new_kingdom');
      }
      else {
        res.send("Not a valid combination!");
      }
    
    });
  })

  app.post('/logout', urlencodedParser, function (req,res) {
    req.session.destroy((err) => {
      if(err) {
          return console.log(err);
      }
      res.redirect('/');
  });
  })
  /*app.get('/new_kingdom',urlencodedParser,function(req,res){
    res.sendFile(path.join(__dirname, '/public', 'kingdom.html'));
    var kingdomid=sess.userid;
    kingdom.html.getElementById('kingdomid').innerHTML = kingdomid;
  })*/