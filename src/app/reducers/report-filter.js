import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.REPORT_FILTERS_INIT:
            let reportFilters = action.payload;

            reportFilters = reportFilters && reportFilters.length > 0 &&
                reportFilters.map(({workIds, nativeLanguageIds, translateLanguageIds, editorIds, sectionIds, ...filter}) => {
                    let newWorkIds = workIds && workIds.split(",");
                    newWorkIds = !newWorkIds || newWorkIds.length === 0 ? [] : newWorkIds.map(m => m|0);  //This is the bitwise converter from string to int.
                    let newNativeLanguageIds = nativeLanguageIds && nativeLanguageIds.split(",");
                    newNativeLanguageIds = !newNativeLanguageIds || newNativeLanguageIds.length === 0 ? [] : newNativeLanguageIds.map(m => m|0);  //This is the bitwise converter from string to int.
                    let newTranslateLanguageIds = translateLanguageIds && translateLanguageIds.split(",");
                    newTranslateLanguageIds = !newTranslateLanguageIds || newTranslateLanguageIds.length === 0 ? [] : newTranslateLanguageIds.map(m => m|0);
                    let newEditorIds = editorIds && editorIds.split(",");
                    newEditorIds = !newEditorIds || newEditorIds.length === 0 ? [] : newEditorIds.map(m => m|0);
                    let newSectionIds = sectionIds && sectionIds.split(",");
                    newSectionIds = !newSectionIds || newSectionIds.length === 0 ? [] : newSectionIds.map(m => m|0);

                    return ({
                        ...filter,
                        workIds: newWorkIds,
                        nativeLanguageIds: newNativeLanguageIds,
                        translateLanguageIds: newTranslateLanguageIds,
                        editorIds: newEditorIds,
                        sectionIds: newSectionIds,
                    })
                });
            return reportFilters;

        default:
            return state;
    }
}

export const selectReportFilter = (state) => state;
