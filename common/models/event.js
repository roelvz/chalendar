'use strict';

module.exports = function(Event) {
  // Set number of new messages to 0 when reading a group's messages
  // TODO: refactor with group.js
  Event.afterRemote('findById', function(context, user, next) {
    let chatterInChat = Event.app.models.ChatterInChat;
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
