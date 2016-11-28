const config = require('config');
const TransactionWatcher = require('../transaction-watcher');
const messageWriter = require('../message-writer');

let watchers = [];

let startWatcher = function(yfApi, channelId, leagueId, bot, controller) {
    
	console.log(`Start Watcher for Channel:${channelId} League:${leagueId}`);
    // Create new watcher
	let w = new TransactionWatcher(yfApi, leagueId, config.get("TransactionWatcher"));
	
	// Place it in array with Channel Index
	watchers.push({
		"channelId": channelId,
		"watcher": w
	})
    
    w.on('new_transaction', function(t) {
        console.log('NEW TRANSACTION', t);
                
        controller.storage.channels.get(channelId, function(err, data) {
            if (err) {
                throw err;
            }
            let teams = data.teams || [];
            
            bot.say(Object.assign(
                { channel: channelId },
                messageWriter.transaction(t, teams)
            ));
            
        });
        
        
    });
	
	// Start it
	w.start();
};


let destroyWatcher = function(channelId) {
    console.log(`Stop Watcher for Channel:${channelId}`);
	// Find by channelId
	let w = watchers.find((e) => e.channelId === channelId);
	
    console.log(w);
	// Stop and Destroy
	if (w) {
        w.stop();
        w.removeAllListeners('new_transaction');
        w = null;
		// watchers.splice(i, 1)
	}
};


module.exports = {

	addTo: function(controller, yfApi) {
		
		// On RTM Open, start multiple watchers, on all active channels
		controller.on('rtm_open', function(bot) {
		    
		  controller.storage.channels.all(function(err, all_channel_data) {
		    console.log(all_channel_data);
				
				// Start watchers for all active channels.
				all_channel_data.forEach(function(c) {
					if (c.watchTransactions && c.leagueId) {
						startWatcher(yfApi, c.id, c.leagueId, bot, controller);
					}
				});
				
		  });
		});
		
		// TODO: kill all Watchers
		controller.on('rtm_close', function(bot) {});
		
		// TODO: start watching if setup on controller.on('bot_channel_join')
		// TODO: stop watching if setup on controller.on('channel_left')
		
		// Start or Stop Watching this channel's league
		controller.hears('watch', 'direct_message,direct_mention,mention', function(bot, message){
			
			controller.storage.channels.get(message.channel, function(err, channel) {
				console.log("CHANNEL DATA", channel);
				
				// Missing setup
		    if (err || !channel || !channel.setup_done || !channel.leagueId ) {
					bot.reply(message, 'My Yahoo Fantasy League Integration is not set up in this channel. Write *@'+bot.identity.name+' setup* so I can help you.');
					return;
				} else {
					
					bot.startConversation(message, function(err, convo) {
						if (err) {
							throw err;
						}
						
						// This is a toggle question. Yes means toggle the watch option.
						const question = (channel.watchTransactions) ? "Do you want me to pause reporting your League's Transactions into this channel ?" : "Do you want me to report all of you League's Transactions into this channel ?";
						
						convo.ask(question, [
 							{
 				        pattern: bot.utterances.yes,
 				        callback: function(response,convo) {
 				          convo.next();
 				        }
 				      },
 							{
 				        pattern: bot.utterances.no,
 				        callback: function(response,convo) {
 				          convo.stop();
 				        }
 				      },
 				      {
 				        default: true,
 				        callback: function(response,convo) {
 				          // just repeat the question
 				          convo.repeat();
 				        }
 				      }
 						]);
						
						convo.on('end', function(convo) {
							
							if (convo.status == 'completed') {
								
								// Toggle Watch Option
								channel.watchTransactions = (channel.watchTransactions) ? false : true;
								
								controller.storage.channels.save(channel, function(err, id) {
									if (channel.watchTransactions) {
										startWatcher(yfApi, channel.id, channel.leagueId, bot, controller);
										bot.reply(message, 'Got it. I will keep you up to date with all transactions from the league. Call *@'+bot.identity.name+' watch* again if you change your mind.');
									} else {
										destroyWatcher(channel.leagueId);
										bot.reply(message, 'Got it. I will shut up. Call *@'+bot.identity.name+' watch* again if you change your mind.');
									}
								});
								
							} else {
                
								// this happens if the conversation ended prematurely for some reason
								bot.reply(message, 'Allright. Nothing changed.');
								
              }
						});
						
					});
					
				}

			});
		
		});
		
	}
}
