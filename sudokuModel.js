import _ from 'lodash';

const createRow = () => _.times(9, _.constant(null));
export const createTable = () => _.times(9, createRow);

const getColumn = (table, columnIndex) => _.map(table, row => row[columnIndex]);

/**
 * to define sudoku areas we use x and y coordinates ranging from 0 to 2.
 * columns in area are defining as 3x, 3x+1, 3x+2
 * rows in area are defining as 3y, 3y+1, 3y+2
 */
const getArea = (table, x, y) => {
    const rows = [table[3*y], table[3*y + 1], table[3*y + 2]];
    return _.flatMap(rows, row => row.slice( 3*x, 3*x + 3));
}

const getAllAreas = table =>
    _(3).range().flatMap(x =>
        _(3).range().map( y =>
            getArea(table, x, y) // needed to add constraints
        ).value()
    ).value();

const getMainDiag = table => _.map(table, (row, index) => row[index]);
const getBackDiag = table => _.map(table, (row, index) => row[8 - index]);


const getAllConstraints = table => {
    const rows = table;
    const columns = _.range(9).map(_.partial(getColumn, table));
    const areas = getAllAreas(table);
    const diags = [getMainDiag(table), getBackDiag(table)];

    return [
        ...rows,
        ...columns,
        ...areas,
        ...diags,
    ]
}

/**
 * check if lines has uniq number values
 */
const allDistinct = values => {
    const filteredValues = _.filter( values, x => typeof x === 'number');
    return _.uniq(filteredValues).length === filteredValues.length;
}

const allDistinctList = constraintList =>
    _.reduce(constraintList, (acc, values) => acc && allDistinct(values), true);

export const validateTable = table => allDistinctList(getAllConstraints(table));

export const setCell = (table, rowIndex, columnIndex, value)  => {
    const newTable = _.cloneDeep(table);
    newTable[rowIndex][columnIndex] = value;
    return newTable;
}

export const validateWin = (table, isInvalid) =>
    !_.some(_.flatMap(table), value => typeof value !== 'number')
    && !isInvalid;

export const setPredefineValues = (table, dataArr) => {
    _.each(dataArr, cellArr => {
        table[cellArr[0]][cellArr[1]] = cellArr[2];
    });
};
