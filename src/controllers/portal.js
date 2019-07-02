const utils = require('@utils/portal');
const { success: resSuccess, error: resError } = require('@utils/res-builder');

const getMainStatus = async(_req, res) => {
  const mainStatus = await utils.control.getMainStatus();
  if (mainStatus === null || mainStatus === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ mainStatus }));
};

const setMainStatus = async(req, res) => {
  const { status } = req.body;

  const result = await utils.control.setMainStatus({ status });
  if (mainStatus === null || mainStatus === undefined)
    return res.status(500).json(resError(73500));

  res.json(resSuccess({ result }));
};

module.exports = {
  getMainStatus,
  setMainStatus,
};
