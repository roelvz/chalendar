'use strict';

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
};

module.exports = function(Group) {
  Group.beforeRemote('**', function(context, user, next) {
    // TODO: check in correct way
    if (context.methodString === 'Group.prototype.__create__messages') {
      context.args.data.creationDate = Date.now();
      if (context.req && context.req.user && context.req.user.sub) {
        context.args.data.creatorId = context.req.user.sub;
      } else {
        context.args.data.creatorId = 'DEV_USER';
      }
    }
    next();
  });
};
