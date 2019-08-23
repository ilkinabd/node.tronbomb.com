CREATE TYPE CONTRACT_TYPE AS ENUM ('portal', 'dice', 'wheel', 'operations');

CREATE TABLE "contracts" (
  "id"      SERIAL        NOT NULL,
  "type"    CONTRACT_TYPE NOT NULL,
  "address" CHAR(34)      NOT NULL,
  "title"   VARCHAR(30),

  PRIMARY KEY("id"),
  UNIQUE("address")
);

CREATE TABLE "sockets" (
  "socket_id" CHAR(20)      NOT NULL,
  "rooms"     VARCHAR(25)[],

  PRIMARY KEY("socket_id")
);
