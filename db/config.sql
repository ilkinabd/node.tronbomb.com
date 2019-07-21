CREATE TYPE CONTRACT_TYPE AS ENUM ('portal', 'dice', 'wheel');

CREATE TABLE "contracts" (
  "id"      SERIAL        NOT NULL,
  "type"    CONTRACT_TYPE NOT NULL,
  "address" CHAR(34)      NOT NULL,

  PRIMARY KEY("id"),
  UNIQUE("address")
);

INSERT INTO "contracts"
VALUES
  (1, 'portal', 'TWQcSML3UQKa6XqZvrQD6EaiHyZYrEiWYY'),
  (2, 'dice', 'TPgUUX5pmQhzy7jgkPtqEA6UXJNiRxE7Xx'),
  (3, 'wheel', 'TYHStGDed2SBppyGy58CceRRpG4aVJQV92');
