'use strict';

/**
 * Route53 Environment parameters
 *
 * @param {string} ROUTE53_ZONEID                             Hosted Zone ID e.g. BJBK35SKMM9OE
 * @param {string} ROUTE53_RECORDSET                          The CNAME you want to update e.g. hello.example.com
 * @param {number} [ROUTE53_TTL=300]                          The Time-To-Live of this recordset
 * @param {string} [ROUTE53_COMMENT='Auto updating @ `date`'] AWS Route53 update comment
 * @param {string} [ROUTE53_TYPE='A']                         Change to AAAA if using an IPv6 address
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

module.exports = (new EnvParser(required, optional)).parse();
