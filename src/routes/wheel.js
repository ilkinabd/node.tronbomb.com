const express = require('express');
const router = new express.Router();

const controller = require('@controllers/wheel');
const { server } = require('@middleware/auth');
const { validateGame: validate } = require('@middleware/validate-params');

// Getters

router.route('/get/params')
  .get(server, controller.get.params);

// Setters

router.route('/set/portal')
  .post(server, validate('setPortal', false), controller.set.portal);

router.route('/set/bet')
  .post(server, validate('setBet', false), controller.set.bet);

router.route('/set/duration')
  .post(server, validate('setDuration', false), controller.set.duration);

// Functions

// Events

router.route('/events/change_params')
  .get(server, validate('events', true), controller.events.changeParams);

module.exports = router;
