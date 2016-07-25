'use strict';

var util = require('util');
var Bot = require('slackbots');

var Hubot = function Constructor(settings) {
   this.settings = settings;
   this.name = this.settings.name;
   this.user = null;
};

util.inherits(Hubot, Bot);

module.exports = Hubot;

Hubot.prototype.run = function () {
   Hubot.super_.call(this, this.settings);

   console.log('Hello world');
};

