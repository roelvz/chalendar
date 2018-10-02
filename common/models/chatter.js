'use strict';

module.exports = function(Chatter) {
  Chatter.afterRemote('**', function(context, user, next) {
    let chatModel = Chatter.app.models.Chat;
    let chatterInChatModel = Chatter.app.models.ChatterInChat;
    let eventModel = Chatter.app.models.Event;

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
      let promises2 = [];
      for (let i = 0; i < context.result.length; i++) {
        let calendar = context.result[i];
        calendar.newMessages = 0;

        promises.push(eventModel.find({where: {
          calendarId: calendar.id,
        }})
          .then(events => {
            for (let j = 0; j < events.length; j++) {
              let event = events[j];

              promises2.push(chatModel.findOne({where: {
                eventId: event.id,
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
                  calendar.newMessages +=
                    chatterInChat ? chatterInChat.newMessages : 0;
                }));
            }
          })
        );
      }
      Promise.all(promises)
        .then(result => Promise.all(promises2))
        .then(result => next())
        .catch(error => next());
    } else {
      next();
    }
  });
};
