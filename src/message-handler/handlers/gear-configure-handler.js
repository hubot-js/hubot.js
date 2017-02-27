'use strict';

const conversation = require('../conversation');

exports.handle = handle;

function handle(hubot, message, core) {
  if (isGearConfigureMessage(hubot, message)) {
    core.isAdminUser(message.user).then((isAdmin) => {
      if (isAdmin) {
        const param = {
          user: message.user,
          gear: gearDescription(message, hubot),
          interactions: discoverConfig(hubot, message)
        };

        conversation.startConversation(hubot, param, message);
      }
    });
  }
}

function isGearConfigureMessage(hubot, message) {
  return hubot.gears.find((gear) => {
    const configureMessage = hubot.i18n('configureGear', { gear: gear.description });

    return message.text === configureMessage;
  }) != null;
}

function discoverConfig(hubot, message) {
  return hubot.gears.find(g => g.description === gearDescription(message, hubot)).configs;
}

function gearDescription(message, hubot) {
  return message.text.replace(hubot.i18n('configure'), '');
}
