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
  db.raw(
    "ARRAY_AGG(element) filter (where element is not null) as element_inflict"
  ),
  // db.raw("ARRAY_AGG(status) as status_inflict"),
  // db.raw("ARRAY_AGG(chance) as status_inflict_chance")
  // db.raw("ARRAY_AGG(chance) as status_inflict_chance"),
  // "weapon_status_inflict.status",
  // (db.select('status').from('weapon_status_inflict').where({"weapon_status_inflict.weapon_id": 301004800})).as('Godly')
  // db.raw("JSON_AGG((status, chance)) as godly"),

  db.raw(
    "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
  ),
  // db.raw("JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"),
  // db.raw("coalesce(status, 0) as godly")
  // db.raw("JSON_OBJECT_AGG('skill_id', equippable_skill.skill_id) filter (where equippable_skill.skill_id is not null) as skills"),
  // db.raw("JSON_OBJECT_AGG(test.skill_id, test.name, test.rarity) as skills"),
  db.raw(
    "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited)) as skills"
  )
  // db.raw("array_AGG(skill_id) as skills")
)
  .from("weapon")
  .innerJoin("equipment", "equipment.equipment_id", "=", "weapon.weapon_id")
  .innerJoin("equippable", "equippable.eq_id", "=", "weapon.weapon_id")
  .innerJoin(
    "weapon_variance",
    "weapon_variance.variance_id",
    "=",
    "weapon.variance_id"
  )
  // .fullOuterJoin('equippable_skill', "equippable_skill.eq_id", "weapon.weapon_id")
  // .innerJoin('skill_passive', "skill_passive.skill_id", '=', "equippable_skill.skill_id")

  .fullOuterJoin(
    db
      .select(
        "eq_id",
        "skill_passive.skill_id",
        "name",
        "rarity",
        "effect",
        "limited"
      )
      .from("equippable_skill")
      .innerJoin(
        "skill_passive",
        "skill_passive.skill_id",
        "equippable_skill.skill_id"
      )
      // .where('equippable_skill.skill_id', '=', 'skill_passive.skill_id')
      .as("skill"),
    "skill.eq_id",
    "weapon.weapon_id"
  )

  // .innerJoin('skill_passive', "skill_passive.skill_id", "=", "equippable_skill.skill_id")
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
  .groupBy(
    "weapon.weapon_id",
    "equippable.name",
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
    "weapon_variance.lower_limit",
    "weapon_variance.upper_limit"
    // 'weapon_status_inflict.status',
    // 'weapon_status_inflict.chance',
    // 'weapon_element_inflict.element'
    // 'equippable_skill.skill_id',
    // 'skill.skill_id',
    // 'skill.name',
    // 'skill.rarity',
    // 'skill.effect',
    // 'skill.limited',
  )
  .orderBy("name", "asc")
  // .where({"weapon.weapon_id": 301004800}) // Assassin's Dagger
  // .where({"weapon.weapon_id": 301000200}) // bronze knife
  // .where({"weapon.weapon_id": 301005100}) // Dynamo Dagger
  .where({ "weapon.weapon_id": 302002500 }) // Colbat Winglet 2x skills
  .then((weapon) => {
    //   res.json(unitList);
    // weapon_list = weaponList;
    // console.log(weapon);
  });

// db.select("weapon.weapon_id", "type", "element")
//   .from("weapon")
//   .join("weapon_element_inflict", function () {
//     this.on("weapon.weapon_id", "=", "weapon_element_inflict.weapon_id");
//   })
//   .where({ "weapon.weapon_id": 302006300 })
//   .as("weapon_test")
//   .then((weaponList) => {
//     // console.log(weaponList);
//   });
//-----------------------------------------------Unit

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
