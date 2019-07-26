const { TOKEN } = process.env;

const db = require('@db');

db.sockets.clear();

const connected = (socket) => {
  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  console.log(`User ${id} connected. Rooms: ${rooms}`);
  db.sockets.add({ id, rooms });
};
const disconnected = (socket) => {
  const { id } = socket;

  console.log(`User ${id} disconnected`);
  db.sockets.delete({ id });
};

const subscribe = async(data, socket) => {
  const { room, token } = data;
  if (token !== TOKEN) return;
  socket.join(room);

  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  await db.sockets.setRooms({ id, rooms });
};
const unsubscribe = async(data, socket) => {
  const { room, token } = data;
  if (token !== TOKEN) return;
  socket.leave(room);

  const { id, adapter } = socket;
  const rooms = Object.keys(adapter.rooms);

  await db.sockets.setRooms({ id, rooms });
};

module.exports = (socket) => {
  connected(socket);

  socket.on('subscribe', (data) => subscribe(data, socket));
  socket.on('unsubscribe', (data) => unsubscribe(data, socket));

  socket.on('disconnect', () => {
    disconnected(socket);
  });
};
