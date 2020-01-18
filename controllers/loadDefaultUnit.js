const handleLoadDefaultUnit = (db) => (req, res) => {
 
    return db.select('info').from('stats')
    .join('units', function() {
        this.on('units.unit_id', '=', 'stats.unit_id')
    })
    // case-sensitive; update db formatting to all lower-case
    .where('units.name', '=', 'Lightning') 
    .then(unit => {
        res.json(unit[0].info)
    })
    .catch(err => res.status(400).json('unable to retrieve user'))
}

module.exports = {
    handleLoadDefaultUnit
}