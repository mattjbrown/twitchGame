function showCrapAroundScreen(canvas) {    
    var context = canvas.getContext("2d");
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPanes(context, canvas);
    drawPaneLabels(context, canvas);
    drawNextActorList(context, canvas);
    drawCombatLog(context, canvas);
    
    //context.fillText('Combat Log', dxStart + (canvas.width - dxStart)/2, 30);
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
    
    var dxStart = 940;
    var dyStart = 60;
    
    context.font = "32px Final Fantasy VII";
    context.fillStyle = 'white';
    
    var counter = 0;
    
    recentBattleActions.forEach(function (message) {
        context.fillText(message, dxStart, dyStart + 30 * counter++);
        var rgb = 255 - (15 * counter);
        context.fillStyle = 'rgb(' +  rgb + ',' + rgb + ',' + rgb + ')';
    });
}

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1); 
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();  
} 