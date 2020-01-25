module.exports = async (app, db) => {
    app.get('/balances', (req, res) => {
        const post = db.get('balances')
            .value()
        res.send(post)
    });
    app.get('/balances/card/:card', (req, res) => {
        const post = db.get('balances')
            .find({ card: req.params.card })
            .value()
        res.send(post)
    });
};