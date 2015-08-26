'use strict';

if (process.env.NODE_ENV === 'production') {
  return;
}

// create Vagrantfile for docker server
require('vagrant-docker')();
