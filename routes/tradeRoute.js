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
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let arrayOfObjectTrades_global =[]; 
      let arrayOfObjectTrades_personal =[]; 
      let arrayOfObjectTrades_my =[]; 

      db.serialize(()=>{
          db.each(`SELECT * FROM trades WHERE scope=?`,'global', function(err,rows) {
              let trade = {
                  id: rows.tradeid,
                  owner: rows.ownerid,
                  type: rows.type,
                  resource: rows.resource,
                  amount: rows.amount,
                  ppu: rows.price,
                  date: rows.date,
                      time: rows.time
              }
              arrayOfObjectTradesglobal.push(trade);
              console.log(arrayOfObjectTrades_global)
          })
          db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
            kingdom=rows.kingdom;
            db.each(`SELECT * FROM trades WHERE scope=? AND recepient=?`,['personal', kingdom] , function(err,rows) {
                if(err) {
                    console.error(err.message);
                }
                    let trade = {
                        id: rows.tradeid,
                        owner: rows.ownerid,
                        type: rows.type,
                        resource: rows.resource,
                        amount: rows.amount,
                        ppu: rows.price,
                        date: rows.date,
                        time: rows.time
                    }
                    console.log(trade);
                    arrayOfObjectTrades_personal.push(trade)
                    console.log(arrayOfObjectTrades_personal)

                })
        })
        db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
            kingdom=rows.kingdom;
            console.log(kingdom);
            db.each(`SELECT * FROM trades WHERE ownerid=?`,[kingdom] , function(err,rows) {
                if(err) {
                    console.error(err.message);
                }
                console.log(kingdom);
                console.log(rows);
                let trade = {
                    id: rows.tradeid,
                    owner: rows.ownerid,
                    type: rows.type,
                    resource: rows.resource,
                    amount: rows.amount,
                    ppu: rows.price,
                    date: rows.date,
                    time: rows.time
                }
                console.log(trade);
                arrayOfObjectTrades_my.push(trade);
                console.log(arrayOfObjectTrades_my)

            })
        })
          db.get('SELECT * FROM kingdoms WHERE id=?', storedID, function(err,rows) {
              console.log('sending to trade')
              res.render('trade', {arrayOfObjectTrades_global,arrayOfObjectTrades_personal,arrayOfObjectTrades_my}) 
          })
      })
    }})
})

router.post('/filter_trades',urlencodedParser, function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let arrayOfObjectTrades_global =[]; 
      db.serialize(()=>{
          let resource = req.body.resource;
          let type=req.body.type;
          let order = req.body.order; 
          let direction = req.body.direction;//should be 'ASC or DSC'
          let scope = 'global'
          if (order=='quantity'){
            db.each(`SELECT * FROM trades ORDER BY amount ${direction} WHERE scope=? AND type=? AND resource=?`,[scope,type,resource], function(err,rows) {
                let trade = {
                    id: rows.tradeid,
                    owner: rows.ownerid,
                    type: rows.type,
                    resource: rows.resource,
                    amount: rows.amount,
                    ppu: rows.price,
                    date: rows.date,
                      time: rows.time
                }
                console.log(trade);
                arrayOfObjectTrades_global.push(trade);
            })
            db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
                kingdom=rows.kingdom;
                db.each(`SELECT * FROM trades WHERE scope=? AND recepient=?`,['personal', kingdom] , function(err,rows) {
                    if(err) {
                        console.error(err.message);
                    }
                        let trade = {
                            id: rows.tradeid,
                            owner: rows.ownerid,
                            type: rows.type,
                            resource: rows.resource,
                            amount: rows.amount,
                            ppu: rows.price,
                            date: rows.date,
                            time: rows.time
                        }
                        console.log(trade);
                        arrayOfObjectTrades_personal.push(trade)
                        console.log(arrayOfObjectTrades_personal)
    
                    })
            })
            db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
                kingdom=rows.kingdom;
                console.log(kingdom);
                db.each(`SELECT * FROM trades WHERE ownerid=?`,[kingdom] , function(err,rows) {
                    if(err) {
                        console.error(err.message);
                    }
                    console.log(kingdom);
                    console.log(rows);
                    let trade = {
                        id: rows.tradeid,
                        owner: rows.ownerid,
                        type: rows.type,
                        resource: rows.resource,
                        amount: rows.amount,
                        ppu: rows.price,
                        date: rows.date,
                        time: rows.time
                    }
                    console.log(trade);
                    arrayOfObjectTrades_my.push(trade);
                    console.log(arrayOfObjectTrades_my)
    
                })
            })
              db.get('SELECT * FROM kingdoms WHERE id=?', storedID, function(err,rows) {
                  console.log('sending to trade')
                  res.render('trade', {arrayOfObjectTrades_global,arrayOfObjectTrades_personal,arrayOfObjectTrades_my}) 
              })
          }
          if (order=='price'){
            db.each(`SELECT * FROM trades ORDER BY ppu ${direction} WHERE scope=? AND type=? AND resource=?`,[scope,type,resource], function(err,rows) {
                let trade = {
                    id: rows.tradeid,
                    owner: rows.ownerid,
                    type: rows.type,
                    resource: rows.resource,
                    amount: rows.amount,
                    ppu: rows.price,
                    date: rows.date,
                      time: rows.time
                }
                console.log(trade);
                arrayOfObjectTrades_global.push(trade);
            })
            db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
                kingdom=rows.kingdom;
                db.each(`SELECT * FROM trades WHERE scope=? AND recepient=?`,['personal', kingdom] , function(err,rows) {
                    if(err) {
                        console.error(err.message);
                    }
                        let trade = {
                            id: rows.tradeid,
                            owner: rows.ownerid,
                            type: rows.type,
                            resource: rows.resource,
                            amount: rows.amount,
                            ppu: rows.price,
                            date: rows.date,
                            time: rows.time
                        }
                        console.log(trade);
                        arrayOfObjectTrades_personal.push(trade)
                        console.log(arrayOfObjectTrades_personal)
    
                    })
            })
            db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
                kingdom=rows.kingdom;
                console.log(kingdom);
                db.each(`SELECT * FROM trades WHERE ownerid=?`,[kingdom] , function(err,rows) {
                    if(err) {
                        console.error(err.message);
                    }
                    console.log(kingdom);
                    console.log(rows);
                    let trade = {
                        id: rows.tradeid,
                        owner: rows.ownerid,
                        type: rows.type,
                        resource: rows.resource,
                        amount: rows.amount,
                        ppu: rows.price,
                        date: rows.date,
                        time: rows.time
                    }
                    console.log(trade);
                    arrayOfObjectTrades_my.push(trade);
                    console.log(arrayOfObjectTrades_my)
    
                })
            })
              db.get('SELECT * FROM kingdoms WHERE id=?', storedID, function(err,rows) {
                  console.log('sending to trade')
                  res.render('trade', {arrayOfObjectTrades_global,arrayOfObjectTrades_personal,arrayOfObjectTrades_my}) 
              })
          }
      })
    }})
})

