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
  const acceptance = trigger.check(message.text, hubot.i18n(task.trigger));

  if (acceptance.ok) {
    if (gear.active) {
      if (incorretMessageSource(hubot, task, message)) {
        return true;
      }

      const hubotClone = getHubotClone(core);
      const handler = getHandler(gear, task);
      handler.handle(hubotClone, message, task, acceptance.params);
    } else {
      hubot.speak(message, 'feature.disabled');
    }

    return true;
  }

  return false;
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
