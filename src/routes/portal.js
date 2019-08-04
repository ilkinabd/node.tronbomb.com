const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/balance')
  .get(server, controller.get.balance);

router.route('/get/main_status')
  .get(server, controller.get.mainStatus);

router.route('/get/owner')
  .get(server, controller.get.owner);

router.route('/get/token')
  .get(server, validate('id', true), controller.get.token);

router.route('/get/game')
  .get(server, validate('id', true), controller.get.game);

router.route('/get/game_status')
  .get(server, validate('address', true), controller.get.gameStatus);

// Setters

router.route('/set/main_status')
  .post(admin, validate('status', false), controller.set.mainStatus);

router.route('/set/token')
  .post(admin, validate('idAddress', false), controller.set.token);

router.route('/set/game')
  .post(admin, validate('idAddress', false), controller.set.game);

router.route('/set/game_status')
  .post(admin, validate('statusAddress', false), controller.set.gameStatus);

// Functions

router.route('/func/take_trx_bet')
  .post(server, validate('idAmountData', false), controller.func.takeTRXBet);

router.route('/func/withdraw')
  .post(admin, validate('idAmount', false), controller.func.withdraw);

// Events

router.route('/events/main_status')
  .get(server, validate('fromTo', true), controller.events.mainStatus);

router.route('/events/withdraw')
  .get(server, validate('fromTo', true), controller.events.withdraw);

router.route('/events/token')
  .get(server, validate('fromTo', true), controller.events.token);

router.route('/events/game')
  .get(server, validate('fromTo', true), controller.events.game);

router.route('/events/reward')
  .get(server, validate('fromTo', true), controller.events.reward);

module.exports = router;
