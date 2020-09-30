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


router.get('/revenue', urlencodedParser, function(req,res) {
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
      storedID=parseInt(rows.id, 10);
      db.serialize(()=>{
        let rev = {
            gold: 0,
            mana: 0,
            flora: 0,
            fauna: 0,
            lumber: 0,
            food: 0,
            ore: 0,
            silver: 0,
            iron: 0,
            bronze: 0,
            steel: 0
        }
        let provinces = [];
        let numPlantation=0;
        let numPasture=0;
        let numMine=0;
        let numManaRift=0;
        let numLumberMill=0;
        let numSlaughterhouse=0;
        let numSilverRefinery=0;
        let numSteelRefinery=0;
        let numIronRefinery=0;
        let numBronzeRefinery=0;
        let numMarket=0;
        let numBazaar=0;
        let numEmporium=0;
        let numPlaza=0;
        let numTheatre=0;
        let numColiseum=0;
        let numSchool=0;
        let numLibrary=0;
        let numLaboratory=0; 
        let numBarrack=0;
        let numAcademy=0;
        let numHatchery=0;
        let numHarbor=0;
        let numWorkshop=0;
        db.each('SELECT * FROM provinces WHERE userid = ?', storedID, function(err,rows) {
            if (err) {
                console.error(err.message)
            } else {
                provinces.push(rows.name);
                numPlantation+=rows.plantation;
                numPasture+=rows.pasture;
                numMine+=rows.mine;
                numManaRift+=rows.mana_rift;
                numLumberMill+=rows.lumber_mill;
                numSlaughterhouse+=rows.slaughterhouse;
                numSilverRefinery+=rows.silver_refinery;
                numSteelRefinery+=rows.steel_refinery;
                numIronRefinery+=rows.iron_refinery;
                numBronzeRefinery+=rows.bronze_refinery;
                numMarket+=rows.market;
                numBazaar+=rows.bazar;
                numEmporium+=rows.emporium;
                numPlaza+=rows.plaza;
                numTheatre+=rows.theatre;
                numColiseum+=rows.coliseum;
                numSchool+=rows.school;
                numLibrary+=rows.library;
                numLaboratory+=rows.laboratory;
                numBarrack+=rows.barracks;
                numAcademy+=rows.academy;
                numHatchery+=rows.hatchery;
                numHarbor+=rows.harbor;
                numWorkshop+=rows.workshop;
            }
        })
        db.get('SELECT * FROM kingdoms WHERE id =?', storedID, function(err,rows) {
            rev.gold = numMarket*5+numBazaar*12+numEmporium*45;
            //console.log(numMarket + " line 99");
            //console.log(numBazaar +" lin 100");
            //console.log(numEmporium + " line 101")
            //console.log(rev.gold + " line 102");
            rev.mana = numManaRift*3;
            rev.flora = numPlantation*2;
            rev.fauna = numPasture*2
            rev.lumber = numLumberMill*8;
            rev.food = numSlaughterhouse*30;
            rev.ore = numMine*8;
            rev.silver = numSilverRefinery*3;
            rev.iron = numIronRefinery*4;
            rev.bronze = numBronzeRefinery*3;
            rev.steel = numSteelRefinery*2;
            checkBalance(rev, storedID).then(check=>{
                if(check===true) {
                    console.log('Positive revnue')
                    res.render('revenue', {rev});
                }
                if(check===false) {
                    console.log('Not enough resources to supply current improvements')
                    res.render('revenue', {rev});
                }
            })
        })
    })
    })
}) 

function checkBalance(rev, key) {
    return new Promise((resolve, reject) => {
        let storedID = key; 
      let cost=rev;
      //console.log(cost);
      let newGold=0, newMana=0, newFlora=0, newFauna=0, newLumber=0, newFood=0, newOre=0, newSilver=0, newIron=0, newBronze=0, newSteel=0;
      db.get("SELECT * FROM resources WHERE id = ?", storedID, function(err, rows) {
          if(cost.gold<0) {
              newGold=rows.gold-cost.gold;
          }
          if(cost.mana<0) {
              newMana=rows.mana-cost.mana;
          }
          if(cost.flora<0) {
              newFlora=rows.flora-cost.flora;
          }
          if(cost.fauna<0) {
              newFauna=rows.fauna-cost.fauna;
          }
          if(cost.lumber<0) {
              newLumber=rows.lumber-cost.lumber;
          }
          if(cost.food<0) {
              newFood=rows.food-cost.food;
          }
          if(cost.ore<0) {
              newOre=rows.ore-cost.ore;
          }
          if(cost.silver<0) {
              newSilver=rows.silver-cost.silver;
          }
          if(cost.iron<0) {
              newIron=rows.iron-cost.iron;
          }
          if(cost.bronze<0) {
              newBronze=rows.bronze-cost.bronze;
          }
          if(cost.steel<0) {
              newSteel=rows.steel-cost.steel;
          }
          resolve((newGold>=0) && (newMana>=0) && (newFlora>=0) && (newFauna>=0) && (newLumber>=0) && (newFood>=0) && (newOre>=0) && (newSilver>=0) && (newIron>=0) && (newBronze>=0) && (newSteel>=0))
      })
    })
}

