const { currentBlock } = require('@utils/tron');
const { log } = require("@utils/logger");
const dice = require('@workers/dice');
const wheel = require('@workers/wheel');
const operations = require('@workers/operations');
const bomb = require('@workers/bomb');
const auction = require('@workers/auction');

module.exports = async(io) => {
  let lastBlock = (await currentBlock()).block_header;
  log.error(
      `=========Last Block Info======
      data: 
        ${lastBlock}
       ============================== 
      `
  );
  setInterval(async() => {
    const current = await currentBlock() - 1;
    for (let block = lastBlock + 1; block <= current; block++) {
      log.error(
          `=========Block Info======
      current: 
        ${current}
      block: 
        ${block}  
       ============================== 
      `
      );
      io.in('blocks').emit('blocks', block);

      dice(block, io.in('dice'));
      wheel(block, io.in('wheel'));
      operations(block, io.in('operations'));
      bomb(block, io.in('bomb'));
      auction(block, io.in('auction'));
    }
    lastBlock = current;
  }, 3000);
};
