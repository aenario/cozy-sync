db = require './db'

# EVENT
module.exports = Event = db.define 'Event',
    id:          type:String, default: null
    caldavuri:   String
    start:       String
    end:         String
    rrule:       String
    place:       type: String, default: ''
    description: type: String, default: ''
    details:     type: String, default: ''
    diff:        type: Number, default: 0
    related:     type: String, default: null

# Add Ical utilities to Event model
require('cozy-ical').decorateEvent Event

Event.all = (cb) -> Event.request 'byURI', cb
Event.byURI = (uri, cb) ->
    # See Alarm
    req = Event.request 'byURI', null, cb
    req.body = JSON.stringify key: uri
    req.setHeader 'content-type', 'application/json'