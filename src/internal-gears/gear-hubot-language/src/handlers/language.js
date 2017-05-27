'use strict';

const db = require('../../../../lib/db');
const i18n = require('../../../../lib/i18n');
const trigger = require('../../../../message-handler/trigger');

exports.handle = handle;

function handle(hubot, message) {
  const acceptance = trigger.check(message.text, hubot.i18n('hubot-language:command.change.trigger'));

  if (acceptance.ok) {
    const language = acceptance.params[0];

    const gearsWithLanguage = hubot.gears.filter(g => g.locales.includes(language.toLowerCase()));

    if (gearsWithLanguage.length > 0) {
      i18n.changeLanguage(language);

      db.getDb().run('UPDATE config SET language = ?', language);

      hubot.speak(message, 'hubot-language:sucess', { language });
    } else {
      hubot.speak(message, 'hubot-language:error', { language });
    }

    return true;
  }

  return false;
}
