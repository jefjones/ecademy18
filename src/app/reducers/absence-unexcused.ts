import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ABSENCE_UNEXCUSED_INIT:
            return action.payload

				case types.ABSENCE_UNEXCUSED_FILE_DELETE: {
						let newState = Object.assign([], state)
						const fileUploadId = action.payload
						newState.fileUploads = newState && newState.fileUploads && newState.fileUploads.length > 0 && newState.fileUploads.filter(m => m.fileUploadId !== fileUploadId)
						return newState
				}

				case types.ABSENCE_UNEXCUSED_APPROVE: {
						//This is actually reacting to "approve" or "decline"
						let newState = Object.assign([], state)
						const excusedAbsenceIds = action.payload
						newState.absenceDateLines = newState && newState.absenceDateLines && newState.absenceDateLines.length > 0 && newState.absenceDateLines.filter(m => {
								return !(excusedAbsenceIds && excusedAbsenceIds.length > 0 && excusedAbsenceIds.indexOf(m.excusedAbsenceId) > -1)
						})
						return newState
				}

				case types.ABSENCE_UNEXCUSED_FILE_UPLOADS: {
						const fileUploads = action.payload
						return {...state, fileUploads }
				}

				case types.ABSENCE_UNEXCUSED_UPDATE: {
						let newState = Object.assign([], state)
						let absenceDateLines = newState.absenceDateLines || []
						const {courseAttendanceIds} = action.payload

						courseAttendanceIds && courseAttendanceIds.length > 0 && courseAttendanceIds.forEach(id => {
								absenceDateLines = absenceDateLines && absenceDateLines.length > 0 && absenceDateLines.filter(m => m.courseAttendanceId !== id)
						})
						newState.absenceDateLines = absenceDateLines
						newState.fileUploads = []; //Clear these out since we are done with the local view of the file upload(s)
						return newState
				}

        default:
            return state
    }
}

export const selectAbsenceUnexcused = (state) => state
