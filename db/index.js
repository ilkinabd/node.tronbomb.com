const { PG_HOST, PG_USER, PG_PORT, PG_PASS, PG_DB } = process.env;

const PgClient = require('pg').Client;

const { getValue, getAll, getRow, getId, fillTemplate } = require('./tools');

const contracts = require('./requests/contracts');
const funds = require('./requests/funds');
const sockets = require('./requests/sockets');

const client = new PgClient({
  host: PG_HOST,
  user: PG_USER,
  port: PG_PORT,
  password: PG_PASS,
  database: PG_DB,
});
client.connect().catch(console.error);

const request = template => params => {
  const { sql, values } = fillTemplate(template, params);

  return client.query(sql, values).catch(error => {
    console.warn(sql, values);
    console.error(error);
  });
};

module.exports = {
  contracts: {
    get: getValue(request(contracts['get'])),
    getAll: getAll(request(contracts['get-all'])),
  },
  funds: {
    get: getRow(request(funds['get'])),
    getAll: getAll(request(funds['get-all'])),
  },
  sockets: {
    add: getId(request(sockets['add'])),
    setRooms: request(sockets['set-rooms']),
    delete: getAll(request(sockets['delete'])),
    clear: getValue(request(sockets['clear'])),
  },
};
