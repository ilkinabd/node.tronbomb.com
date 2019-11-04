const log = require("simple-node-logger");

const opts = {
    errorEventName:'error',
    logDirectory:'/data/app/logs', // NOTE: folder must exist and be writable...
    fileNamePattern:'roll-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};

exports.log = log.createRollingFileLogger( opts );