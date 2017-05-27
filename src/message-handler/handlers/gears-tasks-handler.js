'use strict';

const Hubot = require('../../hubot');
const trigger = require('../trigger');

exports.handle = handle;

function handle(hubot, message, core) {
  hubot.gears.forEach((gear) => {
    gear.tasks.forEach((task) => { // eslint-disable-line consistent-return
      const taskExecuted = tryExecuteTask(hubot, core, gear, message, task);

      if (taskExecuted) {
        return true;
      }
    });
  });

  return false;
}

function tryExecuteTask(hubot, core, gear, message, task) {
  if (!shouldCallTask(message, core)) return false;

  const messageWithoutBotName = hubot.removeBotNameFromMessage(message);

  const acceptance = trigger.check(messageWithoutBotName, hubot.i18n(task.trigger));

  if (acceptance.ok) {
    if (gear.active) {
      if (incorretMessageSource(hubot, task, message)) {
        return true;
      }

      const handler = getHandler(gear, task);

      if (gear.isInternal) {
        handler.handle(hubot, message, task, acceptance.params);
      } else {
        handler.handle(getHubotClone(core), message, task, acceptance.params);
      }
    } else {
      hubot.speak(message, 'feature.disabled');
    }

    return true;
  }

  return false;
}

function shouldCallTask(message, core) {
  let triggerOk = false;
  const isToBotMessage = message.text.startsWith(`${core.name} `);

  if (core.isPrivateConversation(message)) {
    triggerOk = true;
  }

  if (!core.isPrivateConversation(message) && isToBotMessage) {
    triggerOk = true;
  }

  return triggerOk;
}

function incorretMessageSource(hubot, task, message) {
  if (task.onlyInChannel && !hubot.isFromChannel(message)) {
    hubot.speak(message, 'feature.onlyChannel');
    return true;
  }

  if (task.onlyInPrivate && !hubot.isFromPrivate(message)) {
    hubot.speak(message, 'feature.onlyPrivate');
    return true;
  }

  return false;
}

function getHubotClone(core) {
  const hubotClone = new Hubot(core);
  hubotClone.gears = JSON.parse(JSON.stringify(core.hubot.gears));

  return hubotClone;
}

function getHandler(gear, task) {
  return gear.handlers.find(h => h.key === task.handler);
}
