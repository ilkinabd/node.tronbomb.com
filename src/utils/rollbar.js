const Rollbar = require('rollbar');

const { ROLLBAR_TOKEN } = process.env;

const rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

module.exports = rollbar;
