'use strict';

const db = require('./lib/db');

exports.firstRun = firstRun;

function firstRun(core, message) {
  db.getDb().run("INSERT INTO first_use(first_use) VALUES('NO')");
  db.getDb().run('INSERT INTO admins(admin) VALUES(?)', message.user);

  const hubot = core.hubot;
  const messageDelay = 3000;

  hubot.speak(message, message1(hubot, core, message), null, messageDelay)
    .then(() => hubot.speak(message, 'firstUse.message2', null, messageDelay))
    .then(() => hubot.speak(message, 'firstUse.message3', null, messageDelay))
    .then(() => hubot.speak(message, message4(hubot), null, messageDelay))
    .then(() => hubot.speak(message, message5(hubot), null, messageDelay))
    .then(() => hubot.speak(message, 'firstUse.message6', null, messageDelay))
    .then(() => hubot.speak(message, postGearsNames(hubot), null, messageDelay));
}

function message1(hubot, core, message) {
  return hubot.speech().hello(core.getUserById(message.user)).append('firstUse.message1', { botName: 'hubot' }).end();
}

function message4(hubot) {
  return hubot.speech().append('firstUse.message4').bold('gears.deactivate').period().end();
}

function message5(hubot) {
  return hubot.speech().append('firstUse.message5').bold('gears.configure').period().end();
}

function postGearsNames(hubot) {
  const speech = hubot.speech();

  hubot.gears.forEach(g => speech.item(g.description).line());

  return speech.end();
}
