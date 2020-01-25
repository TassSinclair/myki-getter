const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

const API_PORT = process.env.API_PORT || 8764;

const swaggerDefinition = {
    info: {
        title: 'Balance Getter API',
        version: '1.0.0',
    },
    host: 'localhost:8764',
    basePath: '/',
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

module.exports = async (db) => {
    require('./routes/balances')(app, db);
}

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));