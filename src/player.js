import { gameboard } from'./board.js';

export const player = ( enemyBoard ) => {
    return {
        win: false,
        attack( x, y ){
            enemyBoard.receiveAttack( x, y )
            if ( enemyBoard.remainingBoats === 0 ){
                this.win = true;
            } 
        },
    }
}

export const computer = ( enemyBoard ) => {
    return {
        win: false,
        attack( x, y ){
            enemyBoard.receiveAttack( x, y )
            if ( enemyBoard.remainingBoats === 0 ){
                this.win = true;
            } 
        },
    }
}