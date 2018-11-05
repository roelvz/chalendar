'use strict';
let utils = require('../../utils/utils.js')();

module.exports = function(Event) {
  // Set number of new messages to 0 when reading a group's messages
  Event.afterRemote('findById', function(context, user, next) {
    utils.initMessages(Event, user, context);
    next();
  });
};
