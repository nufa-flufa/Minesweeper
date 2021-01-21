'use strict'

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


function findAllMinesOnBoard() {
    var mines = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var mineCoords = { i, j };
            if (gBoard[i][j].isMine) mines.push(mineCoords)
        }
    }
    return mines;
}