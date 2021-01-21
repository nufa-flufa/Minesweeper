'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getCellClass(i, j) {
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    return elCell;
}

