// Generated by CoffeeScript 1.9.1
var CozyCardDAVBackend, Exc, WebdavAccount, allContactsId, async, axon, handle,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

async = require('async');

axon = require('axon');

Exc = require('jsDAV/lib/shared/exceptions');

WebdavAccount = require('../models/webdavaccount');

handle = function(err) {
  console.log(err);
  return new Exc.jsDAV_Exception(err.message || err);
};

allContactsId = 'all-contacts';

module.exports = CozyCardDAVBackend = (function() {
  function CozyCardDAVBackend(Contact) {
    this.Contact = Contact;
    this.saveLastCtag = bind(this.saveLastCtag, this);
    this.getLastCtag((function(_this) {
      return function(err, ctag) {
        var onChange, socket;
        _this.ctag = ctag + 1;
        _this.saveLastCtag(_this.ctag);
        onChange = function() {
          _this.ctag = _this.ctag + 1;
          return _this.saveLastCtag(_this.ctag);
        };
        socket = axon.socket('sub-emitter');
        socket.connect(9105);
        return socket.on('contact.*', onChange);
      };
    })(this));
  }

  CozyCardDAVBackend.prototype.getLastCtag = function(callback) {
    return WebdavAccount.first(function(err, account) {
      return callback(err, (account != null ? account.cardctag : void 0) || 0);
    });
  };

  CozyCardDAVBackend.prototype.saveLastCtag = function(ctag, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return WebdavAccount.first((function(_this) {
      return function(err, account) {
        if (err || !account) {
          return callback(err);
        }
        return account.updateAttributes({
          cardctag: ctag
        }, function() {});
      };
    })(this));
  };

  CozyCardDAVBackend.prototype.getAddressBooksForUser = function(principalUri, callback) {
    return this.Contact.tags(function(err, tags) {
      var books;
      books = tags.map(function(tag) {
        var book;
        book = {
          id: tag,
          uri: tag,
          principaluri: principalUri,
          "{http://calendarserver.org/ns/}getctag": this.ctag,
          "{DAV:}displayname": tag
        };
        return book;
      });
      books.push({
        id: allContactsId,
        uri: allContactsId,
        principaluri: principalUri,
        "{http://calendarserver.org/ns/}getctag": this.ctag,
        "{DAV:}displayname": 'Cozy Contacts'
      });
      return callback(null, books);
    });
  };

  CozyCardDAVBackend.prototype.getCards = function(addressbookId, callback) {
    var processContacts;
    processContacts = function(err, contacts) {
      if (err) {
        return callback(handle(err));
      }
      return async.mapSeries(contacts, function(contact, next) {
        return contact.toVCF(function(err, vCardOutput) {
          return next(err, {
            lastmodified: 0,
            carddata: vCardOutput,
            uri: contact.getURI()
          });
        });
      }, callback);
    };
    if (addressbookId === allContactsId) {
      return this.Contact.all(processContacts);
    } else {
      return this.Contact.byTag(addressbookId, processContacts);
    }
  };

  CozyCardDAVBackend.prototype.getCard = function(addressBookId, cardUri, callback) {
    return this.Contact.byURI(cardUri, function(err, contact) {
      if (err) {
        return callback(handle(err));
      }
      if (!contact.length) {
        return callback(null);
      }
      contact = contact[0];
      return contact.toVCF(function(err, vCardOutput) {
        return callback(null, {
          lastmodified: 0,
          carddata: vCardOutput,
          uri: contact.getURI()
        });
      });
    });
  };

  CozyCardDAVBackend.prototype.createCard = function(addressBookId, cardUri, cardData, callback) {
    var data;
    data = this.Contact.parse(cardData);
    data.carddavuri = cardUri;
    if (addressBookId !== allContactsId) {
      data.addTag(addressBookId);
    }
    return this.Contact.create(data, function(err, contact) {
      if (err != null) {
        return callback(handle(err));
      }
      return contact.handlePhoto(data.photo, callback);
    });
  };

  CozyCardDAVBackend.prototype.updateCard = function(addressBookId, cardUri, cardData, callback) {
    return this.Contact.byURI(cardUri, (function(_this) {
      return function(err, contact) {
        var data, k, v;
        if (err) {
          return callback(handle(err));
        }
        if (!contact.length) {
          return callback(handle('Not Found'));
        }
        contact = contact[0];
        data = _this.Contact.parse(cardData);
        data.id = contact._id;
        data.carddavuri = cardUri;
        if (addressBookId !== allContactsId) {
          data.addTag(addressBookId);
        }
        for (k in data) {
          v = data[k];
          contact[k] = v;
        }
        return contact.save(function(err, contact) {
          if (err != null) {
            return callback(handle(err));
          }
          return contact.handlePhoto(data.photo, callback);
        });
      };
    })(this));
  };

  CozyCardDAVBackend.prototype.deleteCard = function(addressBookId, cardUri, callback) {
    return this.Contact.byURI(cardUri, function(err, contact) {
      if (err) {
        return callback(handle(err));
      }
      contact = contact[0];
      return contact.destroy(function(err) {
        if (err) {
          return callback(handle(err));
        }
        return callback(null);
      });
    });
  };

  return CozyCardDAVBackend;

})();
