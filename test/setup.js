'use strict';

exports.start = start;

function start() {
   global.__base = __dirname.replace('test', '');
   global.__nodeModules = __dirname + '/resource/node_modules_test/';
}
