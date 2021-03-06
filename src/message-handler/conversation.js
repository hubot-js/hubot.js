'use strict';

const EventEmitter = require('events');

const Q = require('q');

const i18n = require('../lib/i18n');
const trigger = require('./trigger');

exports.startConversation = startConversation;
exports.hasActiveConversation = hasActiveConversation;
exports.notify = notify;

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

let activeConversations = [];
const nodeModules = '../../node_modules/';

function startConversation(hubot, conversation, message) {
  activeConversations.push(conversation);

  conversation.nextInteration = 0;

  start(hubot, conversation, message);
}

function start(hubot, conversation, message) {
  const interactions = conversation.interactions;

  if (conversation.nextInteration < interactions.length) {
    speak(hubot, message, conversation, () => {
      start(hubot, conversation, message);
    });
  }

  if (conversation.nextInteration === interactions.length) {
    if (conversation.previousConversation) {
      start(hubot, conversation.previousConversation, message);
    } else {
      endConversations(conversation);
    }
  }
}

function speak(hubot, message, conversation, callback) {
  const interaction = conversation.interactions[conversation.nextInteration];

  hubot.speak(message, interaction.speak).then(() => {
    if (justSpeak(conversation, interaction, callback)) return;

    myEmitter.once(message.user, (response) => {
      if (withoutExpectedResponse(conversation, interaction, response, hubot, message, callback)) return;

      if (withExpectedResponse(conversation, interaction, response, hubot, message, callback)) return;

      Q(handleResponse(hubot, conversation, interaction, response)).then((text) => {
        conversation.nextInteration++;

        if (text) {
          hubot.speak(message, text).then(() => {
            if (hasAnotherInteraction(conversation, interaction, response, hubot, message)) return;
            callback(conversation);
          });
        } else {
          if (hasAnotherInteraction(conversation, interaction, response, hubot, message)) return;
          callback(conversation);
        }
      }, (text) => {
        speakReturnedText(hubot, message, conversation, text, callback);
      });
    });
  });
}

function justSpeak(conversation, interaction, callback) {
  if (!interaction.expectedResponses && !interaction.handler) {
    conversation.nextInteration++;
    callback(conversation);
    return true;
  }

  return false;
}

function withoutExpectedResponse(conversation, interaction, response, hubot, message, callback) {
  if (!interaction.expectedResponses) {
    Q(handleResponse(hubot, conversation, interaction, response)).then((text) => {
      conversation.nextInteration++;
      speakReturnedText(hubot, message, conversation, text, callback);
    }, (text) => {
      speakReturnedText(hubot, message, conversation, text, callback);
    });
    return true;
  }

  return false;
}

function speakReturnedText(hubot, message, conversation, text, callback) {
  if (text) {
    hubot.speak(message, text).then(() => {
      callback(conversation);
    });
  } else {
    callback(conversation);
  }
}

function withExpectedResponse(conversation, interaction, response, hubot, message, callback) {
  if (!getExpectedResponse(interaction.expectedResponses, response)) {
    hubot.speak(message, invalidResponseMessage(hubot, getExpectedResponses(interaction))).then(() => {
      callback(conversation);
    });
    return true;
  }

  return false;
}

function hasAnotherInteraction(conversation, interaction, response, hubot, message) {
  const expectedResponse = getExpectedResponse(interaction.expectedResponses, response);

  if (expectedResponse.iteration) {
    const newConversation = {
      user: message.user,
      interactions: [expectedResponse.iteration],
      gear: conversation.gear,
      nextInteration: 0,
      previousConversation: conversation
    };

    start(hubot, newConversation, message);
    return true;
  }

  return false;
}

function handleResponse(hubot, conversation, interaction, response) {
  if (interaction.handler) {
    const handler = require(`${nodeModules}gear-${conversation.gear}/${interaction.handler}`);
    return handler.handle(hubot, response.text);
  }

  return null;
}

function getExpectedResponse(expectedResponses, response) {
  if (expectedResponses) {
    const responses = expectedResponses.filter(expectedResponse => expectedResponse.response);

    if (responses.length === 0) {
      return expectedResponses[0];
    }

    return expectedResponses.find(r => trigger.check(i18n.t(r.response), response.text).ok);
  }

  return null;
}

function getExpectedResponses(interaction) {
  const expectedResponses = [];

  interaction.expectedResponses.forEach(e => expectedResponses.push(i18n.t(e.response)));

  return expectedResponses;
}

function invalidResponseMessage(hubot, expectedResponses) {
  return hubot.speech().append('didNotUnderstand')
    .bold(expectedResponses.join(', ')).append(').').end();
}

function hasActiveConversation(message) {
  return getActiveConversation(message) != null;
}

function notify(message) {
  myEmitter.emit(message.user, message);
}

function getActiveConversation(message) {
  return activeConversations.find(c => c.user === message.user);
}

function endConversations(conversation) {
  activeConversations = activeConversations.filter(c => c.user !== conversation.user);
}
