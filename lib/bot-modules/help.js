module.exports = {
  addTo: function(controller) {

    // If first time in channel, talk about Help and Setup
    controller.on('bot_channel_join', function(bot, msg) {
      console.log("bot_channel_join");

      controller.storage.channels.get(msg.channel, function(err, channel) {
        console.log("CHANNEL DATA", channel);
        if (err || !channel.setup_done) {
          bot.say(msg, 'Very happy to join you guys. Write *@' + bot.identity.name + ' help* to see what I can do. You will probably want to set up a link to your League by using *@' + bot.identity.name + ' setup*');
        }
      });
    });

    /**
    * Help Command
    */
    controller.hears('help', 'direct_message,direct_mention,mention', function(bot, msg) {
      let reply = `*@${bot.identity.name} setup*: Sets up a Yahoo League link into the current channel. When Setup is already done, will show the current settings.
*@${bot.identity.name} watch*: Enable/disable the notification of the League's transaction in the current channel.
*@${bot.identity.name} standings*: Show current League Leaderboard in a compact version
*@${bot.identity.name} standings full*: Show current League Leaderboard in a more complete version.
*@${bot.identity.name} help*: This message`;
      bot.reply(msg, reply);
    });

  }
};
