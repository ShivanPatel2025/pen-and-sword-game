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

const cost = {
    'econ1':20,
    'econ2':50,
    'econ3':150,
    'econ4':600,
    'econ5':2500,
    'ent1':20,
    'ent2':50,
    'ent3':150,
    'ent4':600,
    'ent5':2500,
    'sci1':20,
    'sci2':50,
    'sci3':150,
    'sci4':600,
    'sci5':2500,
    'mil1':20,
    'mil2':50,
    'mil3':150,
    'mil4':600,
    'mil5':2500,
}

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
            db.get('SELECT * FROM research WHERE id=?',storedID, function(err,rows){
                //ECONOMY
                //ECON 1
                if (rows.econ1=='0'){
                    objEcon1 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : 'N/A',
                        'status' : 'ready',
                        'dbName' : 'econ1',
                        'cost' : cost.econ1
                    }
                    econArray.push(objEcon1)
                } else {
                    objEcon1 = {
                        'name' : 'Economy Research #1',
                        'description' : 'Description for Economy Research #1',
                        'date' : rows.econ1,
                        'status' : 'unlocked',
                        'dbName' : 'econ1',
                        'cost' : cost.econ1
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
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'econ2',
                        'cost' : cost.econ2
                    }
                    econArray.push(objEcon2)
                } else {
                    objEcon2 = {
                        'name' : 'Economy Research #2',
                        'description' : 'Description for Economy Research #2',
                        'date' : rows.econ2,
                        'status' : 'unlocked',
                        'dbName' : 'econ2',
                        'cost' : cost.econ2
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
                        'name' : 'Economy Research #3',
                        'description' : 'Description for Economy Research #3',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'econ3',
                        'cost' : cost.econ3
                    }
                    econArray.push(objEcon3)
                } else {
                    objEcon3 = {
                        'name' : 'Economy Research #3',
                        'description' : 'Description for Economy Research #3',
                        'date' : rows.econ3,
                        'status' : 'unlocked',
                        'dbName' : 'econ3',
                        'cost' : cost.econ3
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
                        'name' : 'Economy Research #4',
                        'description' : 'Description for Economy Research #4',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'econ4',
                        'cost' : cost.econ4
                    }
                    econArray.push(objEcon4)
                } else {
                    objEcon4 = {
                        'name' : 'Economy Research #4',
                        'description' : 'Description for Economy Research #4',
                        'date' : rows.econ4,
                        'status' : 'unlocked',
                        'dbName' : 'econ4',
                        'cost' : cost.econ5
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
                        'name' : 'Economy Research #5',
                        'description' : 'Description for Economy Research #5',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'econ5',
                        'cost' : cost.econ5
                    }
                    econArray.push(objEcon5)
                } else {
                    objEcon5 = {
                        'name' : 'Economy Research #5',
                        'description' : 'Description for Economy Research #5',
                        'date' : rows.econ4,
                        'status' : 'unlocked',
                        'dbName' : 'econ5',
                        'cost' : cost.econ5
                    }
                    numEcon++;
                    econArray.push(objEcon5)
                }
                //ENTERTAINMENT
                //ENT 1
                if (rows.ent1=='0'){
                    objEnt1 = {
                        'name' : 'Entertainment Research #1',
                        'description' : 'Description for Entertainment Research #1',
                        'date' : 'N/A',
                        'status' : 'ready',
                        'dbName' : 'ent1',
                        'cost' : cost.ent1

                    }
                    entArray.push(objEnt1)
                } else {
                    objEnt1 = {
                        'name' : 'Entertainment Research #1',
                        'description' : 'Description for Entertainment Research #1',
                        'date' : rows.ent1,
                        'status' : 'unlocked',
                        'dbName' : 'ent1',
                        'cost' : cost.ent1
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
                        'name' : 'Entertainment Research #2',
                        'description' : 'Description for Entertainment Research #2',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'ent2',
                        'cost' : cost.ent1
                    }
                    entArray.push(objEnt2)
                } else {
                    objEnt2 = {
                        'name' : 'Entertainment Research #2',
                        'description' : 'Description for Entertainment Research #2',
                        'date' : rows.ent2,
                        'status' : 'unlocked',
                        'dbName' : 'ent2',
                        'cost' : cost.ent2
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
                        'name' : 'Entertainment Research #3',
                        'description' : 'Description for Entertainment Research #3',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'ent3',
                        'cost' : cost.ent3
                    }
                    entArray.push(objEnt3)
                } else {
                    objEnt3 = {
                        'name' : 'Entertainment Research #3',
                        'description' : 'Description for Entertainment Research #3',
                        'date' : rows.ent3,
                        'status' : 'unlocked',
                        'dbName' : 'ent3',
                        'cost' : cost.ent3
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
                        'name' : 'Entertainment Research #4',
                        'description' : 'Description for Entertainment Research #4',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'ent4',
                        'cost' : cost.ent4
                    }
                    entArray.push(objEnt4)
                } else {
                    objEnt4 = {
                        'name' : 'Entertainment Research #4',
                        'description' : 'Description for Entertainment Research #4',
                        'date' : rows.ent4,
                        'status' : 'unlocked',
                        'dbName' : 'ent4',
                        'cost' : cost.ent4
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
                        'name' : 'Entertainment Research #5',
                        'description' : 'Description for Entertainment Research #5',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'ent5',
                        'cost' : cost.ent5
                    }
                    entArray.push(objEnt5)
                } else {
                    objEnt5 = {
                        'name' : 'Entertainment Research #5',
                        'description' : 'Description for Entertainment Research #5',
                        'date' : rows.ent4,
                        'status' : 'unlocked',
                        'dbName' : 'ent5',
                        'cost' : cost.ent5
                    }
                    numEnt++;
                    entArray.push(objEnt5)
                }
                //SCIENCE
                //SCI 1
                if (rows.sci1=='0'){
                    objSci1 = {
                        'name' : 'Science Research #1',
                        'description' : 'Description for Science Research #1',
                        'date' : 'N/A',
                        'status' : 'ready',
                        'dbName' : 'sci1',
                        'cost' : cost.sci1
                    }
                    sciArray.push(objSci1)
                } else {
                    objSci1 = {
                        'name' : 'Science Research #1',
                        'description' : 'Description for Science Research #1',
                        'date' : rows.sci1,
                        'status' : 'unlocked',
                        'dbName' : 'sci1',
                        'cost' : cost.sci1
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
                        'name' : 'Science Research #2',
                        'description' : 'Description for Science Research #2',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'sci2',
                        'cost' : cost.sci2
                    }
                    sciArray.push(objSci2)
                } else {
                    objSci2 = {
                        'name' : 'Science Research #2',
                        'description' : 'Description for Science Research #2',
                        'date' : rows.sci2,
                        'status' : 'unlocked',
                        'dbName' : 'sci2',
                        'cost' : cost.sci2
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
                        'name' : 'Science Research #3',
                        'description' : 'Description for Science Research #3',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'sci3',
                        'cost' : cost.sci3
                    }
                    sciArray.push(objSci3)
                } else {
                    objSci3 = {
                        'name' : 'Science Research #3',
                        'description' : 'Description for Science Research #3',
                        'date' : rows.sci3,
                        'status' : 'unlocked',
                        'dbName' : 'sci3',
                        'cost' : cost.sci3
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
                        'name' : 'Science Research #4',
                        'description' : 'Description for Science Research #4',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'sci4',
                        'cost' : cost.sci4
                    }
                    sciArray.push(objSci4)
                } else {
                    objSci4 = {
                        'name' : 'Science Research #4',
                        'description' : 'Description for Science Research #4',
                        'date' : rows.sci4,
                        'status' : 'unlocked',
                        'dbName' : 'sci4',
                        'cost' : cost.sci4
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
                        'name' : 'Science Research #5',
                        'description' : 'Description for Science Research #5',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'sci5',
                        'cost' : cost.sci5
                    }
                    sciArray.push(objSci5)
                } else {
                    objSci5 = {
                        'name' : 'Science Research #5',
                        'description' : 'Description for Science Research #5',
                        'date' : rows.sci4,
                        'status' : 'unlocked',
                        'dbName' : 'sci5',
                        'cost' : cost.sci5
                    }
                    numSci++;
                    sciArray.push(objSci5)
                }
                //MILITARY
                //MIL 1
                if (rows.mil1=='0'){
                    objMil1 = {
                        'name' : 'Military Research #1',
                        'description' : 'Description for Military Research #1',
                        'date' : 'N/A',
                        'status' : 'ready',
                        'dbName' : 'mil1',
                        'cost' : cost.mil1
                    }
                    milArray.push(objMil1)
                } else {
                    objMil1 = {
                        'name' : 'Military Research #1',
                        'description' : 'Description for Military Research #1',
                        'date' : rows.mil1,
                        'status' : 'unlocked',
                        'dbName' : 'mil1',
                        'cost' : cost.mil1
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
                        'name' : 'Military Research #2',
                        'description' : 'Description for Military Research #2',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'mil2',
                        'cost' : cost.mil2
                    }
                    milArray.push(objMil2)
                } else {
                    objMil2 = {
                        'name' : 'Military Research #2',
                        'description' : 'Description for Military Research #2',
                        'date' : rows.mil2,
                        'status' : 'unlocked',
                        'dbName' : 'mil2',
                        'cost' : cost.mil2
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
                        'name' : 'Military Research #3',
                        'description' : 'Description for Military Research #3',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'mil3',
                        'cost' : cost.mil3
                    }
                    milArray.push(objMil3)
                } else {
                    objMil3 = {
                        'name' : 'Military Research #3',
                        'description' : 'Description for Military Research #3',
                        'date' : rows.mil3,
                        'status' : 'unlocked',
                        'dbName' : 'mil3',
                        'cost' : cost.mil3
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
                        'name' : 'Military Research #4',
                        'description' : 'Description for Military Research #4',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'mil4',
                        'cost' : cost.mil4
                    }
                    milArray.push(objMil4)
                } else {
                    objMil4 = {
                        'name' : 'Military Research #4',
                        'description' : 'Description for Military Research #4',
                        'date' : rows.mil4,
                        'status' : 'unlocked',
                        'dbName' : 'mil4',
                        'cost' : cost.mil4
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
                        'name' : 'Military Research #5',
                        'description' : 'Description for Military Research #5',
                        'date' : 'N/A',
                        'status' : status,
                        'dbName' : 'mil5',
                        'cost' : cost.mil5
                    }
                    milArray.push(objMil5)
                } else {
                    objMil5 = {
                        'name' : 'Military Research #5',
                        'description' : 'Description for Military Research #5',
                        'date' : rows.mil4,
                        'status' : 'unlocked',
                        'dbName' : 'mil5',
                        'cost' : cost.mil5
                    }
                    numMil++;
                    milArray.push(objMil5)
                }
                db.get('SELECT * FROM resources WHERE id =?',storedID, function(err,rows){
                    let science=rows.science;
                    res.render('research', {numEcon,numEnt,numMil,numSci,econArray,entArray,sciArray,milArray,science})
                })
            })
        }
    })
})

router.post('/research_upgrade',urlencodedParser,function(req,res){
    let storedID;
    db.get(`SELECT * FROM sessions WHERE cookie=?`, req.session.id, function(err,rows) {
        if(rows==undefined) {
            res.redirect ('/')
            console.log('this bih not signed in')
        } else{
            storedID=parseInt(rows.id, 10);
            let upgrade = req.body.dbName;
            let costs = cost[upgrade];
            db.get('SELECT * FROM resources WHERE id=?',storedID,function(err,rows){
                let currentScience=rows.science;
                if (currentScience>=costs){
                    let date1 = Date();
                    let splited = date1.split(" "); 
                    let postdate = `${splited[1]}/${splited[2]}/${splited[3]}`;
                    let updatedScience=currentScience-costs;
                    db.run('UPDATE resources SET science=? WHERE id=?',[updatedScience,storedID]);
                    db.run(`UPDATE research SET ${upgrade}=? WHERE id=?`,[postdate,storedID]);
                    console.log('Researched');
                    res.redirect('/research')
                } else {
                    console.log('You lack science')
                    res.redirect('/research')
                }
            })
        }
    })
})


module.exports = router;