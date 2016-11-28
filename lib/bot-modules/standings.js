const messageWriter = require('../message-writer');

module.exports = {
  addTo: function(controller, yfApi) {

    /**
    * Standings Command
    */
    controller.hears(['standings full', 'standings'], 'direct_message,direct_mention,mention', function(bot, msg) {      
      controller.storage.channels.get(msg.channel, function(err, channel) {
				console.log("CHANNEL DATA", channel);
        // Missing setup
        if (err || !channel || !channel.setup_done || !channel.leagueId ) {
          bot.reply(msg, 'My Yahoo Fantasy League Integration is not set up in this channel. Write *@'+bot.identity.name+' setup* so I can help you.');
          return;
        }
        
        // Fetch Standings
        yfApi.league.standings(channel.leagueId, function(err, data){
          if (err) {
      			console.log(err);
      			throw new Error ('Could not fetch Standings', this.leagueId);
      		}
          
          if (data.standings) {
            console.log(msg.match[0]);
            if (msg.match[0] === 'standings full') {
              bot.reply(msg, messageWriter.standings_full(data.standings));
            } else {
              bot.reply(msg, messageWriter.standings(data.standings));
            }
          }
          
        });        
      });
      
    });

  }
};
