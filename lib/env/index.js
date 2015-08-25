'use strict';

var route53Parser = require('./route53.js');

var route53 = route53Parser.parse();

module.exports = {
  route53: route53
};
