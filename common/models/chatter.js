'use strict';

module.exports = function(Chatter) {
  Chatter.afterRemote('**', function(context, user, next) {
    let chatModel = Chatter.app.models.Chat;
    let chatterInChatModel = Chatter.app.models.ChatterInChat;
    let evenModel = Chatter.app.models.Event;

    if (context.methodString === 'Chatter.prototype.__get__groups') {
      // Calculate # new messages for group
      let chatterId = context.instance.id;
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
    } else if (context.methodString === 'Chatter.prototype.__get__calendars') {
      // Calculate # new messages for calendar
      let chatterId = context.instance.id;
      let promises = [];
      for (let i = 0; i < context.result.length; i++) {
        let calendar = context.result[i];
        calendar.newMessages = 0;

        promises.push(evenModel.findOne({where: {
          calendarId: calendar.id,
        }})
          .then(event => {
            return chatModel.findOne({where: {
              eventId: event.id,
            }});
          })
          .then(chat => {
            return chatterInChatModel.findOne({
              where: {
                chatId: chat.id,
                chatterId: chatterId,
              },
            });
          })
          .then(chatterInChat => {
            calendar.newMessages +=
              chatterInChat ? chatterInChat.newMessages : 0;
          })
        );
      }
      Promise.all(promises)
        .then(result => next())
        .catch(error => next());
    } else {
      next();
    }
  });
};
