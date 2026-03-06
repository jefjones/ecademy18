import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.VOICE_RECORDING_INIT:
            return action.payload;

        default:
            return state;
    }
}

export const selectVoiceRecording = (state) => state;
