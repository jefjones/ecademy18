import * as types from './actionTypes';
import {apiHost} from '../api_host.js';
import {guidEmpty} from '../utils/guidValidate.js';

export const getStudentSchedule = (personId, studentPersonId, schoolYearId=0) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentSchedule', value: true } });
				dispatch({type: types.FETCHING_RECORD, payload: {studentScheduleAdmin: true} });
        return !studentPersonId || studentPersonId === guidEmpty
						? null
						: fetch(`${apiHost}ebi/studentSchedule/` + personId + `/` + studentPersonId + `/` + schoolYearId, {
			            method: 'get',
			            headers: {
			                'Accept': 'application/json',
			                'Content-Type': 'application/json',
			                'Access-Control-Allow-Credentials' : 'true',
			                "Access-Control-Allow-Origin": "*",
			                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
			                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
			                "Authorization": "Bearer " + localStorage.getItem("authToken"),
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
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentSchedule', value: false } });
									dispatch({type: types.FETCHING_RECORD, payload: {studentScheduleAdmin: "ready"} });
									dispatch({ type: types.STUDENT_SCHEDULE_INIT, payload: response });
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'studentSchedule', value: false } }));
    }
}

export const getStudentScheduleWeek = (personId, studentPersonId, runFunction=() => {}) => {
    return dispatch => {
				dispatch({ type: types.STUDENT_SCHEDULE_WEEK_INIT, payload: [] });
        return !studentPersonId || studentPersonId === guidEmpty
						? null
						: fetch(`${apiHost}ebi/studentSchedule/week/` + personId + `/` + studentPersonId, {
			            method: 'get',
			            headers: {
			                'Accept': 'application/json',
			                'Content-Type': 'application/json',
			                'Access-Control-Allow-Credentials' : 'true',
			                "Access-Control-Allow-Origin": "*",
			                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
			                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
			                "Authorization": "Bearer " + localStorage.getItem("authToken"),
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
									dispatch({ type: types.STUDENT_SCHEDULE_WEEK_INIT, payload: response });
									dispatch(runFunction);
			        })
    }
}

export const getMultStudentSchedules = (personId, studentPersonIds, schoolYearId=0) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/multStudentSchedules`, {
			            method: 'post',
			            headers: {
			                'Accept': 'application/json',
			                'Content-Type': 'application/json',
			                'Access-Control-Allow-Credentials' : 'true',
			                "Access-Control-Allow-Origin": "*",
			                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
			                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
			                "Authorization": "Bearer " + localStorage.getItem("authToken"),
			            },
									body: JSON.stringify({
											personId,
											studentPersonIds,
											schoolYearId
									}),
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
									dispatch({ type: types.MULT_STUDENT_SCHEDULES_INIT, payload: response });
			        })
    }
}

export const clearStudentScheduleLocal = () => {
    return dispatch => {
					dispatch({ type: types.STUDENT_SCHEDULE_INIT, payload: [] });
					localStorage.setItem("studentSchedule", JSON.stringify([]));
    }
}

export const removeStudentSchedule = (courseScheduledId, studentPersonId) => {
		return dispatch => dispatch({ type: types.STUDENT_SCHEDULE_REMOVE, payload: {courseScheduledId, studentPersonId} });
}

export const addStudentSchedule = (course, studentPersonId) => {
		return dispatch => dispatch({ type: types.STUDENT_SCHEDULE_ADD, payload: {course, studentPersonId} });
}

export const removeStudentCourseAssign = (personId, studentPersonId, courseScheduledId, runFunction=() => {}) => {
    return dispatch => {
				dispatch(removeStudentSchedule(courseScheduledId, studentPersonId));
				return fetch(`${apiHost}ebi/studentSchedule/remove/` + personId + `/` + studentPersonId + `/` + courseScheduledId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
        .then(() => dispatch(runFunction))
    }
}

export const removeOrRefundStudentCourseAssign = (personId, studentPersonId, courseScheduledId, financeBillingRefunds=[]) => {
    return dispatch => {
				dispatch(removeStudentSchedule(courseScheduledId, studentPersonId));
				return fetch(`${apiHost}ebi/studentSchedule/removeOrRefund/` + personId + `/` + studentPersonId + `/` + courseScheduledId, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
						body: JSON.stringify(financeBillingRefunds)
        })
    }
}

export const setStudentScheduleByMathName = (personId, studentPersonId, scheduleAssignByMathId) => {
		//let schoolYearId = 9; //Help - to do:  Make this dynamic

    return dispatch => {
        return fetch(`${apiHost}ebi/studentSchedule/setByMath/` + personId + `/` + studentPersonId + `/` + scheduleAssignByMathId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
        .then(response => {
						dispatch(getStudentSchedule(personId, studentPersonId)); //, schoolYearId
        })
    }
}

export const blankOutStudentScheduleLocal = () => {
		return dispatch => {
				dispatch({ type: types.STUDENT_SCHEDULE_INIT, payload: [] });
				localStorage.setItem("studentSchedule", JSON.stringify([]));
		}
}

export const setLearnerCourseAssignAccredited = (personId, learnerCourseAssignId, value, studentPersonId) => {
    return dispatch => {
        dispatch({ type: types.STUDENT_SCHEDULE_ACCREDITED_SET, payload: {learnerCourseAssignId, value} });
        return fetch(`${apiHost}ebi/studentSchedule/setAccredited/` + personId + `/` + learnerCourseAssignId + `/` + studentPersonId + `/` + (value ? value : 'false'), {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
                "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
                "Authorization": "Bearer " + localStorage.getItem("authToken"),
            },
        })
				.then(() => {
						dispatch(getStudentSchedule(personId, studentPersonId));
				})
    }
}
