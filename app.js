const { version } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const contracts = require('@routes/contracts');

const bomb = require('@routes/bomb');
const portal = require('@routes/portal');
const dice = require('@routes/dice');
const wheel = require('@routes/wheel');
const operations = require('@routes/operations');
const tools = require('@routes/tools');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
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

app.use('/contracts', contracts);

app.use('/bomb', bomb);
app.use('/portal', portal);
app.use('/dice', dice);
app.use('/wheel', wheel);
app.use('/operations', operations);
app.use('/tools', tools);

module.exports = app;
