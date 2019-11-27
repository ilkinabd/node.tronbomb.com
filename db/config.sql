CREATE TYPE CONTRACT_TYPE AS ENUM ('portal', 'dice', 'wheel', 'coin', 'operations');

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

CREATE TABLE "funds" (
  "id"            SERIAL       NOT NULL,
  "type"          VARCHAR(40)  NOT NULL,
  "address"       CHAR(34)     NOT NULL,
  "encrypted_key" VARCHAR(256) NOT NULL,

  PRIMARY KEY("id"),
  UNIQUE("type"),
  UNIQUE("address")
);
