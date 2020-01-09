const utils = require('@utils/wallet');
const { toDecimal } = require('@utils/tron');
const { successRes, errorRes } = require('@utils/res-builder');

// Functions
const withdraw = async (req, res) => {
  try {
    console.log('Withdraw method called ');
    const { wallet: address, amount, isToken } = req.body;
    const value = toDecimal(amount);
    console.log(`Address is : ${address}\nAmount is : ${value}`);
    await utils.func.withdraw(address, value);
    successRes(res);
  } catch (error) {
    console.log('Error : ');
    console.log(error.message);
    errorRes(res, 500, 73501, error);
  }
};

module.exports = {
  func: {
    withdraw,
  },
};
