'use strict';

// lib
var main = require('./lib/main.js');
var settings = require('./lib/env/main.js');

main();
setInterval(function () {
  main();
}, settings.ODIN_FREQUENCY);
