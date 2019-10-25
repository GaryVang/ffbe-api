const handleUnitGet = (req, res, db) => {
    const { unit_id } = req.params;
    db.select('*').from('stats').where({ unit_id })
        .then(unit => {
            if(unit.length) {
                res.json(unit[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
    handleUnitGet
}