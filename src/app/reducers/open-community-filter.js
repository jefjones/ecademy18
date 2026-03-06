import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.OPEN_COMMUNITY_FILTERS_INIT:
            let openCommunityFilters = action.payload;

            openCommunityFilters = openCommunityFilters && openCommunityFilters.length > 0 &&
                openCommunityFilters.map(({nativeLanguageIds, translateLanguageIds, genreIds, editSeverityIds, ...filter}) => {
                    let newNativeLanguageIds = nativeLanguageIds && nativeLanguageIds.split(",");
                    newNativeLanguageIds = !newNativeLanguageIds || newNativeLanguageIds.length === 0 ? [] : newNativeLanguageIds.map(m => m|0);  //This is the bitwise converter from string to int.
                    let newTranslateLanguageIds = translateLanguageIds && translateLanguageIds.split(",");
                    newTranslateLanguageIds = !newTranslateLanguageIds || newTranslateLanguageIds.length === 0 ? [] : newTranslateLanguageIds.map(m => m|0);
                    let newGenreIds = genreIds && genreIds.split(",");
                    newGenreIds = !newGenreIds || newGenreIds.length === 0 ? [] : newGenreIds.map(m => m|0);
                    let newEditSeverityIds = editSeverityIds && editSeverityIds.split(",");
                    newEditSeverityIds = !newEditSeverityIds || newEditSeverityIds.length === 0 ? [] : newEditSeverityIds.map(m => m|0);

                    return ({
                        ...filter,
                        nativeLanguageIds: newNativeLanguageIds,
                        translateLanguageIds: newTranslateLanguageIds,
                        genreIds: newGenreIds,
                        editSeverityIds: newEditSeverityIds,
                    })
                });
            return openCommunityFilters;

        default:
            return state;
    }
}

export const selectOpenCommunityFilter = (state) => state;
