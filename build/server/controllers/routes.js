// Generated by CoffeeScript 1.9.1
var account;

account = require('./account');

module.exports = {
  '': {
    get: account.index
  },
  'token': {
    post: account.createCredentials
  }
};
