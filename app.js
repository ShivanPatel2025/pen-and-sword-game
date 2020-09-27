const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const { url } = require('inspector');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
const session = require('express-session');
const { createDecipher } = require('crypto');
const { urlencoded } = require('body-parser');

// Middleware
app.use(session({
  secret: "q_z%?q^;P4HKYnj'U<L$fKZ2%&b//'VCaPDrm*;#q4H",
  saveUninitialized: true,
  resave: true}));
// Change the secret key if you want to use this for production (and move to .env file)

const router = express.Router();
app.use('/',router)

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public"));

var TWO_HOURS = 7200000;
const {
  PORT = 5000,
  NODE_ENV = 'development',

  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!quiet,it\'asecret!',
  SESS_LIFETIME = TWO_HOURS
} = process.env

app.use(express.static("functions"));
app.use(express.static("public"));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));


//SQLITE
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//SQLITE

const kingdomRoute = require('./routes/kingdomRoute.js')
const militaryRoute = require('./routes/militaryRoute.js')
const provinceRoute = require('./routes/provinceRoute.js')
const revenueRoute = require('./routes/revenueRoute.js')
const guildRoute = require('./routes/guildRoute.js')
const tradeRoute = require('./routes/tradeRoute.js')
const wonderRoute = require('./routes/wonderRoute.js')



app.use(kingdomRoute)
app.use(militaryRoute)
app.use(provinceRoute)
app.use(revenueRoute)
app.use(guildRoute)
app.use(tradeRoute)
app.use(wonderRoute)


//RUNNING SERVER
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
//RUNNING SERVER

//SENDING LOGIN PAGE
app.get('/', (req, res) => {
  res.render("keys");

})
//SENDING LOGIN PAGE

//parse date


app.post('/home', urlencodedParser, function (req, res){
  let userkey=req.body.key;
  let sql = ('SELECT * FROM keys WHERE key = ?');
  db.get(sql, [userkey], (err, row) => {
    if (err) {
      return console.error(err.message);
    } else if (row) {
      res.render('home');
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
  res.render('creation');
  let data = [req.body.email, req.body.password];
  let sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
  let sql1 = `SELECT id FROM users WHERE email = (?)`;
  let data1 = [req.body.email];
  // let sql2 = `INSERT INTO kingdoms (id) VALUES (?)`;
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
    realid=rows.id;
    console.log("Session created. Session ID: " + realid + ". Cookie key: " + req.session.id);
    db.run(`INSERT INTO sessions (cookie, id) VALUES (?,?)`, [req.session.id,realid]);
    let date = Date();
    console.log(date);
    let splited = date.split(" ");
    
    let creationdate = `${splited[1]}/${splited[2]}/${splited[3]}`;
    db.run(`INSERT INTO kingdoms (id,date,provinces) VALUES (?,?,?)`, [realid, creationdate, 1], function (err) {
      if (err) {
        return console.error(err.message);
        console.log(ooga);
       }})
    db.run(`INSERT INTO military (id, warriors, archers, cavalry, blacksmiths, priests, mages, blimps, harpies, angels, dragons, galleys, pirates, sea_serpents, catapults, trebuchets, cannons) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)`, [realid,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], function (err) {
      if (err) {
        return console.error(err.message);
    }
      console.log('Military values of 0 inputted!')})
    db.run(`INSERT INTO resources (id, gold, mana, flora, fauna, lumber, food, ore, silver, iron, bronze, steel) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?)`, [realid,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999, 9999999, 9999999], function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log('resources generated')
    })

    // //POLICIES
    // db.run(`INSERT INTO Policies (id, government, economy, war) VALUES (?, ?, ?, ?)`, [realid,'Democracy','Communism','Blitzkrieg'], function (err) {
    //   if (err) {
    //     return console.error(err.message);
    //   }
    //     console.log('policies table created successfully!')
    // })

    //PROVINCES
    db.run(`INSERT INTO provinces (userid, name, land, happiness) VALUES (?, ?, ?, ?)`, [realid,'Capital', 100, '100'], function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log('provinces table created successfully!')
    })

    //WONDERS
    db.run(`INSERT INTO wonders (id, pyramids, eiffel_tower, stone_henge) VALUES (?, ?, ?, ?)`, [realid,"0",'0','0'], function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log('wonders table created successfully!')
    })
      
  })
  console.log('Row(s) updated');
})});

app.post('/kingdom-page',urlencodedParser, function (req, res) {
  let realid;
  db.serialize(()=>{
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      realid=parseInt(rows.id, 10);
   
    db.run(`UPDATE kingdoms SET kingdom = ?, ruler = ?, region = ? WHERE id = ?`, [req.body.kingdom, req.body.ruler, req.body.region, realid], function (err) {
      if (err) {
        return console.error(err.message);;
      }
      res.redirect('/kingdom-details')
    })
  })
})
})


app.get('/kingdom-details',urlencodedParser,function(req,res){
  res.render('kingdomdetails');

})
app.post('/kingdom-details', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10);
      let government = req.body.government;
      let economy = req.body.economy;
      let war = req.body.war;
      let background = req.body.background;
      db.run(`INSERT INTO Policies (id, government, economy, war, background) VALUES (?,?, ?, ?, ?)`, [storedID, government,economy,war,background], function (err) {
        if (err) {
          return console.error(err.message);
        }
          console.log('policies table created successfully!')
       })
      res.redirect('/kingdom')
    })
})



app.get('/sign-in',urlencodedParser, function(req,res){
  res.render('sign-in')
})

app.get('/sign-up',urlencodedParser, function(req,res){
  res.render('sign-up')
})

app.get('/home',urlencodedParser, function(req,res){
  res.render('home')
})

app.post('/sign-in',urlencodedParser, function (req,res) {
  let sql = ('SELECT * FROM users WHERE email = ? AND password = ?');
  let data = [req.body.email, req.body.pass];
  db.get(sql, data, (err, row) => {
    if (err) {
      return console.error(err.message);
    } else if (row) {
      
      let sql1 = `SELECT id FROM users WHERE email = (?)`;
      let data1 = [req.body.email];
      db.get(sql1, data1, function (err,rows) {
        if (err) {
            return console.error(err.message);
            console.log('realid is the issue');
        }
        //console.log(rows);
        realid=Number(rows.id);
        console.log("Session created. Session ID:");
        console.log(realid);
        db.run(`INSERT INTO sessions (cookie,id) VALUES (?,?)`, [req.session.id,realid], function(err){})
      });
      //res.redirect('/new_kingdom');
      res.redirect('/kingdom')
    }
    else {
      res.redirect('/')
    }
    
  
  });
})

app.get('/logout', urlencodedParser, function (req,res) {
  req.session.destroy();
  res.redirect('/');


})


 