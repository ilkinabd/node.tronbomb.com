const { PRIVATE_KEY, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const call = (variable) => async(address, param) => {
  const contract = await tronWeb.contract().at(address);
  const result = await (param !== undefined ?
    contract[variable](param) :
    contract[variable]()
  ).call().catch(console.error);

  return result;
};

const send = (method) => async(address, ...params) => {
  const contract = await tronWeb.contract().at(address);
  const result = await contract[method](...params).send({
    shouldPollResponse: true,
  }).catch(console.error);

  return result;
};

// const events = (eventName) => async(address) => {
//   const events = await tronWeb.getEventResult(address, {
//     eventName,
//   }).catch(console.error);

//   return events;
// };

module.exports = {
  get: {
    game: call('games'),
    totalGames: call('totalGames'),
    portal: call('portal'),
    rtp: call('rtp'),
    rtpDivider: call('rtpDivider'),
    minBet: call('minBet'),
    maxBet: call('maxBet'),
  },
  set: {
    portal: send('setPortalAddress'),
    rtp: send('setRTP'),
    bet: send('setMinMaxBet'),
  },
  controll: {

  },
  events: {

  },
};
