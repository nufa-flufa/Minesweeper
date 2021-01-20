'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getShuffledArrayOfMinesAndEmptyCells() {
    var emptyCellsAmount = gLevel.SIZE ** 2 - gLevel.MINES

    var emptyArray = Array(emptyCellsAmount).fill('empty')
    var bombArray = Array(gLevel.MINES).fill('bomb')
    var gameArray = emptyArray.concat(bombArray);
    var shuffledArray = gameArray.sort(() => Math.random() - 0.5)
    return shuffledArray;
}