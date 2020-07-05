import _ from 'lodash';
import { setCell, validateTable, validateWin } from './sudokuModel';

const templateString = document.getElementsByClassName('js-table-template')[0].innerHTML;

const tableTemplate = _.template(templateString);

let tableModel = null;

const selectCell = (cellNode) => {
    _.each(
        document.getElementsByClassName('js-selected'),
        node => {
            node.classList.remove('selected');
            node.classList.remove('js-selected');
        }
    );
    cellNode.classList.add('selected');
    cellNode.classList.add('js-selected');
}

const deselectCell = cellNode => {
    cellNode.classList.remove('selected');
    cellNode.classList.remove('js-selected');
}

const addClickEvent = cell => {
    const onBlur = () => {
        deselectCell(cell);
    }

    const escapeHandling = (event) => {
        if(event.key === 'Escape') event.target.blur();
    }

    cell.addEventListener('focus', event => {
        console.log('target', event.target);
        console.log('dataset', event.target.dataset);
        selectCell(cell);
    });

    cell.addEventListener('keydown', escapeHandling);
    cell.addEventListener('blur', onBlur)
}

const addAllClickEvents = () => _.each(
    document.getElementsByClassName('js-sudoku-cell'),
    addClickEvent,
);

const insertValue = (key) => {
    const selectedNode = document.getElementsByClassName('js-selected')[0];
    if (selectedNode) {
        const dataset = selectedNode.dataset;
        const value = parseInt(key) || null;
        renderTable(setCell(tableModel, dataset.row, dataset.column, value));
    }
};

const addKeyEvent = () =>
    window.addEventListener('keypress', event => {
        const key = event.key;
        if ('123456789 '.includes(key)) insertValue(key);
    });

export const renderTable = (table) => {
    const isValid = validateTable(table);
    console.log(isValid);
    const domTable = document.getElementsByClassName('js-table')[0];
    domTable.innerHTML = tableTemplate({ table, isValid });

    tableModel = table;

    addAllClickEvents();
};

addKeyEvent();

const nodeExist = className => _.some(document.getElementsByClassName(className));

export const renderTimer = (t = 0, table = tableModel) => {
    document.getElementsByClassName('js-timer')[0].innerHTML = _.template(
        '<span class="js-spent-time"><%= t %></span> seconds'
    )({ t });
}

export const renderWinView = () => {
    const winView = document.getElementsByClassName('js-win-view-template')[0].innerHTML;
    const time = document.getElementsByClassName('js-spent-time')[0].textContent;
    document.getElementsByClassName('js-win-view')[0].innerHTML = _.template(winView)({t: time});
}

const winEvent = new Event('win');

const addTimerToWin = (renderTimer, time = 0, table = tableModel) => {
    renderTimer(time++);
    if (!validateWin(table, nodeExist('js-invalid'))) _.delay(() => addTimerToWin(renderTimer, time), 1000);
    else document.getElementsByClassName('js-table')[0].dispatchEvent(winEvent);
}

export const startGame = () => {
    addTimerToWin(renderTimer);
    document.getElementsByClassName('js-table')[0].addEventListener('win', () => {console.log('catch event'); renderWinView()});
}
