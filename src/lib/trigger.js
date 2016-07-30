'use strict';

exports.check = check;

var stringfy = require('string');

function check(message, trigger) {
   return new Trigger('$').accept(message, trigger);
}

class Trigger {
   constructor(placeholder) {
      this.placeholder = placeholder;
   }

   accept(message, phrase) {
      message = this.normalize(message);
      phrase = this.normalize(phrase);

      if (!phrase.startsWith(this.placeholder) && phrase.indexOf(this.placeholder) > 0) {
         return this.acceptWithParams(message, phrase);
      }

      return this.acceptWithoutParams(message, phrase);
   }

   acceptWithParams(message, phrase) {
      var count = this.countParams(phrase);
      var params = this.getParams(message, phrase);
      return { ok: params.length === count, params: params }
   }

   acceptWithoutParams(message, phrase) {
      return { ok: message == phrase };
   }

   normalize(text) {
      return stringfy(text).trim().latinise().s.toLowerCase();
   }

   countParams(phrase) {
      return phrase.match(new RegExp('\\' + this.placeholder, 'g')).length;
   }

   getParams(message, phrase) {
      // get $ to $  >  ['get ', ' to ']
      var triggerParts = phrase.split(this.placeholder).filter(s => s);
      
      // get alpha to beta  >  'alpha$beta'
      triggerParts.reduce((previous, next) => { 
         message = message.replace(previous, this.placeholder);
         message = message.replace(next, this.placeholder);
      });

      // 'alpha$beta'  >  ['alpha', 'beta']
      return message.split(this.placeholder).filter(s => s);
   }
}