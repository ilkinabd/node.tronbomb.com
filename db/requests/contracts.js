module.exports = {
  'get': `
      SELECT "address" as "value"
      FROM "contracts"
      WHERE "type" = $type`,

  'get-all': `
      SELECT "type", "address", "title"
      FROM "contracts";`,
};
