'use strict';

var EnvParser = require('../lib/env/env-parser.js');
var expect = require('chai').expect;

describe('Environment Parser', function () {
  describe('parse', function () {
    before(function () {
      process.env.required_key = 'I\'m required';
      process.env.optional_key = 'I\'m optional';
    });

    it('should throw when missing a required key', function () {
      var testEnv = new EnvParser(['not_found']);
      expect(function () {
        testEnv.parse();
      }).to.throw(Error, /missing.*not_found/i);
    });

    it('should not care if an optional key is missing', function () {
      var testEnv = new EnvParser([], ['not_found']);
      expect(function () {
        testEnv.parse();
      }).to.not.throw(Error);
    });

    it('should find the key if it exists', function () {
      var testEnv = new EnvParser(['required_key'], ['optional_key']);
      var env = testEnv.parse();
      expect(env.required_key).to.equal('I\'m required');
      expect(env.optional_key).to.equal('I\'m optional');
    });

    after(function () {
      delete process.env.required_key;
      delete process.env.optional_key;
    });
  });
});
