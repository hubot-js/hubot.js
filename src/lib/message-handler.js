'use strict';

exports.callTasks = callTasks;

var Stringfy = require('string');

function callTasks(message, hubot) {
   hubot.core.tasks.forEach(function(task) {
      if (accept(message, task.trigger)) {
         var handler = getHandler(hubot, task);
         handler.process(message, hubot, task);
      }
   });
}

function getHandler(hubot, task) {
   return hubot.core.handlers.find(h => h.key === task.handler);
}

function accept(message, phrase) { 
   return normalize(message.text) == normalize(phrase);
}

function normalize(text) {
   return Stringfy(text).trim().latinise().s.toLowerCase();
}


