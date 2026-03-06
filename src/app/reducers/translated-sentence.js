import {TRANSLATED_SENTENCE_SET} from '../actions/actionTypes';

export default function(state = "", {type, payload}) {
    switch(type) {
        case TRANSLATED_SENTENCE_SET: {
            return payload === "" ? "" : payload;  //Blanking out the translated sentence is common on leaving the edit/translation view page.
        }

        default:
            return state;
    }
}
