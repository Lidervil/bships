import { container, gridLayoutPlayer } from './layout.js';
import { createHtmlElement } from './util.js';
import { gameboard } from './board.js';
import { player } from './player.js';

document.body.appendChild(container());

let angle = 'column';
let oneBlockShips = 4;
let twoBlockShips = 3;
let threeBlockShips = 2;
let fourBlockShips = 1;
let draggedShip;
let board = [];
let playerShips = [];
let playerBoard;
let boardEnemy = [];
let enemyShips = [];
let enemyBoard;
let playerOne;
let playerTwo;
let shootArray = [];
let enemyShootArray = [];

let gridEventListener = function (e){
    let cell = e.target;
    let row = parseInt(cell.getAttribute('data-row'));
    let col = parseInt(cell.getAttribute('data-column'));
    gameManager( row, col )
}

resetBoards();

function populateBoard( gameboard ) {
    for ( let i = 0 ; i < 10; i++ ) {
        gameboard.push([]);
        for ( let j = 0; j < 10; j++) {
            gameboard[i].push([i,j]);
        }
    } 
}

function buttonsEventListeners(){
const flipButton = document.getElementsByClassName('flip-button')[0];
flipButton.addEventListener('click', () => {
    flip();
})

const resetButton = document.getElementsByClassName('reset-button')[0];
resetButton.addEventListener('click', () => {
    resetBoards();
})

const startButton = document.getElementsByClassName('start-button')[0];
startButton.addEventListener('click', () => {
    startBoards();
})

const oneBlockShipArray = Array.from(document.getElementsByClassName('one-block'));
const twoBlockShipArray = Array.from(document.getElementsByClassName('two-block'));
const threeBlockShipArray = Array.from(document.getElementsByClassName('three-block'));
const fourBlockShipArray = Array.from(document.getElementsByClassName('four-block'));
let unplacedShips = [...oneBlockShipArray, ...twoBlockShipArray, ...threeBlockShipArray, ...fourBlockShipArray ];
unplacedShips.forEach( ship => ship.addEventListener('dragstart', (e) => {
    dragStart(e);
}))

const gridItems = Array.from(document.getElementsByClassName('grid-item'));

gridItems.forEach( ship => ship.addEventListener('dragover', (e) => {
    dragOver(e);
}))

gridItems.forEach( ship => ship.addEventListener('drop', (e) => {
    drop(e);
}))

}

function resetBoards() {
    angle = 'column';
    oneBlockShips = 4;
    twoBlockShips = 3;
    threeBlockShips = 2;
    fourBlockShips = 1;
    
    const grid = document.getElementsByClassName('grid')[0];
    grid.innerHTML = '';
    board = [];
    playerShips = [];
    boardEnemy = [];
    enemyShips = [];
    populateBoard( board );

    gridLayoutPlayer( grid );
    placingGrid();
    buttonsEventListeners();
    flip();
    flip();
}

function startBoards() {
    let totalUnplacedShips = 0;
    totalUnplacedShips += oneBlockShips + twoBlockShips + threeBlockShips + fourBlockShips;
    const playerMessage = document.getElementsByClassName('player-container')[0];
    const cpuMessage = document.getElementsByClassName('cpu-container')[0];
    if ( totalUnplacedShips > 0 ) {
        playerMessage.innerHTML = 'Place all the ships to start the game!';
        cpuMessage.innerHTML = 'Place all the ships to start the game!';
    } else {
        playerMessage.innerHTML = 'Game start!';
        cpuMessage.innerHTML = 'Your turn';

        const sortedShips = sortShips();
        playerBoard = gameboard(sortedShips[0], sortedShips[1], sortedShips[2], sortedShips[3], sortedShips[4], sortedShips[5], sortedShips[6], sortedShips[7], sortedShips[8], sortedShips[9]);
        
        populateBoard( boardEnemy );
        enemyShips = enemyBoardGenerator();
        enemyBoard = gameboard(enemyShips[0], enemyShips[1], enemyShips[2], enemyShips[3], enemyShips[4], enemyShips[5], enemyShips[6], enemyShips[7], enemyShips[8], enemyShips[9]);

        playerOne = player(enemyBoard);
        playerTwo = player(playerBoard);
    
        populateBoard( shootArray );
        populateBoard( enemyShootArray );

        const gridEnemy = document.getElementsByClassName('placing-grid')[0];
        gridEnemy.remove()
        const main = document.getElementsByTagName('main')[0];
        const newGrid = createHtmlElement('div', 'grid', '');
        main.appendChild( newGrid );

        gridLayoutPlayer( newGrid, shootArray );

        const gridItems = document.getElementsByClassName('grid-item');

        for (let i = 100; i < gridItems.length; i++) {
            gridItems[i].addEventListener('click', (e) => {
                
            let cell = e.target;
            let row = parseInt(cell.getAttribute('data-row'));
            let col = parseInt(cell.getAttribute('data-column'));
            gameManager( row, col )
            })
        }
    }
    
}

