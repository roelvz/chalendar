'use strict';

module.exports = function(Chatter) {
  Chatter.afterRemote('**', function(context, user, next) {
    let chatterInChatModel = Chatter.app.models.ChatterInChat;

    let promises = [];
    if (context.methodString === 'Chatter.prototype.__get__groups') {
      // Calculate # new messages for group
      let chatterId = context.instance.id;

      for (let i = 0; i < context.result.length; i++) {
        let group = context.result[i];
        let chat = group.chat();

        promises.push(chatterInChatModel.findOne({
          where: {
            chatId: chat.id,
            chatterId: chatterId,
          },
        }).then(chatterInChat => {
          group.newMessages = chatterInChat ? chatterInChat.newMessages : 0;
        }));
      }
    } else if (context.methodString === 'Chatter.prototype.__get__calendars') {
      // Calculate # new messages for calendar
      let chatterId = context.instance.id;

      for (let i = 0; i < context.result.length; i++) {
        let calendar = context.result[i];
        calendar.newMessages = 0;
        let events = calendar.events();

        for (let j = 0; j < events.length; j++) {
          let event = events[j];
          let chat = event.chat();

          promises.push(chatterInChatModel.findOne({
            where: {
              chatId: chat.id,
              chatterId: chatterId,
            },
          }).then(chatterInChat => {
            calendar.newMessages +=
              chatterInChat ? chatterInChat.newMessages : 0;
          }));
        }
      }
    }
    Promise.all(promises)
      .then(() => next())
      .catch(error => {
        console.error(error);
        next();
      });
  });
};
