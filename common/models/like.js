'use strict';

module.exports = function(Like) {
  Like.beforeRemote('create', function(context, user, next) {
    context.args.data.date = Date.now();
    next();
  });
};
