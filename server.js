const { NODE_PORT, NODE_URL } = process.env;
require('module-alias/register');

const app = require('./app');

app.listen(NODE_PORT, NODE_URL, () => {
  console.log('Server started');
});
