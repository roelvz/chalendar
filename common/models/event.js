'use strict';

module.exports = function(Event) {
  Event.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    if (context.req && context.req.user && context.req.user.sub) {
      context.args.data.creatorId = context.req.user.sub;
    } else {
      context.args.data.creatorId = 'DEV_USER';
    }
    next();
  });
};

module.exports = function(Event) {
  Event.beforeRemote('**', function(context, user, next) {
    // TODO: check in correct way
    if (context.methodString === 'Event.prototype.__create__messages') {
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
