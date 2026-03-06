import * as types from '../actions/actionTypes'
import moment from 'moment'

export default function(state = [], action) {
    switch(action.type) {
        case types.STUDENT_SCHEDULE_INIT:
            return !action.payload && action.payload.length === 0 ? [] : action.payload

				case types.STUDENT_SCHEDULE_REMOVE: {
						let newState = [...state]
						let {courseScheduledId} = action.payload
						if (courseScheduledId) newState = newState.filter(m => m.courseScheduledId !== courseScheduledId)
            return newState
				}

				case types.STUDENT_SCHEDULE_ADD: {
						let addState = [...state]
						let {course} = action.payload
						addState = addState && addState.length > 0 ? addState.concat(course) : [course]
						return addState
				}

				case types.REGISTRATION_STUDENT_FINALIZE: {
						let newState = [...state]
						newState = newState && newState.length > 0 && newState.map(m => {m.isfinalized = true; return m})
						return newState
				}

        case types.STUDENT_COURSE_ASSIGN_INTERVALID: {
            const {courseScheduledId, intervalId} = action.payload
            let newState = [...state]
            newState = newState && newState.length > 0 && newState.map(m => {
                let found = false
                if (m.courseScheduledId === courseScheduledId) {
                    m.assignedIntervals && m.assignedIntervals.length > 0 && m.assignedIntervals.forEach(id => {
                        if (id === intervalId) found = true
                    })
                }
                if (found) {
                    m.assignedIntervals = m.assignedIntervals.filter(id => id !== intervalId)
                } else {
                    m.assignedIntervals = m.assignedIntervals && m.assignedIntervals.length > 0 ? m.assignedIntervals.concat(intervalId) : [intervalId]
                }
                return m
            })
            return newState
        }

        case types.STUDENT_SCHEDULE_ACCREDITED_SET: {
            const {learnerCourseAssignId, value} = action.payload
            let newState = [...state]
            newState = newState && newState.length > 0 && newState.map(m => {
                if (m.learnerCourseAssignId === learnerCourseAssignId)  m.accredited = value
                return m
            })
            return newState
        }

        default:
            return state
    }
}

export const selectStudentSchedule = (state) => {
		return state && state.length > 0 && state.map(m => {
				// let classPeriod = m.classPeriodId && classPeriods && classPeriods.length > 0 && classPeriods.filter(m => m.classPeriodId === m.classPeriodId)[0];
				// let classPeriodName = classPeriod && classPeriod.name;
        let weekdaysText = ''
        				let dash = ''
        				if (m.monday) { weekdaysText += dash + 'M'; dash = '-'; }
        				if (m.tuesday) { weekdaysText += dash + 'T'; dash = '-'; }
        				if (m.wednesday) { weekdaysText += dash + 'W'; dash = '-'; }
        				if (m.thursday) { weekdaysText += dash + 'Th'; dash = '-'; }
        				if (m.friday) { weekdaysText += dash + 'F'; dash = '-'; }

				let reoccurringText = moment(m.startTime).format("h:mm:ss a")
				let startTimeText = moment(m.startTime).format("h:mm:ss a")
				reoccurringText += " (" + m.duration + " min)"
				let durationText = m.duration ? m.duration + " min" : ''
				reoccurringText += " [" + moment(m.fromDate).format("D MMM")
				reoccurringText += " .. " + moment(m.toDate).format("D MMM") + "]"
				let dateRangeText = "" + moment(m.fromDate).format("D MMM") + " .. " + moment(m.toDate).format("D MMM")
				dateRangeText = dateRangeText.indexOf('Invalid') > -1 ? '' : dateRangeText

				return {
						...m,
						offCampus: m.offCampus,
						onCampus: m.onCampus,
						online: m.online,
						SelfPaced: m.selfPaced,
						classPeriodName: m.classPeriodName,
						offCampusName: m.offCampus ? 'Off campus' : '',
						onCampusName: m.onCampus ? 'On campus' : '',
						onlineName: m.online ? 'Online' : '',
						selfPacedName: m.selfPaced ? 'Self-paced' : '',
						//schedule: m.Schedule,
						reoccurringText,
						//specificTextList: m.SpecificTextList,
						weekdaysText,
						startTimeText,
						durationText,
						dateRangeText,
				}
		})
}
