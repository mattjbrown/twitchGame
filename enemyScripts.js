var enemyTypes = [{
    name: 'Goblin',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'attack',
        power: 50,
        chance: 70
    },
    {
        name: 'goblin punch',
        special: function (enemy, enemies, players) {
            var toHit = rng(0, players.length - 1);
            var damage = (players[toHit].characterStats.level == enemy.characterStats.level) ? 10 : 1;
            var dmgString = (damage === 10) ? 'It was super effective!' : 'It was not very effective...';
            addToBattleLog(enemy.name + ' used Goblin Punch on ' + players[toHit].name + '.');
            addToBattleLog(dmgString);
            addToBattleLog(players[toHit].name + ' took ' + damage + ' damage.');
            processDamage(enemy, [ players[toHit].name ], damage);
        },
        chance: 30
        
    }],
    spriteInfo: 'goblin'
},
{
    name: 'Imp',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'attack',
        power: 5,
        chance: 70
    },
    {
        name: 'imp punch',
        special: function (enemy, enemies, players) {
            var toHit = rng(0, players.length - 1);
            var damage = (players[toHit].characterStats.level == enemy.characterStats.level) ? 10 : 1;
            var dmgString = (damage === 10) ? 'It was super effective!' : 'It was not very effective...';
            addToBattleLog(enemy.name + ' used Knight Punch on ' + players[toHit].name + '.');
            addToBattleLog(dmgString);
            addToBattleLog(players[toHit].name + ' took ' + damage + ' damage.');
            processDamage(enemy, [ players[toHit].name ], damage);
        },
        chance: 30
        
    }],
    spriteInfo: 'imp'
},
{
    name: 'Knight',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'attack',
        power: 5,
        chance: 70
    },
    {
        name: 'knight punch',
        special: function (enemy, enemies, players) {
            var toHit = rng(0, players.length - 1);
            var damage = (players[toHit].characterStats.level == enemy.characterStats.level) ? 10 : 1;
            var dmgString = (damage === 10) ? 'It was super effective!' : 'It was not very effective...';
            addToBattleLog(enemy.name + ' used Knight Punch on ' + players[toHit].name + '.');
            addToBattleLog(dmgString);
            addToBattleLog(players[toHit].name + ' took ' + damage + ' damage.');
            processDamage(enemy, [ players[toHit].name ], damage);
        },
        chance: 30
        
    }],
    spriteInfo: 'armorKnight'
}];

function generateEnemiesForBattle(players, difficulty) {
    var totalPlayerLevels = 0;
    
    players.forEach(function(player) {
        totalPlayerLevels += player.level;
    });
    
    chooseRandomEnemies(totalPlayerLevels + difficulty);
}

function chooseRandomEnemies(totalLevels) {
    var withinLevelRange = _.filter(enemyTypes, function (enemyType) {
       return enemyType.level <= totalLevels; 
    });
    
    withinLevelRange = _.sortBy(withinLevelRange, 'level');
    
    var enemies = [];
    var totalEnemyLevels = 0;
    var enemyTypesChosen = [];
    
    while (totalEnemyLevels < totalLevels && enemies.length < 9) {
        var index = rngBiasTowardsCenter(0, withinLevelRange.length - 1);
        var newEnemy = convertToBattleActor(withinLevelRange[index], true, withinLevelRange[index].maxHP, withinLevelRange[index].maxMP);
        enemyTypesChosen[index] = enemyTypesChosen[index] ? enemyTypesChosen[index] + 1 : 1;
        enemies.push(newEnemy);
        
        totalEnemyLevels += withinLevelRange[index].level;
    }
    
    enemyTypesChosen.forEach(function (value, index) {
        if (value && value > 1) {
            var number = 1;
            enemies.forEach(function (enemy) {
                if (enemy.name === withinLevelRange[index].name) {
                    enemy.name = enemy.name + '-' + (number++);
                }
            });
        }       
    });
    
    return enemies;
}

function processEnemyTurn(enemy, enemies, players) {
    var totalChance = 0;
    
    enemy.characterStats.attacks.forEach(function (attack) {
        totalChance += attack.chance; 
    });
    
    var whichMove = rng(1, totalChance);
    var attackToExecute;
    
    for (var i = 0; i < enemy.characterStats.attacks.length; i++) {
        var attack = enemy.characterStats.attacks[i];
        whichMove -= attack.chance;
        
        if (whichMove <= 0) {
            attackToExecute = attack;
            break;
        }
    }
    
    executeSelectedAttack(attackToExecute, enemy, enemies, players);
}

function executeSelectedAttack(attackToExecute, enemy, enemies, players) {
    if (attackToExecute.special) {
        attackToExecute.special(enemy, enemies, players);
        return;
    }

    var hitNumber = rng(0, 100);
    var rawAttack = Math.floor(((90 + (hitNumber/5)) / 100) * attackToExecute.power);
    var toHit = rng(0, players.length - 1);
    
    addToBattleLog(enemy.name + " did " + rawAttack + " damage to " + players[toHit].name);
    
    processDamage(enemy, [ players[toHit].name ], rawAttack);
}