const errors = new Map();

errors.set(73400, 'No token provided.');
errors.set(73401, 'Wrong token.');
errors.set(73500, 'Internal server error.');

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code) => ({ status: 'error', code, message: errors.get(code) });

module.exports = {
  resSuccess: success,
  resError: error,
};
