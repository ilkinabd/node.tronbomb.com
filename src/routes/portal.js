const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const auth = require('@middleware/check-auth');
const validate = require('@middleware/validate-params');

router.route('/get/main_status')
  .get(auth, controller.getMainStatus);

router.route('/set/main_status')
  .post(auth, validate('setMainStatus', false), controller.setMainStatus);

router.route('/get/owner')
  .get(auth, controller.getOwner);

router.route('/get/token')
  .get(auth, validate('getToken', true), controller.getToken);

router.route('/set/token')
  .post(auth, validate('setToken', false), controller.setToken);

router.route('/get/game')
  .get(auth, validate('getGame', true), controller.getGame);

router.route('/set/game')
  .post(auth, validate('setGame', false), controller.setGame);

router.route('/get/game_status')
  .get(auth, validate('getGameStatus', true), controller.getGameStatus);

router.route('/set/game_status')
  .post(auth, validate('setGameStatus', false), controller.setGameStatus);

router.route('/balance')
  .get(auth, controller.balance);

router.route('/withdraw')
  .post(auth, validate('withdraw', false), controller.withdraw);

// Events

router.route('/events/main_status')
  .get(auth, validate('statusEvents', true), controller.events.mainStatus);

router.route('/events/withdraws')
  .get(auth, controller.events.withdraws);

router.route('/events/tokens')
  .get(auth, controller.events.tokens);

module.exports = router;
