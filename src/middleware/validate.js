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
  idAddress: Joi.object().keys({
    id: templates.integer.required(),
    address: templates.address.required(),
  }),
  statusAddress: Joi.object().keys({
    status: templates.status.required(),
    address: templates.address.required(),
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
  idAmountData: Joi.object().keys({
    id: templates.integer.required(),
    amount: templates.number.required(),
    data: Joi.array().items(templates.bytes).required(),
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
