import * as types from '../actions/actionTypes'
import moment from 'moment'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_BASE_COURSE_REQUEST_INIT:
            return action.payload

				case types.STUDENT_BASE_COURSE_REQUEST_ADD: {
						const {courseEntryId, courseName, externalId, credits} = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.courseEntryId !== courseEntryId)
						let option = {
							courseEntryId,
							courseName,
							externalId,
							credits,
						}
						newState = newState && newState.length > 0 ? newState.concat(option) : [option]
            return newState
				}

				case types.STUDENT_BASE_COURSE_REQUEST_FINALIZE: {
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.map(m => {
								m.finalizeDate = moment()
								return m
						})
            return newState
				}

				case types.STUDENT_BASE_COURSE_REQUEST_REMOVE: {
						const studentBaseCourseRequestId = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.studentBaseCourseRequestId !== studentBaseCourseRequestId)
						return newState
				}


				case types.COURSE_RECOMMENDATION_REMOVE: {
						const {studentPersonId, courseEntryId} = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0 && newState.filter(m => m.LearnerCourseRecommended && m.studentPersonId !== studentPersonId && m.courseEntryId !== courseEntryId)
						return newState
				}

				case types.COURSE_ASSIGN_BY_ADMIN_DECLINE: {
						const {courseAssignByAdminId, studentPersonId} = action.payload
						let newState = Object.assign([], state)
						newState = newState && newState.length > 0
								&& newState.filter(m => m.courseAssignByAdminId !== courseAssignByAdminId && m.studentPersonId !== studentPersonId)
						return newState
				}

        default:
            return state
    }
}

export const selectStudentBaseCourseRequests = (state) => state
