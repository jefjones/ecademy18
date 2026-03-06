import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.TRANSCRIPTS_INIT:
            return !action.payload && action.payload.length === 0 ? [] : action.payload;

				case types.TRANSCRIPT_REMOVE:
						const transcriptId = action.payload;
						let newState = Object.assign([], state);
						let courseTranscripts = newState.courseTranscripts;
						courseTranscripts = courseTranscripts && courseTranscripts.length > 0 && courseTranscripts.filter(m => m.transcriptId !== transcriptId);
						newState.courseTranscripts = courseTranscripts;
            return newState || [];

        default:
            return state;
    }
}

export const selectTranscripts = (state) => state;
