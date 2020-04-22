const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const unit = require("./controllers/unit");
const equipment = require("./controllers/equipment");
const materia = require("./controllers/materia");

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


//---------------Enhancements subquery
db.select(
  "skill_enhancement.unit_id",
  "skill_enhancement.skill_base",
  "skill_enhancement.skill_2 as skill_id",
  "skill_passive.name",
  "skill_passive.rarity as skill_rarity",
  db.raw(
    "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
  )
)
.from('skill_enhancement')
.innerJoin(
  "skill_passive",
  "skill_passive.skill_id",
  "skill_enhancement.skill_2"
)
// .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
.innerJoin(
  "skill_passive_effect",
  "skill_passive_effect.skill_id",
  "skill_enhancement.skill_2"
)
.innerJoin("unit_skill", function() {
  this.on(function() {
    this.on('unit_skill.unit_id', '=', 'skill_enhancement.unit_id')
    this.on('unit_skill.skill_id', '=', 'skill_enhancement.skill_base')
  })
})
.groupBy(
  "skill_enhancement.unit_id",
  "skill_enhancement.skill_base",
  "skill_enhancement.skill_2",
  "skill_passive.name",
  "skill_passive.rarity",
)
.where({"unit_skill.unit_id": 100012405})
// .then(console.log);

