import * as types from '../actions/actionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case types.COURSE_ATTENDANCE_ADMIN:
            return !action.payload || action.payload.length === 0 ? [] : action.payload; //This does need to blank out when choosing an assignment that doesn't have any records yet.

				case types.COURSE_ATTENDANCE_SINGLE_SET:
						const {attendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete} = action.payload;
						let newState = Object.assign([], state);
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
						let foundRecord = false;
						newState && newState.length > 0 && newState.forEach(m => {
								if (m.studentPersonId === studentPersonId && m.courseScheduledId === courseScheduledId && m.day === day) {
										if (!(m.isLeftEarly && attendanceTypeCode === "TARDY") && !(m.isTardy && attendanceTypeCode === "LEFTEARLY"))
										{
												m.isLeftEarly = false;
												m.isAbsent = false;
												m.isPresent = false;
												m.isExcusedAbsence = false;
												m.isTardy = false;
										}
										if (!isDelete) {
												if (attendanceTypeCode === 'PRESENT') m.isPresent = true;
												if (attendanceTypeCode === 'TARDY') m.isTardy = true;
												if (attendanceTypeCode === 'ABSENT') m.isAbsent = true;
												if (attendanceTypeCode === 'EXCUSEDABSENCE') m.isExcusedAbsence = true;
												if (attendanceTypeCode === 'LEFTEARLY') m.isLeftEarly = true;
										}
										foundRecord = true;
								}
								return m;
						})
						if (!isDelete) {
								if (!foundRecord) {
										newState = newState && newState.length > 0 ? newState.concat(result) : [result];
								}
								if (!(newState && newState.length > 0)) newState = newState && newState.length > 0 ? newState.concat(result) : [result];
						}
						return newState;

        default:
            return state;
    }
}

export const selectCourseAttendanceAdmin = (state) => state;
