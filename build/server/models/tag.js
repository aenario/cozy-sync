// Generated by CoffeeScript 1.9.1
var Tag, americano, log;

americano = require('americano-cozy');

log = require('printit')({
  prefix: 'tag:model'
});

module.exports = Tag = americano.getModel('Tag', {
  name: {
    type: String
  },
  color: {
    type: String,
    "default": '#008AF6'
  }
});

Tag.byNames = function(names, callback) {
  return Tag.request('all', {
    keys: names
  }, callback);
};

Tag.getOrCreateByName = function(name, callback) {
  var createIt;
  createIt = function() {
    return Tag.create({
      name: name
    }, callback);
  };
  return Tag.request('all', {
    key: name
  }, function(err, tags) {
    if (err) {
      log.error(err);
      return createIt();
    } else if (tags.length === 0) {
      return createIt();
    } else {
      return callback(null, tags[0]);
    }
  });
};
