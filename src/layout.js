import { createHtmlElement } from './util.js';
import './sass/style.scss';

export function container() {
    const container = createHtmlElement('div', 'container', '');
    container.appendChild(header());
    container.appendChild(main());
    container.appendChild(sectionFooter());

    return container;
}

export function gridLayoutPlayer( grid, board ) {
    if (!board) {
        for ( let i = 0; i < 10 ; i++ ) {
            for ( let j = 0; j < 10; j++ ) {
                const gridItem = createHtmlElement('div', 'grid-item', '');
                gridItem.dataset['row'] = i;
                gridItem.dataset['column'] = j;
                grid.appendChild(gridItem);    
            }
        } 
    } else {
        for ( let i = 0; i < 10 ; i++ ) {
            for ( let j = 0; j < 10; j++ ) {
                const gridItem = createHtmlElement('div', 'grid-item', '');
                gridItem.dataset['row'] = i;
                gridItem.dataset['column'] = j;
                if ( board[i][j] === 'hit' || board[i][j] === 'miss' ) {
                    gridItem.classList.add(board[i][j]);
                }
                if ( board[i][j].hits !== undefined || board[i][j] === 'ship') {
                    gridItem.classList.add('ship');
                }
                grid.appendChild(gridItem);    
            }
        } 
    }
}

function header() {
    const header = createHtmlElement('header', '', '');
    header.appendChild(createHtmlElement('h1', '', 'BattleShips'));

    return header;
}

function main() {
    const main = createHtmlElement('main','', '');
    main.appendChild(createHtmlElement('div','grid', ''));
    main.appendChild(createHtmlElement('div','placing-grid', ''));

    return main;
}

function sectionFooter() {
    const sectionFooter = createHtmlElement('div','footer-section', '');
    sectionFooter.appendChild(createHtmlElement('div','player-container', 'Player message here!'));
    sectionFooter.appendChild(createHtmlElement('div','cpu-container', 'CPU message here!'));
    
    return sectionFooter;
}
