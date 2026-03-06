import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const getAttendanceReport = (personId, studentPersonId, intervalId) => {
    return dispatch => {
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceReport', value: true } })
        return !studentPersonId || studentPersonId === guidEmpty || studentPersonId === 0
					? null
					: fetch(`${apiHost}ebi/attendanceReport/` + personId + `/` + studentPersonId + `/` + intervalId, {
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
                return response.json()
            } else {
                const error = new Error(response.statusText)
                error.response = response
                throw error
            }
        })
        .then(response => {
						dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceReport', value: false } })
						dispatch({ type: types.ATTENDANCE_REPORT_INIT, payload: response })
						localStorage.setItem("attendanceReport", JSON.stringify(response))
        })
				.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'attendanceReport', value: false } }))
    }
}

export const setEditMode = (studentPersonId, courseScheduledId, attendanceDate) => {
		return dispatch => {
				dispatch({type: types.ATTENDANCE_REPORT_EDIT_MODE_SET, payload: { studentPersonId, courseScheduledId, attendanceDate }})
		}
}

export const setAttendanceStudent = (studentPersonId, courseScheduledId, day, attendanceCode) => {
		return dispatch => {
				dispatch({type: types.ATTENDANCE_REPORT_UPDATE, payload: { studentPersonId, courseScheduledId, day, attendanceCode }})
		}
}
