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

const query = sql => (client
  .query(sql)
  .catch(error => {
    console.warn(sql);
    console.error(error);
  })
);
const request = template => params => {
  const sql = fillTemplate(template, params);
  console.log(sql);
  return query(sql);
};

module.exports = {
  contracts: {
    get: getValue(request(contracts['get'])),
    getAll: getAll(request(contracts['get-all'])),
  },
  funds: {
    get: getRow(request(funds['get'])),
  },
  sockets: {
    add: getId(request(sockets['add'])),
    setRooms: request(sockets['set-rooms']),
    delete: getAll(request(sockets['delete'])),
    clear: getValue(request(sockets['clear'])),
  },
};
