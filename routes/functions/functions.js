let db = new sqlite3.Database('./pns.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

const calculateCost = (unit, amount)=> {
    if (unit=='warrior') {
        return amount*1;
    }
}

const  checkBalance = (cost) =>{
    db.get("SELECT gold FROM resources WHERE id = ?", sess.id, function(err) {
        
    })
    if (current>cost) {
        return true;
    } else return false;
}

module.exports = {calculateCost,checkBalance}