const { version } = process.env;

const express = require('express');
const bodyParser = require('body-parser');

const contracts = require('./src/routes/contracts');
const portal = require('./src/routes/portal');
const dice = require('./src/routes/dice');
const wheel = require('./src/routes/wheel');

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

app.get('/', (_req, res) => {
  res.json({ version });
});

app.use('/contracts', contracts);
app.use('/portal', portal);
app.use('/dice', dice);
app.use('/wheel', wheel);

module.exports = app;
