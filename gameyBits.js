var playerList = [{
    name: 'IvanGPX',
    level: 10,
    maxHP: 20,
    maxMP: 30,
    curHP: 5,
    curMP: 30,
    speed: 90,
    power: 20
}];
var maxPlayers = 2;

var enemyList = [{
    name: 'Spork-Slowest',
    level: 2,
    maxHP: 50,
    curHP: 50,
    maxMP: 0,
    curMP: 0,
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
    curHP: 50,
    maxMP: 0,
    curMP: 0,
    speed: 5,
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
    name: 'Spork-MidSlow',
    level: 2,
    maxHP: 50,
    curHP: 50,
    maxMP: 0,
    curMP: 0,
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
    curHP: 50,
    maxMP: 0,
    curMP: 0,
    speed: 60,
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
    curHP: 50,
    maxMP: 0,
    curMP: 0,
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

var battleActors;
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
    battleActors = _.map(playerList.concat(enemyList), function (actor) {
        return {
            name: actor.name,
            nextTurn: 100 - calculateTimeBetweenTurns(actor.speed),
            speed: actor.speed
        };
    });
    
    recentBattleActions = [];
    
    decideWhoGoesNext();
}

function decideWhoGoesNext() {
    var nextActor;
    
    while (!nextActor) {
        var nextActor = false;
        
        battleActors.forEach(function (actor) {
            if (actor.nextTurn <= timePointer && (!nextActor || actor.nextTurn > nextActor.nextTurn)) {
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
    
    var actorIsEnemy = _.find(enemyList, function (enemy) {
        return enemy.name === nextActor.name;
    });
    
    if (actorIsEnemy) {
        //take enemy turn!
        addToBattleLog(nextActor.name + " was loafing around...");
        decideWhoGoesNext();
    } else {
        nextPlayer = nextActor;
    }
}

function takePlayerTurn(player, targets) {
    var rawAttack = Math.Floor((rng(80, 130) / 100) * player.power);
    addToBattleLog(player.name + " did " + rawAttack + " damage to " + targets.join());
    
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
        power: 30
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
            if (actor.nextTurn <= pretendTimer && (!nextActorToGo || actor.nextTurn > nextActorToGo.nextTurn)) {
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