/**
 * table creation
 */

// way 1
const createRow = () => _.times(9, _.constant(null));
const createTable = () => _.times(9, createRow);

const t = createTable();


//way 2

const createRow2 = x => _.map(_.range(9), y => `${x}-${y}`);
    //testing
createRow2(4); //console for testing?
    //end of testing

const createTable2 = () => _.map(_.range(9), createRow2);

const t = createTable2();


/**
 * rowSelection
 */

const getRow = (table, row) => table[row];

    //testing
getRow(t2,4);
    //end of testing

/**
 * column selection
 */

const getColumn = (table, columnIndex) => _.map(table, row => row[columnIndex]);
    //testing
getColumn(t2, 3);
    //end of texting

/**
 * to define sudoku areas we use x and y coordinates ranging from 0 to 2.
 * columns in area are defining as 3x, 3x+1, 3x+2
 * rows in area are defining as 3y, 3y+1, 3y+2
 */

//testing
let x = 2, y = 1;

const selectedRows = [ t2[3*y], t2[3*y+1], t2[3*y+2]];
console.table(selectedRows);
let selectedArea = _.map(selectedrow, row => row.slice( 3*x, 3*x + 3));
console.table(selectedAreas);
    //it is better to use 1-dimansional array instead of array of arrays;
selectedArea = _.flatMap(selectedrow, row => row.slice( 3*x, 3*x + 3));
//end of testing

/**
 * area selection
 */

const getArea = (table, x, y) => {
    const rows = [table[3*y], table[3*y + 1], table[3*y + 2]];
    return _.flatMap(rows, row => row.slice( 3*x, + 3));
}

    //testing
getArea(t2, 2, 1);
getArea(t2, 1, 0);
getArea(t2, 0, 1);
    //end of testing

/**
 * diagonals selection
 */

const getMainDiag = table => _.map(table, (row, index) => row[index]);
const getBackDiag = table => _.map(table, (row, index) => row[8 - index]);

    //testing
getMainDiag(t2);
getBackDiag(t2);
    //end of testing
