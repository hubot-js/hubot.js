'use strict';

global.__base = __dirname + '/';
global.__gears = __base + 'src/gears/';
global.__nodeModules = __base + 'node_modules/';

var Hubot = require(__base + 'src/lib/hubot');
var token = process.env.BOT_API_KEY
var name = process.env.BOT_NAME || 'hubot';

var hubot = new Hubot({
   token: token,
   name: name
});

hubot.run();
