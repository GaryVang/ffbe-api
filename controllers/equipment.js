const handleGetEquipmentList =  (db) => async (req, res) => {
  let armor_list;
  let weapon_list;
  let accessory_list;

  await db.select(
    "eq_id",
    "name",
    "type",
    "rarity",
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
    "petrify_resist"
  )
    .from("equipment")
    .join("equippable", function () {
      this.on("equipment.equipment_id", "=", "equippable.eq_id");
    })
    .join("armor", function () {
      this.on("equipment.equipment_id", "=", "armor.armor_id");
    })
    // .where({ rarity: 7 })
    .orderBy("name", "asc")
    .then((armorList) => {
      //   res.json(unitList);
      armor_list = armorList;
    })
    .catch((err) => res.status(400).json("Unable to retrieve armor list."));

//-------------------Accessory--------------------
await db.select(
    "eq_id",
    "name",
    "type",
    "rarity",
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
    "petrify_resist"
  )
    .from("equipment")
    .join("equippable", function () {
      this.on("equipment.equipment_id", "=", "equippable.eq_id");
    })
    .join("accessory", function () {
      this.on("equipment.equipment_id", "=", "accessory.acc_id");
    })
    // .where({ rarity: 7 })
    .orderBy("name", "asc")
    .then((accList) => {
      //   res.json(unitList);
      accessory_list = accList;
    })
    .catch((err) => res.status(400).json("Unable to retrieve accessory list."));

//------------Weapon------------------------
// await db.select(
//     "eq_id",
//     "name",
//     "weapon.type",
//     "rarity",
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
//     "is_twohanded",
//     "accuracy",
//     "lower_limit",
//     "upper_limit",
//     // "element",
//     db.raw('ARRAY_AGG(element) as element'),
//     "status",
//     "chance"
//   )
//     .from("equipment")
//     .join("equippable", function () {
//       this.on("equipment.equipment_id", "=", "equippable.eq_id");
//     })
//     .join("weapon", function () {
//       this.on("equipment.equipment_id", "=", "weapon.weapon_id");
//     })
//     .join("weapon_variance", function () {
//         this.on("weapon.variance_id", "=", "weapon_variance.variance_id");
//     })
//     .innerJoin('weapon_element_inflict', 'weapon_element_inflict.weapon_id', '=', 'weapon.weapon_id')
//     .groupBy('weapon.weapon_id')
//     .orderBy("name", "asc")
//     .then((weaponList) => {
//       //   res.json(unitList);
//       weapon_list = weaponList;
//     })
//     .catch((err) => res.status(400).json("Unable to retrieve weapon list."));

    await db.select(
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
      db.raw("ARRAY_AGG(element) as element"),
      db.raw("ARRAY_AGG(status) as status_inflict"),
      db.raw("ARRAY_AGG(chance) as status_inflict_chance")
      // "weapon_status_inflict.status",
      // "weapon_status_inflict.chance"
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
      .then((weaponList) => {
              //   res.json(unitList);
        weapon_list = weaponList;
      })
      .catch((err) => res.status(400).json("Unable to retrieve weapon list."));

    res.json({weapon_list, armor_list, accessory_list});
};

const handleGetEquipment = (db) => (req, res) => {
    
};

module.exports = {
  handleGetEquipmentList,
  handleGetEquipment,
};
