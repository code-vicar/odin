'use strict';

/**
 * Environment parameters
 *
 * ROUTE53_ZONEID {string}                            Hosted Zone ID e.g. BJBK35SKMM9OE
 * ROUTE53_RECORDSET {string}                         The CNAME you want to update e.g. hello.example.com
 * ROUTE53_TTL {number=300}                           The Time-To-Live of this recordset
 * ROUTE53_COMMENT {string='Auto updating @ `date`'}  Change this if you want
 * ROUTE53_TYPE {string='A'}                          Change to AAAA if using an IPv6 address
 */

var EnvParser = require('./env-parser.js');

var required = [
  'ROUTE53_ZONEID',
  'ROUTE53_RECORDSET'
];

var optional = [{
  key: 'ROUTE53_TTL',
  type: 'int',
  'default': 300
}, {
  key: 'ROUTE53_COMMENT',
  'default': 'Auto updating @ `date`'
}, {
  key: 'ROUTE53_TYPE',
  'default': 'A'
}];

var route53Parser = new EnvParser(required, optional);

module.exports = route53Parser;
