const { MIN_WITHDRAW, MAX_WITHDRAW } = process.env;

const Joi = require('@hapi/joi');

const templates = {
  integer: Joi.number().integer().min(0),
  number: Joi.number().min(0),
  address: Joi.string().alphanum().length(34),
  status: Joi.boolean(),
  bytes: Joi.string().regex(/0[xX][0-9a-fA-F]+/m),
  rtp: Joi.number().min(0.001).max(1.000),
};

const schemas = {
  id: Joi.object().keys({
    id: templates.integer.required(),
  }),
  address: Joi.object().keys({
    address: templates.address.required(),
  }),
  status: Joi.object().keys({
    status: templates.status.required(),
  }),
  rtp: Joi.object().keys({
    rtp: templates.rtp.required(),
  }),
  duration: Joi.object().keys({
    duration: templates.integer.required(),
  }),
  code: Joi.object().keys({
    code: Joi.number().integer().min(0).max(1000000000),
  }),
  addressSpender: Joi.object().keys({
    address: templates.address.required(),
    spender: templates.address.required(),
  }),
  idAmount: Joi.object().keys({
    amount: templates.number.required(),
    id: templates.integer.required(),
  }),
  fromTo: Joi.object().keys({
    from: templates.integer,
    to: templates.integer.min(Joi.ref('from')),
  }),
  bet: Joi.object().keys({
    min: templates.number.required(),
    max: templates.number.min(Joi.ref('min')).required(),
  }),
  addressBlockHash: Joi.object().keys({
    address: templates.address.required(),
    block: templates.integer.required(),
    hash: templates.bytes.required(),
  }),
  blockHash: Joi.object().keys({
    block: templates.integer.required(),
    hash: templates.bytes.required(),
  }),
  walletToAmount: Joi.object().keys({
    wallet: templates.address.required(),
    to: templates.address.required(),
    amount: templates.number
      .min(parseFloat(MIN_WITHDRAW)).max(parseFloat(MAX_WITHDRAW)).required(),
  }),
  stackingParams: Joi.object().keys({
    period: templates.integer.required(),
    amount: templates.number.required(),
  }),
  transfer: Joi.object().keys({
    to: templates.address.required(),
    amount: templates.number.required(),
  }),
  transferFrom: Joi.object().keys({
    from: templates.address.required(),
    to: templates.address.required(),
    amount: templates.number.required(),
  }),
  approve: Joi.object().keys({
    spender: templates.address.required(),
    amount: templates.number.required(),
  }),
  setBetParams: {
    index: templates.integer.required(),
    minBet: templates.number.required(),
    maxBet: templates.number.min(Joi.ref('minBet')).required(),
  },
  setGame: Joi.object().keys({
    index: templates.integer.required(),
    address: templates.address.required(),
  }),
  setStatus: Joi.object().keys({
    address: templates.address.required(),
    status: templates.status.required(),
  }),
  takeBet: Joi.object().keys({
    gameId: templates.integer.required(),
    bet: templates.number.required(),
    data: Joi.array().items(templates.bytes).required(),
  }),
  takeBOMBBet: Joi.object().keys({
    gameId: templates.integer.required(),
    bet: templates.number.required(),
    data: Joi.array().items(templates.bytes).required(),
  }),
  events: Joi.object().keys({
    from: templates.integer,
    to: templates.integer.min(Joi.ref('from')),
  }),
};

module.exports = (type, isQuery = true) => (req, res, next) => {
  const schema = schemas[type];
  const data = (isQuery) ? req.query : req.body;

  const { error } = Joi.validate(data, schema);

  if (error) return res.status(422).json({
    status: 'error',
    message: error.details,
  });

  next();
};
