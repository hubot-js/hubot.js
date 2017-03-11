'use strict';

const stringfy = require('string');

exports.normalize = normalize;

function normalize(text) {
  return stringfy(text).trim().latinise().s.toLowerCase();
}
