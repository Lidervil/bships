const gameboard = require('./board.js');

describe('gameboard', () => {
    it('should create a board', () => {
      let smallShip1 = [[0,0],[0,0]]  
      let smallShip2 = [[1,0],[1,0]]  
      let smallShip3 = [[2,0],[2,0]]  
      let smallShip4 = [[3,0],[3,0]]
      let mediumShip1 = [[0,1],[1,1]]   
      let mediumShip2 = [[2,1],[3,1]]   
      let mediumShip3 = [[4,1],[5,1]]
      let bigShip1 = [[0,2],[2,2]]   
      let bigShip2 = [[3,2],[5,2]]   
      let largeShip = [[0,3],[3,3]]   
      const board = gameboard( smallShip1, smallShip2, smallShip3, smallShip4, mediumShip1, mediumShip2, mediumShip3, bigShip1, bigShip2, largeShip);

      expect(board.board[4][3]).toEqual([4,3]);
    });
  });