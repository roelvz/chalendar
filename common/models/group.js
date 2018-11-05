'use strict';
let utils = require('../../utils/utils.js')();

module.exports = function(Group) {
  Group.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    if (context.req && context.req.user && context.req.user.sub) {
      context.args.data.creatorId = context.req.user.sub;
    } else {
      context.args.data.creatorId = 'DEV_USER';
    }
    next();
  });

  // Set number of new messages to 0 when reading a group's messages
  Group.afterRemote('findById', function(context, user, next) {
    utils.initMessages(Group, user, context);
    next();
  });
};
