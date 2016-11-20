'use strict';

// This file is an alternative to the CLI. When using hubot as CLI it is not possible to debug.
// If you wish to debug fill in the token and bot name and start this file.

const path = require('path');

const db = require('./src/lib/db');
const Core = require('./src/core');

global.__nodeModules = path.join(__dirname, './node_modules/');

db.startDb().then(() => {
  new Core({ token: 'botToken', name: 'botName' }).run();
});

