'use strict';

var BBPromise = require('bluebird');
var request = require('request-promise');
var fs = BBPromise.promisifyAll(require('fs-extra'));

/**
 * Log file tracking last known external IP
 *
 * @type const {String}
 */
var IP_LOG = './log/ip.json';

function log() {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log.apply(console.log, arguments);
}

function getExternalIp() {
  return request({
    method: 'GET',
    uri: 'https://www.icanhazip.com',
    gzip: true
  }).then(function (body) {
    if (body && body.trim) {
      return body.trim();
    }
    return body;
  });
}

function ensureLogFile() {
  return fs.ensureFileAsync(IP_LOG);
}

function getLastKnownIP() {

  function readFile() {
    return fs.readJsonAsync(IP_LOG).then(function (obj) {
      return obj.lastKnownIP;
    }).catch(function (err) {
      //Error reading the file
      log('Error reading file', err);
      log('last known ip is now undefined...');
      return BBPromise.resolve(undefined);
    });
  }

  return ensureLogFile().then(readFile);
}

function saveLastKnownIP(ip) {

  function writeFile() {
    return fs.writeJsonAsync(IP_LOG, {
      lastKnownIP: ip
    });
  }

  log('updating ' + IP_LOG + ' with latest IP', ip);
  return ensureLogFile().then(writeFile);
}

function updateResourceRecordSet(ip) {
  var AWS = require('aws-sdk');
  var route53 = BBPromise.promisifyAll(new AWS.Route53());

  log('updating AWS route53 resource record set');
  return route53.listHostedZonesAsync({}).then(function (data) {
    console.log(data);
  });
}

function onIPChange(ip) {
  return updateResourceRecordSet(ip).then(function () {
    return saveLastKnownIP(ip);
  });
}

function main() {
  BBPromise.all([getExternalIp(), getLastKnownIP()]).then(function (results) {
    var currIP = results[0];
    var lastIP = results[1];
    log('current IP', currIP);
    log('last known IP', lastIP);

    if (currIP === lastIP) {
      log('last known IP has not changed');
      return;
    }

    return onIPChange(currIP);
  }).catch(function (err) {
    log(err);
  });
}

main();
