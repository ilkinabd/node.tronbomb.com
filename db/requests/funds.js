module.exports = {
  'get': `
      SELECT "address", "encrypted_key" as "encryptedKey"
      FROM "funds"
      WHERE "type" = $type`,
};
