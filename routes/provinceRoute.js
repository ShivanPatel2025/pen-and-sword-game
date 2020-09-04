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

router.get('/provinces',urlencodedParser,function(req,res){
    let currentProvinceCount;
    let i=0;
    let provinces = { 
        countArray: [],
        provinceNames: [],
         provinceLands: [],
         provinceHappiness: []}
    // let provinceNames=[];
    // let provinceLands=[];
    // let provinceHappiness=[];
    db.serialize(() => {
      db.each(`SELECT * FROM provinces WHERE userid = ?`, sess.userid, function(err,rows) {
        console.log(rows)
        provinces.countArray.push(i);
        i++;
        provinces.provinceNames.push(rows.name);
        provinces.provinceLands.push(rows.land);
        provinces.provinceHappiness.push(rows.happiness);
        //console.log(provinceNames);
      })
      db.get(`SELECT * FROM kingdoms WHERE id = ?`, sess.userid, function(err,rows) {
        //console.log(rows.provinces);
        let current = Number(rows.provinces);
        //console.log(current);
        currentProvinceCount = {
            'count': current,
          } 
        res.render('provinces', {currentProvinceCount, provinces});
      }) 
    })
    
})


router.post('/new-province', urlencodedParser, function(req,res) {
    let provinceCost;
    let currentGold;
    let provinces;
    db.serialize(()=> {
    db.get('SELECT gold FROM resources WHERE id =(?)',sess.userid, function(err,rows) {
        currentGold=rows.gold;
    })
    db.get('SELECT provinces FROM kingdoms WHERE id = (?)', sess.userid, function(err,rows) {
        if (err) {
            console.log('Error creating province line 28');
            console.error(err.message);
        } 
        provinceCost=Math.round(3*(Math.pow(1.4,(Number(rows.provinces)+1))));
        provinces=Number(rows.provinces)+1;
        let newGold = currentGold-provinceCost;
        checkBalance(provinceCost).then(check=>{
            if (check===true) {
                db.run('UPDATE kingdoms SET provinces = (?) WHERE id = (?)',[provinces, sess.userid],function(err) {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('updated province count')
                })
                db.run('UPDATE resources SET gold = (?) WHERE id=(?)',[newGold, sess.userid], function(err) {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('updated resources')
                })
                db.run('INSERT INTO provinces (userid, name, land, happiness) VALUES (?,?,?,?)', [sess.userid, req.body.provinceName, 100, '100'], function(err) {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('inserted province');
                })
                res.redirect('/provinces')
            } else {
                console.log('Not Sufficient Funds')
                res.redirect('/provinces')
            }

        }).catch(console.error);
    })
    })
})

function checkBalance(incost) {
    return new Promise((resolve, reject) => {
        let cost=incost;
        db.get("SELECT * FROM resources WHERE id = ?", sess.userid, function(err, rows) {
            
            resolve(rows.gold >= cost)
        })
    })
}


router.post('/buyImprovement', urlencodedParser, function(res,req) {
    let name=req.body.provinceName;
    db.get(`SELECT * FROM provinces WHERE userid = ? AND name =?`, [sess.userid, name], function(err,rows) {
        console.log(rows.land);
    })
                res.redirect('/provinces')
 
})
module.exports = router;