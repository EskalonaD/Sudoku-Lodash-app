import _ from 'lodash';

const templateString = document.getElementsByClassName('js-table-template')[0].innerHTML;

const tableTemplate = _.template(templateString);
export const renderTable = (table) => {
    const domTable = document.getElementsByClassName('js-table')[0];
    domTable.innerHTML = tableTemplate({table});
};
