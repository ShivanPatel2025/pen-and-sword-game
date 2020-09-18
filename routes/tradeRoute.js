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

router.get('/trade', function(req,res) {
    let arrayOfObjectTrades =[]; 
    db.serialize(()=>{
        db.each(`SELECT * FROM trades`, function(err,rows) {
            let trade = {
                owner: rows.ownerid,
                type: rows.type,
                resource: rows.resource,
                amount: rows.amount,
                ppu: rows.price,
                region: rows.region
            }
            console.log(trade);
            arrayOfObjectTrades.push(trade);
        })
        db.get('SELECT * FROM kingdoms WHERE id=?', sess.userid, function(err,rows) {
            console.log(arrayOfObjectTrades);
            res.render('trade', {arrayOfObjectTrades}) 
        })
    })
})

router.get('/createtrade', function(req,res) {
    res.render('createtrade');
})

router.post('/createtrade', urlencodedParser, function(req,res) {
    db.run('INSERT INTO trades(ownerid, type, resource, amount, price, region) VALUES (?,?,?,?,?,?)', [sess.userid, req.body.type, req.body.resource, req.body.amount, req.body.ppu, req.body.region], function(err) {
        if(err) {
            console.error(err.message);
        }
    })
    res.redirect('/trade');
})

module.exports = router;