//---------------------------------
db
    .select(
      "unit_skill.unit_id",
      "level",
      "unit_skill.rarity as unit_rarity",
      "unit_skill.skill_id",
      "skill_passive.name",
      "skill_passive.rarity as skill_rarity",
      // "skill_passive_effect.effect",
      // "skill_passive.limited",
      // "effect_code_1",
      // "effect_code_2",
      // "effect_code_3",
      // "effect_code_4",
      // db.raw(
      //   "ARRAY_AGG(unit_id) filter (where unit_id is not null) as requirements"
      // )
      // db.raw(
      //   "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
      // ),
      // db.raw(
      //   "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effect"
      // )
      db.raw(
        "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
      ),
      db.raw(
        "ARRAY_AGG(JSON_BUILD_OBJECT('name', enhancement.name, 'skill_id', enhancement.skill_id, 'effect', enhancement.effects)) filter (where enhancement.skill_id is not null) as enhancements"
      )

    ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
    .from("unit_skill")
    .innerJoin(
      "skill_passive",
      "skill_passive.skill_id",
      "unit_skill.skill_id"
    )
    // .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
    .innerJoin(
      "skill_passive_effect",
      "skill_passive_effect.skill_id",
      "unit_skill.skill_id"
    )
    
    .fullOuterJoin( // enhancements
      db.select(
        "skill_enhancement.unit_id",
        "skill_enhancement.skill_base",
        "skill_enhancement.skill_2 as skill_id",
        "skill_passive.name",
        "skill_passive.rarity as skill_rarity",
        db.raw(
          "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
        )
      )
      .from('skill_enhancement')
      .innerJoin(
        "skill_passive",
        "skill_passive.skill_id",
        "skill_enhancement.skill_2"
      )
      // .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
      .innerJoin(
        "skill_passive_effect",
        "skill_passive_effect.skill_id",
        "skill_enhancement.skill_2"
      )
      .innerJoin("unit_skill", function() {
        this.on(function() {
          this.on('unit_skill.unit_id', '=', 'skill_enhancement.unit_id')
          this.on('unit_skill.skill_id', '=', 'skill_enhancement.skill_base')
        })
      })
      .groupBy(
        "skill_enhancement.unit_id",
        "skill_enhancement.skill_base",
        "skill_enhancement.skill_2",
        "skill_passive.name",
        "skill_passive.rarity",
      )
      // db.select(
      //   // "skill_enhancement.unit_id",
      //   "skill_enhancement.skill_base",
      //   "skill_enhancement.skill_2 as skill_id",
      //   "skill_passive.name",
      //   "skill_passive.rarity as skill_rarity",
      //   db.raw(
      //     "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
      //   )
      // )
      // .from('skill_enhancement')
      // .innerJoin(
      //   "skill_passive",
      //   "skill_passive.skill_id",
      //   "skill_enhancement.skill_2"
      // )
      // // .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
      // .innerJoin(
      //   "skill_passive_effect",
      //   "skill_passive_effect.skill_id",
      //   "skill_enhancement.skill_2"
      // )
      // .innerJoin("unit_skill", function() {
      //   this.on(function() {
      //     // this.on('unit_skill.unit_id', '=', 'skill_enhancement.unit_id')
      //     this.on('unit_skill.skill_id', '=', 'skill_enhancement.skill_base')
      //   })
      // })
      // .groupBy(
      //   "skill_enhancement.skill_base",
      //   "skill_enhancement.skill_2",
      //   "skill_passive.name",
      //   "skill_passive.rarity",
      // )




      // .innerJoin(
      //   "unit_skill",
      //   "unit_skill.unit_id",
      //   "skill_enhancement.unit_id"
      // )
      .as('enhancement'),
      // 'enhancement.skill_base',
      // 'unit_skill.skill_id'
      function() {
        this.on(function() {
          this.on('unit_skill.unit_id', '=', 'enhancement.unit_id')
          this.on('unit_skill.skill_id', '=', 'enhancement.skill_base')
        })}


    )
    .groupBy(
      "unit_skill.unit_id",
      "unit_skill.level",
      "unit_skill.rarity",
      "unit_skill.skill_id",
      "skill_passive.name",
      "skill_passive.rarity",
    )
    .where({"unit_skill.unit_id": 100012405})
    .then((unit) => {
      // console.log(unit);
    });

//------------Unit
db
  .select(
    "sub_id",
    "unit.name",
    "sex_id",
    "hp_base",
    "hp_pot",
    "hp_door",
    "mp_base",
    "mp_pot",
    "mp_door",
    "atk_base",
    "atk_pot",
    "atk_door",
    "def_base",
    "def_pot",
    "def_door",
    "mag_base",
    "mag_pot",
    "mag_door",
    "spr_base",
    "spr_pot",
    "spr_door",
    "fire_resist",
    "ice_resist",
    "lightning_resist",
    "water_resist",
    "wind_resist",
    "earth_resist",
    "light_resist",
    "dark_resist",
    "poison_resist",
    "blind_resist",
    "sleep_resist",
    "silence_resist",
    "paralyze_resist",
    "confusion_resist",
    "disease_resist",
    "petrify_resist",
    "physical_resist",
    "magical_resist",
    "white_magic_affinity",
    "black_magic_affinity",
    "green_magic_affinity",
    "blue_magic_affinity",

    db.raw(
      "ARRAY_AGG(DISTINCT equipment_type) filter (where equipment_type is not null) as equip"
    ),
    db.raw(
      "ARRAY_AGG(DISTINCT role) filter (where role is not null) as roles"
    ),
    // db.raw(
    //   "ARRAY_AGG(DISTINCT unit_skill.skill_id) filter (where unit_skill.skill_id is not null) as skills"
    // ),
    // db.raw(
    //   "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', skill.unit_restriction)) filter (where skill_id is not null) as skills"
    // )
    db.raw(
      "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('level', skill.level, 'unit_rarity', skill.unit_rarity, 'skill_id', skill.skill_id, 'name', skill.name, 'skill_rarity', skill.skill_rarity, 'effects', skill.effects)) filter (where skill.skill_id is not null ) as skills"
    ),
    db.raw(
      "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', latent_skill.skill_id, 'name', latent_skill.name, 'skill_rarity', latent_skill.skill_rarity, 'effects', latent_skill.effects)) filter (where latent_skill.skill_id is not null ) as latent_skills"
    ),
  )
  .from("unit_stat")
  .join("unit", function () {
    this.on("unit.unit_id", "=", "unit_stat.unit_id");
  })
  .join("equipment_option", function () {
    this.on("unit.unit_id", "=", "equipment_option.unit_id");
    
    // this.on("equipment_option.unit_id", "=", "unit_role.unit_id");
  })
  .join("unit_role", function () {
    this.on("unit.unit_id", "=", "unit_role.unit_id");
  })
  // .join("unit_skill", function () {
  //   this.on("unit.unit_id", "=", "unit_skill.unit_id");
  // })
  .fullOuterJoin(
    db
    .select(
      "unit_latent_skill.unit_id",
      "unit_latent_skill.skill_2 as skill_id",
      "skill_passive.name",
      "skill_passive.rarity as skill_rarity",
      // "skill_passive_effect.effect",
      // "skill_passive.limited",
      // "effect_code_1",
      // "effect_code_2",
      // "effect_code_3",
      // "effect_code_4",
      // db.raw(
      //   "ARRAY_AGG(unit_id) filter (where unit_id is not null) as requirements"
      // )
      // db.raw(
      //   "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
      // ),
      // db.raw(
      //   "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effect"
      // )
      db.raw(
        "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
      )
    ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
    .from("unit_latent_skill")
    .innerJoin(
      "skill_passive",
      "skill_passive.skill_id",
      "unit_latent_skill.skill_2"
    )
    // .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
    .innerJoin(
      "skill_passive_effect",
      "skill_passive_effect.skill_id",
      "unit_latent_skill.skill_2"
    )
    .groupBy(
      "unit_latent_skill.unit_id",
      "unit_latent_skill.skill_2",
      "skill_passive.name",
      "skill_passive.rarity",
    )
    .as("latent_skill"),
    "latent_skill.unit_id",
    "unit.unit_id"
  )
  .fullOuterJoin(
    db
    .select(
      "unit_skill.unit_id",
      "level",
      "unit_skill.rarity as unit_rarity",
      "unit_skill.skill_id",
      "skill_passive.name",
      "skill_passive.rarity as skill_rarity",
      // "skill_passive_effect.effect",
      // "skill_passive.limited",
      // "effect_code_1",
      // "effect_code_2",
      // "effect_code_3",
      // "effect_code_4",
      // db.raw(
      //   "ARRAY_AGG(unit_id) filter (where unit_id is not null) as requirements"
      // )
      // db.raw(
      //   "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
      // ),
      // db.raw(
      //   "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effect"
      // )
      db.raw(
        "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
      )
    ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
    .from("unit_skill")
    .innerJoin(
      "skill_passive",
      "skill_passive.skill_id",
      "unit_skill.skill_id"
    )
    // .fullOuterJoin("unit", "unit.unit_id", "unit_skill.skill_id")
    .innerJoin(
      "skill_passive_effect",
      "skill_passive_effect.skill_id",
      "unit_skill.skill_id"
    )
    .groupBy(
      "unit_skill.unit_id",
      "unit_skill.level",
      "unit_skill.rarity",
      "unit_skill.skill_id",
      "skill_passive.name",
      "skill_passive.rarity",
    )
      // .select(
      //   "unit_skill.unit_id",
      //   "level",
      //   "unit_skill.rarity as unit_rarity",
      //   "skill_passive.skill_id",
      //   "skill_passive.name",
      //   "skill_passive.rarity",
      //   "skill_passive_effect.effect",
      //   // "skill_passive.limited",
      //   "effect_code_1",
      //   "effect_code_2",
      //   "effect_code_3",
      //   "effect_code_4",
      //   // db.raw(
      //   //   "ARRAY_AGG(unit_id) filter (where unit_id is not null) as requirements"
      //   // )
      //   // db.raw(
      //   //   "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
      //   // ),
      // ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
      // .from("unit_skill")
      // .innerJoin(
      //   "skill_passive",
      //   "skill_passive.skill_id",
      //   "unit_skill.skill_id"
      // )
      // // .innerJoin("unit", "unit.unit_id", "unit_skill.skill_id")
      // .innerJoin(
      //   "skill_passive_effect",
      //   "skill_passive_effect.skill_id",
      //   "unit_skill.skill_id"
      // )
      // // .innerJoin('skill_requirement', 'skill_requirement.skill_id', 'equippable_skill.skill_id') // Only for tmr/stmr ability
   
      // // .fullOuterJoin("skill_unit_restriction", function () {
      // //   this.on(
      // //     "skill_unit_restriction.skill_id",
      // //     "=",
      // //     "equippable_skill.skill_id"
      // //   );
      // // })
      // // .whereNotNull("eq_id") // Necessary because fullOuterJoin will do a null = null, then results will have a row with all null values
      // // .groupBy(
      // //   "equippable_skill.eq_id",
      // //   "skill_passive.skill_id",
      // //   "skill_passive_effect.effect",
      // //   "skill_passive_effect.effect_code_1",
      // //   "skill_passive_effect.effect_code_2",
      // //   "skill_passive_effect.effect_code_3",
      // //   "skill_passive_effect.effect_code_4"
      // // )
      .as("skill"),
    "skill.unit_id",
    "unit.unit_id"
  )
  .groupBy(
    "unit_stat.sub_id",
    "unit.name",
    "unit.sex_id",
    "unit_stat.hp_base",
    "unit_stat.hp_pot",
    "unit_stat.hp_door",
    "unit_stat.mp_base",
    "unit_stat.mp_pot",
    "unit_stat.mp_door",
    "unit_stat.atk_base",
    "unit_stat.atk_pot",
    "unit_stat.atk_door",
    "unit_stat.def_base",
    "unit_stat.def_pot",
    "unit_stat.def_door",
    "unit_stat.mag_base",
    "unit_stat.mag_pot",
    "unit_stat.mag_door",
    "unit_stat.spr_base",
    "unit_stat.spr_pot",
    "unit_stat.spr_door",
    "fire_resist",
    "ice_resist",
    "lightning_resist",
    "water_resist",
    "wind_resist",
    "earth_resist",
    "light_resist",
    "dark_resist",
    "poison_resist",
    "blind_resist",
    "sleep_resist",
    "silence_resist",
    "paralyze_resist",
    "confusion_resist",
    "disease_resist",
    "petrify_resist",
    "physical_resist",
    "magical_resist",
    "white_magic_affinity",
    "black_magic_affinity",
    "green_magic_affinity",
    "blue_magic_affinity",
  )
  // .where({ sub_id: sub_id })
  // .where({sub_id: 401006807}) // Esther 7*
  .where({sub_id: 100012405}) // BS Sakura 7*
  .then((unit) => {
    // console.log(unit);
    // console.log(unit[0].latent_skills);
  })

//-------------Materia

// db
// .select(
//   "materia.mat_id",
//   "equippable.name",
//   "materia.limited as unique",
//   db.raw(
//     "ARRAY_AGG(materia_unit_restriction.unit_restriction) filter (where materia_unit_restriction.unit_restriction is not null) as unit_restriction"
//   ),
//   db.raw(
//     "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'skill_passive_effect.effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', skill.unit_restriction)) filter (where skill_id is not null) as skills"
//   )
// )
// .from("materia")
// .join("equippable", function () {
//   this.on("materia.mat_id", "=", "equippable.eq_id");
// })
// .fullOuterJoin(
//   "materia_unit_restriction",
//   "materia_unit_restriction.mat_id",
//   "materia.mat_id"
// )
// .fullOuterJoin(
//   db
//     .select(
//       "eq_id",
//       "skill_passive.skill_id",
//       "name",
//       "rarity",
//       "skill_passive_effect.effect",
//       "skill_passive.limited",
//       "effect_code_1",
//       "effect_code_2",
//       "effect_code_3",
//       "effect_code_4",
//       db.raw(
//         "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
//       )
//     ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
//     .from("equippable_skill")
//     .innerJoin(
//       "skill_passive",
//       "skill_passive.skill_id",
//       "equippable_skill.skill_id"
//     )
//     .innerJoin("materia", "materia.mat_id", "equippable_skill.eq_id")
//     .innerJoin(
//       "skill_passive_effect",
//       "skill_passive_effect.skill_id",
//       "equippable_skill.skill_id"
//     )
//     // .innerJoin('skill_requirement', 'skill_requirement.skill_id', 'equippable_skill.skill_id') // Only for tmr/stmr ability
//     // .innerJoin('equipment', 'equipment.equipment_id', 'equippable.eq_id')
//     // .fullOuterJoin('skill_unit_restriction', 'skill_unit_restriction.skill_id', 'equippable_skill.skill_id')
//     .fullOuterJoin("skill_unit_restriction", function () {
//       this.on(
//         "skill_unit_restriction.skill_id",
//         "=",
//         "equippable_skill.skill_id"
//       );
//     })
//     .whereNotNull("eq_id") // Necessary because fullOuterJoin will do a null = null, then results will have a row with all null values
//     .groupBy(
//       "equippable_skill.eq_id",
//       "skill_passive.skill_id",
//       "skill_passive_effect.effect",
//       "skill_passive_effect.effect_code_1",
//       "skill_passive_effect.effect_code_2",
//       "skill_passive_effect.effect_code_3",
//       "skill_passive_effect.effect_code_4"
//     )
//     .as("skill"),
//   "skill.eq_id",
//   "materia.mat_id"
// )
// .groupBy("materia.mat_id", "equippable.name")
// // .where({ rarity: 7 })
// .orderBy("name", "asc")
// .then((materiaList) => {
//     // res.json(materiaList);
//     // console.log(materiaList);
//   })

//--------Armor
// db
//   .select(
//     "armor.armor_id",
//     "equippable.name",
//     "type",
//     "equipment.rarity",
//     "hp",
//     "mp",
//     "atk",
//     "def",
//     "mag",
//     "spr",
//     "fire_resist",
//     "ice_resist",
//     "lightning_resist",
//     "water_resist",
//     "wind_resist",
//     "earth_resist",
//     "light_resist",
//     "dark_resist",
//     "poison_resist",
//     "blind_resist",
//     "sleep_resist",
//     "silence_resist",
//     "paralyze_resist",
//     "confusion_resist",
//     "disease_resist",
//     "petrify_resist",
//     db.raw(
//       "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
//     )
//   )
//   .from("equipment")
//   .join("equippable", function () {
//     this.on("equipment.equipment_id", "=", "equippable.eq_id");
//   })
//   .join("armor", function () {
//     this.on("equipment.equipment_id", "=", "armor.armor_id");
//   })
//   .fullOuterJoin(
//     db
//       .select(
//         "eq_id",
//         "skill_passive.skill_id",
//         "name",
//         "rarity",
//         "skill_passive.effect",
//         "limited",
//         "effect_code_1",
//         "effect_code_2",
//         "effect_code_3",
//         "effect_code_4",
//         db.raw(
//           "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
//         )
//       ) 
//       .from("equippable_skill")
//       .innerJoin(
//         "skill_passive",
//         "skill_passive.skill_id",
//         "equippable_skill.skill_id"
//       )
//       .innerJoin("accessory", "accessory.acc_id", "equippable_skill.eq_id")
//       .innerJoin(
//         "skill_passive_effect",
//         "skill_passive_effect.skill_id",
//         "equippable_skill.skill_id"
//       )
//       .fullOuterJoin("skill_unit_restriction", function () {
//         this.on(
//           "skill_unit_restriction.skill_id",
//           "=",
//           "equippable_skill.skill_id"
//         );
//       })
//       .whereNotNull("eq_id") // Necessary because fullOuterJoin will do a null = null, then results will have a row with all null values
//       .groupBy(
//         "equippable_skill.eq_id",
//         "skill_passive.skill_id",
//         "skill_passive_effect.effect_code_1",
//         "skill_passive_effect.effect_code_2",
//         "skill_passive_effect.effect_code_3",
//         "skill_passive_effect.effect_code_4"
//       )
//       .as("skill"),
//     "skill.eq_id",
//     "armor.armor_id"
//   )
//   .groupBy(
//     "armor.armor_id",
//     "equippable.name",
//     "equipment.rarity",
//     "equipment.hp",
//     "equipment.mp",
//     "equipment.atk",
//     "equipment.def",
//     "equipment.mag",
//     "equipment.spr",
//     "equipment.fire_resist",
//     "equipment.ice_resist",
//     "equipment.lightning_resist",
//     "equipment.water_resist",
//     "equipment.wind_resist",
//     "equipment.earth_resist",
//     "equipment.light_resist",
//     "equipment.dark_resist",
//     "equipment.poison_resist",
//     "equipment.blind_resist",
//     "equipment.sleep_resist",
//     "equipment.silence_resist",
//     "equipment.paralyze_resist",
//     "equipment.confusion_resist",
//     "equipment.disease_resist",
//     "equipment.petrify_resist",
//   )
//   // .where({ rarity: 7 })
//   .orderBy("name", "asc")
//   .then((armorList) => {

//       console.log(armorList);
//     })


//---------Accessory
db
  .select(
    "accessory.acc_id",
    "equippable.name",
    "type",
    "equipment.rarity",
    "hp",
    "mp",
    "atk",
    "def",
    "mag",
    "spr",
    "fire_resist",
    "ice_resist",
    "lightning_resist",
    "water_resist",
    "wind_resist",
    "earth_resist",
    "light_resist",
    "dark_resist",
    "poison_resist",
    "blind_resist",
    "sleep_resist",
    "silence_resist",
    "paralyze_resist",
    "confusion_resist",
    "disease_resist",
    "petrify_resist",
    db.raw(
      "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
    )
  )
  .from("equipment")
  .join("equippable", function () {
    this.on("equipment.equipment_id", "=", "equippable.eq_id");
  })
  .join("accessory", function () {
    this.on("equipment.equipment_id", "=", "accessory.acc_id");
  })
  .fullOuterJoin(
    db
      .select(
        "eq_id",
        "skill_passive.skill_id",
        "name",
        "rarity",
        "skill_passive.effect",
        "limited",
        "effect_code_1",
        "effect_code_2",
        "effect_code_3",
        "effect_code_4",
        db.raw(
          "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
        )
      ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
      .from("equippable_skill")
      .innerJoin(
        "skill_passive",
        "skill_passive.skill_id",
        "equippable_skill.skill_id"
      )
      .innerJoin("accessory", "accessory.acc_id", "equippable_skill.eq_id")
      .innerJoin(
        "skill_passive_effect",
        "skill_passive_effect.skill_id",
        "equippable_skill.skill_id"
      )
      // .innerJoin('skill_requirement', 'skill_requirement.skill_id', 'equippable_skill.skill_id') // Only for tmr/stmr ability
      // .innerJoin('equipment', 'equipment.equipment_id', 'equippable.eq_id')
      // .fullOuterJoin('skill_unit_restriction', 'skill_unit_restriction.skill_id', 'equippable_skill.skill_id')
      .fullOuterJoin("skill_unit_restriction", function () {
        this.on(
          "skill_unit_restriction.skill_id",
          "=",
          "equippable_skill.skill_id"
        );
      })
      .whereNotNull("eq_id") // Necessary because fullOuterJoin will do a null = null, then results will have a row with all null values
      .groupBy(
        "equippable_skill.eq_id",
        "skill_passive.skill_id",
        "skill_passive_effect.effect_code_1",
        "skill_passive_effect.effect_code_2",
        "skill_passive_effect.effect_code_3",
        "skill_passive_effect.effect_code_4"
      )
      .as("skill"),
    "skill.eq_id",
    "accessory.acc_id"
  )
  .groupBy(
    "accessory.acc_id",
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
  )
  // .where({ rarity: 7 })
  .orderBy("name", "asc")
  .then((accList) => {
    //   res.json(unitList);
    // accessory_list = accList;
    // console.log(accList);
  })
  // .catch((err) => res.status(400).json("Unable to retrieve accessory list."));



//--------weapon

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

app.get("/materia", materia.handleGetMateriaList(db));

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
