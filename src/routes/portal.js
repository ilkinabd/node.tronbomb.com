const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const auth = require('@middleware/check-auth');
const { validatePortal: validate } = require('@middleware/validate-params');

router.route('/balance')
  .get(auth, controller.balance);

router.route('/withdraw')
  .post(auth, validate('withdraw', false), controller.withdraw);

// Getters

router.route('/get/main_status')
  .get(auth, controller.get.mainStatus);

router.route('/get/owner')
  .get(auth, controller.get.owner);

router.route('/get/token')
  .get(auth, validate('getToken', true), controller.get.token);

router.route('/get/game')
  .get(auth, validate('getGame', true), controller.get.game);

router.route('/get/game_status')
  .get(auth, validate('getGameStatus', true), controller.get.gameStatus);

// Setters

router.route('/set/main_status')
  .post(auth, validate('setMainStatus', false), controller.set.mainStatus);

router.route('/set/token')
  .post(auth, validate('setToken', false), controller.set.token);

router.route('/set/game')
  .post(auth, validate('setGame', false), controller.set.game);

router.route('/set/game_status')
  .post(auth, validate('setGameStatus', false), controller.set.gameStatus);

// Payable

router.route('/payable/take_trx_bet')
  .post(auth, validate('takeTRXBet', false), controller.payable.takeTRXBet);

// Events

router.route('/events/main_status')
  .get(auth, validate('statusEvents', true), controller.events.mainStatus);

router.route('/events/withdraws')
  .get(auth, controller.events.withdraws);

router.route('/events/tokens')
  .get(auth, controller.events.tokens);

router.route('/events/games')
  .get(auth, controller.events.games);

router.route('/events/rewards')
  .get(auth, controller.events.rewards);

module.exports = router;
