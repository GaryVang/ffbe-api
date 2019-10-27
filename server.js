const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const unit = require('./controllers/unit');
const testUnit = require('./controllers/testUnit');
const unitList = require('./controllers/unitList');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test123',
      database : 'ffbe'
    }
});

db.select('*').from('units')
    .then(data => { console.log(data)});

const app = express();

// const database = {
//     units: [
//         {
//             name: 'Lightning'
//         }
//     ]
// }

app.unsubscribe(bodyParser.json());
app.use(cors());

// app.get('/', (req, res) => { res.send(db.units)  })
app.get('/', (req, res) => { res.send(db.select('*').from('units'))  })

// app.get('/', (req, res) => { return db.select('*').from('units') })

// app.get('/', (req, res) => { res.send(db.select('*').from('units')
//                                     .then(unit => {
//                                         res.json(unit[0])
//                                     })
//                      .catch(err => res.status(400).json('unable to get user')) ) 
//                                 })

// app.get('/unit/:id', (req, res, db) => { unit.handleUnitGet(req, res, db) })

app.get('/testUnit', testUnit.handleTestUnit(db));

app.get('/unitList', unitList.handleUnitList(db));



app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})