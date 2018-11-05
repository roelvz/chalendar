'use strict';

module.exports = function(Chat) {
  // Set creatorId and creationDate for a new message.
  Chat.beforeRemote('**', function(context, user, next) {
    if (context.methodString === 'Chat.prototype.__create__messages') {
      let creatorId = 'DEV_USER';
      if (context.req && context.req.user && context.req.user.sub) {
        creatorId = context.req.user.sub;
      }
      context.args.data.creatorId = creatorId;
      context.args.data.creationDate = Date.now();
    }
    next();
  });

  // Increase number of new messages when adding a message
  Chat.afterRemote('**', function(context, user, next) {
    if (context.methodString === 'Chat.prototype.__create__messages') {
      let chatterInChat = Chat.app.models.ChatterInChat;

      let creatorId = 'DEV_USER';
      if (context.req && context.req.user && context.req.user.sub) {
        creatorId = context.req.user.sub;
      }

      let chatId = context.instance.id;

      Chat.app.models.Chatter.find()
        .then(chatters => {
          let promises = [];

          // Increase new message count for all other users
          // TODO: only for members of group/calendar
          for (let i = 0; i < chatters.length; i++) {
            let chatter = chatters[i];

            // No need to increase new message count for creator of message
            if (chatter.id !== creatorId) {
              chatterInChat.findOne({where: {
                chatId: chatId,
                chatterId: chatter.id,
              }})
                .then(result => {
                  chatterInChat.upsert({
                    id: result ? result.id : undefined,
                    chatId: chatId,
                    chatterId: chatter.id,
                    newMessages: result ? result.newMessages + 1 : 1,
                  });
                });
            }
          }
        });
    }
    next();
  });
};
