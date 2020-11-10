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

router.get('/research',function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
        } else {
            storedID=parseInt(rows.id, 10);
            let econArray=[];
            let entArray=[];
            let sciArray=[];
            let milArray=[];
            let numEcon=0;
            let numEnt=0;
            let numSci=0;
            let numMil=0;
            db.get('SELECT * FROM research WHERE id=?',storedID, function(rows,err){
                //ECONOMY
                //ECON 1
                if (rows.econ1=='0'){
                    objEcon1 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : '',
                        'status' : 'ready'
                    }
                    econArray.push(objEcon1)
                } else {
                    objEcon1 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ1,
                        'status' : 'unlocked'
                    }
                    numEcon++;
                    econArray.push(objEcon1)
                }
                //ECON 2
                if (rows.econ2=='0'){
                    let status='';
                    if (objEcon1.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEcon2 = {
                        'name' : 'Economy Research #2',
                        'description' : 'Description for Economy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    econArray.push(objEcon2)
                } else {
                    objEcon2 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ2,
                        'status' : 'unlocked'
                    }
                    numEcon++;
                    econArray.push(objEcon2)
                }
                //ECON 3
                if (rows.econ3=='0'){
                    let status='';
                    if (objEcon2.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEcon3 = {
                        'name' : 'Economy Research #2',
                        'description' : 'Description for Economy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    econArray.push(objEcon3)
                } else {
                    objEcon3 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ3,
                        'status' : 'unlocked'
                    }
                    numEcon++;
                    econArray.push(objEcon3)
                }
                //ECON 4
                if (rows.econ4=='0'){
                    let status='';
                    if (objEcon3.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEcon4 = {
                        'name' : 'Economy Research #2',
                        'description' : 'Description for Economy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    econArray.push(objEcon4)
                } else {
                    objEcon4 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ4,
                        'status' : 'unlocked'
                    }
                    numEcon++;
                    econArray.push(objEcon4)
                }
                //ECON 5
                if (rows.econ5=='0'){
                    let status='';
                    if (objEcon4.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEcon5 = {
                        'name' : 'Economy Research #2',
                        'description' : 'Description for Economy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    econArray.push(objEcon5)
                } else {
                    objEcon5 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ4,
                        'status' : 'unlocked'
                    }
                    numEcon++;
                    econArray.push(objEcon5)
                }
                //ENTERTAINMENT
                //ENT 1
                if (rows.ent1=='0'){
                    objEnt1 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : '',
                        'status' : 'ready'
                    }
                    entArray.push(objEnt1)
                } else {
                    objEnt1 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : rows.ent1,
                        'status' : 'unlocked'
                    }
                    numEnt++;
                    entArray.push(objEnt1)
                }
                //ENT 2
                if (rows.ent2=='0'){
                    let status='';
                    if (objEnt1.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEnt2 = {
                        'name' : 'Entomy Research #2',
                        'description' : 'Description for Entomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    entArray.push(objEnt2)
                } else {
                    objEnt2 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : rows.ent2,
                        'status' : 'unlocked'
                    }
                    numEnt++;
                    entArray.push(objEnt2)
                }
                //ENT 3
                if (rows.ent3=='0'){
                    let status='';
                    if (objEnt2.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEnt3 = {
                        'name' : 'Entomy Research #2',
                        'description' : 'Description for Entomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    entArray.push(objEnt3)
                } else {
                    objEnt3 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : rows.ent3,
                        'status' : 'unlocked'
                    }
                    numEnt++;
                    entArray.push(objEnt3)
                }
                //ENT 4
                if (rows.ent4=='0'){
                    let status='';
                    if (objEnt3.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEnt4 = {
                        'name' : 'Entomy Research #2',
                        'description' : 'Description for Entomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    entArray.push(objEnt4)
                } else {
                    objEnt4 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : rows.ent4,
                        'status' : 'unlocked'
                    }
                    numEnt++;
                    entArray.push(objEnt4)
                }
                //ENT 5
                if (rows.ent5=='0'){
                    let status='';
                    if (objEnt4.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objEnt5 = {
                        'name' : 'Entomy Research #2',
                        'description' : 'Description for Entomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    entArray.push(objEnt5)
                } else {
                    objEnt5 = {
                        'name' : 'Entomy Research #1',
                        'description' : 'Description for Entomy Research #1',
                        'date' : rows.ent4,
                        'status' : 'unlocked'
                    }
                    numEnt++;
                    entArray.push(objEnt5)
                }
                //SCIENCE
                //SCI 1
                if (rows.sci1=='0'){
                    objSci1 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : '',
                        'status' : 'ready'
                    }
                    sciArray.push(objSci1)
                } else {
                    objSci1 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : rows.sci1,
                        'status' : 'unlocked'
                    }
                    numSci++;
                    sciArray.push(objSci1)
                }
                //SCI 2
                if (rows.sci2=='0'){
                    let status='';
                    if (objSci1.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objSci2 = {
                        'name' : 'Sciomy Research #2',
                        'description' : 'Description for Sciomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    sciArray.push(objSci2)
                } else {
                    objSci2 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : rows.sci2,
                        'status' : 'unlocked'
                    }
                    numSci++;
                    sciArray.push(objSci2)
                }
                //SCI 3
                if (rows.sci3=='0'){
                    let status='';
                    if (objSci2.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objSci3 = {
                        'name' : 'Sciomy Research #2',
                        'description' : 'Description for Sciomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    sciArray.push(objSci3)
                } else {
                    objSci3 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : rows.sci3,
                        'status' : 'unlocked'
                    }
                    numSci++;
                    sciArray.push(objSci3)
                }
                //SCI 4
                if (rows.sci4=='0'){
                    let status='';
                    if (objSci3.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objSci4 = {
                        'name' : 'Sciomy Research #2',
                        'description' : 'Description for Sciomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    sciArray.push(objSci4)
                } else {
                    objSci4 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : rows.sci4,
                        'status' : 'unlocked'
                    }
                    numSci++;
                    sciArray.push(objSci4)
                }
                //SCI 5
                if (rows.sci5=='0'){
                    let status='';
                    if (objSci4.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objSci5 = {
                        'name' : 'Sciomy Research #2',
                        'description' : 'Description for Sciomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    sciArray.push(objSci5)
                } else {
                    objSci5 = {
                        'name' : 'Sciomy Research #1',
                        'description' : 'Description for Sciomy Research #1',
                        'date' : rows.sci4,
                        'status' : 'unlocked'
                    }
                    numSci++;
                    sciArray.push(objSci5)
                }
                //MILITARY
                //MIL 1
                if (rows.mil1=='0'){
                    objMil1 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : '',
                        'status' : 'ready'
                    }
                    milArray.push(objMil1)
                } else {
                    objMil1 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : rows.mil1,
                        'status' : 'unlocked'
                    }
                    numMil++;
                    milArray.push(objMil1)
                }
                //MIL 2
                if (rows.mil2=='0'){
                    let status='';
                    if (objMil1.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objMil2 = {
                        'name' : 'Milomy Research #2',
                        'description' : 'Description for Milomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    milArray.push(objMil2)
                } else {
                    objMil2 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : rows.mil2,
                        'status' : 'unlocked'
                    }
                    numMil++;
                    milArray.push(objMil2)
                }
                //MIL 3
                if (rows.mil3=='0'){
                    let status='';
                    if (objMil2.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objMil3 = {
                        'name' : 'Milomy Research #2',
                        'description' : 'Description for Milomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    milArray.push(objMil3)
                } else {
                    objMil3 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : rows.mil3,
                        'status' : 'unlocked'
                    }
                    numMil++;
                    milArray.push(objMil3)
                }
                //MIL 4
                if (rows.mil4=='0'){
                    let status='';
                    if (objMil3.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objMil4 = {
                        'name' : 'Milomy Research #2',
                        'description' : 'Description for Milomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    milArray.push(objMil4)
                } else {
                    objMil4 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : rows.mil4,
                        'status' : 'unlocked'
                    }
                    numMil++;
                    milArray.push(objMil4)
                }
                //MIL 5
                if (rows.mil5=='0'){
                    let status='';
                    if (objMil4.status=='unlocked'){
                        status="ready";
                    } else {
                        status='locked';
                    }
                    objMil5 = {
                        'name' : 'Milomy Research #2',
                        'description' : 'Description for Milomy Research #2',
                        'date' : '',
                        'status' : status,
                    }
                    milArray.push(objMil5)
                } else {
                    objMil5 = {
                        'name' : 'Milomy Research #1',
                        'description' : 'Description for Milomy Research #1',
                        'date' : rows.mil4,
                        'status' : 'unlocked'
                    }
                    numMil++;
                    milArray.push(objMil5)
                }
                db.get('SELECT * FROM kingdoms WHERE id =?',storedID, function(err,rows){
                    res.render('research', {numEcon,numEnt,numMil,numSci,econArray,entArray,sciArray,milArray})
                })
            })
        }
    })
})

module.exports = router;