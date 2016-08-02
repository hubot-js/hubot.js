'use strict';

exports.start = start;

function start() {
   global.__base = __dirname.replace('test', '');
   global.__gears = __dirname + '/resource/gears/';
}