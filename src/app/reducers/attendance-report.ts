import * as types from '../actions/actionTypes'

export default function(state = [], action) {
    switch(action.type) {
        case types.ATTENDANCE_REPORT_INIT:
            return !action.payload && action.payload.length === 0 ? [] : action.payload

				case types.ATTENDANCE_REPORT_EDIT_MODE_SET: {
						const {courseScheduledId, attendanceDate} = action.payload
						let newState = Object.assign({}, state)
						newState.courseAttendance = newState.courseAttendance && newState.courseAttendance.length > 0 && newState.courseAttendance.map(m => {
								if (m.courseScheduledId === courseScheduledId && m.attendanceDate === attendanceDate) {
										m.isEditMode = !m.isEditMode
								}
								return m
						})
						return newState
				}

				case types.COURSE_ATTENDANCE_SINGLE_SET: {
						let {courseScheduledId, day, attendanceTypeCode} = action.payload
						let newState = Object.assign({}, state)
						let courseAttendance = newState.courseAttendance

						let result = {
								courseScheduledId,
								attendanceDate: day,
								isAbsent: attendanceTypeCode === 'ABSENT',
								isExcusedAbsence: attendanceTypeCode === 'EXCUSEDABSENCE',
								isLeftEarly: attendanceTypeCode === 'LEFTEARLY',
								isPresent: attendanceTypeCode === 'PRESENT',
								isTardy: attendanceTypeCode === 'TARDY',
						}
						let foundRecord = false
						courseAttendance && courseAttendance.length > 0 && courseAttendance.forEach(m => {
								if (m.courseScheduledId === courseScheduledId && m.attendanceDate === day) {
										if (!(m.isLeftEarly && attendanceTypeCode === "TARDY") && !(m.isTardy && attendanceTypeCode === "LEFTEARLY"))
										{
												m.isLeftEarly = false
												m.isAbsent = false
												m.isPresent = false
												m.isExcusedAbsence = false
												m.isTardy = false
										}
										if (attendanceTypeCode === 'PRESENT') m.isPresent = true
										if (attendanceTypeCode === 'TARDY') m.isTardy = true
										if (attendanceTypeCode === 'ABSENT') m.isAbsent = true
										if (attendanceTypeCode === 'EXCUSEDABSENCE') m.isExcusedAbsence = true
										if (attendanceTypeCode === 'LEFTEARLY') m.isLeftEarly = true
										foundRecord = true
								}
								return m
						})
						if (attendanceTypeCode) {
								if (!foundRecord) {
										courseAttendance = courseAttendance && courseAttendance.length > 0 ? courseAttendance.concat(result) : [result]
								}
								if (!(courseAttendance && courseAttendance.length > 0)) courseAttendance = courseAttendance && courseAttendance.length > 0 ? courseAttendance.concat(result) : [result]
						}
						newState.courseAttendance = courseAttendance
						return newState
				}

        default:
            return state
    }
}

export const selectAttendanceReport = (state) => state
