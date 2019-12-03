const handleLoadEq = (db) => (req, res) => {
    return db.select('info')
        .from('test_equipment')
        // .whereRaw('(info ->> ?) = ?', ['name', 'storm kickers'])
        .then(equipment => {
            res.json(equipment)
        })
    .catch(err => 
        res.status(400).json('Unable to retrieve equipment list.'))
}

module.exports = {
    handleLoadEq
}