import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.TUTORIAL_VIDEOS_INIT:
            return action.payload

        default:
            return state
    }
}

 export const selectTutorialVideos = (state) => {
	 	let newState = Object.assign([], state)
		return newState && newState.length > 0 && newState.map(m => ({ ...m, id: m.tutorialVideoId, tutorialVideoId: m.tutorialVideoId }));s
 }
