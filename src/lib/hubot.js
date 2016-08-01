'use strict';

var util = require('util');
var Bot = require('slackbots');
var log = require(__base + 'src/lib/log');
var Assembler = require(__base + 'src/lib/assembler');
var messageHandler = require(__base + 'src/lib/message-handler');

process.on('uncaughtException', function (exception) {
  log.error(exception);
});

var Hubot = function Constructor(settings) {
   this.settings = settings;
   this.name = this.settings.name;
   this.user = null;
};

util.inherits(Hubot, Bot);

module.exports = Hubot;

Hubot.prototype.run = function () {
   Hubot.super_.call(this, this.settings);

   this.on('start', this._onStart);
   this.on('message', this._onMessage);
};

Hubot.prototype._onStart = function () {
   this._loadBotUser();
   this.core = new Assembler().build();
};

Hubot.prototype._onMessage = function (message) {
   if (this._isChatMessage(message) && !this._isFromHubot(message)) { 
      messageHandler.callTasks(message, this);
   }
};

Hubot.prototype._loadBotUser = function () {
   this.user = this._getUserByName(this.name);
};

Hubot.prototype._getUserByName = function (name) {
   return this.users.find(user => user.name === name);
};

Hubot.prototype._getUserById = function (userId) {
   return this.users.find(user => user.id === userId);
};

Hubot.prototype._isChatMessage = function (message) {
   return message.type === 'message' && Boolean(message.text);
};

Hubot.prototype._isChannelConversation = function (message) {
   return typeof message.channel === 'string' && message.channel[0] === 'C';
};

Hubot.prototype._isPrivateConversation = function (message) {
   return typeof message.channel === 'string' && message.channel[0] === 'D';
};

Hubot.prototype._isFromHubot = function (message) {
   return message.user === this.user.id;
};
