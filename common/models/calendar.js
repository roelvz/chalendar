'use strict';

module.exports = function(Calendar) {
  Calendar.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    context.args.data.creatorId = context.req.user.sub;
    next();
  });
};
