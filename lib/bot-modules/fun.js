module.exports = {
    addTo: function(controller) {
        
        /**
         * Giroux Reaction
         */
        controller.hears('(Giroux|giroux|Crosby|crosby)', ['ambient'], function(bot, msg) {
            bot.api.reactions.add({
                timestamp: msg.ts,
                channel: msg.channel,
                name: msg.match[1].toLowerCase(),
            },function(err) {
                if (err) { console.log(err) }
            });
        });
                
        /**
         * @fhurtubise troll
         * UserID: U24ULCV5W
         */
        
        const canadiensKeywords = [
          'Canadiens', 'Habs', 'Therrien', 
          'Beaulieu', 'Byron', 'Carr',
          'Danault', 'Desharnais', 'Emelin', 'Flynn', 'Galchenyuk', 'Gallagher',
          'Lehkonen', 'Markov', 'Mitchell', 'Montoya', 'Pacioretty', 'Pateryn',
          'Petry', 'Plekanec', 'Price', 'Radulov', 'Sergachev', 'Shaw', 'Weber'
        ];
        // add lowercase
        let keys = canadiensKeywords.concat(canadiensKeywords.map((e, i, arr) => {
          return e.toLowerCase();
        }));
                
        controller.hears(keys, ['ambient'], function(bot, msg) {
            if (msg.user === 'U24ULCV5W') {
                bot.api.reactions.add({
                    timestamp: msg.ts,
                    channel: msg.channel,
                    name: 'troll',
                },function(err) {
                    if (err) { console.log(err) }
                });
            }
        });
    }
};
