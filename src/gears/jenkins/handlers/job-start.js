'use strict';

exports.process = process;

var jenkins = require(__base + 'src/lib/jenkins');
var log = require(__base + 'src/lib/log');

function process(message, hubot, task, params) {
   start(message, hubot, task, params[0]);
}

function start(message, hubot, task, job) {
   var recipient = getRecipient(hubot, message);

   jenkins.callJob(job).then(function() {
      hubot.postMessage(recipient, task.options.message, {as_user: true});  
   }, function(error) {
      if (error.notFound) {
         hubot.postMessage(recipient, `Sorry I could not find the job *${job}*`, {as_user: true});
      } else {
         log.detailedError('Error on call Jenkins', error);
         hubot.postMessage(recipient, 'Sorry I could not start the job *${job}*. See the error in the logs.', {as_user: true});
      }
   });
};

function getRecipient(hubot, message) {
   if (hubot._isPrivateConversation(message)) {
      return message.user;
   } else {
      return message.channel;
   }
}
