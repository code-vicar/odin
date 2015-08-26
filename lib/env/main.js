'use strict';

/**
 * Odin Environment parameters
 *
 * @param {number} [ODIN_FREQUENCY=60000]    How often to check for IP changes (in milliseconds)
 */

var EnvParser = require('./env-parser.js');
var optional = [{
  key: 'ODIN_FREQUENCY',
  type: 'int',
  'default': 60000
}];

module.exports = (new EnvParser([], optional)).parse();
