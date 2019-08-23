const express = require('express');
const router = new express.Router();

const controller = require('@controllers/portal');
const { server, admin } = require('@middleware/auth');
const validate = require('@middleware/validate');

// Getters

router.route('/get/games')
  .get(server, controller.get.games);

router.route('/get/params')
  .get(server, controller.get.params);

// Setters

router.route('/set/main_status')
  .post(admin, validate('status', false), controller.set.mainStatus);

router.route('/set/bet_params')
  .post(admin, validate('setBetParams', false), controller.set.betParams);

router.route('/set/game')
  .post(admin, validate('setGame', false), controller.set.game);

router.route('/set/game_status')
  .post(admin, validate('setStatus', false), controller.set.gameStatus);

// Functions

router.route('/func/take_bet')
  .post(server, validate('takeBet', false), controller.func.takeBet);

router.route('/func/take_bomb_bet')
  .post(server, validate('takeBOMBBet', false), controller.func.takeBOMBBet);

router.route('/func/withdraw')
  .post(admin, validate('amount', false), controller.func.withdraw);

// Events

router.route('/events/pay_reward')
  .get(server, validate('events'), controller.events.payReward);

router.route('/events/withdraw')
  .get(server, validate('events'), controller.events.withdraw);

router.route('/events/main_status')
  .get(server, validate('events'), controller.events.mainStatus);

router.route('/events/token')
  .get(server, validate('fromTo', true), controller.events.token);

router.route('/events/game')
  .get(server, validate('fromTo', true), controller.events.game);

module.exports = router;
