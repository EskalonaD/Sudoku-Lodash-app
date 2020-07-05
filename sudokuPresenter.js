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

const addClickEvent = cell =>
    cell.addEventListener('click', event => {
        console.log('target', event.target);
        console.log('dataset', event.target.dataset);
        selectCell(cell);
    });

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
        console.log('event', event);
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
        '<%= t %> seconds'
    )({ t });
    // _.delay(() => renderTimer(t + 1), 1000);
    if (!validateWin(table, nodeExist('invalid'))) _.delay(() => renderTimer(t + 1), 1000);
}
