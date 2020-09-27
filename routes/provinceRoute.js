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

router.get('/provinces',urlencodedParser,function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10);
      let currentProvinceCount;
    let i=0;
    let improvementsRaw =['plantation', 'pasture', 'mine', 'mana_rift'];
    let improvementsRefine = ['lumber_mill','slaughterhouse', 'silver_refinery', 'steel_refinery', 'iron_refinery', 'bronze_refinery'];
    let improvementsEcon = ['market', 'bazaar', 'emporium'];
    let improvementsEntertainment =['plaza', 'theatre', 'coliseum'];
    let improvementsResearch = ['school', 'library', 'laboratory'];
    let improvementsHousing = ['barracks','academy','hatchery', 'harbor', 'workshop'];
    let provinces = { 
        countArray: [],
        provinceNames: [],
         provinceLands: [],
         provinceHappiness: []}
    // let provinceNames=[];
    // let provinceLands=[];
    // let provinceHappiness=[];
    db.serialize(() => {
      db.each(`SELECT * FROM provinces WHERE userid = ?`, storedID, function(err,rows) {
        //console.log(rows)
        provinces.countArray.push(i);
        i++;
        provinces.provinceNames.push(rows.name);
        provinces.provinceLands.push(rows.land);
        provinces.provinceHappiness.push(rows.happiness);
        //console.log(provinceNames);
      })
      db.get(`SELECT * FROM kingdoms WHERE id = ?`, storedID, function(err,rows) {
        //console.log(rows.provinces);
        let current = Number(rows.provinces);
        //console.log(current);
        currentProvinceCount = {
            'count': current,
          } 
        res.render('provinces', {currentProvinceCount, provinces, improvementsRaw, improvementsRefine, improvementsEcon, improvementsEntertainment, improvementsResearch, improvementsHousing});
      }) 
    })
    })
})


router.post('/new-province', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10);
      let provinceCost;
        let currentGold;
        let provinces;
        db.serialize(()=> {
        db.get('SELECT gold FROM resources WHERE id =(?)',storedID, function(err,rows) {
            currentGold=rows.gold;
        })
        db.get('SELECT provinces FROM kingdoms WHERE id = (?)', storedID, function(err,rows) {
            if (err) {
                console.log('Error creating province line 28');
                console.error(err.message);
            } 
            provinceCost=Math.round(3*(Math.pow(1.4,(Number(rows.provinces)+1))));
            provinces=Number(rows.provinces)+1;
            let newGold = currentGold-provinceCost;
            checkBalance(provinceCost).then(check=>{
                if (check===true) {
                    db.run('UPDATE kingdoms SET provinces = (?) WHERE id = (?)',[provinces, storedID],function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated province count')
                    })
                    db.run('UPDATE resources SET gold = (?) WHERE id=(?)',[newGold, storedID], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated resources')
                    })
                    db.run('INSERT INTO provinces (userid, name, land, happiness) VALUES (?,?,?,?)', [storedID, req.body.provinceName, 100, '100'], function(err) {
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
})

function checkBalance(incost) {
    return new Promise((resolve, reject) => {
        let storedID;
        db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
            storedID=parseInt(rows.id, 10);
            let cost=incost;
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {     
                resolve(rows.gold >= cost)
            })
        })
    })
}

router.post('/buyLand', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        storedID=parseInt(rows.id, 10);
        let increase = req.body.land;
    let name = req.body.provinceName
    let current;
    let cost;
    let currentGold;
    let newLand;
    let newGold;
    db.get('SELECT * FROM provinces WHERE userid = ? AND name = ?', [storedID, name], function(err,rows) {
        current = Number(rows.land);
        //console.log(current + "line 131");
        cost = ((Number(current)+Number(increase))*1.5) - (Number(current)*1.5);
        console.log(cost + "line 134");
        newLand = Number(current)+Number(increase);
        console.log(newLand + "line 137")
        checkBalanceLand(cost).then(check=>{
            if (check===true) {
                db.serialize(()=> {
                db.get('SELECT * FROM resources WHERE id = ?', storedID, function(err,row) {
                    //console.log(row);
                    currentGold=row.gold;
                    console.log(currentGold);
                    newGold=currentGold-cost;
                    console.log(newGold + " line 144");
                    db.run('UPDATE resources SET gold = (?) WHERE id=(?)',[newGold, storedID], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated resources')
                    })
                    db.run('UPDATE provinces SET land = (?) WHERE userid = ? AND name = ?',[newLand, storedID, name], function(err) {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('updated land')
                        res.redirect('/provinces')
                    })
                })
                })
            }
            else {
                console.log('Not Sufficient Funds')
                res.redirect('/provinces')
            }
        }).catch(console.error);
    })
    })
    
})

