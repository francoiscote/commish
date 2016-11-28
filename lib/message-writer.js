messageWriter = {

  transaction: function(t, allTeams) {
    let message = {
      text: "",
      attachments: []
    }

    switch (t.type) {
      case "add":
        {
          // Get Team Info
          let team = allTeams.find((e) => e.team_key === t.players[0].transaction_data.destination_team_key);
          message.text = `It is my pleasure to announce that *${team.name}* signed a player.`;

          let att = buildTransactionAttachement(t.players[0], team);
          att.ts = t.timestamp
          message.attachments.push(att);

          break;
        }
      case "drop":
        {
          // Get Team Info
          let team = allTeams.find((e) => e.team_key === t.players[0].transaction_data.source_team_key);
          message.text = `It is my pleasure to announce that *${team.name}* dropped a player.`;

          let att = buildTransactionAttachement(t.players[0], team);
          att.ts = t.timestamp
          message.attachments.push(att);

          break;
        }
      case "add/drop":
        
        // Get Team Info
        let team = allTeams.find((e) => {
          if (t.players[0].transaction_data.type === 'add') {
            return e.team_key === t.players[0].transaction_data.destination_team_key
          } else {
            return e.team_key === t.players[0].transaction_data.source_team_key
          }
        });
        
        message.text = `It is my pleasure to announce that *${team.name}* made a change to his team.`;

        // Build Attachements
        t.players.forEach(function(p) {
          let att = buildTransactionAttachement(p, team);
          att.ts = t.timestamp
          message.attachments.push(att);
        });

        break;

      case "trade":
        {
          message.text = `It is my pleasure to announce a *trade* between *${t.trader_team_name}* and *${t.tradee_team_name}*.`;
          
          // Build Attachements
          t.players.forEach(function(p) {
            
            // Get Destination Team Info
            let team = allTeams.find((e) => e.team_key === p.transaction_data.destination_team_key);
            
            let att = buildTransactionAttachement(p, team);
            att.ts = t.timestamp
            message.attachments.push(att);
          });
          
          break;
        }
      default:
    }

    return message;
  },
  
  standings: function(standings) {
    let message = {
      text: "",
      attachments: []
    }
    let colors = ['#00ff00','#5af000','#7dde00','#92cf00','#a4be00','#b1ad00','#bc9b00','#c58900','#cd7300','#d35e00','#d93f00','#dd0000']
    
    standings.forEach(function(s, i){
      let pointsBack = (i > 0) ? `- from Leader: ${s.standings.points_back} points.` : '';
      let att = {
        "fallback": `#${s.standings.rank} - ${s.name} - ${s.standings.points_for} points`,
        "color": colors[i],
        "author_name": `#${s.standings.rank}`,
        "author_link": s.url,
        "author_icon": s.team_logos[0].url,
        "title": `${s.name} - ${s.standings.points_for} points`,
        // "text": `Change: ${s.standings.points_change} points ${pointsBack}`,
      };
      message.attachments.push(att);
    });
    
    return message;
  },
  
  standings_full: function(standings) {
    let message = {
      text: "",
      attachments: []
    }
    let colors = ['#00ff00','#5af000','#7dde00','#92cf00','#a4be00','#b1ad00','#bc9b00','#c58900','#cd7300','#d35e00','#d93f00','#dd0000']
    
    standings.forEach(function(s, i){
      let pointsBack = (i > 0) ? `- from Leader: ${s.standings.points_back} points.` : '';
      let att = {
        "fallback": `#${s.standings.rank} - ${s.name} - ${s.standings.points_for} points`,
        "color": colors[i],
        "title": `#${s.standings.rank} - ${s.name} - ${s.standings.points_for} points`,
        "title_link": s.url,
        // "text": `Change: ${s.standings.points_change} points ${pointsBack}`,
        "fields": [
                {
                    "title": "Change",
                    "value": `${s.standings.points_change} points`,
                    "short": true
                },
                {
                    "title": "from Leader",
                    "value": `${s.standings.points_back} points`,
                    "short": true
                },
                {
                    "title": "Moves",
                    "value": s.number_of_moves,
                    "short": true
                },
                {
                    "title": "Waiver Priority",
                    "value": s.waiver_priority,
                    "short": true
                }
            ],
        "thumb_url": s.team_logos[0].url
      };
      message.attachments.push(att);
    });
    
    return message;
  }
  
};

/**
 * Builds Message Attachements for Transaction Notification messages
 * @param  {object} player the player involved in the transaction
 * @param  {object} team   the team doing the transaction
 * @return {object}        a Slack Message object https://api.slack.com/docs/message-attachments#attachment_structure
 */
function buildTransactionAttachement(player, team = false, allTeams = false) {
  let a = {};
  let playerAttributes = "(" + player.editorial_team_abbr + " - " + player.display_position + ")";
  
  switch (player.transaction_data.type) {
    case "add":
      {
        let data = player.transaction_data;
        
        let source = '';
        if (data.source_type === 'waivers') {
          source = 'from Waivers';
        } else if (data.source_type === 'freeagents') {
          source = 'from Free Agents';
        }

        a = {
          "fallback": `${player.name.full} signed with ${team.name}`,
          "color": "#00AA00",
          "author_name": team.name,
          "author_link": team.url,
          "author_icon": team.team_logos[0].url,
          "title": `${player.name.full} ${playerAttributes}`,
          // "title_link": "https://api.slack.com/",
          "text": `added ${source}`,
          // "image_url": "http://my-website.com/path/to/image.jpg",
          // "thumb_url": "http://example.com/path/to/thumb.png"
        };
        break;
      }

    case "drop":
      {
        let data = player.transaction_data;
        a = {
          "fallback": player.name.full + " was dropped by" + data.source_team_name,
          "color": "#FF0000",
          "author_name": team.name,
          "author_link": team.url,
          "author_icon": team.team_logos[0].url,
          "title": `${player.name.full} ${playerAttributes}`,
          "text": `dropped`,
          // "title_link": "https://api.slack.com/",
          // "image_url": "http://my-website.com/path/to/image.jpg",
          // "thumb_url": "http://example.com/path/to/thumb.png",
        };
        break;
      }
    
    case "trade":
      {
        let data = player.transaction_data;
        
        a = {
          "fallback": `${player.name.full} was trade from ${data.source_team_name} to ${data.destination_team_name}`,
          "color": "#0000FF",
          "author_name": team.name,
          "author_link": team.url,
          "author_icon": team.team_logos[0].url,
          "title": `${player.name.full} ${playerAttributes}`,
          "text": `Traded to ${team.name}`,
          // "title_link": "https://api.slack.com/",
          // "image_url": "http://my-website.com/path/to/image.jpg",
          // "thumb_url": "http://example.com/path/to/thumb.png",
        };
        break;
      }
  }

  return a;
}

module.exports = messageWriter;
