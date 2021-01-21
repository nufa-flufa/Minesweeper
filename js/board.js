'use strict'

function createMat(size) {
    var shuffledArray = getShuffledArrayOfMinesAndEmptyCells()
    var mat = [];
    for (var i = 0; i < size; i++) {
        mat[i] = [];
        for (var j = 0; j < size; j++) {
            var cellType = shuffledArray.shift()
            var isCellBomb = (cellType === 'bomb') ? true : false;
            mat[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: isCellBomb,
                isMarked: false,
            }
        }
    }
    console.table(mat)
    return mat;
}


function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellMineNegs = gBoard[i][j].minesAroundCount = countMineNegsAround(i, j);
            var color = checkCellColor(cellMineNegs)
            strHTML += ` <td class="cell cell-${i}-${j}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this,${i},${j})" style="color:${color}"></td>`
        }
        strHTML += '<tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(i,j,content){
    var elCell = getCellClass(i,j)
    elCell.innerHTML = content;
}

function checkCellColor(num){
    if(!num) return 'black';
    if(num === 1) return 'blue';
    else if(num === 2) return 'green';
    else if(num === 3) return 'red';
    else if (num > 3 )return 'darkblue';
}

