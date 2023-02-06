import { shipGen } from './shipGen.js';

export const gameboard = ( smallShip1, smallShip2, smallShip3, smallShip4, mediumShip1, mediumShip2, mediumShip3, bigShip1, bigShip2, largeShip ) => {
    let board = [];
    for ( let i = 0; i < 10; i++ ) {
        board.push([]);
        for ( let j = 0; j < 10; j++ ) {
            board[i].push([i, j]);
        }
    }

    let shipsArray = [];
    shipsArray.push(smallShip1);
    shipsArray.push(smallShip2);
    shipsArray.push(smallShip3);
    shipsArray.push(smallShip4);
    shipsArray.push(mediumShip1);
    shipsArray.push(mediumShip2);
    shipsArray.push(mediumShip3);
    shipsArray.push(bigShip1);
    shipsArray.push(bigShip2);
    shipsArray.push(largeShip);
    
    let ships = []

    for ( let i = 0; i < shipsArray.length; i++ ) {
        if ( shipsArray[i][0][0] === shipsArray[i][1][0] && shipsArray[i][0][1] === shipsArray[i][1][1]) {
            let ship = shipGen(1);
            let shipX = shipsArray[i][0][0];
            let shipY = shipsArray[i][0][1];
            board[shipX][shipY] = ship;
            ships.push(ship);
        } else {
            if ( shipsArray[i][0][0] !== shipsArray[i][1][0]) {
                if ( shipsArray[i][0][0] > shipsArray[i][1][0] ) {
                    let shipSize = 1 + shipsArray[i][0][0] - shipsArray[i][1][0];
                    let ship = shipGen(shipSize);
                    let shipX = shipsArray[i][0][0];
                    let shipY = shipsArray[i][0][1];
                    board[shipX][shipY] = ship;
                    for (let i = 1; i < shipSize; i++) {
                        board[shipX-i][shipY] = ship;
                    }
                    ships.push(ship);
                } else {
                    let shipSize = 1 + shipsArray[i][1][0] - shipsArray[i][0][0];
                    let ship = shipGen(shipSize);
                    let shipX = shipsArray[i][0][0];
                    let shipY = shipsArray[i][0][1];
                    board[shipX][shipY] = ship;
                    for (let i = 1; i < shipSize; i++) {
                        board[shipX+i][shipY] = ship;
                    }
                    ships.push(ship);
                }
            } else {
                if ( shipsArray[i][0][1] > shipsArray[i][1][1] ) {
                    let shipSize = 1 + shipsArray[i][0][1] - shipsArray[i][1][1];
                    let ship = shipGen(shipSize);
                    let shipX = shipsArray[i][0][0];
                    let shipY = shipsArray[i][0][1];
                    board[shipX][shipY] = ship;
                    for (let i = 1; i < shipSize; i++) {
                        board[shipX][shipY-i] = ship;
                    }
                    ships.push(ship);
                } else {
                    let shipSize = 1 + shipsArray[i][1][1] - shipsArray[i][0][1];
                    let ship = shipGen(shipSize);
                    let shipX = shipsArray[i][0][0];
                    let shipY = shipsArray[i][0][1];
                    board[shipX][shipY] = ship;
                    for (let i = 1; i < shipSize; i++) {
                        board[shipX][shipY+i] = ship;
                    }
                    ships.push(ship);
                }
            }
        }

    }

    return {
        board: board,
        missedShots: [],
        remainingBoats: 10,
        ships: ships,
        receiveAttack(x, y) {
            if ( board[x][y].hits === undefined ) {
                board[x][y] = 'miss';
            } else {
                board[x][y].hit();
                if (board[x][y].sunk === true) {
                    this.remainingBoats--;
                }
                board[x][y] = 'hit';
            }
            this.missedShots.push( [x, y] );
        }
    }
}