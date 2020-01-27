const express = require('express');

const app = express();

const API_PORT = process.env.API_PORT || 8764;

module.exports = async (db) => {
    require('./routes/balances')(app, db);
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));