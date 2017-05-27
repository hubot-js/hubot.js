'use strict';

const trigger = require('../../../../message-handler/trigger');
const conversation = require('../../../../message-handler/conversation');

exports.handle = handle;

function handle(hubot, message) {
  if (isGearConfigureMessage(hubot, message)) {
    const gear = discoverGear(hubot, message);

    if (gear) {
      hubot.isAdminUser(message.user).then((isAdmin) => {
        if (isAdmin) {
          const param = {
            user: message.user,
            gear: gearDescription(message, hubot),
            interactions: gear.configs
          };

          conversation.startConversation(hubot, param, message);
        }
      });
    }

    return true;
  }

  return false;
}

function isGearConfigureMessage(hubot, message) {
  return hubot.gears.find((gear) => {
    const configureMessage = hubot.i18n('hubot-gear-configure:command.configure.trigger', { gear: gear.description });

    return trigger.check(message.text, configureMessage).ok;
  }) != null;
}

function discoverGear(hubot, message) {
  return hubot.gears.find(g => g.description === gearDescription(message, hubot));
}

function gearDescription(message, hubot) {
  return message.text.replace(hubot.i18n('hubot-gear-configure:configure'), '');
}
