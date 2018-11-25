'use strict';
let utils = require('../../utils/utils.js')();

module.exports = function(Event) {
  // Set creationDate and creatorId for a new event.
  // @Roel, dit werkt precies niet? CreationDate en cratorId blijft leeg. Een idee waarom? want da lijkt correct.
  Event.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    if (context.req && context.req.user && context.req.user.sub) {
      context.args.data.creatorId = context.req.user.sub;
    } else {
      context.args.data.creatorId = 'DEV_USER';
    }
    next();
  });

  // Set number of new messages to 0 when reading a group's messages
  Event.afterRemote('findById', function(context, user, next) {
    utils.initMessages(Event, user, context);
    next();
  });
};
