# Commish
a simple [Slack](http://slack.com) bot Commissioner to interact with your [Yahoo Fantasy Sports](https://developer.yahoo.com/fantasysports/) Leagues.

Built with: 
- [BotKit](https://github.com/howdyai/botkit) - Building Blocks for Building Bots
- [YFsapi](https://github.com/whatadewitt/yfsapi) - Yahoo! Fantasy API Node Module

For now, the Commissioner can do two things:
- Keeps an eye on **transactions** and lets you know when activity happens
- gives you the **leagues standings** when you ask for them.

# SETUP
## Local Storage
By default, Botkit will use the local filesystem to store json files for local storage of users, channels and team data. On production, this bot will try to use a redis system specified by the *REDIS_URL* ENV variable.

## Install
```shell
$ npm install
```

## Dev
If you have Nodemon globally installed (not included in this project):
```shell
$ nodemon index.js
```

else:
```shell
$ node index.js
```
