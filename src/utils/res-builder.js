const errors = {
  73400: {
    message: 'No token provided.'
  },
  73401: {
    message: 'Wrong token.'
  },
  73500: {
    message: 'Internal server error.'
  },
};

const success = (data) => Object.assign({ status: 'success' }, data);
const error = (code) => Object.assign({ status: 'error', code }, errors[code]);

module.exports = {
  success,
  error,
};
