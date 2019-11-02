const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const unit = require('./controllers/unit');
const testUnit = require('./controllers/testUnit');
const unitList = require('./controllers/unitList');
const loadUnit = require('./controllers/loadUnit');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test123',
      database : 'ffbe'
    }
});

// db.select('*').from('units')
//     .then(data => { console.log(data)});

    db.select('*').from('stats')
    .join('units', function() {
        this.on('units.unit_id', '=', 'stats.unit_id')
    })
    .where('units.name', '=', 'Esther')
    .then(data => { console.log(data)});

const app = express();

// app.unsubscribe(bodyParser.json()); //was causing post req.body error: undefined
app.use(bodyParser.json());
app.use(cors());

// app.get('/', (req, res) => { res.send(db.units)  })
app.get('/', (req, res) => { res.send(db.select('*').from('units'))  })

app.get('/testUnit', testUnit.handleTestUnit(db));

app.get('/unitList', unitList.handleUnitList(db));

app.post('/loadUnit', loadUnit.handleLoadUnit(db));



app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})