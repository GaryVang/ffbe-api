// Consider filtering the list before sending to limit rendering amount
const handleGetEquipmentList = (db) => async (req, res) => {
  let armor_list;
  let weapon_list;
  let accessory_list;

  await db
    .select(
      "armor.armor_id as eq_id",
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
        "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_unit_requirement.unit_id) filter (where equipment_unit_requirement.unit_id is not null) as unit_requirements"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_sex_requirement.sex_id) filter (where equipment_sex_requirement.sex_id is not null) as sex_requirements"
      )
    )
    .from("equipment")
    .join("equippable", function () {
      this.on("equipment.equipment_id", "=", "equippable.eq_id");
    })
    .join("armor", function () {
      this.on("equipment.equipment_id", "=", "armor.armor_id");
    })
    .leftJoin(
      "equipment_sex_requirement",
      "equipment_sex_requirement.equipment_id",
      "armor.armor_id"
    )
    .leftJoin(
      "equipment_unit_requirement",
      "equipment_unit_requirement.equipment_id",
      "armor.armor_id"
    )
    .fullOuterJoin(
      db
        .select(
          "eq_id",
          "skill_passive.skill_id",
          "name",
          "rarity",
          "skill_passive_effect.effect",
          "limited",
          "effect_code_1",
          "effect_code_2",
          "effect_code_3",
          "effect_code_4",
          db.raw(
            "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
          )
        )
        .from("equippable_skill")
        .innerJoin(
          "skill_passive",
          "skill_passive.skill_id",
          "equippable_skill.skill_id"
        )
        .innerJoin("armor", "armor.armor_id", "equippable_skill.eq_id")
        .innerJoin(
          "skill_passive_effect",
          "skill_passive_effect.skill_id",
          "equippable_skill.skill_id"
        )
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
      "armor.armor_id"
    )
    .groupBy(
      "armor.armor_id",
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
      "equipment.petrify_resist"
    )
    .orderBy("name", "asc")
    .then((armorList) => {
      armor_list = armorList;
    })
    .catch((err) => res.status(400).json("Unable to retrieve armor list."));

  await db
    .select(
      "accessory.acc_id as eq_id",
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
        "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_unit_requirement.unit_id) filter (where equipment_unit_requirement.unit_id is not null) as unit_requirements"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_sex_requirement.sex_id) filter (where equipment_sex_requirement.sex_id is not null) as sex_requirements"
      )
    )
    .from("equipment")
    .join("equippable", function () {
      this.on("equipment.equipment_id", "=", "equippable.eq_id");
    })
    .join("accessory", function () {
      this.on("equipment.equipment_id", "=", "accessory.acc_id");
    })
    .leftJoin(
      "equipment_sex_requirement",
      "equipment_sex_requirement.equipment_id",
      "accessory.acc_id"
    )
    .leftJoin(
      "equipment_unit_requirement",
      "equipment_unit_requirement.equipment_id",
      "accessory.acc_id"
    )
    .fullOuterJoin(
      db
        .select(
          "eq_id",
          "skill_passive.skill_id",
          "name",
          "rarity",
          "skill_passive_effect.effect",
          "limited",
          "effect_code_1",
          "effect_code_2",
          "effect_code_3",
          "effect_code_4",
          db.raw(
            "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
          )
        )
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
      "equipment.petrify_resist"
    )
    .orderBy("name", "asc")
    .then((accList) => {
      accessory_list = accList;
    })
    .catch((err) => res.status(400).json("Unable to retrieve accessory list."));

  await db
    .select(
      "weapon.weapon_id as eq_id",
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
      db.raw(
        "ARRAY_AGG(element) filter (where element is not null) as element_inflict"
      ),
      db.raw(
        "JSON_OBJECT_AGG(status, chance) filter (where status is not null) as status_inflict"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', skill.skill_id, 'name', skill.name, 'rarity', skill.rarity, 'effect', skill.effect,'limited', skill.limited, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4, 'unit_restriction', unit_restriction)) filter (where skill_id is not null) as skills"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_unit_requirement.unit_id) filter (where equipment_unit_requirement.unit_id is not null) as unit_requirements"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT equipment_sex_requirement.sex_id) filter (where equipment_sex_requirement.sex_id is not null) as sex_requirements"
      )
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
    .leftJoin(
      "equipment_sex_requirement",
      "equipment_sex_requirement.equipment_id",
      "weapon.weapon_id"
    )
    .leftJoin(
      "equipment_unit_requirement",
      "equipment_unit_requirement.equipment_id",
      "weapon.weapon_id"
    )
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
    .fullOuterJoin(
      db
        .select(
          "eq_id",
          "skill_passive.skill_id",
          "name",
          "rarity",
          "skill_passive_effect.effect",
          "limited",
          "effect_code_1",
          "effect_code_2",
          "effect_code_3",
          "effect_code_4",
          db.raw(
            "ARRAY_AGG(unit_id) filter (where unit_id is not null) as unit_restriction"
          )
        )
        .from("equippable_skill")
        .innerJoin(
          "skill_passive",
          "skill_passive.skill_id",
          "equippable_skill.skill_id"
        )
        .innerJoin("weapon", "weapon.weapon_id", "equippable_skill.eq_id")
        .innerJoin(
          "skill_passive_effect",
          "skill_passive_effect.skill_id",
          "equippable_skill.skill_id"
        )
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
    )
    .orderBy("name", "asc")
    .then((weaponList) => {
      weapon_list = weaponList;
    })
    .catch((err) => res.status(400).json("Unable to retrieve weapon list."));

  res.json({ weapon_list, armor_list, accessory_list });
};

const handleGetEquipment = (db) => (req, res) => {};

module.exports = {
  handleGetEquipmentList,
  handleGetEquipment,
};