function gameManager(x, y) {
    
    let resultPlayer = playerAttack(x, y);
    let resultComputer;
    let pMessage, cMessage;

    if ( resultPlayer !== 'win' ) {
        resultComputer = enemyAttack();
    } 
    
    let gameResults = gameLogic(resultPlayer, resultComputer);
    pMessage = gameResults[0];
    cMessage = gameResults[1];
    
    const playerMessage = document.getElementsByClassName('player-container')[0];
    const cpuMessage = document.getElementsByClassName('cpu-container')[0];

    const grids = document.getElementsByClassName('grid');
    grids[0].innerHTML = '';
    grids[1].innerHTML = '';
    gridLayoutPlayer( grids[0], board );
    gridLayoutPlayer( grids[1], shootArray );

    playerMessage.innerHTML = pMessage;
    cpuMessage.innerHTML = cMessage;
    
    if ( resultPlayer === 'win' || resultComputer === 'win') {
        return;
    }
    
    const gridItems = document.getElementsByClassName('grid-item');

    for (let i = 100; i < gridItems.length; i++) {
        gridItems[i].addEventListener('click', gridEventListener)
    }

    const missItems = document.getElementsByClassName('miss');
    const hitItems = document.getElementsByClassName('hit');

    for (let i = 0; i < missItems.length; i++) {
        missItems[i].removeEventListener('click', gridEventListener)
    }
    
    for (let i = 0; i < hitItems.length; i++) {
        hitItems[i].removeEventListener('click', gridEventListener)
    }
}

function gameLogic(resultPlayer, resultComputer) {
    if ( resultPlayer === 'win' && resultComputer === undefined ){
        return ['You win!','Reload to play again'];
    }

    let cMessage = '';
    let pMessage = '';

    if ( resultComputer === 'win') {
        pMessage = 'You lose!';
        cMessage = 'Reload to try again';
    } else {
        if ( resultPlayer === 'sunk') {
            pMessage = 'You sunk an enemy boat!';
        } else {
            pMessage = `It's a ${resultPlayer}`;
        }
    
        if ( resultComputer === 'sunk') {
            cMessage = 'Enemy sunk one of your boats';
        } else {
            cMessage = `It's a ${resultComputer}`;
        }
    }

    return [cMessage,pMessage];
}

function playerAttack( x, y ){

    let beforeBoats = enemyBoard.remainingBoats;

    playerOne.attack( x, y );

    let afterBoats = enemyBoard.remainingBoats;
    
    let attackSquare = enemyBoard.board[x][y];
    shootArray[x][y] = attackSquare;
    
    if (afterBoats === 0 ) {
        return 'win';
    } 
    
    if ( afterBoats < beforeBoats ) {
        return 'sunk';
    }

    return attackSquare;

}

function enemyAttack(){
    let randomCoords = [];
    randomCoords.push(getRandomIndex());
    randomCoords.push(getRandomIndex());

    if (enemyShootArray[randomCoords[0]][randomCoords[1]] === 'hit' || enemyShootArray[randomCoords[0]][randomCoords[1]] === 'miss') {
        return enemyAttack();
    } 

    let beforeBoats = playerBoard.remainingBoats;

    playerTwo.attack(randomCoords[0], randomCoords[1]);

    let afterBoats = playerBoard.remainingBoats;

    let attackSquare = playerBoard.board[randomCoords[0]][randomCoords[1]];
    enemyShootArray[randomCoords[0]][randomCoords[1]] = attackSquare;
    board[randomCoords[0]][randomCoords[1]] = attackSquare;
    
    if (afterBoats === 0) {
        return 'win';
    } 
    
    if ( afterBoats < beforeBoats ) {
        return 'sunk';
    }

    return attackSquare;

}

function enemyBoardGenerator() {
    let enemyShipArray = [];

    enemyShipArray.push(generateRandomShip(1));
    enemyShipArray.push(generateRandomShip(1));
    enemyShipArray.push(generateRandomShip(1));
    enemyShipArray.push(generateRandomShip(1));
    enemyShipArray.push(generateRandomShip(2));
    enemyShipArray.push(generateRandomShip(2));
    enemyShipArray.push(generateRandomShip(2));
    enemyShipArray.push(generateRandomShip(3));
    enemyShipArray.push(generateRandomShip(3));
    enemyShipArray.push(generateRandomShip(4));

    return enemyShipArray;
}

