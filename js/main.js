'use strict'

const MINE = '💣';
const FLAG = '🚩';
const SMILEY_FACE = '😄';
const FACE_BOMBED = '🤯';
const WIN_FACE = '😎';
const LIVES = '💪';
const HINT_IMG = '👀';
const SAFE_CLICK = '👌'

var gBoard;
var gIsGameWon;
var gBestScoreEasy = Infinity;
var gBestScoreHard = Infinity;
var gBestScoreExpert = Infinity;
var gTimer;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isHintMode: false,
    hintsCount: 3,
    safeClickCount: 3,
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFES: 1,
}

function init() {
    gBoard = createMat(gLevel.SIZE);
    resetData();
    renderBoard();
    gGame.isOn = true;
    displayInfo();
}

function resetData() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isHintMode: false,
        hintsCount: 3,
        safeClickCount: 3,
    }

    var elSmiley = document.querySelector('.smiley-face');
    elSmiley.innerText = SMILEY_FACE;
    if (gLevel.SIZE === 4) gLevel.LIFES = 1;
    else gLevel.LIFES = 3;
    gIsGameWon = false;
    clearInterval(gTimer);
    gTimer = null;
    gSeconds = 0;
    gMinutes = 0;
    gDisplaySec = 0;
    gDisplayMin = 0;
    var stopWatch = document.querySelector('.timer');
    stopWatch.innerHTML = `${gDisplayMin}0:${gDisplaySec}0`;
    var elCellsMarkedSpan = document.querySelector('.flags-count span');
    elCellsMarkedSpan.innerHTML = gGame.markedCount;
    var elMinesNumSpan = document.querySelector('.mines-num span');
    elMinesNumSpan.innerHTML = gLevel.MINES;
}

function setMode(level) {
    if (level === 'easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    } else if (level === 'hard') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    } else if (level === 'expert') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    init();
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false) return;
    if (elCell.innerText === FLAG) return;
    if (gGame.isHintMode) {
        hintMode(i, j);
        gGame.hintsCount--;
        displayInfo();
        return;
    }
    var currCell = gBoard[i][j];
    if (currCell.isShown) return;

    if (!gGame.shownCount && currCell.isMine) {
        currCell.isShown = true;
        gBoard = createMat(gLevel.SIZE);
        renderBoard();
        gTimer = setInterval(stopWatch, 1000);
    } else {
        if (!gTimer) gTimer = setInterval(stopWatch, 1000);
        currCell.isShown = true;
        gGame.shownCount++;
        elCell.innerHTML = currCell.minesAroundCount;
        elCell.classList.add('clicked');
        if (!currCell.minesAroundCount && !currCell.isMine) expandNegs({ i, j });
        if (currCell.isMine) {
            if (!gLevel.LIFES) {
                gGame.shownCount--;
                gameOver();
            } else {
                gGame.shownCount--;
                gLevel.LIFES--;
                displayInfo();
                currCell.isShown = true;
                elCell.innerText = MINE;
                elCell.classList.add('bombed');
                setTimeout(function () {
                    currCell.isShown = false;
                    elCell.innerText = gGame.isOn ? '' : MINE;
                    elCell.classList.remove('bombed');
                    elCell.classList.remove('clicked');
                }, 300);
            }
        }

    }
    checkVictory();
}




function cellMarked(elCell, i, j) {
    window.addEventListener('contextmenu', function (elCell) {
        elCell.preventDefault();
    }, false);

    if (gGame.isOn === false) return;
    if (gBoard[i][j].isShown) return;

    var currCell = gBoard[i][j];
    currCell.isMarked = !currCell.isMarked;
    var markedCellStyle = currCell.isMarked ? FLAG : ''
    gGame.markedCount = currCell.isMarked ? gGame.markedCount += 1 : gGame.markedCount -= 1;
    elCell.innerText = markedCellStyle;
    var elCellsMarkedSpan = document.querySelector('.flags-count span');
    elCellsMarkedSpan.innerHTML = gGame.markedCount;
    checkVictory();
}

