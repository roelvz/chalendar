'use strict';

module.exports = function(Calendar) {
  // Set creationDate and creatorId for a new calendar.
  Calendar.beforeRemote('create', function(context, user, next) {
    context.args.data.creationDate = Date.now();
    if (context.req && context.req.user && context.req.user.sub) {
      context.args.data.creatorId = context.req.user.sub;
    } else {
      context.args.data.creatorId = 'DEV_USER';
    }
    next();
  });

  // Calculate # of new messages for event
  Calendar.afterRemote('**', function(context, user, next) {
    if (context.methodString === 'Calendar.prototype.__get__events') {
      let eventModel = Calendar.app.models.Event;
      let chatModel = Calendar.app.models.Chat;
      let chatterInChatModel = Calendar.app.models.ChatterInChat;

      let calendarId = context.instance.id;

      let creatorId = 'DEV_USER';
      if (context.req && context.req.user && context.req.user.sub) {
        creatorId = context.req.user.sub;
      }

      let promises = [];
      for (let i = 0; i < context.result.length; i++) {
        let event = context.result[i];
        event.newMessages = 0;

        promises.push(chatModel.findOne({where: {
          eventId: event.id,
        }})
          .then(chat => {
            return chatterInChatModel.findOne({
              where: {
                chatId: chat.id,
                chatterId: creatorId,
              },
            });
          })
          .then(chatterInChat => {
            event.newMessages =
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
