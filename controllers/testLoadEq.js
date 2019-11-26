const handleTestLoadEq = (db) => (req, res) => {
    return db.select('*')
        .from('test_equipment')
        .whereRaw('(info ->> ?) = ?', ['name', 'omega weapon'])
    .then(equipment => {
        equipment[0].info
    })
}

module.exports = {
    handleTestLoadEq
}