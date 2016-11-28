//TODO: add setup-clear command

module.exports = {

  addTo: function(controller, yfApi) {

    controller.hears('setup', 'direct_message,direct_mention,mention', function(bot, message) {

      controller.storage.channels.get(message.channel, function(err, channelData) {
        console.log("CHANNEL DATA", channelData);

        if (channelData && channelData.setup_done) {
          bot.reply(message, {
            "text": "Looks like I'm already connected to a league. Here are the infos I have:",
            "attachments": [
              {
                "fields": [
                  {
                    "title": "League Id",
                    "value": channelData.leagueId,
                    "short": true
                  }, {
                    "title": "Watch Transactions",
                    "value": (channelData.watchTransactions)
                      ? 'Yes'
                      : 'No',
                    "short": true
                  }
                ]
              }
            ]
          });
        }

        // Start Setup Conversation
        bot.startConversation(message, function(err, convo) {
          if (err) {
            throw err;
          }

          convo.ask("Do you want to set up your Yahoo Fantasy League Integration ?", [
            {
              pattern: bot.utterances.yes,
              callback: function(response, convo) {
                convo.sayFirst('Allright! Say cancel at anytime if you want to stop the setup process.');
                convo.next();
              }
            }, {
              pattern: bot.utterances.no,
              callback: function(response, convo) {
                convo.stop();
              }
            }, {
              default: true,
              callback: function(response, convo) {
                // just repeat the question
                convo.repeat();
              }
            }
          ]);

          convo.ask("What is the ID of your Yahoo Fantasy League ? (The pattern looks something like `363.l.92378`)", [
            {
              pattern: '([0-9]{3}\.l\.[0-9]+)',
              callback: function(response, convo) {
                // since no further messages are queued after this,
                // the conversation will end naturally with status == 'completed'
                convo.next();
              }
            }, {
              pattern: 'cancel',
              callback: function(response, convo) {
                // stop the conversation. this will cause it to end with status == 'stopped'
                convo.stop();
              }
            }, {
              default: true,
              callback: function(response, convo) {
                convo.say("It seems your League ID format is wrong.");
                convo.repeat();
                convo.next();
              }
            }
          ], {'key': 'leagueId'});

          convo.on('end', function(convo) {
            if (convo.status == 'completed') {
              bot.reply(message, 'OK! I will update my dossier...');

              controller.storage.channels.get(message.channel, function(err, channel) {
                if (!channel) {
                  channel = {
                    id: message.channel
                  };
                }

                let leagueId = convo.extractResponse('leagueId');
                //Fetch Teams Data from Yahoo
                yfApi.league.teams(leagueId, function(err, data) {
                  if (err) {
                    console.log(err);
                    throw new Error('Could not fetch Teams Data', leagueId);
                  }
                  channel.teams = data.teams;

                  // TODO: if leagueId has changed, restart the watcher
                  channel.leagueId = leagueId;

                  channel.setup_done = true;

                  // TODO: question for watch
                  channel.watchTransactions = false;

                  // TODO: Fetch League Data from Yahoo and save it in the channels data.
                  controller.storage.channels.save(channel, function(err, id) {
                    bot.reply(message, 'Got it.');
                  });
                });

              });
            } else {
              // this happens if the conversation ended prematurely for some reason
              bot.reply(message, 'Perhaps we could set this up later. Write *@' + bot.identity.name + ' setup* when you are ready.');
            }
          });
        });

      });

    });

  }

}
