import {TRANSLATIONS_INIT} from '../actions/actionTypes'

export default function(state = {}, {type, payload}) {
    switch(type) {
        case TRANSLATIONS_INIT: {
            return payload
        }

        default:
            return state
    }
}

export const selectTranslations = (state) => state

export const selectTranslationsByKey = (state, key) => state[key]
