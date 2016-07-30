'use strict';

exports.callTasks = callTasks;

var trigger = require(__base + 'src/lib/trigger');

function callTasks(message, hubot) {
   hubot.core.tasks.forEach(function(task) {
      var acceptance = trigger.check(message.text, task.trigger);
      if (acceptance.ok) {
         var handler = getHandler(hubot, task);
         handler.process(message, hubot, task, acceptance.params);
      }
   });
}

function getHandler(hubot, task) {
   return hubot.core.handlers.find(h => h.key === task.handler);
}
