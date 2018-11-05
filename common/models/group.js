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

  // Set number of new messages to 0 when reading a group's messages
  Group.afterRemote('findById', function(context, user, next) {
    let chatterInChat = Group.app.models.ChatterInChat;
    let chatterId = 'DEV_USER';

    if (context.req && context.req.user && context.req.user.sub) {
      chatterId = context.req.user.sub;
    }

    let chatId = context.result.chat().id;
    chatterInChat.findOne({where: {
      chatId: chatId,
      chatterId: chatterId,
    }})
      .then(result => {
        if (result) {
          chatterInChat.upsert({
            id: result.id,
            chatId: chatId,
            chatterId: chatterId,
            newMessages: 0,
          });
        }
      });
    next();
  });
};