function hintMode(iIdx, jIdx) {
    if (!gGame.hintsCount) return;
    var elHintsDisplay = document.querySelector('.hints')
    elHintsDisplay.style.boxShadow = '0px 0px 30px 7px rgba(233, 221, 57, 0.76)'
    displayInfo();

    gGame.isHintMode = true;
    var negsCoordsArray = countMineNegsAround(iIdx, jIdx);
    for (var i = 0; i < negsCoordsArray.length; i++) {
        var currCoords = negsCoordsArray[i];
        var currCell = gBoard[currCoords.i][currCoords.j];
        currCell.isShown = true;
        var cellContent = currCell.isMine ? MINE : currCell.minesAroundCount;
        renderCell(currCoords.i, currCoords.j, cellContent);
    }

    setTimeout(function () {
        for (var i = 0; i < negsCoordsArray.length; i++) {
            currCoords = negsCoordsArray[i];
            currCell = gBoard[currCoords.i][currCoords.j];
            currCell.isShown = false;
            renderCell(currCoords.i, currCoords.j, '');
            gGame.isHintMode = false;
            elHintsDisplay.style.boxShadow = 'none';

        }
    }, 1000);
}

function expandNegs(coords) {
    for (var i = coords.i - 1; i <= coords.i + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = coords.j - 1; j <= coords.j + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (i === coords.i && j === coords.j) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown) continue;
            if (currCell.isMarked) continue;
            currCell.isShown = true;
            if (!currCell.minesAroundCount) expandNegs({ i, j })
            renderCell(i, j, currCell.minesAroundCount);
            var elCell = getCellClass(i, j);
            elCell.classList.add('clicked');
            gGame.shownCount = countShownCellsOnBoard();
        }
    }

}

function displayInfo() {
    var elLifeDisplay = document.querySelector('.life-display');
    var elHintsDisplay = document.querySelector('.hints');
    var elSafeClickSpan = document.querySelector('.safe-click span')
    elLifeDisplay.innerHTML = gLevel.LIFES + LIVES;
    elHintsDisplay.innerHTML = gGame.hintsCount + HINT_IMG;
    elSafeClickSpan.innerText = gGame.safeClickCount;
}

function checkVictory() {
    var allCellsNeededShown = (gLevel.SIZE ** 2) - gLevel.MINES;
    if (gGame.shownCount === allCellsNeededShown && gGame.markedCount === gLevel.MINES) {
        gIsGameWon = true;
        gameOver();
    }
}

function safeClick() {
    if(!gGame.safeClickCount) return;
    gGame.safeClickCount--;
    var noMineCells = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currCell = gBoard[i][j]
            var currCellCoords = { i, j }
            if (!currCell.isMine &&
                !currCell.isShown &&
                !currCell.isMarked) noMineCells.push(currCellCoords)
        }
    }
    var rndIdx = getRandomInt(0, noMineCells.length);
    var safeClickCell = noMineCells[rndIdx]
    renderCell(safeClickCell.i, safeClickCell.j, SAFE_CLICK)
    setTimeout(function () {
        renderCell(safeClickCell.i, safeClickCell.j, '');
    }, 3000);
    displayInfo()
}

function countShownCellsOnBoard() {
    var count = 0;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isShown) count++
        }
    }
    return count;
}

function bestScore(level) {
    var elBestScores = document.querySelectorAll('.best-score span')
    var timeStamp = stopWatch()
    if (level === 4) {
        var elBestScoreEasy = elBestScores[0]
        var currScoreEasy = gGame.secsPassed;
        if (currScoreEasy < gBestScoreEasy) {
            gBestScoreEasy = currScoreEasy;
            elBestScoreEasy.innerText = '\n' + timeStamp;
        }
    } else if (level === 8) {
        var elBestScoreHard = elBestScores[1]
        var currScoreHard = gGame.secsPassed;
        if (currScoreHard < gBestScoreHard) {
            gBestScoreHard = currScoreHard;
            elBestScoreHard.innerText = '\n' + timeStamp;
        }
    } else {
        var elBestScoreExpert = elBestScores[2];
        var currScoreExpert = gGame.secsPassed;
        if (currScoreExpert < gBestScoreExpert) {
            gBestScoreExpert = currScoreExpert;
            elBestScoreExpert.innerText = '\n' + timeStamp;
        }
    }
}


function gameOver() {
    gGame.isOn = false;
    clearInterval(gTimer);
    if (!gIsGameWon) {
        var minesCoords = findAllMinesOnBoard();
        for (var i = 0; i < minesCoords.length; i++) {
            var currMine = minesCoords[i]
            renderCell(currMine.i, currMine.j, MINE);
        }
    } else bestScore(gLevel.SIZE);
    var elSmiley = document.querySelector('.smiley-face');
    elSmiley.innerHTML = gIsGameWon ? WIN_FACE : FACE_BOMBED;
}