function generateRandomShip(shipSize){
    let shipCoords = [];
    let shipDirection = getRandomDirection();
    shipCoords.push([])
    shipCoords[0].push(getRandomIndex());
    shipCoords[0].push(getRandomIndex());
    let invalidCoords = false;

    switch (shipSize) {
        case 1:
            break;
        case 2:
            if (shipDirection === 0) {
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 1]);
            } else {
                shipCoords.push([shipCoords[0][0] + 1, shipCoords[0][1]]);
            }
            break;
        case 3:
            if (shipDirection === 0) {
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 1]);
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 2]);
            } else {
                shipCoords.push([shipCoords[0][0] + 1, shipCoords[0][1]]);
                shipCoords.push([shipCoords[0][0] + 2, shipCoords[0][1]]);
            }
            break;
        case 4:
            if (shipDirection === 0) {
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 1]);
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 2]);
                shipCoords.push([shipCoords[0][0], shipCoords[0][1] + 3]);
            } else {
                shipCoords.push([shipCoords[0][0] + 1, shipCoords[0][1]]);
                shipCoords.push([shipCoords[0][0] + 2, shipCoords[0][1]]);
                shipCoords.push([shipCoords[0][0] + 3, shipCoords[0][1]]);
            }
            break;
    }

    for ( let i = 0; i < shipCoords.length; i++) {
        if ( shipCoords[i][0] > 9 || shipCoords[i][1] > 9 || boardEnemy[shipCoords[i][0]][shipCoords[i][1]] === 'ship') {
            invalidCoords = true;
            i = 5;
        } else {
            boardEnemy[shipCoords[i][0]][shipCoords[i][1]] ='ship';
        }
    }
    
    if ( invalidCoords === false ) {
        console.log(shipCoords);
        return [[shipCoords[0][0], shipCoords[0][1]],[shipCoords[shipCoords.length-1][0],shipCoords[shipCoords.length-1][1]]];
    } else {
        return generateRandomShip(shipSize);
    }

}

function getRandomIndex() {
    return Math.floor(Math.random() * 10);
}

function getRandomDirection() {
    return Math.round(Math.random());
}

function sortShips() {
    let sortedShips = []
    for ( let i = 0; i < playerShips.length; i++ ) {
        if (playerShips[i].length === 1) {
            sortedShips.push(playerShips[i]);
        }
    }
    for ( let i = 0; i < playerShips.length; i++ ) {
        if (playerShips[i].length === 2) {
            sortedShips.push(playerShips[i]);
        }
    }
    for ( let i = 0; i < playerShips.length; i++ ) {
        if (playerShips[i].length === 3) {
            sortedShips.push(playerShips[i]);
        }
    }
    for ( let i = 0; i < playerShips.length; i++ ) {
        if (playerShips[i].length === 4) {
            sortedShips.push(playerShips[i]);
        }
    }
    return sortedShips;
}

function placingGrid() {
    const shipGrid = document.getElementsByClassName('placing-grid')[0];
    shipGrid.innerHTML = '';
    
    const unplacedShipsContainer = createHtmlElement('div', 'unplaced-ships-container', '');
    
    for ( let i = 0; i < oneBlockShips; i++) {
        const oneBlockShip = createHtmlElement('div', 'one-block', '');
        oneBlockShip.setAttribute('draggable', true);
        unplacedShipsContainer.appendChild(oneBlockShip);
    }
    
    for ( let i = 0; i < twoBlockShips; i++) {
        const twoBlockShip = createHtmlElement('div', 'two-block', '');
        twoBlockShip.setAttribute('draggable', true);
        unplacedShipsContainer.appendChild(twoBlockShip);
    }
    
    for ( let i = 0; i < threeBlockShips; i++) {
        const threeBlockShip = createHtmlElement('div', 'three-block', '');
        threeBlockShip.setAttribute('draggable', true);
        unplacedShipsContainer.appendChild(threeBlockShip);
    }
    
    for ( let i = 0; i < fourBlockShips; i++) {
        const fourBlockShip = createHtmlElement('div', 'four-block', '');
        fourBlockShip.setAttribute('draggable', true);
        unplacedShipsContainer.appendChild(fourBlockShip);
    }
    
    const buttonContainer = createHtmlElement('div', 'button-container', '');
    buttonContainer.appendChild(createHtmlElement('button', 'start-button', 'Start Game'));
    buttonContainer.appendChild(createHtmlElement('button', 'flip-button', 'Flip Pieces'));
    buttonContainer.appendChild(createHtmlElement('button','reset-button', 'Reset Game'));
    
    const gridContainer = createHtmlElement('div', 'grid-container', '')
    
    gridContainer.appendChild(createHtmlElement('p', 'instructions', 'Drag & drop ships, then press star'));
    gridContainer.appendChild(unplacedShipsContainer);
    gridContainer.appendChild(buttonContainer);

    shipGrid.appendChild(gridContainer);

}

