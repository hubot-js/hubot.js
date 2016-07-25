'use strict';

exports.process = process;

var jenkins = require(__base + 'src/lib/jenkins');
var log = require(__base + 'src/lib/log');

function process(message, hubot, task) {
   start(message, hubot, task);
}

function start(message, hubot, task) {
   jenkins.callJob(task.options.jobName).then(function() {
      hubot.postMessage(getRecipient(hubot, message), task.options.message, {as_user: true});  
   }, function(error) {
      log.detailedError('Error on call Jenkins', error);
      hubot.postMessage(getRecipient(hubot, message), 'Could not start the job. See the error in the logs.', {as_user: true});
   });
};

function sucessMessage(hubot, message) {
   hubot.postMessage(getRecipient(hubot, message), task.options.message, {as_user: true});
}

function errorMessage(hubot, message, error) {
   hubot.postMessage(getRecipient(hubot, message), 'Sorry could not start the job. See the error in the logs.', {as_user: true});
}

function getRecipient(hubot, message) {
   if (hubot._isPrivateConversation(message)) {
      return message.user;
   } else {
      return message.channel;
   }
}
