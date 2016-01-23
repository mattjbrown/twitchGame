var options = {
    options: {
        debug: true
    },
    identity: {
        username: 'BotvanGS',
        password: oAuthPass
    },
    connection: {
        random: "chat",
        reconnect: true
    },
    channels: ["#betagpx"]
};

var options2 = {
    options: {
        debug: true
    },
    identity: {
        username: 'BotvanGS',
        password: oAuthPass
    },
    connection: {
        random: "group",
        reconnect: true
    },
    channels: ["#betagpx"]
};


var client = new irc.client(options);
var groupClient = new irc.client(options2);
client.connect();
groupClient.connect();

client.on("chat", function (channel, user, message, self) {
    getCommandDetails(user, message);
});

function getCommandDetails(user, message) {
    var commandBits = message.split(" ");
    
    var command = commandBits.shift();
    var userName = user['display-name'];
    
    if (command === '!status') {
        var player = _.find(battleActors, function (player) {
           return player.name.toLowerCase() === userName.toLowerCase();
        });
        
        if (player) {
            var statusString = "" + 
            "HP: " + player.curHP + "/" + player.characterStats.maxHP + ", " +
            "MP: " + player.curMP + "/" + player.characterStats.maxMP + ", " +
            "LV: " + player.level;
            groupClient.whisper(userName, statusString);
        }
    }
    
    if (command === '!join') {
        var player = _.find(playerList, function (player) {
           return player.name.toLowerCase() === userName.toLowerCase();
        });
        
        if (player) {
            groupClient.whisper(userName, "You're already in the game, dummy!");
            return;
        }

        if (playerList.length >= maxPlayers) {
            var playerNames = _.pluck(playerList, 'name');
                        
            groupClient.whisper(userName, "The game is currently full. Current players are: " + playerNames.join());
        } else {
            createPlayer(userName);
        }
    }
    
    if (command === '!attack') {
        var player = _.find(playerList, function (player) {
           return player.name.toLowerCase() === userName.toLowerCase();
        });
        
        if (!player) {
            groupClient.whisper(userName, "You're not in the game!");
        }
        
        if (nextPlayer.name === player.name) {
            var target = commandBits.shift();
            var enemyNames = _.pluck(_.where(battleActors, { isEnemy: true, fainted: false }), 'name');
            
            if (target && _.contains(enemyNames, target)) {
                takePlayerTurn(player, [ target ]);
            }
            else {
                groupClient.whisper(userName, "Invalid attack target. Valid enemies are: " + enemyNames.join());
            }
        } else {
            groupClient.whisper(userName, "It's not your turn, dummy!");
        }
    }
    
    if (command === '!battlestart' && userName === 'IvanGPX') {
        startBattle();
    }
}

function debugCommand(message, userName) {
    var user = {};
    user['display-name'] = userName || 'IvanGPX';
    
    getCommandDetails(user, message);
}