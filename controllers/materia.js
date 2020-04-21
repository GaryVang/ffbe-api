//consider changing mat_id to materia_id
const handleGetMateriaList = (db) => async (req, res) => {
  return (
    db
      .select(
        "materia.mat_id",
        "equippable.name",
        "materia.limited as unique",
        db.raw(
          "ARRAY_AGG(materia_unit_restriction.unit_restriction) filter (where materia_unit_restriction.unit_restriction is not null) as unit_restriction"
        ),
        db.raw(
          "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', skill.unit_restriction)) filter (where skill_id is not null) as skills"
        )
      )
      .from("materia")
      .join("equippable", function () {
        this.on("materia.mat_id", "=", "equippable.eq_id");
      })
      .fullOuterJoin(
        "materia_unit_restriction",
        "materia_unit_restriction.mat_id",
        "materia.mat_id"
      )
      .fullOuterJoin(
        db
          .select(
            "eq_id",
            "skill_passive.skill_id",
            "name",
            "rarity",
            "skill_passive_effect.effect",
            "skill_passive.limited",
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
          .innerJoin("materia", "materia.mat_id", "equippable_skill.eq_id")
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
            "skill_passive_effect.effect",
            "skill_passive_effect.effect_code_1",
            "skill_passive_effect.effect_code_2",
            "skill_passive_effect.effect_code_3",
            "skill_passive_effect.effect_code_4"
          )
          .as("skill"),
        "skill.eq_id",
        "materia.mat_id"
      )
      .groupBy("materia.mat_id", "equippable.name")
      // .where({ rarity: 7 })
      .orderBy("name", "asc")
      .then((materiaList) => {
        res.json(materiaList);
        // console.log(materiaList);
      })
      .catch((err) => res.status(400).json("Unable to retrieve materia list"))
  );

  // return db
  // .select(
  //     "mat_id",
  //     "name",
  //     "limited as unique",
  //     db.raw(
  //         "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
  //     )
  // )
  // .from("materia")
  // .join("equippable", function () {
  //     this.on("materia.materia_id", "=", "equippable.eq_id");
  // })
  // .fullOuterJoin(
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
  //       ) //db.raw("ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_id")
  //       .from("equippable_skill")
  //       .innerJoin(
  //         "skill_passive",
  //         "skill_passive.skill_id",
  //         "equippable_skill.skill_id"
  //       )
  //       .innerJoin("materia", "materia.materia_id", "equippable_skill.eq_id")
  //       .innerJoin(
  //         "skill_passive_effect",
  //         "skill_passive_effect.skill_id",
  //         "equippable_skill.skill_id"
  //       )
  //       // .innerJoin('skill_requirement', 'skill_requirement.skill_id', 'equippable_skill.skill_id') // Only for tmr/stmr ability
  //       // .innerJoin('equipment', 'equipment.equipment_id', 'equippable.eq_id')
  //       // .fullOuterJoin('skill_unit_restriction', 'skill_unit_restriction.skill_id', 'equippable_skill.skill_id')
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
  //     "materia.materia_id"
  //   )
  // // .where({ rarity: 7 })
  // .orderBy("name", "asc")
  // .then((materiaList) => {
  //   res.json(materiaList);
  // })
  // .catch((err) => res.status(400).json("Unable to retrieve materia list"));
};

module.exports = {
  handleGetMateriaList,
};
