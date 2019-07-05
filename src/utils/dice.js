const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const call = (variable) => async(address, param) => {
  const contract = await tronWeb.contract().at(address);
  const result = await (param ?
    contract[variable](param) :
    contract[variable]()
  ).call().catch(console.error);

  return result;
};

// const send = (method) => async(...params) => {
//   const contract = await tronWeb.contract().at(address);
//   const result = await contract[method](...params).send({
//     shouldPollResponse: true,
//   }).catch(console.error);

//   return result;
// };

// const events = (eventName) => async(address) => {
//   const events = await tronWeb.getEventResult(address, {
//     eventName,
//   }).catch(console.error);

//   return events;
// };

module.exports = {
  get: {
    game: call('games')
  },
  set: {

  },
  controll: {

  },
  events: {

  },
};
