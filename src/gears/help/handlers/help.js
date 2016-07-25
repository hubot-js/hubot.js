'use strict';

exports.process = process;

var speech = require(__base + 'src/lib/speech');

function process(message, hubot) {
   publicHelp(message, hubot);
   privateHelp(message, hubot);
}

function publicHelp(message, hubot) {
   if (hubot._isChannelConversation(message)) {
      hubot.postMessage(message.channel, getPublicHelpMessage(hubot._getUserById(message.user)), {as_user: true});
   }
}

function privateHelp(message, hubot) {
   if (hubot._isPrivateConversation(message)) {
      hubot.postMessage(message.user, getPrivateHelpMessage(hubot, hubot._getUserById(message.user)), {as_user: true});
   }
}

function getPublicHelpMessage(user) {
   return speech.start().hello(user).append('You need help? Call me in private chat.').end();
}

function getPrivateHelpMessage(hubot, user) {
   return speech.start().hello(user).append('How can I help?').append(getHelpOptions(hubot)).end();
}

function getHelpOptions(hubot) {
   var speecher = speech.start();

   getVisibleCategories(hubot).forEach(category => buildCategoryDescription(hubot, speecher, category));

   return speecher.end();
}

function buildCategoryDescription(hubot, speecher, category) {
   speecher.paragraph().bold(category.name).line().append(category.description).paragraph();
   
   buildTasksDescription(hubot, speecher, category);
}

function buildTasksDescription(hubot, speecher, category) {
   getTasks(hubot, category).forEach(task => speecher.item().bold(task.trigger).separator().append(task.description).line());
}

function getVisibleCategories(hubot) {
   return hubot.core.categories.filter(c => c.visible);
}

function getTasks(hubot, category) {
   return hubot.core.tasks.filter(t => t.category == category.key);
}
