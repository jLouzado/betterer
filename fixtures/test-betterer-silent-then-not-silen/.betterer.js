const { smaller } = require('@betterer/constraints');

let shrinks = 2;

module.exports = {
  'should shrink': {
    test: () => shrinks--,
    constraint: smaller
  }
};