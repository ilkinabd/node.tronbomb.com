module.exports = {
  'add': `
      INSERT INTO "sockets" ("socket_id", "rooms")
      VALUES ($id, $rooms)
      RETURNING "socket_id" as "id";`,

  'set-rooms': `
      UPDATE "sockets"
      SET "rooms" = $rooms
      WHERE "socket_id" = $id;`,

  'delete': `
      DELETE FROM "sockets"
      WHERE "socket_id" = $id;`,

  'clear': `
      TRUNCATE TABLE "sockets";`,
};
