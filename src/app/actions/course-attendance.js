import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import moment from 'moment';

export const getSingleCourseAttendance = (personId, courseScheduledId, day, studentList='') => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendance', value: true } });
        return fetch(`${apiHost}ebi/courseAttendance/singleCourse/` + personId + `/` + courseScheduledId + `/` + day, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
						body: JSON.stringify(studentList)
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({type: types.COURSE_ATTENDANCE_ROLL_INIT, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendance', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendance', value: false } }));
    }
}

export const clearCourseAttendanceAdmin = () => {
		return dispatch => {
				dispatch({type: types.COURSE_ATTENDANCE_ADMIN, payload: []});
		}
}

export const getCourseAttendanceAdmin = (personId, attendanceRequest) => {
		let today = moment().format('YYYY-MM-DD');
		if (attendanceRequest) {
				attendanceRequest.studentPersonId = attendanceRequest.studentPersonId ? attendanceRequest.studentPersonId : attendanceRequest.studentPersonId;
				attendanceRequest.dayFrom = attendanceRequest.dayFrom && attendanceRequest.dayFrom.indexOf('NaN') === -1 ? attendanceRequest.dayFrom : attendanceRequest.dayTo ? attendanceRequest.dayTo : today;
				attendanceRequest.dayTo = attendanceRequest.dayTo && attendanceRequest.dayTo.indexOf('NaN') === -1 ? attendanceRequest.dayTo : attendanceRequest.dayFrom ? attendanceRequest.dayFrom : today;
		}
		let hasStudentPersonId = attendanceRequest && attendanceRequest.studentPersonId;

    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceAdmin', value: true } });
        return !hasStudentPersonId ? null : fetch(`${apiHost}ebi/courseAttendance/admin/` + personId, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
            body: JSON.stringify(attendanceRequest)
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({type: types.COURSE_ATTENDANCE_ADMIN, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceAdmin', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceAdmin', value: false } }));
    }
}

export const setMassCourseAttendanceAdmin = (personId, attendanceTypeCode, isDelete, courseAttendances, runFunction=() => {}) => {
    return dispatch => {
				dispatch({type: types.COURSE_ATTENDANCE_ADMIN_SET_MASS, payload: {attendanceTypeCode, courseAttendances} });
        dispatch({type: types.FETCHING_RECORD, payload: {courseAttendanceAdmin: true} });
        return fetch(`${apiHost}ebi/courseAttendance/setMass/` + personId + `/` + attendanceTypeCode + `/` + isDelete, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
            body: JSON.stringify(courseAttendances)
        })
        .then(() => dispatch(runFunction));
    }
}

export const courseAttendanceDatesInit = (personId, courseScheduledId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/courseAttendance/days/` + personId + `/` + courseScheduledId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({type: types.COURSE_ATTENDANCE_DAYS_INIT, payload: response});
        })
    }
}

export const clearAttendanceDates = () => {
    return dispatch => {
        dispatch({type: types.COURSE_ATTENDANCE_DAYS_INIT, payload: [] });
    }
}


export const courseAttendanceDatesSetBlank = () => {
    return dispatch => dispatch({type: types.COURSE_ATTENDANCE_DAYS_INIT, payload: []});
}

export const setCourseAttendance = (personId, attendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction=() => {}) => {
		let todayDate = moment().format('YYYY-MM-DD');
		attendanceTypeCode = attendanceTypeCode ? attendanceTypeCode : 'EMPTY';

    return dispatch => {
				dispatch({type: types.COURSE_ATTENDANCE_SINGLE_SET, payload: {attendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete} });
        return fetch(`${apiHost}ebi/courseAttendance/set/` + personId + `/` + attendanceTypeCode + `/` + studentPersonId + `/` + courseScheduledId + `/` + day + `/` + todayDate + `/` + isDelete, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
						body: JSON.stringify(studentList)
        })
				.then(() => {
						dispatch(runFunction);
				})
    }
}

export const getCourseAttendanceSingle = (personId, studentPersonId, dayFrom, dayTo) => {
		let today = moment().format('YYYY-MM-DD');
		dayFrom = dayFrom && dayFrom.indexOf('NaN') === -1 ? dayFrom : dayTo ? dayTo : today;
		dayTo = dayTo && dayTo.indexOf('NaN') === -1 ? dayTo : dayFrom ? dayFrom : today;

    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceSingle', value: true } });
        return fetch(`${apiHost}ebi/courseAttendance/single/` + personId + `/` + studentPersonId, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
            body: JSON.stringify({
                dayFrom,
                dayTo,
            })
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({type: types.COURSE_ATTENDANCE_SINGLE, payload: response});
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceSingle', value: false } });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'courseAttendanceSingle', value: false } }));
    }
}

export const clearCourseAttendanceSingle = () => {
		return dispatch => {
				dispatch({type: types.COURSE_ATTENDANCE_SINGLE, payload: []});
		}
}

export const getAttendanceClassReport = (personId, courseScheduledId, jumpToDay='EMPTY') => {
    return dispatch => {
        dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceClassReport', value: true } });
        return fetch(`${apiHost}ebi/courseAttendance/classReport/` + personId + `/` + courseScheduledId + `/` + jumpToDay, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => {
            dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceClassReport', value: false } });
						dispatch({type: types.COURSE_ATTENDANCE_CLASS_REPORT, payload: response });
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceClassReport', value: false } }));
    }
}

export const setAllPresentAttendance = (personId, courseScheduledId, courseDay, studentList) => {
    return dispatch => {
        dispatch({type: types.ATTENDANCE_SET_ALL_PRESENT, payload: {courseScheduledId, courseDay, studentList} });
        return fetch(`${apiHost}ebi/courseAttendance/setAllPresent/` + personId, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + window.localStorage.getItem("authToken"),
            },
						body: JSON.stringify({
								courseScheduledId,
								courseDay,
								studentList,
						})
        })
    }
}
