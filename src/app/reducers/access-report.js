import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.ACCESS_REPORT_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectAccessReport = (state) => state;

export const selectAccessReportTable = (state, groupId) => {
    //Table headers:  Work's cut-off name
    //row left column: editor's names (students or group members)
    let headings = state && state.headings && state.headings.length > 0 && state.headings.map(h => ({
        ...h,
        label: h.label && h.label.length > 15 ? h.label.substring(0, 15) + '...' : h.label,
        pathLink: '',
        verticalText: true
    }));
    let data = state && state.dataRows && state.dataRows.length > 0 && state.dataRows.map(row =>
        row && row.reportDataRow && row.reportDataRow.length > 1 && row.reportDataRow.map(d => {
         return ({
            ...d,
            id: d.id,
            headingId: d.headingId,
            pathLink: '',
        })})
    );

    // let sortByHeadings = { sortField: "label", isAsc: true, isNumber: true };
    // return doSort(options, sortByHeadings);
    return {headings, data};
}

export const selectWorkOptions = (state) => {
    let workOptions = state && state.headings && state.headings.length > 0 && state.headings.map(h => ({
        id: h.headingId,
        value: h.headingId,
        label: h.label,
    }));
    workOptions && workOptions.shift()
    return workOptions; //Take off the first once since it is a blank cell to start the heading of a report.
}

export const selectEditorOptions = (state) => {
    let editorOptions = [];
    state && state.dataRows && state.dataRows.length > 0 && state.dataRows.forEach(row =>
        row && row.reportDataRow && row.reportDataRow.length > 1 && row.reportDataRow.forEach((d, index) => {
            if (index === 0) {
                let option = {
                    id: d.id,
                    value: d.id,
                    label: d.value,
                }
                editorOptions = editorOptions ? editorOptions.concat(option) : [option];
            }
        })
    );
    return editorOptions;
}
