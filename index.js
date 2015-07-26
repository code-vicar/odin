'use strict';

var AWS = require('aws-sdk');

var route53 = new AWS.Route53();

route53.listHostedZones({}, function(err, data) {
  if (err) {
    console.log(err, err.stack);
    return;
  } // an error occurred

  console.log(data); // successful response
});
