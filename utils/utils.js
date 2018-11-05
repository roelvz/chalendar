'use strict';

module.exports = function() {
  let module = {};

  module.initMessages = function initMessages(Entity, user, context) {
    let chatterInChat = Entity.app.models.ChatterInChat;
    let chatterId = 'DEV_USER';

    if (context.req && context.req.user && context.req.user.sub) {
      chatterId = context.req.user.sub;
    }

    let chat = context.result.chat();
    if (chat) {
      let chatId = context.result.chat().id;
      chatterInChat.findOne({
        where: {
          chatId: chatId,
          chatterId: chatterId,
        },
      })
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
    }
  };

  return module;
};
