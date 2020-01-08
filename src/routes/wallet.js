const express = require('express');
const router = new express.Router();

const controller = require('@controllers/wallet');
const { server } = require('@middleware/auth');

// Getters

router.route('/func/withdraw').post(server, controller.func.withdraw);

module.exports = router;
