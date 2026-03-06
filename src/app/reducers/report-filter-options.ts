import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.REPORT_FILTERS_OPTIONS_INIT:
            return action.payload

        case types.REPORT_FILTERS_OPTIONS_SECTIONS:
            const section = action.payload
            return {
                ...state,
                section,
            }


        default:
            return state
    }
}

export const selectWorkOptions = (state) => state.work
export const selectNativeLanguageOptions = (state) => state.nativeLanguage
export const selectTranslateLanguageOptions = (state) => state.translateLanguage
export const selectEditorOptions = (state) => state.editor
export const selectSectionOptions = (state) => state.section