setInterval(function() {
    db.each('SELECT * FROM kingdoms', function(err,rows) {
        let userid=rows.id;
        db.serialize(()=>{
            let rev = {
                gold: 0,
                mana: 0,
                flora: 0,
                fauna: 0,
                lumber: 0,
                food: 0,
                ore: 0,
                silver: 0,
                iron: 0,
                bronze: 0,
                steel: 0
            }
            let provinces = [];
            let numPlantation=0;
            let numPasture=0;
            let numMine=0;
            let numManaRift=0;
            let numLumberMill=0;
            let numSlaughterhouse=0;
            let numSilverRefinery=0;
            let numSteelRefinery=0;
            let numIronRefinery=0;
            let numBronzeRefinery=0;
            let numMarket=0;
            let numBazaar=0;
            let numEmporium=0;
            let numPlaza=0;
            let numTheatre=0;
            let numColiseum=0;
            let numSchool=0;
            let numLibrary=0;
            let numLaboratory=0; 
            let numBarrack=0;
            let numAcademy=0;
            let numHatchery=0;
            let numHarbor=0;
            let numWorkshop=0;
            db.each('SELECT * FROM provinces WHERE userid = ?', userid, function(err,rows) {
                if (err) {
                    console.error(err.message)
                } else {
                    provinces.push(rows.name);
                    numPlantation+=rows.plantation;
                    numPasture+=rows.pasture;
                    numMine+=rows.mine;
                    numManaRift+=rows.mana_rift;
                    numLumberMill+=rows.lumber_mill;
                    numSlaughterhouse+=rows.slaughterhouse;
                    numSilverRefinery+=rows.silver_refinery;
                    numSteelRefinery+=rows.steel_refinery;
                    numIronRefinery+=rows.iron_refinery;
                    numBronzeRefinery+=rows.bronze_refinery;
                    numMarket+=rows.market;
                    numBazaar+=rows.bazar;
                    numEmporium+=rows.emporium;
                    numPlaza+=rows.plaza;
                    numTheatre+=rows.theatre;
                    numColiseum+=rows.coliseum;
                    numSchool+=rows.school;
                    numLibrary+=rows.library;
                    numLaboratory+=rows.laboratory;
                    numBarrack+=rows.barracks;
                    numAcademy+=rows.academy;
                    numHatchery+=rows.hatchery;
                    numHarbor+=rows.harbor;
                    numWorkshop+=rows.workshop;
                }
            })
            db.get('SELECT * FROM resources WHERE id =?', userid, function(err,rows) {
                rev.gold = numMarket*5+numBazaar*12+numEmporium*45;
                //console.log(numMarket + " line 99");
                //console.log(numBazaar +" lin 100");
                //console.log(numEmporium + " line 101")
                //console.log(rev.gold + " line 102");
                rev.mana = numManaRift*3;
                rev.flora = numPlantation*2;
                rev.fauna = numPasture*2
                rev.lumber = numLumberMill*8;
                rev.food = numSlaughterhouse*30;
                rev.ore = numMine*8;
                rev.silver = numSilverRefinery*3;
                rev.iron = numIronRefinery*4;
                rev.bronze = numBronzeRefinery*3;
                rev.steel = numSteelRefinery*2;
                let newGold=rows.gold+rev.gold;
                let newMana=rows.mana+rev.mana;
                let newFlora=rows.flora + rev.flora;
                let newFauna=rows.fauna+rev.flora;
                let newLumber=rows.lumber+rev.lumber;
                let newFood=rows.food+rev.food;
                let newOre=rows.ore+rev.ore;
                let newSilver=rows.silver+rev.silver
                let newIron=rows.iron+rev.iron;
                let newBronze=rows.bronze+rev.bronze;
                let newSteel=rows.steel+rev.steel;
                checkBalance(rev, userid).then(check=>{
                    if(check===true) {
                        console.log('Positive revnue is being added')
                        db.run('UPDATE resources SET gold = ?, mana =?, flora = ?, fauna = ?, lumber =?, food =?,ore=?,silver=?,iron=?,bronze=?,steel=? WHERE id = ?', [newGold, newMana, newFlora, newFauna, newLumber, newFood, newOre, newSilver, newIron, newBronze, newSteel,  userid], function(err) {
                            if(err) {
                              console.log('yo something went wrong');
                            } else {
                              console.log('ayo it should be updated');
                            }
                          })
                    }
                    if(check===false) {
                        console.log('ayo cant update coz this bih turn negative')
                    }
                })
            })
        })
    //   let userid=rows.id;
    //   let currentGold=rows.gold;
    //   let newGold=currentGold+30;
    //   db.run('UPDATE resources SET gold = ? WHERE id = ?', [newGold, userid], function(err) {
    //     if(err) {
    //       console.log('yo something went wrong');
    //     } else {
    //       console.log('ayo it should be updated');
    //     }
    //   })
    })
  },120000)

module.exports = router;
