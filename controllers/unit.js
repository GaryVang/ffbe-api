// Currently only retrieves only 7* max rarity units
const handleGetUnitList = (db) => (req, res) => {
  return db
    .select("sub_id", "name")
    .from("unit_stat")
    .join("unit", function () {
      this.on("unit.unit_id", "=", "unit_stat.unit_id");
    })
    .where({ rarity: 7 })
    .orderBy("name", "asc")
    .then((unitList) => {
      res.json(unitList);
    })
    .catch((err) => res.status(400).json("Unable to retrieve unit"));
};

// Retrieves a unit based on its sub_id
const handleGetUnit = (db) => (req, res) => {
  const sub_id = parseInt(req.params.id);

  return db
    .select(
      "sub_id",
      "unit_stat.rarity",
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
      db.raw(
        "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('level', skill.level, 'unit_rarity', skill.unit_rarity, 'skill_id', skill.skill_id, 'name', skill.name, 'skill_rarity', skill.skill_rarity, 'effects', skill.effects, 'enhancements', skill.enhancements, 'requirements', skill.requirements)) filter (where skill.skill_id is not null ) as skills"
      ),
      db.raw(
        "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', latent_skill.skill_id, 'name', latent_skill.name, 'skill_rarity', latent_skill.skill_rarity, 'effects', latent_skill.effects)) filter (where latent_skill.skill_id is not null ) as latent_skills"
      )
    )
    .from("unit_stat")
    .join("unit", function () {
      this.on("unit.unit_id", "=", "unit_stat.unit_id");
    })
    .join("equipment_option", function () {
      this.on("unit.unit_id", "=", "equipment_option.unit_id");
    })
    .join("unit_role", function () {
      this.on("unit.unit_id", "=", "unit_role.unit_id");
    })
    .fullOuterJoin(
      db
        .select(
          "unit_latent_skill.unit_id",
          "unit_latent_skill.skill_2 as skill_id",
          "skill_passive.name",
          "skill_passive.rarity as skill_rarity",
          db.raw(
            "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
          )
        )
        .from("unit_latent_skill")
        .innerJoin(
          "skill_passive",
          "skill_passive.skill_id",
          "unit_latent_skill.skill_2"
        )
        .innerJoin(
          "skill_passive_effect",
          "skill_passive_effect.skill_id",
          "unit_latent_skill.skill_2"
        )
        .groupBy(
          "unit_latent_skill.unit_id",
          "unit_latent_skill.skill_2",
          "skill_passive.name",
          "skill_passive.rarity"
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
          db.raw(
            "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT(skill_requirement.requirement, skill_requirement.eq_id)) filter (where skill_requirement.requirement is not null) as requirements"
          ),
          db.raw(
            "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
          ),
          db.raw(
            "ARRAY_AGG(DISTINCT JSONB_BUILD_OBJECT('name', enhancement.name, 'skill_id', enhancement.skill_id, 'effect', enhancement.effects)) filter (where enhancement.skill_id is not null) as enhancements"
          )
        )
        .from("unit_skill")
        .innerJoin(
          "skill_passive",
          "skill_passive.skill_id",
          "unit_skill.skill_id"
        )
        .innerJoin(
          "skill_passive_effect",
          "skill_passive_effect.skill_id",
          "unit_skill.skill_id"
        )

        .leftJoin(
          "skill_requirement",
          "unit_skill.skill_id",
          "skill_requirement.skill_id"
        )

        .fullOuterJoin(
          // enhancements
          db
            .select(
              "skill_enhancement.unit_id",
              "skill_enhancement.skill_base",
              "skill_enhancement.skill_2 as skill_id",
              "skill_passive.name",
              "skill_passive.rarity as skill_rarity",
              db.raw(
                "ARRAY_AGG(JSON_BUILD_OBJECT('skill_id', skill_passive_effect.skill_id, 'effect', skill_passive_effect.effect, 'effect_code_1', effect_code_1, 'effect_code_2', effect_code_2, 'effect_code_3', effect_code_3, 'effect_code_4', effect_code_4)) filter (where skill_passive_effect.skill_id is not null) as effects"
              )
            )
            .from("skill_enhancement")
            .innerJoin(
              "skill_passive",
              "skill_passive.skill_id",
              "skill_enhancement.skill_2"
            )
            .innerJoin(
              "skill_passive_effect",
              "skill_passive_effect.skill_id",
              "skill_enhancement.skill_2"
            )
            .innerJoin("unit_skill", function () {
              this.on(function () {
                this.on("unit_skill.unit_id", "=", "skill_enhancement.unit_id");
                this.on(
                  "unit_skill.skill_id",
                  "=",
                  "skill_enhancement.skill_base"
                );
              });
            })
            .groupBy(
              "skill_enhancement.unit_id",
              "skill_enhancement.skill_base",
              "skill_enhancement.skill_2",
              "skill_passive.name",
              "skill_passive.rarity"
            )
            .as("enhancement"),
          function () {
            this.on(function () {
              this.on("unit_skill.unit_id", "=", "enhancement.unit_id");
              this.on("unit_skill.skill_id", "=", "enhancement.skill_base");
            });
          }
        )
        .groupBy(
          "unit_skill.unit_id",
          "unit_skill.level",
          "unit_skill.rarity",
          "unit_skill.skill_id",
          "skill_passive.name",
          "skill_passive.rarity"
        )
        .as("skill"),
      "skill.unit_id",
      "unit.unit_id"
    )
    .groupBy(
      "unit_stat.sub_id",
      "unit_stat.rarity",
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
      "blue_magic_affinity"
    )
    .where({ sub_id: sub_id })
    .then((unit) => {
      res.json(unit[0]);
    })
    .catch((err) => res.status(400).json("Unable to retrieve unit"));

  res.send("request received");
};

module.exports = {
  handleGetUnitList,
  handleGetUnit,
};
