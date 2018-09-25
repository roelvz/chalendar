'use strict';

module.exports = function(Group) {
  Group.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    // context.args.data.creatorId = context.req.accessToken.userId;
    next();
  });
};

module.exports = function(Group) {
  Group.beforeRemote('**', function(context, user, next) {
    // TODO: check in correct way
    if (context.methodString === 'Group.prototype.__create__messages') {
      context.args.data.creationDate = Date.now();
      console.log(context.req.user);
    }
    next();
  });
};
