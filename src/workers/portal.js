const { PRIVATE_KEY, PORTAL_CONTRACT, PROVIDER } = process.env;

const TronWeb = require('tronweb');

const tronWeb = new TronWeb(PROVIDER, PROVIDER, PROVIDER, PRIVATE_KEY);

const setGame = (gameId, contractAddress, timestamp) => {
  console.log(gameId, contractAddress, timestamp);
};

const loadGames = async() => {
  const events = await tronWeb.getEventResult(PORTAL_CONTRACT, {
    eventName: 'SetGame',
  });

  if (!events || events.length === 0) {
    console.error('Games smart contracts not found.');
  }

  for (const event of events) {
    const { timestamp, result } = event;
    const { gameId, contractAddress } = result;
    setGame(gameId, contractAddress, timestamp);
  }
};

const loadPortal = () => {
  loadGames();
};

loadPortal();
