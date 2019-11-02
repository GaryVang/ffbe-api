const handleTestUnit = (db) => (req, res) => {
    // const { unit_id } = req.body;

    // return db.select('*').from('stats').where('unit_id', '=', unit_id )
   
    // currently static, fix later
    return db.select('*').from('stats')
    .join('units', function() {
        this.on('units.unit_id', '=', 'stats.unit_id')
    })
    .then(unit => {
        res.json(unit[0])
    })
    .catch(err => res.status(400).json('unable to retrieve user'))
}

module.exports = {
    handleTestUnit
}