'use strict';

const util = require('util');
const path = require('path');

const Bot = require('slackbots');

const db = require('./lib/db');
const Hubot = require('./hubot');
const log = require('./lib/log');
const i18n = require('./lib/i18n');
const firstRun = require('./first-run');
const Assembler = require('./assembler');
const normalizer = require('./lib/normalizer');
const messageHandler = require('./message-handler/message-handler');

let botName;
let botUser;
let coreSettings;
let isFirstRun = false;

process.on('uncaughtException', (exception) => {
  log.error(exception);
});

const Core = function Constructor(settings) {
  coreSettings = settings;
  botName = settings.name;
};

util.inherits(Core, Bot);
module.exports = Core;

Core.prototype.run = function run() {
  Core.super_.call(this, coreSettings);

  this.on('start', this.onStart);
  this.on('message', this.onMessage);
  this.on('close', () => {
    this.connect();
  });
};

Core.prototype.onStart = function onStart() {
  botUser = this.getUserByName(botName);

  this.hubot = new Hubot(this);

  const internalGearPath = path.join(__dirname, 'internal-gears/');
  this.hubot.gears = new Assembler(internalGearPath, true).build();

  const gears = new Assembler(global.__nodeModules, false).build();
  this.hubot.gears = this.hubot.gears.concat(gears);

  this.firstRunChecker();
  this.setLanguage();
};

Core.prototype.onMessage = function onMessage(message) {
  if (message.type === 'reconnect_url') {
    this.wsUrl = message.url;
    return;
  }

  handleMessage(message, this);
};

function handleMessage(message, hubot) {
  if (isChatMessage(message) && !isFromHubot(message)) {
    message.text = normalizer.normalize(message.text);

    if (isFirstInteraction(hubot, message)) {
      isFirstRun = false;
      firstRun.firstRun(hubot, message);
    } else {
      messageHandler.callTasks(message, hubot);
    }
  }
}

Core.prototype.firstRunChecker = function firstRunChecker() {
  db.getDb().get('SELECT * FROM first_use').then((record) => {
    if (!record || !record.first_use) {
      isFirstRun = true;
    }
  });
};

Core.prototype.setLanguage = function setLanguage() {
  db.getDb().get('SELECT * FROM config')
    .then(config => i18n.changeLanguage(config.language));
};

Core.prototype.getUserByName = function getUserByName(name) {
  return this.users.find(user => user.name === name);
};

Core.prototype.getUserById = function getUserById(userId) {
  return this.users.find(user => user.id === userId);
};

Core.prototype.isChannelConversation = function isChannelConversation(message) {
  return typeof message.channel === 'string' && message.channel[0] === 'C';
};

Core.prototype.isPrivateConversation = function isPrivateConversation(message) {
  return typeof message.channel === 'string' && message.channel[0] === 'D';
};

Core.prototype.getRecipient = function getRecipient(message) {
  if (this.isPrivateConversation(message)) {
    return message.user;
  }
  return message.channel;
};

Core.prototype.isAdminUser = function isAdminUser(user) {
  return db.getDb().get('SELECT * FROM admins WHERE admin = ?', user);
};

Core.prototype.getChannelByName = function getChannelByName(channelName) {
  return this.channels.find(channel => channel.name === channelName);
};

function isFromHubot(message) {
  return message.user === botUser.id;
}

function isChatMessage(message) {
  return message.type === 'message' && Boolean(message.text);
}

function isFirstInteraction(core, message) {
  return isFirstRun && core.isPrivateConversation(message) && message.text === botName;
}
