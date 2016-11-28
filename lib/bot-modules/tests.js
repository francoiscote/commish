const messageWriter = require('../message-writer');

module.exports = {
  addTo: function(controller) {

    controller.hears('test-transaction-adddrop', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-transaction-adddrop');
      let t = require('../../data/transaction_adddrop.json');

      let teams = null;
      controller.storage.channels.get(message.channel, function(err, data) {
        if (err) {
          throw err;
        }
        teams = data.teams;
      });

      bot.reply(message, messageWriter.transaction(t, teams));

    });

    controller.hears('test-transaction-drop', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-transaction-drop');
      let t = require('../../data/transaction_drop.json');

      // Get Teams Data
      let teams = null;
      controller.storage.channels.get(message.channel, function(err, data) {
        if (err) {
          throw err;
        }
        teams = data.teams;
      });

      bot.reply(message, messageWriter.transaction(t, teams));

    });

    controller.hears('test-transaction-add', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-transaction-add');
      let t = require('../../data/transaction_add.json');

      // Get Teams Data
      let teams = null;
      controller.storage.channels.get(message.channel, function(err, data) {
        if (err) {
          throw err;
        }
        teams = data.teams;
      });

      bot.reply(message, messageWriter.transaction(t, teams));

    });
    
    controller.hears('test-transaction-trade', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-transaction-trade');
      let t = require('../../data/transaction_trade.json');

      // Get Teams Data
      let teams = null;
      controller.storage.channels.get(message.channel, function(err, data) {
        if (err) {
          throw err;
        }
        teams = data.teams;
      });

      bot.reply(message, messageWriter.transaction(t, teams));

    });
    
    controller.hears('test-standings-full', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-standings');
      let standings = require('../../data/standings.json');
      
      bot.reply(message, messageWriter.standings_full(standings));
      
    });
    
    controller.hears('test-standings', 'direct_message,direct_mention', function(bot, message) {
      console.log('Test:test-standings');
      let standings = require('../../data/standings.json');

      bot.reply(message, messageWriter.standings(standings));

    });
    

  }
}
