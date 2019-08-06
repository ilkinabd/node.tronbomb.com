CREATE TYPE CONTRACT_TYPE AS ENUM ('portal', 'dice', 'wheel', 'token', 'withdraw');

CREATE TABLE "contracts" (
  "id"      SERIAL        NOT NULL,
  "type"    CONTRACT_TYPE NOT NULL,
  "address" CHAR(34)      NOT NULL,
  "index"   INTEGER,
  "title"   VARCHAR(30),

  PRIMARY KEY("id"),
  UNIQUE("address")
);

INSERT INTO "contracts"
VALUES
  (DEFAULT, 'portal', 'TTF2udpEwuFtjd8YZjZm4mGCKfwc6KJsXY', NULL, 'Portal'),
  (DEFAULT, 'dice', 'TUoYPCJSPKuzvDmhGzSWPTokDKUfJbLtWi', NULL, 'Dice'),
  (DEFAULT, 'wheel', 'TE4Cerczq6YqNRpnLbamRy8Rw6eNZdp1Tr', NULL, 'Wheel'),
  (DEFAULT, 'token', 'TAchv6odQC1PFPApdBJ1tNQ4uKTv2Yv4es', NULL, 'BOMB'),
  (DEFAULT, 'withdraw', 'TFG1gZHC92QTYu1mLCGQA75xdQiq75n16Z', NULL, 'Withdraw');

CREATE TABLE "sockets" (
  "socket_id" CHAR(20)      NOT NULL,
  "rooms"     VARCHAR(25)[],

  PRIMARY KEY("socket_id")
);
