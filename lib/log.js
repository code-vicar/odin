'use strict';

// node
var path = require('path');
var util = require('util');
var moment = require('moment');
var eol = require('os').EOL;

// vendor
var BBPromise = require('bluebird');
var fs = BBPromise.promisifyAll(require('fs-extra'));

// lib
var env = require('./env/log.js');

var IP_FILE = path.resolve(path.join(env.LOG_DIR, env.LOG_IP_FILENAME));
var HISTORY_FILE = path.resolve(path.join(env.LOG_DIR, env.LOG_HISTORY_FILENAME));
var TIMESTAMP_FORMAT = env.LOG_TIMESTAMP;

function log() {
  var args = arguments;

  return BBPromise.try(function () {
    if (!args || !args.length) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log.apply(console.log, args);
    }

    var msgs = Array.prototype.map.call(args, function (arg) {
      return util.format('%s - %s', moment().format(TIMESTAMP_FORMAT), util.inspect(arg, {
        depth: 5
      }));
    });

    return fs.ensureFileAsync(HISTORY_FILE).then(function () {
      return fs.appendFileAsync(HISTORY_FILE, msgs.join(eol) + eol);
    });
  });
}

function getLastKnownIP() {
  return fs.readFileAsync(IP_FILE, {
    encoding: 'utf8'
  }).then(function (data) {
    return data;
  }).catch(function (err) {
    //Error reading the file
    return log('Error reading file', err).then(function () {
      return BBPromise.resolve(undefined);
    });
  });
}

function saveLastKnownIP(ip) {
  return fs.ensureFileAsync(IP_FILE).then(function () {
    return fs.writeFileAsync(IP_FILE, ip);
  }).then(function () {
    return log(util.format('%s logged as last known IP', ip));
  }).catch(function (err) {
    return log('error writing last known IP to log', err);
  });
}

module.exports = {
  log: log,
  getLastKnownIP: getLastKnownIP,
  saveLastKnownIP: saveLastKnownIP
};
