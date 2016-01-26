var playerList = (typeof savedData === 'undefined') ? [] : savedData;
var maxPlayers = 6;

var battleActors = [];
var recentBattleActions;
var maxLogMsgs = 15;

var timePointer = 100;
var inBattle = false;
var nextPlayer = false;

var nextTurnProcessor;

var battleEnemyActors = [];
var battlePlayerActors = [];

var battleWon = false;
var battleLost = false;

function startBattle() {
    timePointer = 100;
    inBattle = true;
    battleWon = false;
    battleLost = false;
    battleActors = [];
    
    if (nextTurnProcessor) {
        clearTimeout(nextTurnProcessor);
    }
    
    battlePlayerActors = _.map(playerList, function (player) {
        return convertToBattleActor(player, false, player.baseHP, player.baseMP);
    });
    battleEnemyActors = _.map(chooseRandomEnemies(15));
    
    battleActors = battleActors.concat(battlePlayerActors).concat(battleEnemyActors);
    
    recentBattleActions = [];
    
    decideWhoGoesNext();
}

function decideWhoGoesNext() {
    var nextActor;
    
    var battleOver = checkForBattleFinished();
    if (battleOver > 0) {
        //award stuff
        battleWon = true;
    }
    if (battleOver < 0) {
        //game over stuff
        battleLost = true;
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
    
    nextPlayer = nextActor;
    
    if (nextActor.isEnemy) {        
        processEnemyTurn(nextActor, battleEnemyActors, battlePlayerActors);
        
        nextTurnProcessor = setTimeout(function () {
            decideWhoGoesNext();
        }, 2000);
    }
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
            actor.curHP = 0;
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

function convertToBattleActor(character, isEnemy, hp, mp) {
    return {
            name: character.name,
            nextTurn: 100 - calculateTimeBetweenTurns(character.speed),
            speed: character.speed,
            fainted: false,
            curHP: hp,
            curMP: mp,
            characterStats: character,
            isEnemy: isEnemy
        };
}