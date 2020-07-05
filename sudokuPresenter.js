import _ from 'lodash';
import {
    setCell,
    validateTable,
    validateWin,
    createTable,
    setPredefineValues
} from './sudokuModel';

const templateString = document.getElementsByClassName('js-table-template')[0].innerHTML;

const tableTemplate = _.template(templateString);

let tableModel = null;
let renderTable = null;

const selectCell = (cellNode) => {
    _.each(
        document.getElementsByClassName('js-selected'),
        node => {
            node.classList.remove('selected');
            node.classList.remove('js-selected');
        }
    );

    if(!cellNode.classList.contains('js-predefine-cell')) {
        cellNode.classList.add('selected');
        cellNode.classList.add('js-selected');
    }
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
        // console.log('target', event.target);
        // console.log('dataset', event.target.dataset);
        selectCell(cell);
    });

    cell.addEventListener('keydown', escapeHandling);
    cell.addEventListener('blur', onBlur);
};

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

const addKeyEvent = () => window.addEventListener('keypress', event => {
    const key = event.key;
    if ('123456789 '.includes(key)) insertValue(key);
});

const objectMapperPredefinedValues = (data) => _.reduce(data, (acc, cellArr) => {
    acc[`${cellArr[0]}${cellArr[1]}`] = cellArr[2];
    return acc;
}, {})


const nodeExist = className => _.some(document.getElementsByClassName(className));

export const renderTimer = (t = 0, table = tableModel) => {
    document.getElementsByClassName('js-timer')[0].innerHTML = _.template(
        '<span class="js-spent-time"><%= t %></span> seconds'
    )({ t });
};

export const renderWinView = (buttonEventHandler) => {
    const winView = document.getElementsByClassName('js-win-view-template')[0].innerHTML;
    const time = document.getElementsByClassName('js-spent-time')[0].textContent;
    document.getElementsByClassName('js-win-view-wrapper')[0].innerHTML = _.template(winView)({t: time});
    document.getElementsByClassName('js-again-button')[0].addEventListener('click', buttonEventHandler);
};

const winEvent = new Event('win');

const addTimerToWin = (renderTimer, time = 0, table = tableModel) => {
    renderTimer(time++);

    if (!validateWin(table, nodeExist('js-invalid'))) _.delay(() => addTimerToWin(renderTimer, time), 1000);
    else document.getElementsByClassName('js-table')[0].dispatchEvent(winEvent);
}



const setInitialValues = (table, data) => {
    const cellNodes = document.getElementsByClassName('js-sudoku-cell');
    // console.log('herer', cellNodes)
    // parsePredefineValues(table, data);

    // _.each(cellNodes, () => console.log('hi'))
    _.each(cellNodes, cell => {
        // console.log(typeof cell.value);
        // console.log(!isNaN(+cell.value));
        // console.log(cell.value)
        if (!isNaN(+cell.textContent)) cell.classList.add('js-predefine-cell')
    });
};

const restartGame = (newData) => {
    document.getElementsByClassName('js-win-view-wrapper')[0].innerHTML = '';
    document.getElementsByClassName('js-table')[0].innerHTML = '';
    document.getElementsByClassName('js-win-view-wrapper').innerHTML = '';

    startGame(newData);
};

export const startGame = (data) => {
    const table = createTable();
    const random = Math.trunc(Math.random() * data.length);
    const startedValues = data[random];
    const newData = _.filter(data, (value, propName) => propName !== random);

    const restartFunction = data => () => restartGame(data);
    renderTable = _.partial((data, table) => {
        const isValid = validateTable(table);
        const domTable = document.getElementsByClassName('js-table')[0];

        domTable.innerHTML = tableTemplate({ table, isValid });
        const cellNodes = document.getElementsByClassName('js-sudoku-cell');
        const predefinedValuesObject = objectMapperPredefinedValues(data);
        _.each(cellNodes, cell => {
            if(typeof predefinedValuesObject[`${cell.dataset.row}${cell.dataset.column}`] === 'number') {
                cell.classList.add('js-predefine-cell');
            }
        })
        tableModel = table;
        addAllClickEvents();
    }, startedValues);

    setPredefineValues(table, startedValues);
    renderTable(table);
    setInitialValues(table, startedValues);
    addTimerToWin(renderTimer);
    addKeyEvent();

    document.getElementsByClassName('js-table')[0].addEventListener('win', () => renderWinView(restartFunction(newData)));
}
