function takePlayerTurn(player, targets) {
    var hitNumber = rng(0, 100);
    
    if (hitNumber > 90) {
        //critical!
    }
    
    var rawAttack = Math.floor(((80 + (hitNumber/2)) / 100) * player.str);
    addToBattleLog(player.name + " did " + rawAttack + " damage to " + targets.join());
    
    processDamage(player, targets, rawAttack);
    
    decideWhoGoesNext();
}

function createNewPlayer(name) {
    var newPlayer = {
        name: name,
        level: 1,
        baseHP: 5000,
        baseMP: 1,
        str: 70,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        speed: 10
    }
    
    var stats = ['str', 'dex', 'con', 'int', 'wis', 'speed'];
    
    for (var bonusStats = 10; bonusStats > 0; bonusStats--) {
        var whichStat = rng(0, stats.length - 1);
        newPlayer[stats[whichStat]]++;
    }
    
    playerList.push(newPlayer);
}