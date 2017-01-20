'use strict';

const BotKit = require('botkit');
const YahooFantasy = require('yahoo-fantasy');

class Commish {

    constructor(name, opts) {

        this.name = name;

        // Config = defaults + opts
        const defaults = {
            botkit: {}
        };
        this.config = Object.assign(defaults, opts);

        try {

            if (!this.config.slackApiToken) {
                throw new Error('Commish: missing "slackApiToken" in config');
            }

            if (!this.config.yahooConsumerKey) {
                throw new Error('Commish: missing "yahooConsumerKey" in config');
            }

            if (!this.config.yahooConsumerSecret) {
                throw new Error('Commish: missing "yahooConsumerSecret" in config');
            }

        } catch (e) {
            console.log(e.name + ': ' + e.message);
        }

        // Prepare YahooFantasy API
        // TODO: Error handling
        this.yfApi = new YahooFantasy(this.config.YAHOO_CONSUMER_KEY, this.config.YAHOO_CONSUMER_SECRET);

        this.initBot();
    }

    initBot() {
        // TODO: Error handling
        this.botkitController = BotKit.slackbot(this.config.botkit);
        
        // TODO: Setup All Commands
    }

    // Start Bot Instance
    startBot() {
        this.bot = this.botkitController.spawn({
            token: process.env.SLACK_API_TOKEN
        }).startRTM(function(err,bot,payload) {
            // TODO: Better Error handling
            if (err) {
                throw err;
            }  
            // TODO: Cache Payload data
        });
    }

}

module.exports = Commish;
