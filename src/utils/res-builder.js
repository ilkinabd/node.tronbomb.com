const errors = new Map();

errors.set(73400, 'No token provided.');
errors.set(73401, 'Wrong token.');
errors.set(73402, 'Invalid address provided.');
errors.set(73405, 'Game does not exist.');
errors.set(73406, 'Bet does not exist.');
errors.set(73500, 'Internal server error.');
errors.set(73501, 'REVERT opcode executed.');

const successRes = (res, data) => res.json(Object.assign({
  status: 'success',
}, data));
const errorRes = (res, status, code, error) => res.status(status).json({
  status: 'error',
  code,
  message: errors.get(code),
  error,
});

module.exports = {
  successRes,
  errorRes,
};
