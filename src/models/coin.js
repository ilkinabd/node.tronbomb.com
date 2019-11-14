const { toBase58, toDecimal } = require("@utils/tron");

const templates = {
  index: toDecimal,
  finishBlock: toDecimal,
  tokenId: toDecimal,
  totalGames: toDecimal,
  number: toDecimal,
  result: toDecimal,
  wallet: toBase58,
  portal: toBase58,
  owner: toBase58,
  address: toBase58,
  bet: value => value / 10 ** 6,
  prize: value => value / 10 ** 6,
  rtp: value => value / 10 ** 3,
  state: value => [null, "start", "finish"][value],
  roll: value => ["under", "over", "exact"][value]
};

const modelBuilder = (payload, keys) => {
  const model = {};
  for (const key of keys) model[key] = templates[key](payload[key]);

  return model;
};

module.exports = {
  game: payload =>
    modelBuilder(payload, [
      "index",
      "finishBlock",
      "wallet",
      "bet",
      "tokenId",
      "number",
      "result",
      "state"
    ]),
  params: payload =>
    modelBuilder(payload, ["portal", "owner", "totalGames", "rtp", "address"]),
  rng: payload => modelBuilder(payload, ["result"]),
  takeBet: payload =>
    modelBuilder(payload, [
      "wallet",
      "bet",
      "number",
      "tokenId",
      "finishBlock",
      "index"
    ]),
  finishGame: payload => modelBuilder(payload, ["result", "index"]),
  playerWin: payload =>
    modelBuilder(payload, ["wallet", "prize", "tokenId", "index"]),
  setRTP: payload => modelBuilder(payload, ["rtp"])
};
