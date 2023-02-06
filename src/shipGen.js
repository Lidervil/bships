export const shipGen = ( size ) => {
    return { 'length': size, 'hits': 0, 'sunk': false, 'hit': function() {
        this.hits += 1;
        this.isSunk();
    }, 'isSunk': function() {
        if ( this.hits >= this.length ) {
            this.sunk = true;
        }
    }}
}