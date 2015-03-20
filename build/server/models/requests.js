// Generated by CoffeeScript 1.9.1
var byCalendar, byTag, tagsNCalendarsView, tagsView;

tagsView = {
  map: function(doc) {
    var ref;
    return (ref = doc.tags) != null ? typeof ref.forEach === "function" ? ref.forEach(function(tag) {
      return emit(tag, true);
    }) : void 0 : void 0;
  },
  reduce: function(key, values, rereduce) {
    return true;
  }
};

tagsNCalendarsView = {
  map: function(doc) {
    var ref;
    return (ref = doc.tags) != null ? typeof ref.forEach === "function" ? ref.forEach(function(tag, index) {
      var type;
      type = index === 0 ? 'calendar' : 'tag';
      return emit([type, tag], true);
    }) : void 0 : void 0;
  },
  reduce: function(key, values, rereduce) {
    return true;
  }
};

byCalendar = function(doc) {
  var ref;
  if (((ref = doc.tags) != null ? ref.length : void 0) > 0) {
    return emit(doc.tags[0], doc);
  } else {
    return emit(null, doc);
  }
};

byTag = function(doc) {
  var ref;
  return (ref = doc.tags) != null ? typeof ref.forEach === "function" ? ref.forEach(function(tag) {
    return emit(tag, doc);
  }) : void 0 : void 0;
};

module.exports = {
  cozyinstance: {
    all: function(doc) {
      return emit(doc._id, doc);
    }
  },
  webdavaccount: {
    all: function(doc) {
      return emit(doc._id, doc);
    }
  },
  contact: {
    all: function(doc) {
      return emit(doc._id, doc);
    },
    byURI: function(doc) {
      return emit(doc.carddavuri || doc._id + '.vcf', doc);
    },
    byTag: byTag,
    tags: tagsView
  },
  tag: {
    all: function(doc) {
      return emit(doc.name, doc);
    }
  },
  event: {
    all: function(doc) {
      return emit(doc._id, doc);
    },
    byURI: function(doc) {
      return emit(doc.caldavuri || doc._id + '.ics', doc);
    },
    tags: tagsNCalendarsView,
    byCalendar: byCalendar
  },
  user: {
    all: function(doc) {
      return emit(doc._id, doc);
    }
  }
};
