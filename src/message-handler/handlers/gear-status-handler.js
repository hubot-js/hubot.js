'use strict';

const db = require('../../lib/db');
const trigger = require('../trigger');

exports.handle = handle;

function handle(hubot, message, core) {
  const action = getAction(message, hubot);

  if (action && isGearChangeStatusMessage(action, hubot, message)) {
    core.isAdminUser(message.user)
        .then(isAdmin => changeStatus(isAdmin, action, hubot, message));

    return true;
  }

  return false;
}

function changeStatus(isAdmin, action, hubot, message) {
  if (isAdmin) {
    const gear = discoverGear(action, hubot, message);

    if (gear) {
      if (gear.active === action.status) {
        hubot.speak(message, 'gears.already', { statusDescription: action.already });
      } else {
        changeGearStatus(action, hubot, gear.description)
          .then(() => hubot.speak(message, sucessMessage(action, hubot, gear.description)),
          () => hubot.speak(message, errorMessage(action, hubot, gear.description)));
      }
    }
  }
}

function changeGearStatus(action, hubot, gear) {
  hubot.findGear(gear).active = action.status;

  return db.getDb().run('UPDATE gears SET active = ? WHERE description = ?', action.status, gear);
}

function isGearChangeStatusMessage(action, hubot, message) {
  return hubot.gears.find(gear => trigger.check(message.text, `${action.description} ${gear.description}`).ok) !== null;
}

function discoverGear(action, hubot, message) {
  const gearDescription = message.text.replace(`${action.description} `, '');
  return hubot.findGear(gearDescription);
}

function sucessMessage(action, hubot, gearDescription) {
  return hubot.speech().append('gears.activation.success', { statusDescription: action.success, gearDescription })
        .end();
}

function errorMessage(action, hubot, gearDescription) {
  return hubot.speech().append('gears.activation.error', { statusDescription: action.description, gearDescription })
        .end();
}

function getAction(message, hubot) {
  const active = hubot.i18n('gears.activation.active');
  const inactive = hubot.i18n('gears.activation.inactive');
  const activate = hubot.i18n('gears.activation.activate');
  const deactivate = hubot.i18n('gears.activation.deactivate');
  const activated = hubot.i18n('gears.activation.actived');
  const deactivated = hubot.i18n('gears.activation.deactivated');

  if (message.text.startsWith(activate)) {
    return { description: activate, status: true, already: active, success: activated };
  }

  if (message.text.startsWith(deactivate)) {
    return { description: deactivate, status: false, already: inactive, success: deactivated };
  }

  return null;
}