function checkBalanceLand(incost) {
    return new Promise((resolve, reject) => {
        let storedID;
        db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
            storedID=parseInt(rows.id, 10);
            let cost=incost;
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
            resolve(rows.gold >= cost)
        })
        })
    })
}

router.post('/buyImprovement', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        storedID=parseInt(rows.id, 10);
        let name = req.body.provinceName;
    console.log(name);
    let building = req.body.improvementsName;
    console.log(building);
    let buildingCount;
    let totalImprovements;
    let land;
    let costArray;
    //console.log(name);
    db.get(`SELECT * FROM provinces WHERE userid = ? AND name = ?`, [storedID, name], function(err,rows) {
        if (err) {
            console.error(err.message + "line 135");
        }
        totalImprovements = Number(rows.plantation)
                            +Number(rows.pasture)
                            +Number(rows.mine)
                            +Number(rows.mana_rift)
                            +Number(rows.lumber_mill)
                            +Number(rows.slaughterhouse)
                            +Number(rows.silver_refinery)
                            +Number(rows.steel_refinery)
                            +Number(rows.iron_refinery)
                            +Number(rows.bronze_refinery)
                            +Number(rows.plaza)
                            +Number(rows.theatre)
                            +Number(rows.coliseum)
                            +Number(rows.market)
                            +Number(rows.bazar)
                            +Number(rows.emporium)
                            +Number(rows.school)
                            +Number(rows.library)
                            +Number(rows.laboratory)
                            +Number(rows.barracks)
                            +Number(rows.academy)
                            +Number(rows.hatchery)
                            +Number(rows.harbor)
                            +Number(rows.workshop);
        buildingCount = rows[building]+1;
        land=rows.land;
        console.log(totalImprovements);
        console.log(land);
        let currentGold=0,currentLumber=0,currentSteel=0;
        let newGold=0,newLumber=0,newSteel=0;
        db.get('SELECT * FROM resources WHERE id = ?', storedID, function(err,rows) {
            currentGold=Number(rows.gold);
            currentLumber=Number(rows.lumber);
            currentSteel=Number(rows.steel);
            if(building=='plantation') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
                console.log(currentGold);
                console.log(costArray[0]);
                console.log(newGold);
            }
            if(building=='pasture') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='mine') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='mana_rift') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='lumber_mill') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='slaughterhouse') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='silver_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='steel_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='iron_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='bronze_refinery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='plaza') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='theatre') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='market') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='bazar') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='emporium') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='school') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='library') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='laboratory') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='barracks') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='academy') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='hatchery') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='harbor') {
                costArray =[3,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            if(building=='workshop') {
                costArray =[100000,3,3];
                newGold=currentGold-costArray[0];
                newLumber=currentLumber-costArray[1];
                newSteel=currentSteel-costArray[2];
            }
            checkBalanceImp(costArray).then(check=>{
                //now check if sufficient land
                if(check===true){
                    if(totalImprovements<(land/20)) {
                        db.all(`UPDATE provinces SET ${building} = ? WHERE userid = ? AND name = ?`, [buildingCount,storedID, name], function(err) {
                            if (err) {
                                console.error(err.message+" line 169");
                            }
                            res.redirect('/provinces')
                            console.log('buildingbought');
                        });
                        } else {
                            console.log('not enough land');
                            res.redirect('/provinces')
                
                        } 
                        db.run('UPDATE resources SET gold = (?), lumber=(?), steel=(?) WHERE id=(?)',[newGold,newLumber,newSteel,storedID], function(err) {
                            if (err) {
                                console.error(err.message);
                            }
                            console.log('updated resources')
                        }) 
                }      
                }).catch(console.error)
        })  
    })
    })
})


function checkBalanceImp(costArray) {
    return new Promise((resolve, reject) => {
        let storedID;
        db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
            storedID=parseInt(rows.id, 10);
            let arrayOfCosts = costArray;
            let goldCost=arrayOfCosts[0];
            let lumberCost=arrayOfCosts[1];
            let steelCost = arrayOfCosts[2];
            db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
                resolve((rows.gold >= goldCost) && (rows.lumber >= lumberCost) && (rows.steel >= steelCost))
            })
        })  
    })
}


module.exports = router;