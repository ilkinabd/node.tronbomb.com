const getRows = result => (result.rows || []);
const getFirst = rows => (rows[0] || {});
const getField = (row, field) => (row[field] === undefined ? null : row[field]);

const getAll = requestFunc => async(params) => {
  const result = await requestFunc(params) || {};
  return getRows(result);
};
const getRow = requestFunc => async(params) => {
  const result = await requestFunc(params) || {};
  return getFirst(getRows(result));
};
const getId = requestFunc => async(params) => {
  const result = await requestFunc(params) || {};
  return getField(getFirst(getRows(result)), 'id');
};
const getValue = requestFunc => async(params) => {
  const result = await requestFunc(params) || {};
  return getField(getFirst(getRows(result)), 'value');
};

const getFromParams = (keys, params) => {
  let value = params;

  for (const key of keys) {
    if (typeof value !== 'object') {
      value === undefined;
      break;
    }

    value = value[key];
  }

  switch (typeof value) {
    case 'undefined': return null;
    case 'string': return `'${value.replace(/"|'|`/gi, '')}'`;
    case 'object': return JSON.stringify(value).replace(/"/gi, '\'');
    default: return value;
  }
};

const fillTemplate = (template, params = {}) => {
  const filter = /\$[\w.]+/g;

  return template.replace(filter, (match) => {
    const keys = match.slice(1).split('.');
    return getFromParams(keys, params);
  });
};

module.exports = {
  getAll,
  getRow,
  getId,
  getValue,
  fillTemplate,
};
