const errors = new Map();

errors.set(73400, 'No token provided.');
errors.set(73401, 'Wrong token.');
errors.set(73402, 'Wrong address.');
errors.set(73403, 'Invalid address provided.');
errors.set(73500, 'Internal server error.');

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code) => ({ status: 'error', code, message: errors.get(code) });

const successRes = (res, data) => res.json(Object.assign({
  status: 'success',
}, data));
const errorRes = (res, status, code) => res.status(status).json({
  status: 'error',
  code,
  message: errors.get(code),
});

module.exports = {
  successRes,
  errorRes,
  resSuccess: success,
  resError: error,
};
