const handleTestLoadEq = (db) => (req, res) => {
    return db.select('*')
        .from('test_equipment')
        .whereRaw('(info ->> ?) = ?', ['name', 'storm kickers'])
        .then(equipment => {
            res.json(equipment[0].info)
        })
    .catch(err => res.status(400).json('unable to retrieve equipment'))
}

module.exports = {
    handleTestLoadEq
}