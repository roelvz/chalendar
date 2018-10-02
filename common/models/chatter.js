'use strict';

module.exports = function(Chatter) {
  Chatter.afterRemote('**', function(context, user, next) {
    if (context.methodString === 'Chatter.prototype.__get__groups') {
      let chatterId = context.instance.id;

      let chatModel = Chatter.app.models.Chat;
      let chatterInChatModel = Chatter.app.models.ChatterInChat;

      let promises = [];
      for (let i = 0; i < context.result.length; i++) {
        let group = context.result[i];

        promises.push(chatModel.findOne({where: {
          groupId: group.id,
        }})
          .then(chat => {
            return chatterInChatModel.findOne({
              where: {
                chatId: chat.id,
                chatterId: chatterId,
              },
            });
          })
          .then(chatterInChat => {
            group.newMessages =
              chatterInChat ? chatterInChat.newMessages : 0;
          }));
      }

      Promise.all(promises)
        .then(result => next())
        .catch(error => next());
    } else {
      next();
    }
  });
};
