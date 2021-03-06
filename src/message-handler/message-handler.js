'use strict';

const firstRun = require('./handlers/first-run-handler');
const gearsTasks = require('./handlers/gears-tasks-handler');
const conversation = require('./handlers/conversation-handler');

exports.callTasks = callTasks;

function callTasks(message, core) {
  const handlers = getHandlers();

  for (let i = 0; i < handlers.length; i++) {
    const isHandled = handlers[i].handle(core.hubot, message, core);

    if (isHandled) {
      break;
    }
  }
}

function getHandlers() {
  return [
    firstRun,
    conversation,
    gearsTasks
  ];
}
