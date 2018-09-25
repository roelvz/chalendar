'use strict';

module.exports = function(Message) {
  Message.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    context.args.data.creatorId = context.req.user.sub;
    next();
  });
};
