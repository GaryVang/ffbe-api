//consider ordering by name with the exception of the most recent units
const handleUnitList = db => (req, res) => {
  return db
    .select("unit_id", "name")
    .from("units")
    .then(unitList => {
      res.json(unitList);
    })
    .catch(err => res.status(400).json("Failed to retrieve unit list"));
};

module.exports = {
  handleUnitList
};
