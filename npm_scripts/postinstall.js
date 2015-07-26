'use strict';

if (process.env.NODE_ENV === 'production') {
  return;
}

var BBPromise = require('bluebird');
var fs = BBPromise.promisifyAll(require('fs-extra'));

fs.copyAsync('./node_modules/vagrant-docker/Vagrantfile', './Vagrantfile').then(function () {
  console.log('Copied Vagrantfile');
}).catch(function (err) {
  console.log(err);
});

fs.copyAsync('./node_modules/vagrant-docker/install-docker.sh', './install-docker.sh').then(function () {
  console.log('Copied install-docker.sh');
}).catch(function (err) {
  console.log(err);
});
