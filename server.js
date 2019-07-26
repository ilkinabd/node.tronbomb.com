const { NODE_PORT, NODE_URL } = process.env;
require('module-alias/register');

const app = require('./app');
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const ws = require('@controllers/socket');
io.on('connection', ws);

require('@workers/blocks')(io);

server.listen(NODE_PORT, NODE_URL, () => {
  console.info('Server started');
});
