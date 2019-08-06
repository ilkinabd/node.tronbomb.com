const express = require('express');
const router = new express.Router();

const controller = require('@controllers/tools');
const validate = require('@middleware/validate');

// Functions

router.route('/func/withdraw')
  .post(validate('code', false), controller.func.withdraw);

module.exports = router;
