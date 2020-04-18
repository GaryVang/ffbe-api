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
await db.select(
    "eq_id",
    "name",
    "weapon.type",
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
    "petrify_resist",
    "is_twohanded",
    "accuracy",
    "lower_limit",
    "upper_limit",
    // "element",
    // "status",
    // "chance"
  )
    .from("equipment")
    .join("equippable", function () {
      this.on("equipment.equipment_id", "=", "equippable.eq_id");
    })
    .join("weapon", function () {
      this.on("equipment.equipment_id", "=", "weapon.weapon_id");
    })
    .join("weapon_variance", function () {
        this.on("weapon.variance_id", "=", "weapon_variance.variance_id");
    })
    // .where({ rarity: 7 })
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
