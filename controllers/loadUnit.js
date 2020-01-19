const handleLoadUnit = (db) => (req, res) => {
    console.log('req', req.body);
    const { unitName } = req.body;
    // unitName = 'Esther';
    if(!unitName)
    {
        return res.status(400).json('no unit name sent');
    }
    return db.select('info').from('stats')
        .join('units', function() {
            this.on('units.unit_id', '=', 'stats.unit_id')
        })
        .where('units.name', '=', unitName)
        .then(unit => {
            res.json(unit[0].info)
        })
    .catch(err => res.status(400).json('unable to retrieve user'))
}

module.exports = {
    handleLoadUnit
}