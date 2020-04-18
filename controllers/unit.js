// Retrieves only 7* max rarity units
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
  // console.log("req.param: ", parseInt(req.params.id));
  const sub_id = parseInt(req.params.id);

  return (
    db
      .select(
        "sub_id",
        "name",
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
        "equipment_type"
      )
      .from("unit_stat")
      .join("unit", function () {
        this.on("unit.unit_id", "=", "unit_stat.unit_id");
      })
      .join("equipment_option", function () {
        this.on("unit.unit_id", "=", "equipment_option.unit_id");
      })
      .where({ sub_id: sub_id })
      .then((unit) => {
        db.pluck('equipment_type').from('equipment_option')
        .where({unit_id: 401006805})
        .then((result) => {
          unit[0].equipment_option = result;
          res.json(unit[0]);
        })
      })
      // .then((unit) => {
      //   res.json(unit[0]);
      // })
      .catch((err) => res.status(400).json("Unable to retrieve unit"))
  );
  // res.send("request received");
};

module.exports = {
  handleGetUnitList,
  handleGetUnit,
};

// const handleUnitGet = (req, res, db) => {
// const { unit_id } = req.params;
// db.select("*")
//   .from("stats")
//   .where({ unit_id })
//   .then(unit => {
//     if (unit.length) {
//       res.json(unit[0]);
//     } else {
//       res.status(400).json("Not found");
//     }
//   })
//   .catch(err => res.status(400).json("error getting user"));
