const { npm_package_version: version } = process.env;

const express = require('express');

const app = express();

const { success: resSuccess } = require('@utils/res-builder');

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
  res.json(resSuccess({ version }));
});

module.exports = app;
