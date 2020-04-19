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

db.select(
  "weapon.weapon_id",
  "equippable.name",
  "weapon.type",
  "equipment.rarity",
  "equipment.hp",
  "equipment.mp",
  "equipment.atk",
  "equipment.def",
  "equipment.mag",
  "equipment.spr",
  "equipment.fire_resist",
  "equipment.ice_resist",
  "equipment.lightning_resist",
  "equipment.water_resist",
  "equipment.wind_resist",
  "equipment.earth_resist",
  "equipment.light_resist",
  "equipment.dark_resist",
  "equipment.poison_resist",
  "equipment.blind_resist",
  "equipment.sleep_resist",
  "equipment.silence_resist",
  "equipment.paralyze_resist",
  "equipment.confusion_resist",
  "equipment.disease_resist",
  "equipment.petrify_resist",
  "weapon.is_twohanded",
  "weapon.accuracy",
  "weapon_variance.lower_limit",
  "weapon_variance.upper_limit",
  // "element",
  db.raw("ARRAY_AGG(element) as element_inflict"),
  // db.raw("ARRAY_AGG(status || ',' ||  chance) as status")
  // db.raw("ARRAY_AGG('{\\\'' || status || '\\\':' || chance || '}') as status")
  db.raw("ARRAY_AGG(status) as status_inflict"),
  db.raw("ARRAY_AGG(chance) as status_inflict_chance")
  // "weapon_status_inflict.status",
  // "weapon_status_inflict.chance"
)
  .from("weapon")
  // .join("equippable", function () {
  //   this.on("equipment.equipment_id", "=", "equippable.eq_id");
  // })
  // .join("equipment", function () {
  //   this.on("equipment.equipment_id", "=", "weapon.weapon_id");
  // })
  // .join("weapon_variance", function () {
  //     this.on("weapon.variance_id", "=", "weapon_variance.variance_id");
  // })
  .innerJoin("equipment", "equipment.equipment_id", "=", "weapon.weapon_id")
  .innerJoin("equippable", "equippable.eq_id", "=", "weapon.weapon_id")
  .innerJoin(
    "weapon_variance",
    "weapon_variance.variance_id",
    "=",
    "weapon.variance_id"
  )
  // .innerJoin("weapon_status_inflict", 'weapon_status_inflict.weapon_id', '=', 'weapon.weapon_id')
  .fullOuterJoin(
    "weapon_status_inflict",
    "weapon_status_inflict.weapon_id",
    "weapon.weapon_id"
  )
  .fullOuterJoin(
    "weapon_element_inflict",
    "weapon_element_inflict.weapon_id",
    "weapon.weapon_id"
  )
  // .innerJoin('weapon_element_inflict', 'weapon_element_inflict.weapon_id', '=', 'weapon.weapon_id')
  // .groupBy('equippable.eq_id', 'weapon.type', 'equipment.rarity','weapon_variance.upper_limit', 'weapon_status_inflict.status', 'weapon_status_inflict.chance')
  .groupBy(
    'weapon.weapon_id',
    'equippable.name',
    'equipment.rarity',
    'equipment.hp',
    'equipment.mp',
    'equipment.atk',
    'equipment.def',
    'equipment.mag',
    'equipment.spr',
    'equipment.fire_resist',
    'equipment.ice_resist',
    'equipment.lightning_resist',
    'equipment.water_resist',
    'equipment.wind_resist',
    'equipment.earth_resist',
    'equipment.light_resist',
    'equipment.dark_resist',
    'equipment.poison_resist',
    'equipment.blind_resist',
    'equipment.sleep_resist',
    'equipment.silence_resist',
    'equipment.paralyze_resist',
    'equipment.confusion_resist',
    'equipment.disease_resist',
    'equipment.petrify_resist',
    'weapon_variance.lower_limit',
    'weapon_variance.upper_limit',
    // 'weapon_status_inflict.status',
    // 'weapon_status_inflict.chance',
  )
  .orderBy("name", "asc")
  .where('weapon.weapon_id', '=', '307002100')
  // .then(console.log);



db.select("weapon.weapon_id", "type", "element")
  .from("weapon")
  .join("weapon_element_inflict", function () {
    this.on("weapon.weapon_id", "=", "weapon_element_inflict.weapon_id");
  })
  .where({ "weapon.weapon_id": 302006300 })
  .as("weapon_test")
  .then((weaponList) => {
    // console.log(weaponList);
  });


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
