const { toBase58, toDecimal, toTRX } = require('@utils/tron');

const game = (payload) => {
  const {
    gameId, finishBlock, player, amount, tokenId, number, roll, result, status
  } = payload;

  if (toDecimal(finishBlock) === 0) return null;

  const model = {
    gameId: toDecimal(gameId),
    finishBlock: toDecimal(finishBlock),
    player: toBase58(player),
    amount: (tokenId === 0) ? toTRX(amount) : toDecimal(amount),
    tokenId,
    number,
    roll,
    result: (status === 0) ? null : result,
    status: (status === 0) ? 'start' : 'finish',
  };

  return model;
};

const params = (payload) => {
  const { portal, rtp, rtpDivider, minBet, maxBet } = payload;

  const model = {
    portal: toBase58(portal),
    rtp: rtp / rtpDivider,
    minBet: toTRX(minBet),
    maxBet: toTRX(maxBet),
  };

  return model;
};

module.exports = {
  game,
  params,
};
