/*const express = require('express')
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
//SQLITE
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./pns.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//SQLITE

function calculateCost(unit, amount) {
    if (unit=='warrior') {
        return amount*1;
    }
}

function checkBalance(cost) {
    db.get("SELECT gold FROM resources WHERE id = ?", sess.id, function(err) {
        if (err) {
            console.error(err.message)
        } else {
            let current = rows.gold;
            if (current>cost) {
                return true;
            } else return false;
        }
    })   
}

module.exports = {calculateCost,checkBalance}*/