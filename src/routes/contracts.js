const express = require('express');
const router = new express.Router();

const controller = require('@controllers/contracts');
const { server } = require('@middleware/auth');

router.route('/get_all')
  .get(server, controller.getAll);

module.exports = router;
