var enemyTypes = [{
    name: 'Goblin',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5
    },
    {
        name: 'heavy swing',
        power: 10
    }],
    spriteInfo: 'goblin'
}, 
{
    name: 'Imp',
    level: 5,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5
    },
    {
        name: 'heavy swing',
        power: 10
    }],
    spriteInfo: 'imp'
},
{
    name: 'Armor Knight',
    level: 10,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5
    },
    {
        name: 'heavy swing',
        power: 10
    }],
    spriteInfo: 'armorKnight'
},
{
    name: 'Kami',
    level: 15,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5
    },
    {
        name: 'heavy swing',
        power: 10
    }]
},
{
    name: 'Bugbear',
    level: 20,
    maxHP: 50,
    maxMP: 0,
    speed: 8,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5
    },
    {
        name: 'heavy swing',
        power: 10
    }]
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
        var newEnemy = convertToBattleActor(withinLevelRange[index], true);
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