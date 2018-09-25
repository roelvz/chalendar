'use strict';

module.exports = function(Event) {
  Event.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    context.args.data.creatorId = context.req.user.sub;
    next();
  });
};

module.exports = function(Event) {
  Event.beforeRemote('**', function(context, user, next) {
    console.log(context.methodString);
    // TODO: check in correct way
    if (context.methodString === 'Event.prototype.__create__messages') {
      context.args.data.creationDate = Date.now();
      context.args.data.creatorId = context.req.user.sub;
    }
    next();
  });
};
