const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const { server, admin } = require('@middleware/auth');
const { validatePortal: validate } = require('@middleware/validate-params');

// Getters

router.route('/get/balance')
  .get(server, controller.get.balance);

router.route('/get/main_status')
  .get(server, controller.get.mainStatus);

router.route('/get/owner')
  .get(server, controller.get.owner);

router.route('/get/token')
  .get(server, validate('getToken', true), controller.get.token);

router.route('/get/game')
  .get(server, validate('getGame', true), controller.get.game);

router.route('/get/game_status')
  .get(server, validate('getGameStatus', true), controller.get.gameStatus);

// Setters

router.route('/set/main_status')
  .post(admin, validate('setMainStatus', false), controller.set.mainStatus);

router.route('/set/token')
  .post(admin, validate('setToken', false), controller.set.token);

router.route('/set/game')
  .post(admin, validate('setGame', false), controller.set.game);

router.route('/set/game_status')
  .post(admin, validate('setGameStatus', false), controller.set.gameStatus);

// Functions

router.route('/func/take_trx_bet')
  .post(server, validate('takeTRXBet', false), controller.func.takeTRXBet);

router.route('/func/withdraw')
  .post(admin, validate('withdraw', false), controller.func.withdraw);

// Events

router.route('/events/main_status')
  .get(server, validate('events', true), controller.events.mainStatus);

router.route('/events/withdraws')
  .get(server, validate('events', true), controller.events.withdraws);

router.route('/events/tokens')
  .get(server, validate('events', true), controller.events.tokens);

router.route('/events/games')
  .get(server, validate('events', true), controller.events.games);

router.route('/events/rewards')
  .get(server, validate('events', true), controller.events.rewards);

module.exports = router;
