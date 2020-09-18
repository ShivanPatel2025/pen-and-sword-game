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
                id: rows.tradeid,
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

router.post('/accepttrade', urlencodedParser, function(req,res) {
    console.log('49');
    tradeid=req.body.tradeid;
    let host;
    let interacter = sess.userid;
    let resource;
    let amount;
    let price;
    let totalprice;
    let type;
    let region;
    console.log('58')
    db.get('SELECT* FROM trades WHERE tradeid=?',tradeid, function(err,rows) {
        type=rows.type;
        host = rows.ownerid;
        resource=rows.resource;
        amount=rows.amount;
        price=rows.price;
        totalprice=amount*price;
        region=rows.region;
        console.log('67')
        if (type =='sell') {
            //check if buyer (current user) has money
            console.log('70')
            db.get('SELECT * FROM resources WHERE id=?', interacter, function(err,row) {
                let buyersGold=row.gold;
                let buyersNewResourceCount=Number(row[resource])+amount;
                let buyersNewGoldCount=buyersGold-totalprice;
                if(buyersGold>=price) {
                    //check if seller has resources
                    db.get('SELECT * FROM resources WHERE id=?',host, function(err,ro) {
                        let sellersRss=ro[resource];
                        let sellersNewResourceCount=sellersRss-amount;
                        let sellersNewGoldCount=ro.gold+totalprice;
                        if(sellersRss>=amount) {
                            db.run(`UPDATE resources SET ${resource}=?, gold=? WHERE id=?`, [buyersNewResourceCount,buyersNewGoldCount, interacter])
                            console.log("buyers shit has been updated");
                            db.run(`UPDATE resources SET ${resource}=?, gold=? WHERE id=?`,[sellersNewResourceCount,sellersNewGoldCount, host])
                            console.log("sellers shit has been updated")
                            db.run('DELETE from trades WHERE tradeid=?',tradeid, function(err) {
                                if (err) {
                                    console.err(error.message);
                                }
                            })
                        } else {
                            console.log("seler dont have rss")
                        }
                    })
                } else {
                    console.log("buyer does not have sufficient funds")
                }
            }

            )
        } if(type=='buy') {
            //check if buyer (owner of trade) has money
            db.get('SELECT * FROM resources WHERE id=?', host, function(err,row) {
                let buyersGold=row.gold;
                let buyersNewResourceCount=Number(row[resource])+amount;
                let buyersNewGoldCount=buyersGold-totalprice;
                if(buyersGold>=price) {
                    //check if seller has resources
                    db.get('SELECT * FROM resources WHERE id=?',interacter, function(err,ro) {
                        let sellersRss=ro[resource];
                        let sellersNewResourceCount=sellersRss-amount;
                        let sellersNewGoldCount=ro.gold+totalprice;
                        if(sellersRss>=amount) {
                            db.run(`UPDATE resources SET ${resource}=?, gold=? WHERE id=?`, [buyersNewResourceCount,buyersNewGoldCount, host])
                            console.log("buyers shit has been updated");
                            db.run(`UPDATE resources SET ${resource}=?, gold=? WHERE id=?`,[sellersNewResourceCount,sellersNewGoldCount, interacter])
                            console.log("sellers shit has been updated")
                            db.run('DELETE from trades WHERE tradeid=?',tradeid, function(err) {
                                if (err) {
                                    console.err(error.message);
                                }
                            })
                        } else {
                            console.log("seler dont have rss")
                        }
                    })
                } else {
                    console.log("buyer does not have sufficient funds")
                }
            }
            )
        }
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