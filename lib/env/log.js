'use strict';

/**
 * Log Environment parameters
 *
 * @param {string} [LOG_DIR='./log']                       Directory to save logs in
 * @param {string} [LOG_IP_FILENAME='ip.txt']              Filename that 'last known ip' is stored in.
 * @param {string} [LOG_HISTORY_FILENAME='history.txt']    Filename for history of log messages
 * @param {string} [LOG_TIMESTAMP='MM/DD/YYYY HH:mm:s.SS'] Timestamp format
 */

var EnvParser = require('./env-parser.js');
var optional = [{
  key: 'LOG_DIR',
  'default': './log'
}, {
  key: 'LOG_IP_FILENAME',
  'default': 'ip.txt'
}, {
  key: 'LOG_HISTORY_FILENAME',
  'default': 'history.txt'
}, {
  key: 'LOG_TIMESTAMP',
  'default': 'MM/DD/YYYY HH:mm:s.SS'
}];

module.exports = (new EnvParser([], optional)).parse();
