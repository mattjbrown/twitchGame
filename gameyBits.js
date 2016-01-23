var playerList = savedData || [];
var maxPlayers = 4;

var enemyList = [{
    name: 'Spork-Slowest',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 2,
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
    name: 'Spork-Mid',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 5,
    attacks: [
    {
        name: 'lumbering swing',
        power: 5,
        chance: 67
    },
    {
        name: 'heavy swing',
        power: 10,
        chance: 33
    }]
},
{
    name: 'Spork-MidSlow',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 4,
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
    name: 'Spork-Fast',
    level: 2,
    maxHP: 50,
    maxMP: 0,
    speed: 20,
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
    name: 'Spork-MidFast',
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
    }]
}];

var battleActors = [];
var recentBattleActions;
var maxLogMsgs = 15;

var timePointer = 100;
var inBattle = false;
var nextPlayer = false;

function startBattle() {
    timePointer = 100;
    inBattle = true;
    
    //fetch enemies
    //decide on players
    //other stuff?
    battleActors = _.map(playerList, function (actor) {
        return {
            name: actor.name,
            nextTurn: 100 - calculateTimeBetweenTurns(actor.speed),
            speed: actor.speed,
            fainted: false,
            curHP: actor.maxHP,
            curMP: actor.maxMP,
            characterStats: actor,
            isEnemy: false
        };
    });
    
    battleActors = battleActors.concat(_.map(enemyList, function (actor) {
        return {
            name: actor.name,
            nextTurn: 100 - calculateTimeBetweenTurns(actor.speed),
            speed: actor.speed,
            fainted: false,
            curHP: actor.maxHP,
            curMP: actor.maxMP,
            characterStats: actor,
            isEnemy: true
        };
    }));
    
    recentBattleActions = [];
    
    decideWhoGoesNext();
}

function decideWhoGoesNext() {
    var nextActor;
    
    var battleOver = checkForBattleFinished();
    if (battleOver > 0) {
        //award stuff
    }
    if (battleOver < 0) {
        //game over stuff
    }
    
    while (!nextActor) {
        var nextActor = false;
        
        battleActors.forEach(function (actor) {
            if (!actor.fainted && actor.nextTurn <= timePointer && (!nextActor || actor.nextTurn > nextActor.nextTurn)) {
                nextActor = actor;
            }
        });
            
        if (!nextActor) {
            timePointer = 100;
            continue;
        }
        
        timePointer = nextActor.nextTurn;
        nextActor.nextTurn = nextActor.nextTurn - calculateTimeBetweenTurns(nextActor.speed);
        if (nextActor.nextTurn < 0) {
            nextActor.nextTurn = 100 - Math.abs(nextActor.nextTurn);
        }
    }
    
    if (nextActor.isEnemy) {
        //take enemy turn!
        nextPlayer = nextActor;
        
        setTimeout(function () {
            addToBattleLog(nextActor.name + " was loafing around...");
            decideWhoGoesNext();
        }, 1000);
    } else {
        nextPlayer = nextActor;
    }
}

function takePlayerTurn(player, targets) {
    var rawAttack = Math.floor((rng(80, 130) / 100) * player.power);
    addToBattleLog(player.name + " did " + rawAttack + " damage to " + targets.join());
    
    processDamage(player, targets, rawAttack);
    
    decideWhoGoesNext();
}

function createPlayer(name) {
    var newPlayer = {
        name: name,
        level: 1,
        maxHP: 10,
        maxMP: 10,
        curHP: 10,
        curMP: 10,
        speed: 30,
        power: 30,
        status: []
    }
    
    playerList.push(newPlayer);
}

function getNext5Actors() {
    if (!inBattle) {
        return [];
    }
    
    var pretendTimer = timePointer;
    var actorClones = [];
    battleActors.forEach(function (actor) {
        actorClones.push(_.clone(actor));
    });
    
    var turnOrder = [];
    
    
    while (turnOrder.length < 5 && actorClones.length > 0) {
        var nextActorToGo = false;
        
        actorClones.forEach(function (actor) {
            if (!actor.fainted && actor.nextTurn <= pretendTimer && (!nextActorToGo || actor.nextTurn > nextActorToGo.nextTurn)) {
                nextActorToGo = actor;
            }
        });
            
        if (!nextActorToGo) {
            pretendTimer = 100;
            continue;
        }
        
        pretendTimer = nextActorToGo.nextTurn;
        nextActorToGo.nextTurn = nextActorToGo.nextTurn - calculateTimeBetweenTurns(nextActorToGo.speed);
        if (nextActorToGo.nextTurn < 0) {
            nextActorToGo.nextTurn = 100 - Math.abs(nextActorToGo.nextTurn);
        }
        
        turnOrder.push(nextActorToGo);
    }
    
    return turnOrder;
}

function calculateTimeBetweenTurns(speed) {
    return Math.floor(100 * (10 / (speed + 10)));
}

function addToBattleLog(message) {
    recentBattleActions.unshift(message);
    
    if (recentBattleActions.length > maxLogMsgs) {
        recentBattleActions.pop();
    }
}

function processDamage(dealer, targets, damage) {
    //damage formula stuff, but for now...
    battleActors.forEach(function (actor) {
        if (!_.contains(targets, actor.name)) {
            return;
        }
        
        actor.curHP = actor.curHP - damage;
        
        if (actor.curHP <= 0) {
            actor.fainted = true;
            addToBattleLog(actor.name + " has fainted.");
        }        
    });
}

function checkForBattleFinished() {
    var anyEnemies = false;
    var anyPlayers = false;
    battleActors.forEach(function (actor) {
        if (!actor.fainted) {
            if (actor.isEnemy) {
                anyEnemies = true;
            } else {
                anyPlayers = true;
            }
        }
    });
    
    if (!anyPlayers) {
        return -1;
    }    
    if (!anyEnemies) {
        return 1;
    }
    
    return 0;
}