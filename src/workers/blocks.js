const { currentBlock } = require('@utils/tron');
const wallet = require('@workers/wallet');
// const dice = require("@workers/dice");
// const coin = require("@workers/coin");
// const wheel = require("@workers/wheel");
// const operations = require("@workers/operations");
// const bomb = require("@workers/bomb");
// const auction = require("@workers/auction");

module.exports = async io => {
  let lastBlock = (await currentBlock()).block_header;
  setInterval(async () => {
    const current = (await currentBlock()) - 1;
    for (let block = lastBlock + 1; block <= current; block++) {
      console.log(`Proceed block ${block}`);
      wallet(block, io.in('wallet'));
      // io.in('blocks').emit('blocks', block);

      // dice(block, io.in('dice'));
      // coin(block, io.in("coin"));
      // wheel(block, io.in('wheel'));
      // operations(block, io.in('operations'));
      // bomb(block, io.in('bomb'));
      // auction(block, io.in('auction'));
    }
    lastBlock = current;
  }, 3000);
};