router.get('/personaltrades', function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let arrayOfObjectTrades =[]; 
      let kingdom;
      db.serialize(()=>{
          db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
              kingdom=rows.kingdom;
              console.log(kingdom);
              db.each(`SELECT * FROM trades WHERE scope=? AND recepient=?`,['personal', kingdom] , function(err,rows) {
                  if(err) {
                      console.error(err.message);
                  }
                  console.log(kingdom);
                  console.log(rows);
                  let trade = {
                      id: rows.tradeid,
                      owner: rows.ownerid,
                      type: rows.type,
                      resource: rows.resource,
                      amount: rows.amount,
                      ppu: rows.price,
                      date: rows.date,
                      time: rows.time
                  }
                  console.log(trade);
                  arrayOfObjectTrades.push(trade);
                  console.log(arrayOfObjectTrades)
              })
          })
          db.get('SELECT * FROM kingdoms WHERE id=?', storedID, function(err,rows) {
              console.log(arrayOfObjectTrades);
              res.render('mytrades', {arrayOfObjectTrades}) 
          })
      })
    }})
})

router.get('/mytrades', function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let arrayOfObjectTrades =[]; 
      let kingdom;
      db.serialize(()=>{
          db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows) {
              kingdom=rows.kingdom;
              console.log(kingdom);
              db.each(`SELECT * FROM trades WHERE ownerid=?`,[kingdom] , function(err,rows) {
                  if(err) {
                      console.error(err.message);
                  }
                  console.log(kingdom);
                  console.log(rows);
                  let trade = {
                      id: rows.tradeid,
                      owner: rows.ownerid,
                      type: rows.type,
                      resource: rows.resource,
                      amount: rows.amount,
                      ppu: rows.price,
                      date: rows.date,
                      time: rows.time
                  }
                  console.log(trade);
                  arrayOfObjectTrades.push(trade);
                  console.log(arrayOfObjectTrades)
              })
          })
          db.get('SELECT * FROM kingdoms WHERE id=?', storedID, function(err,rows) {
              console.log(arrayOfObjectTrades);
              res.render('mytrades', {arrayOfObjectTrades}) 
          })
      })
    }})
})

router.post('/accepttrade', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      console.log('49');
        tradeid=req.body.tradeid;
        let host;
        let interacter = storedID;
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
            res.redirect('/trade')
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
            res.redirect('/trade')
            }
        })    
    }})
})

router.get('/createtrade', function(req,res) {
    res.render('createtrade');
})

router.post('/createtrade', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
          } else{
      storedID=parseInt(rows.id, 10);
      let date = Date();
      let splited = date.split(" "); 
      let postdate = `${splited[1]}/${splited[2]}/${splited[3]}`;
      let posttime= `${date.getHours()}:${date.getMinutes()}`
      db.get('SELECT * FROM kingdoms WHERE id=?',storedID, function(err,rows){
          let owner=rows.kingdom;
          db.run('INSERT INTO trades(ownerid, type, resource, amount, price, region, scope, recepient, date,time) VALUES (?,?,?,?,?,?,?,?,?)', [owner, req.body.type, req.body.resource, req.body.amount, req.body.ppu, req.body.region, req.body.scope, req.body.recepient,postdate,posttime], function(err) {
            if(err) {
                console.error(err.message);
            }
            res.redirect('/trade');
            })
      })
    }}) 
})

module.exports = router; 