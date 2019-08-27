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

CREATE TYPE FUND_TYPE AS ENUM (
  'dividends',
  'ad',
  'random-jackpot',
  'bet-amount-jackpot',
  'technical',
  'referral-rewards',
  'team',
  'auction',
  'bomb-hodler',
  'reserve'
);

CREATE TABLE "funds" (
  "id"            SERIAL       NOT NULL,
  "type"          FUND_TYPE    NOT NULL,
  "address"       CHAR(34)     NOT NULL,
  "encrypted_key" VARCHAR(256) NOT NULL,

  PRIMARY KEY("id"),
  UNIQUE("type"),
  UNIQUE("address")
);
