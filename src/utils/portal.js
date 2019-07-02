const { PRIVATE_KEY, PORTAL_CONTRACT, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

let contract;

(async() => {
  contract = await tronWeb.contract().at(PORTAL_CONTRACT);
})();

const getParam = (param) => async() => {
  if (!contract) return null;
  const result = await contract[param]().call();
  return result;
};

module.exports = {
  control: {
    getMianStatus: getParam('mainStatus'),
  },
};
