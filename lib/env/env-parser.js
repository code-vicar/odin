'use strict';

function tryCast(key, val, type) {
  var cast = val;

  if (type === 'int') {
    if (typeof val !== 'number') {
      cast = parseInt(val, 10);

      if (isNaN(cast)) {
        throw new TypeError('cannot cast ' + key + ' with ' + val + ' to ' + type);
      }
    }
  }

  return cast;
}

function normalizeKey(k) {
  var ret = {};

  if (typeof k === 'string') {
    ret.key = k;
    return ret;
  }

  if (k && Object.hasOwnProperty.call(k, 'key')) {
    ret.key = k.key;
  }

  if (k && Object.hasOwnProperty.call(k, 'default')) {
    ret.def = k['default'];
  }

  if (k && Object.hasOwnProperty.call(k, 'type')) {
    ret.type = k.type;
  }

  return ret;
}

function doesExist(key) {
  return typeof process.env[key] !== 'undefined' && process.env[key] !== null;
}

var EnvParser = function (required, optional) {
  this.required = required;
  this.optional = optional;
};

EnvParser.prototype.parse = function parse() {
  var unmet = [],
    res = {};

  if (Array.isArray(this.required)) {
    this.required.forEach(function (k) {
      var key;

      key = normalizeKey(k);
      if (!doesExist(key.key) && key.def == null) {
        unmet.push(key.key);
      } else if (doesExist(key.key)) {
        res[key.key] = tryCast(key.key, process.env[key.key], key.type);
      } else {
        res[key.key] = tryCast(key.key, key.def, key.type);
      }
    });

    if (unmet.length > 0) {
      throw new Error('Missing environment variables: ' + unmet.join(', '));
    }
  }

  if (Array.isArray(this.optional)) {
    this.optional.forEach(function (k) {
      var key;

      key = normalizeKey(k);
      if (doesExist(key.key)) {
        res[key.key] = tryCast(key.key, process.env[key.key], key.type);
      } else if (key.def != null) {
        res[key.key] = tryCast(key.key, key.def, key.type);
      }
    });
  }

  return res;
};

module.exports = EnvParser;
