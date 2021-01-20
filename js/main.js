'use strict'

const MINE = '💣';
const FLAG = '🚩';
const SMIELY_FACE = '😄';
const FACE_BOMBED = '🤯';
const WIN_FACE = '😎';
const HEART = '💪'

var gBoard;
var gLifes = 3;
var gIsGameWon


var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isHintMode: false,
}




function init() {
    gBoard = createMat(gLevel.SIZE)
    resetData()
    renderBoard()
    gGame.isOn = true;
    displayLifes()
}

function resetData() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    var elSmiley = document.querySelector('.smiley-face')
    elSmiley.innerText = SMIELY_FACE;
    gLifes = 3;
}

function setMode(level) {
    if (level === 'easy') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        gLifes = 2;
    } else if (level === 'hard') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    } else if (level === 'expert') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    init()
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false) return;
    if (elCell.innerText === FLAG) return;
    if (gGame.isHintMode) {
        hints(i, j)
        return;
    }
    var currCell = gBoard[i][j]

    if (!gGame.shownCount && currCell.isMine) {
        console.log('render')
        gBoard[i][j].isShown = true;
        gBoard = createMat(gLevel.SIZE)
        renderBoard()
    } else {
        gGame.shownCount++
        currCell.isShown = true;
        elCell.innerText = currCell.isMine ? MINE : currCell.minesAroundCount;
        if (currCell.isMine) {
            gLifes--
            displayLifes()
            currCell.isShown = true;
            elCell.innerText = MINE;
            elCell.classList.add('bombed')
            setTimeout(function () {
                currCell.isShown = false;
                elCell.innerText = '';
                elCell.classList.remove('bombed')
            }, 300)
            if (!gLifes) gameOver()
        }
    }
    checkVictory()
}




function cellMarked(elCell, i, j) {
    window.addEventListener('contextmenu', function (elCell) {
        elCell.preventDefault();
    }, false);
    if (gBoard[i][j].isShown) return;

    var currCell = gBoard[i][j];
    currCell.isMarked = !currCell.isMarked
    var markedCellStyle = currCell.isMarked ? FLAG : ''
    gGame.markedCount = currCell.isMarked ? gGame.markedCount += 1 : gGame.markedCount -= 1;
    console.log(gGame.markedCount)
    elCell.innerText = markedCellStyle;
}

function countMineNegsAround(cellI, cellJ) {
    if (gGame.isHintMode) {
        var negsArray = []
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gBoard.length) continue;
                if (gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;
                var coords = { i, j };
                negsArray.push(coords)
            }
        }
        return negsArray;
    } else {
        var countMinesAround = 0;
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (j < 0 || j >= gBoard.length) continue;
                if (i === cellI && j === cellJ) continue;
                if (gBoard[i][j].isMine) {
                    countMinesAround++
                }

            }
        }
        return countMinesAround;
    }

}

function hints(iIdx, jIdx) {
    gGame.isHintMode = true;
    var negsCoordsArray = countMineNegsAround(iIdx, jIdx)
    for (var i = 0; i < negsCoordsArray.length; i++) {
        var currCoords = negsCoordsArray[i]
        var currCell = gBoard[currCoords.i][currCoords.j];
        currCell.isShown = true;
        var elCell = getCellClass(currCoords.i, currCoords.j)
        elCell.innerText = currCell.isMine ? MINE : currCell.minesAroundCount;
    }
    setTimeout(function () {
        for (var i = 0; i < negsCoordsArray.length; i++) {
            currCoords = negsCoordsArray[i]
            currCell = gBoard[currCoords.i][currCoords.j];
            currCell.isShown = false;
            elCell = getCellClass(currCoords.i, currCoords.j)
            elCell.innerText = '';
            gGame.isHintMode = false;
        }
    }, 1000)
}


function displayLifes() {
    var elLifeDisplay = document.querySelector('.life-display')
    elLifeDisplay.innerText = gLifes + HEART
}

function getCellClass(i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    return elCell;
}

function checkVictory() {
    var allCellsNeededShown = (gLevel.SIZE ** 2) - gLevel.MINES
    console.log(gGame.shownCount)
    if (gGame.shownCount === allCellsNeededShown && gGame.markedCount === gLevel.MINES) {
        gIsGameWon = true;
        gameOver()
    }
}

function gameOver() {
    gGame.isOn = false;
    var elSmiley = document.querySelector('.smiley-face')
    elSmiley.innerText = gIsGameWon ? WIN_FACE : FACE_BOMBED;
}