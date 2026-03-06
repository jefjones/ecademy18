import * as types from '../actions/actionTypes'
import {combineReducers} from 'redux'
import {doSort} from '../utils/sort'

const base = (state = [], action) => {
    switch(action.type) {
        case types.COURSES_BASE:
            return action.payload

        default:
            return state
    }
}

const courseDescription = (state = '', action) => {
    switch(action.type) {
        case types.COURSE_DESCRIPTION:
            return action.payload

        default:
            return state
    }
}

const seatsStatistics = (state = [], action) => {
    switch(action.type) {
        case types.COURSES_SEATS_STATISTICS:
            return action.payload

        default:
            return state
    }
}

const scheduledSimple = (state = [], action) => {
		switch(action.type) {
				case types.COURSES_SCHEDULED_SIMPLE:
						return action.payload

				default:
						return state
		}
}

const scheduled = (state = [], action) => {
    switch(action.type) {
        case types.COURSES_SCHEDULED:
            return action.payload

				case types.COURSES_SCHEDULED_REMOVE: {
						let newState = [...state]
						newState = newState.filter(m => m.courseScheduledId !== action.payload)
						return newState
        }

        case types.COURSE_SCHEDULED_ADD_UPDATE: {
						let newState = Object.assign([], state)
            const course = action.payload
            if (course.courseScheduledId) {
				        newState = newState.filter(m => m.courseScheduledId !== course.courseScheduledId)
            }
            //newState = newState && newState.length > 0 ? newState.concat(course) : [course];
            newState.push(course)
						return newState
        }

				case types.STUDENT_SCHEDULE_ADD: {
						//If this is an online class, then accummulate the studentList in the matching courseEntryId and the intervalId
						let {course, studentPersonId} = action.payload
						let newState = [...state]
						if (course.onlineName === 'Online' || course.online) {
								newState = newState.map(m => {
										if (m.courseEntryId === course.courseEntryId && m.intervalId === course.intervalId) {
												if (m.studentList && m.studentList.length > 0 && m.studentList.indexOf(studentPersonId) === -1) {
														m.studentList = m.studentList ? m.studentList.concat(studentPersonId) : [studentPersonId]
												}
										}
										return m
								})
						} else {
								newState = newState.map(m => {
										if (m.courseScheduledId === course.courseScheduledId) {
												m.studentList = m.studentList
														? m.studentList.indexOf(studentPersonId) === -1
																? m.studentList.concat(studentPersonId)
																: m.studentList
														: [studentPersonId]
										}
										return m
								})
						}
						return newState
				}

				case types.STUDENT_SCHEDULE_REMOVE: {
						let {courseScheduledId, studentPersonId} = action.payload
						let newState = [...state]
						let course = (newState && newState.length > 0
								&& newState.filter(m => m.courseScheduledId === courseScheduledId
										|| m.manheimMusicCombinedCoursesId === courseScheduledId
										|| m.manheimLearningSupportCombinedCoursesId === courseScheduledId))[0] || {}

						if (course.onlineName === 'Online' || course.online) {
								newState = newState.map(m => {
										if (m.courseEntryId === course.courseEntryId && m.intervalId === course.intervalId)
												m.studentList = m.studentList && m.studentList.length > 0
														? m.studentList.filter(m => m !== studentPersonId)
														: []
										return m
								})
						} else {
								newState = newState.map(m => {
										if (m.courseScheduledId === courseScheduledId
													|| m.manheimMusicCombinedCoursesId === courseScheduledId
													|| m.manheimLearningSupportCombinedCoursesId === courseScheduledId) {

												m.studentList = m.studentList && m.studentList.length > 0
														? m.studentList.filter(m => m !== studentPersonId)
														: []
										}
										return m
								})
						}
						return newState
				}

        case types.COURSE_DAYS_SCHEDULED: {
            let newState = [...state]
            const {courseScheduledId, daysScheduled} = action.payload
            newState = newState && newState.length > 0 && newState.map(m => {
                if (m.courseScheduledId === courseScheduledId) {
                    m.daysScheduled = daysScheduled
                }
                return m
            })
            return newState
        }

        default:
            return state
    }
}

const toSchedule  = (state = {}, action) => {
    switch(action.type) {
        case types.COURSE_TO_SCHEDULE:
            return action.payload

				case types.COURSE_TO_SCHEDULE_UPDATE: {
						const {field, value} = action.payload
						let newState = Object.assign({}, state)
						newState[field] = value
						return newState
				}

        default:
            return state
    }
}

const partialNameText  = (state = '', action) => {
    switch(action.type) {
        case types.COURSE_TO_SCHEDULE_NAME_SEARCH:
            return action.payload

        default:
            return state
    }
}

export default combineReducers({ base, courseDescription, scheduled, scheduledSimple, toSchedule, seatsStatistics, partialNameText })

export const selectCoursesBase = (state) => {
    return state.base
		//return state && state.base && state.base.length > 0 && doSort(state.base, { sortField: 'courseName', isAsc: true, isNumber: false })
}
export const selectCourseToSchedule = (state) => state.toSchedule
export const selectCoursesScheduled = (state) => {
		return state && state.scheduled && state.scheduled.length > 0 && doSort(state.scheduled, { sortField: 'label', isAsc: true, isNumber: false })
}
export const selectCoursesScheduledSimple = (state) => state.scheduledSimple
export const selectSeatsStatistics = (state) => state.seatsStatistics

export const selectPartialNameText = (state) => state.partialNameText
export const selectCourseDescription = (state) => state.courseDescription
