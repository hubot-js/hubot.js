'use strict';

const voca = require('voca');

exports.normalize = normalize;

function normalize(text) {
  return voca(text)
    .trim()
    .latinise()
    .lowerCase()
    .value();
}