function flip() {
    angle = angle === 'row' ? 'column' : 'row';
    const container = document.getElementsByClassName('unplaced-ships-container')[0];
    container.style.flexDirection = angle;

    const twoBlock = Array.from(document.getElementsByClassName('two-block'));
    const threeBlock = Array.from(document.getElementsByClassName('three-block'));
    const fourBlock = Array.from(document.getElementsByClassName('four-block'));
    if (angle === 'column') {
        twoBlock.forEach( ship => ship.style.width = '2.4em' );
        threeBlock.forEach( ship => ship.style.width = '3.4em' );
        fourBlock.forEach( ship => ship.style.width = '4.4em' );
        twoBlock.forEach( ship => ship.style.height = '1.4em' );
        threeBlock.forEach( ship => ship.style.height = '1.4em' );
        fourBlock.forEach( ship => ship.style.height = '1.4em' );
    } else {
        twoBlock.forEach( ship => ship.style.width = '1.4em' );
        threeBlock.forEach( ship => ship.style.width = '1.4em' );
        fourBlock.forEach( ship => ship.style.width = '1.4em' );
        twoBlock.forEach( ship => ship.style.height = '2.4em' );
        threeBlock.forEach( ship => ship.style.height = '3.4em' );
        fourBlock.forEach( ship => ship.style.height = '4.4em' );
    }

    console.log(angle);
}

function dragStart(e) {
    draggedShip = e.target.className;
    console.log(draggedShip);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    const shipRow = parseInt(e.target.dataset['row']);
    const shipColumn = parseInt(e.target.dataset['column']);
    let shipCoords = [];
    let invalidCoords = false;

    switch ( draggedShip ) {
        case 'one-block':
            shipCoords.push([shipRow, shipColumn]);
            break;
        case 'two-block':
            shipCoords.push([shipRow, shipColumn]);
            if ( angle === 'column') {
                shipCoords.push([shipRow, shipColumn + 1]);
            } else {
                shipCoords.push([shipRow + 1, shipColumn]);
            }
            break;
        case 'three-block':
            shipCoords.push([shipRow, shipColumn]);
            if ( angle === 'column') {
                shipCoords.push([shipRow, shipColumn + 1]);
                shipCoords.push([shipRow, shipColumn + 2]);
            } else {
                shipCoords.push([shipRow + 1, shipColumn]);
                shipCoords.push([shipRow + 2, shipColumn]);
            }
            break;
        case 'four-block':
            shipCoords.push([shipRow, shipColumn]);
            if ( angle === 'column') {
                shipCoords.push([shipRow, shipColumn + 1]);
                shipCoords.push([shipRow, shipColumn + 2]);
                shipCoords.push([shipRow, shipColumn + 3]);
            } else {
                shipCoords.push([shipRow + 1, shipColumn]);
                shipCoords.push([shipRow + 2, shipColumn]);
                shipCoords.push([shipRow + 3, shipColumn]);
            }
            break;
    }

    for ( let i = 0; i < shipCoords.length; i++) {
        if ( shipCoords[i][0] > 9 || shipCoords[i][1] > 9 || board[shipCoords[i][0]][shipCoords[i][1]] === 'ship') {
            invalidCoords = true;
            const cpuMessage = document.getElementsByClassName('cpu-container')[0];
            cpuMessage.innerHTML = 'Invalid ship placement';
            i = 5;
        } else {
            board[shipCoords[i][0]][shipCoords[i][1]] ='ship';
        }
    }
    
    if ( invalidCoords === false ) {
        playerShips.push([shipCoords[0],shipCoords[shipCoords.length -1]]);

        switch ( shipCoords.length ) {
            case 1:
                oneBlockShips--;
                break;
            case 2:
                twoBlockShips--;
                break;
            case 3:
                threeBlockShips--;
                break;
            case 4:
                fourBlockShips--;
                break;
        }

        const grid = document.getElementsByClassName('grid')[0];
        grid.innerHTML = '';
        gridLayoutPlayer( grid , board );
        placingGrid();
        buttonsEventListeners();
        flip();
        flip();
    }

    console.log(playerShips);
    console.log(board);
}