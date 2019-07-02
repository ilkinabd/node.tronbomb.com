const utils = require('@utils/portal');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.control.getMianStatus();
  if (!mainStatus) return res.status(500).json(resError(73500));
  res.json(resSuccess({ mainStatus }));
};

module.exports = {
  getMainStatus,
};
