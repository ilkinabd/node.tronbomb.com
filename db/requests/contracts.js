module.exports = {
  'get': `
      SELECT "address" as "value"
      FROM "contracts"
      WHERE "type" = $type`,
};
