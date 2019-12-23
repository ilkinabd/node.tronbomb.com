const { version } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const bomb = require('@routes/bomb');
const portal = require('@routes/portal');
const dice = require('@routes/dice');
const coin = require('@routes/coin');
const wheel = require('@routes/wheel');
const operations = require('@routes/operations');
const tools = require('@routes/tools');
const fund = require('@routes/fund');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(express.static('logs'));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (_req, res) => res.json({ version }));

app.use('/bomb', bomb);
app.use('/portal', portal);
app.use('/dice', dice);
app.use('/coin', coin);
app.use('/wheel', wheel);
app.use('/operations', operations);
app.use('/tools', tools);
app.use('/fund', fund);

module.exports = app;
