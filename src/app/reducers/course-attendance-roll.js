import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_ATTENDANCE_ROLL_INIT:
            return action.payload; //This does need to blank out when choosing an assignment that doesn't have any records yet.

				case types.COURSE_ATTENDANCE_SINGLE_SET: {
						let {attendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete} = action.payload;
						let newState = Object.assign([], state);
						let foundRecord = false;
						newState && newState.length > 0 && newState.forEach(m => {
								if (m.personId === studentPersonId && m.courseScheduledId === courseScheduledId && m.attendanceDate && m.attendanceDate.substring(0,10) === day) {
										if (!(m.isLeftEarly && attendanceTypeCode === "TARDY") && !(m.isTardy && attendanceTypeCode === "LEFTEARLY"))
										{
												m.isLeftEarly = false;
												m.isAbsent = false;
												m.isPresent = false;
												m.isExcusedAbsence = false;
												m.isTardy = false;
										}
										if (attendanceTypeCode === 'PRESENT') m.isPresent = isDelete ? false : true;
										if (attendanceTypeCode === 'TARDY') m.isTardy = isDelete ? false : true;
										if (attendanceTypeCode === 'ABSENT') m.isAbsent = isDelete ? false : true;
										if (attendanceTypeCode === 'EXCUSEDABSENCE') m.isExcusedAbsence = isDelete ? false : true;
										if (attendanceTypeCode === 'LEFTEARLY') m.isLeftEarly = isDelete ? false : true;
										foundRecord = true;
								}
								return m;
						})
						if (!isDelete && !foundRecord) {
                let result = {
    								courseScheduledId,
    								attendanceDate: day,
    								isAbsent: attendanceTypeCode === 'ABSENT',
    								isExcusedAbsence: attendanceTypeCode === 'EXCUSEDABSENCE',
    								isLeftEarly: attendanceTypeCode === 'LEFTEARLY',
    								isPresent: attendanceTypeCode === 'PRESENT',
    								isTardy: attendanceTypeCode === 'TARDY',
    								personId: studentPersonId,
    						}
								newState = newState && newState.length > 0 ? newState.concat(result) : [result];
						}
						return newState;
				}

				case types.ATTENDANCE_SET_ALL_PRESENT: {
								let {courseScheduledId, courseDay, studentList} = action.payload;
								let newState = [];
								studentList && studentList.length > 0 && studentList.forEach(studentPersonId => {
										let result = {
												courseScheduledId,
												attendanceDate: courseDay,
												isAbsent: false,
												isExcusedAbsence: false,
												isLeftEarly: false,
												isPresent: true,
												isTardy: false,
												personId: studentPersonId,
										}
										newState = newState && newState.length > 0 ? newState.concat(result) : [result];
								})
								return newState;
						}

        default:
            return state;
    }
}

export const selectCourseAttendanceRoll = (state) => state;
