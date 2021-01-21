'use strict'

var gSeconds = 0;
var gMinutes = 0
var gDisplaySec = 0;
var gDisplayMin = 0;

function stopWatch() {
    gSeconds++;
    gGame.secsPassed +=1;
    // console.log('secs passed',gGame.secsPassed++)

    if (gSeconds / 60 === 1) {
        gSeconds = 0
        gMinutes++;
    }

    if (gSeconds < 10) gDisplaySec = '0' + gSeconds.toString();
    else gDisplaySec = gSeconds

    if (gMinutes < 10) gDisplayMin = '0' + gMinutes.toString();
    else gDisplayMin = gMinutes;
    if (gMinutes === 60) gameOver();

    var stopWatch = document.querySelector('.timer')
    stopWatch.innerHTML = `${gDisplayMin}:${gDisplaySec}`
    var timeStamp = `${gDisplayMin}:${gDisplaySec}`;
    return timeStamp;
}