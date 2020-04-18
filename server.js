const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const unit = require("./controllers/unit");
const equipment = require("./controllers/equipment");

const testUnit = require("./controllers/testUnit");
const unitList = require("./controllers/unitList");
const loadUnit = require("./controllers/loadUnit");
const testLoadEq = require("./controllers/testLoadEq");
const loadEq = require("./controllers/loadEq");
const loadDefaultUnit = require("./controllers/loadDefaultUnit");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "test123",
    database: "ffbe-v3",
  },
});



// db.select(
//   "eq_id",
//   "name",
//   "weapon.type",
//   "rarity",
//   "hp",
//   "mp",
//   "atk",
//   "def",
//   "mag",
//   "spr",
//   "fire_resist",
//   "is_twohanded",
//   "accuracy",
//   "lower_limit",
//   "upper_limit",
//   // "element",
//   // "status",
//   // "chance"
// )
//   .from("equipment")
//   .join("equippable", function () {
//     this.on("equipment.equipment_id", "=", "equippable.eq_id");
//   })
//   .join("weapon", function () {
//     this.on("equipment.equipment_id", "=", "weapon.weapon_id");
//   })
//   .join("weapon_variance", function () {
//       this.on("weapon.variance_id", "=", "weapon_variance.variance_id");
//     })
//     // .join("weapon_element_inflict", function () {
//     //   this.on("weapon.weapon_id", "=", "weapon_element_inflict.weapon_id");
//     // })
//   .where({ "weapon.weapon_id": 302006300 })
//   .orderBy("name", "asc")
//   .then((weaponList) => {
//     //   res.json(unitList);
//     // weapon_list = weaponList;
//     console.log({weaponList});
//   })
  // .catch((err) => res.status(400).json("Unable to retrieve weapon list."));




// db.select("sub_id")
//   .from("unit_stat")
//   .join("unit", function () {
//     this.on("unit.unit_id", "=", "unit_stat.unit_id");
//     // this.on("unit.name", "=", 'Esther')
//   })
//   // .where("unit.name", "=", "Esther")
//   // .where({ name: "Esther", rarity: 7 })
//   .where({ "unit.unit_id": 401006805, rarity: 7 })
//   .then((unit) => {
//     console.log(unit);
//   });


// db
//       .select(
//         "sub_id",
//         "name",
//         "sex_id",
//       )
//       .from("unit_stat")
//       .join("unit", function () {
//         this.on("unit.unit_id", "=", "unit_stat.unit_id");
//       })
//       // .join("equipment_option", function () {
//       //   this.on("unit.unit_id", "=", "equipment_option.unit_id");
//       // })
//       // .where({ sub_id: sub_id })
//       .where({ sub_id: 401006805 })
//       // .union(function () {
//       //   this.select('*').from('equipment_option')
//       //   .where({"equipment_option.unit_id": 401006805})
//       // })
//       .then((unit) => {
//         db.pluck('equipment_type').from('equipment_option')
//         .where({unit_id: 401006805})
//         .then((result) => {
//           unit[0].equipment_option = result;
//           // console.log(result.map(x => {if(x>0 && x<= 16) return x}))
//           // console.log(unit[0]);
//         })
//       })
      // .then(data => console.log(data));

  // db.pluck('equipment_type').from('equipment_option')
  // .where({unit_id: 401006805})

//--------------Old - V1-------------------------------
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "postgres",
//     password: "test123",
//     database: "ffbe"
//   }
// });

// db.select('*').from('units')
//     .then(data => { console.log(data)});

// db.select('*').from('stats')
// .join('units', function() {
//     this.on('units.unit_id', '=', 'stats.unit_id')
// })
// .where('units.name', '=', 'Esther')
// .then(data => { console.log(data)});

//Json test
// db.select('info').from('test_equipment').where({name: 'genji helm'})
//     .then(data => { console.log(data)});

// db.select('*')
//     .from('test_equipment')
//     .whereRaw('info -> ?', ['name'])
//      .then(console.log);

// db('test_equipment')
//     .select(knex.raw('?->"name"', ['info']))
//     .then(console.log);

// db.select('*')
//     .from('test_equipment')
//     .whereRaw('cast(info ->> ? as boolean) = ?', ['name', 'true'])
//     .then(console.log);

// '->>' returns all 'name' keys in text form instead of JSON
// Note: data is returned as an object, thus requires some
//  tinkering to grab the right data
//  db.select('*')
//     .from('test_equipment')
//     .whereRaw('(info ->> ?) = ?', ['name', 'omega weapon'])
//     // .then(res => console.log(res[0].info.stats));
//     .then(res => console.log(res[0].info));

//Removes 'info' key from objects
// db.select('info')
//     .from('test_equipment')
//     .then(result => { console.log(Object.keys(result).map(key => result[key].info)) });

// db.select("info")
//   .from("stats")
//   .join("units", function() {
//     this.on("units.unit_id", "=", "stats.unit_id");
//   })
//   .where("units.name", "=", "Esther")
//   .then(unit => {
//     console.log(unit[0].info);
//   });

const app = express();

// app.unsubscribe(bodyParser.json()); //was causing post req.body error: undefined
app.use(bodyParser.json());
app.use(cors());

// app.get('/', (req, res) => { res.send(db.units)  })
app.get("/", (req, res) => {
  res.send(db.select("*").from("units"));
});

app.get("/testUnit", testUnit.handleTestUnit(db));

app.get("/unitList", unitList.handleUnitList(db));

app.post("/loadUnit", loadUnit.handleLoadUnit(db));

app.get("/testLoadEq", testLoadEq.handleTestLoadEq(db));

app.get("/loadEq", loadEq.handleLoadEq(db));

app.get("/loadDefaultUnit", loadDefaultUnit.handleLoadDefaultUnit(db));

app.get("/unit", unit.handleGetUnitList(db));
app.get("/unit/:id", unit.handleGetUnit(db));

app.get("/equipment", equipment.handleGetEquipmentList(db));
app.get("/equipment/:id", equipment.handleGetEquipment(db));

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
