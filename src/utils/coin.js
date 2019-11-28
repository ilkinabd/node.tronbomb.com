const db = require("@db");
const { call, send, events } = require("@utils/tron");

const address = db.contracts.get({ type: "coin" });
console.log(`Coin contract address is ${address}`);
module.exports = {
  get: {
    address: () => address,
    game: call("games", address),
    totalGames: call("totalGames", address),
    portal: call("portal", address),
    rtp: call("rtp", address),
    owner: call("owner", address)
  },
  set: {
    portal: send("setPortal", address),
    rtp: send("setRTP", address)
  },
  func: {
    rng: call("rng", address),
    finishGame: send("finishGame", address)
  },
  events: {
    takeBet: events("TakeBet", address),
    finishGame: events("FinishGame", address),
    playersWin: events("PlayerWin", address),
    setRTP: events("SetRTP", address)
  }
};
