const express = require('express');
const router = new express.Router();

const controller = require('@controllers/dice');
const { server } = require('@middleware/auth');
const { validateDice: validate } = require('@middleware/validate-params');

// Getters

router.route('/get/game')
  .get(server, validate('getGame', true), controller.get.game);

router.route('/get/games')
  .get(server, validate('getGames', true), controller.get.games);

router.route('/get/params')
  .get(server, validate('getParams', true), controller.get.params);

// Setters

router.route('/set/portal')
  .post(server, validate('setPortal', false), controller.set.portal);

router.route('/set/rtp')
  .post(server, validate('setRTP', false), controller.set.rtp);

router.route('/set/bet')
  .post(server, validate('setBet', false), controller.set.bet);

// Functions

router.route('/func/finish_game')
  .post(server, validate('finishGame', false), controller.func.finishGame);

// Events

router.route('/events/take_bets')
  .get(server, validate('events', true), controller.events.takeBets);

router.route('/events/finish_games')
  .get(server, validate('events', true), controller.events.finishGames);

router.route('/events/players_win')
  .get(server, validate('events', true), controller.events.playersWin);

router.route('/events/change_params')
  .get(server, validate('events', true), controller.events.changeParams);

module.exports = router;
