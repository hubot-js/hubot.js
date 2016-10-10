'use strict';

exports.handle = handle;

const conversation = require(__base + 'src/lib/conversation');

function handle(hubot, message) {
   if (conversation.hasActiveConversation(message)) {
      conversation.notify(message);
      return true;  
   } 

   return false;
}
