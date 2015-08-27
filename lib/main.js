'use strict';

// node
var util = require('util');

// vendor
var moment = require('moment');
var request = require('request-promise');
var BBPromise = require('bluebird');
var AWS = require('aws-sdk');
var route53 = BBPromise.promisifyAll(new AWS.Route53({
  apiVersion: '2013-04-01'
}));

// lib
var logs = require('./log.js');

var route53Settings = require('./env/route53.js');

function getExternalIP() {
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

function updateResourceRecordSet(ip) {

  return BBPromise.try(function () {
    var params = {
      ChangeBatch: {
        Changes: [{
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: route53Settings.ROUTE53_RECORDSET,
              Type: route53Settings.ROUTE53_TYPE,
              ResourceRecords: [{
                Value: ip
              }],
              TTL: route53Settings.ROUTE53_TTL
            },
          },
        ],
        Comment: route53Settings.ROUTE53_COMMENT.replace('`date`', moment().format())
      },
      HostedZoneId: route53Settings.ROUTE53_ZONEID /* required */
    };

    return logs.log(util.format('updating AWS route53 resource record set with IP %s', ip)).then(function () {
      return route53.changeResourceRecordSetsAsync(params).then(function (data) {
        return logs.log(data);
      });
    });
  });
}

function onIPChange(ip) {
  return updateResourceRecordSet(ip).then(function () {
    return logs.saveLastKnownIP(ip);
  });
}

function main() {
  return BBPromise.all([getExternalIP(), logs.getLastKnownIP()]).then(function (results) {
    var currIP = results[0];
    var lastIP = results[1];

    return logs.log(util.format('current IP    = %s', currIP)).then(function () {
      return logs.log(util.format('last known IP = %s', lastIP));
    }).then(function () {
      if (currIP === lastIP) {
        return logs.log('last known IP has not changed');
      }

      return onIPChange(currIP);
    });
  }).catch(function (err) {
    return logs.log(err).catch(function (err2) {
      console.error('fatal error, cannot recover.', err, err2);
    });
  });
}

module.exports = main;
