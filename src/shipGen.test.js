const shipGen = require('./shipGen.js');

describe('shipGen', () => {
    it('should create a ship with the specified size', () => {
      const ship = shipGen(3);
      expect(ship.length).toBe(3);
    });
  
    it('should increase the hits when the hit method is called', () => {
      const ship = shipGen(3);
      ship.hit();
      expect(ship.hits).toBe(1);
    });
  
    it('should set sunk to true when the number of hits equals the length', () => {
      const ship = shipGen(3);
      ship.hit();
      ship.hit();
      ship.hit();
      expect(ship.sunk).toBe(true);
    });
  });