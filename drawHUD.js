function showCrapAroundScreen(canvas) {    
    var context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPanes(context, canvas);
    
    if (battleWon) {
        drawWin(context, canvas);
        return;
    }
    
    if (battleLost) {
        drawLoss(context, canvas);
        return;
    }
    
    drawPaneLabels(context, canvas);
    drawNextActorList(context, canvas);
    drawCombatLog(context, canvas);
    
    drawCharacters(context, canvas);
}

function drawPanes(context, canvas) {
    var dxStart = 900;
    var dyStart = 0;
    
    var drp = context.createLinearGradient(0, 0, canvas.width - dxStart, canvas.height);
    drp.addColorStop(0, 'rgb(0, 0, 210)');
    drp.addColorStop(1, 'rgb(0, 0, 70)');
    
    context.fillStyle = drp;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.clearRect(0, 0, dxStart, 500);
    
    context.strokeStyle = 'grey';
    context.lineWidth = 4;
    
    drawLine(context, dxStart, 0, dxStart, canvas.height);
    drawLine(context, 0, 500, canvas.width, 500);
    
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    
    drawLine(context, dxStart, 0, dxStart, canvas.height);
    drawLine(context, 0, 500, canvas.width, 500);
}

function drawPaneLabels(context, canvas) {
    var topPaneXStart = 900;
    var topPaneYStart = 0;
    
    var brPaneXStart = 900;
    var brPaneYStart = 500;
    
    var blPaneXStart = 0;
    var blPaneYStart = 500;
    
    context.font = "50px Final Fantasy VII";
    context.fillStyle = 'white';
    context.textAlign = 'left';
    
    context.fillText('Combat Log', topPaneXStart + 10, 25);
    context.fillText('Upcoming Turns', brPaneXStart + 10, brPaneYStart + 25);
    
    if (nextPlayer) {
        context.fillText('Abilities Available for ' + nextPlayer.name, blPaneXStart + 10, brPaneYStart + 25);
    }
}

function drawNextActorList(context, canvas) {
    var dxStart = 940;
    var dyStart = 560;
    
    context.font = "45px Final Fantasy VII";
    context.fillStyle = 'white';
    context.textAlign = 'left';
    
    var actorsToDraw = getNext5Actors();
    
    var counter = 0;
    
    actorsToDraw.forEach(function (actor) {
        context.fillText(actor.name, dxStart, dyStart + 30 * counter++);
    });
}

function drawCombatLog(context, canvas) {
    if (!recentBattleActions) {
        return;
    }
    
    var dxStart = 920;
    var dyStart = 60;
    
    context.font = "32px Final Fantasy VII";
    context.fillStyle = 'white';
    context.textAlign = 'left';
    
    var counter = 14;
    
    recentBattleActions.forEach(function (message) {
        context.fillText(message, dxStart, dyStart + 30 * counter--);
        var rgb = 105 + (10 * counter);
        context.fillStyle = 'rgb(' +  rgb + ',' + rgb + ',' + rgb + ')';
    });
}

function drawCharacters(context, canvas) {
    dxStart = 0;
    dyStart = 0;
    width = 898;
    height = 498;
    
    var playerCount = 0;
    var enemyCount = 0;
    
    context.drawImage(document.getElementsByTagName('img')[0], dxStart, dyStart, width, height);
    
    var enemyOffsetX = 100;
    var playerOffsetX = 700;
    var offsetY = 100;
    var rowOffsetY = 50;
    
    context.fillStyle = "white";
    context.textAlign = "center";
    
    if (!battleActors) {
        return;
    }
    
    var previousSpriteHeight = 0;
    var previousSpriteWidth = 0;
    
    var enemySizes = [];
    
    battleActors.forEach(function (actor) {
        if (actor.isEnemy) {            
            context.strokeStyle = 'red';
            context.lineWidth = 3;
            context.textAlign = 'center';
            
            context.font = "32px Final Fantasy VII";
            
            var sprite = document.getElementById(actor.characterStats.spriteInfo);
            
            if (!sprite) {
                sprite = document.getElementById('unknown');
            }
            
            enemySizes[enemyCount] = { width: sprite.width, height: sprite.height };
            
            var row = Math.floor(enemyCount / 3);
            var positionInRow = enemyCount % 3;
            
            var x = enemyOffsetX;
            var y = offsetY + (row % 2) * rowOffsetY;
            
            if (positionInRow === 2) {
                enemyOffsetX += Math.max(sprite.width, enemySizes[enemyCount - 1].width, enemySizes[enemyCount - 2].width);
                enemyOffsetX += 30;
            }
            
            if (actor.fainted) {
                enemyCount++;
                return;
            }
            
            for (var i = 1; i < positionInRow + 1; i++) {
                y += enemySizes[enemyCount - i].height;
                y += 30;
            }
            
            context.strokeText(actor.name, x + (sprite.width / 2), y - 10);
            context.fillText(actor.name, x + (sprite.width / 2), y  - 10);
            
            context.drawImage(sprite, x, y, sprite.width, sprite.height);
            
            if (nextPlayer.name === actor.name) {
                context.strokeStyle = 'white';
                context.lineWidth = 4;
                context.strokeRect(x - 5, y - 5, sprite.width + 10, sprite.height + 10);
                
                context.strokeStyle = 'red';
                context.lineWidth = 2;
                context.strokeRect(x - 5, y - 5, sprite.width + 10, sprite.height + 10);
            }
            
            enemyCount++;
        }
        else {
            var row = Math.floor(playerCount / 3);
            var x = playerOffsetX + (row * 100)
            var y = offsetY + (row % 2) * rowOffsetY + (playerCount % 3) * 130
            
            context.strokeStyle = 'green';
            context.lineWidth = 3;
            
            context.font = "32px Final Fantasy VII";
            context.strokeText(actor.name, x + 40, y - 30);
            context.fillText(actor.name, x + 40 , y  - 30);
            
            context.strokeText(actor.curHP + '/ ' + actor.characterStats.baseHP, x + 40, y - 10);
            context.fillText(actor.curHP + '/ ' + actor.characterStats.baseHP, x + 40 , y  - 10);
            
            if (!actor.fainted) {
                context.drawImage(document.getElementById('playerImg'), x, y, 80, 80);
            } else {
                context.save();
                context.translate(x + 80, y);
                context.rotate(90 * Math.PI/180);
                context.drawImage(document.getElementById('playerImg'), 0, 0, 80, 80);
                context.restore();
            }
            
            if (nextPlayer.name === actor.name) {
                context.strokeStyle = 'white';
                context.lineWidth = 4;
                context.strokeRect(x - 5, y - 5, 90, 90);
                
                context.strokeStyle = 'green';
                context.lineWidth = 2;
                context.strokeRect(x - 5, y - 5, 90, 90);
            }
            
            playerCount++;
        }
    });
}

function drawWin(context, canvas) {
    context.font = "100px Final Fantasy VII";
    context.fillStyle = 'black';
    context.textAlign = 'left';
    
    context.fillText("YOU'RE WINNER!", 100, 100);
}

function drawLoss(context, canvas) {
    context.font = "100px Final Fantasy VII";
    context.fillStyle = 'black';
    context.textAlign = 'left';
    
    context.fillText("YOU'RE LOSER!", 100, 100);
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1); 
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();  
}