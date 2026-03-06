import * as types from './actionTypes'
import {apiHost} from '../api_host'
import {guidEmpty} from '../utils/guidValidate'

export const init = (personId, skipLocalStorage=false) => {
    return dispatch => {
				if (!skipLocalStorage) {
						let storage = localStorage.getItem("carpool")
						!!storage && dispatch({ type: types.CARPOOL_INIT, payload: JSON.parse(storage) })
				}
				dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carpoolRequests', value: true } })
        return fetch(`${apiHost}ebi/carpool/` + personId, {
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
			            dispatch({type: types.CARPOOL_INIT, payload: response})
									dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carpoolRequests', value: false } })
									localStorage.setItem("carpool", JSON.stringify(response))
			        })
							.catch(error => dispatch({ type: types.FETCHING_RECORD, payload: {field: 'carpoolRequests', value: false } }))
    }
}

export const addOrUpdateCarpoolRequest = (personId, carpoolRequest) => {
		if (carpoolRequest && !carpoolRequest.carpoolRequestId) carpoolRequest.carpoolRequestId = guidEmpty
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/request/addOrUpdate/` + personId, {
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
            body: JSON.stringify(carpoolRequest)
        })
        .then(() => dispatch(init(personId, true)))
    }
}

export const removeCarpoolRequest = (personId, carpoolRequestId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/request/delete/` + personId + `/` + carpoolRequestId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const addOrUpdateCarpoolSearchFilter = (personId, filterCarpoolAreas, checkedSendEmail) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/request/watch/` + personId, {
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
						body: JSON.stringify({ filterCarpoolAreas, checkedSendEmail })
        })
        .then(() => dispatch(init(personId, true)))
    }
}

export const addOrUpdateCarpool = (personId, myCarpool) => {
		if (!(myCarpool && myCarpool.carpoolId)) myCarpool.carpoolId = guidEmpty
    return dispatch => {
        return fetch(`${apiHost}ebi/myCarpool/addOrUpdate/` + personId, {
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
            body: JSON.stringify(myCarpool)
        })
        .then(() => dispatch(init(personId, true)))
    }
}

export const removeCarpool = (personId, carpoolId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/myCarpool/delete/` + personId + `/` + carpoolId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const addCarpoolRequestResponse = (personId, carpoolRequestResponse) => {
		if (carpoolRequestResponse && !carpoolRequestResponse.carpoolRequestResponseId) carpoolRequestResponse.carpoolRequestResponseId = guidEmpty
    return dispatch => {
        return fetch(`${apiHost}ebi/carpoolRequest/response/` + personId, {
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
            body: JSON.stringify(carpoolRequestResponse)
        })
        .then(() => dispatch(init(personId, true)))
    }
}

export const removeCarpoolRequestResponse = (personId, carpoolRequestResponseId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpoolRequestResponse/delete/` + personId + `/` + carpoolRequestResponseId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

	export const setCarpoolMember = (personId, acceptOrDecline, carpoolRequestResponseId, memberPersonId) => {
	    return dispatch => {
	        return fetch(`${apiHost}ebi/carpoolRequestResponse/member/add/` + personId + `/` + acceptOrDecline + `/` + carpoolRequestResponseId + `/` + memberPersonId, {
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
	        .then(() => dispatch(init(personId, true)))
	    }
	}

	export const declineCarpoolRequest = (personId, carpoolRequestResponseId) => {
			return dispatch => {
					return fetch(`${apiHost}ebi/carpoolRequestResponse/member/decline/` + personId + `/` + carpoolRequestResponseId, {
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
					.then(() => dispatch(init(personId, true)))
			}
	}

	export const addOrUpdateCarpoolArea = (personId, carpoolArea) => {
			if (carpoolArea && !carpoolArea.carpoolAreaId) carpoolArea.carpoolAreaId = guidEmpty
	    return dispatch => {
	        return fetch(`${apiHost}ebi/carpoolArea/` + personId, {
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
	            body: JSON.stringify(carpoolArea)
	        })
					.then(() => dispatch(init(personId, true)))
	    }
	}

	export const removeCarpoolArea = (personId, carpoolAreasId) => {
	    return dispatch => {
	        return fetch(`${apiHost}ebi/carpoolArea/remove/` + personId + `/` + carpoolAreasId, {
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
					.then(() => dispatch(init(personId, true)))
	    }
	}

export const setMemberStudentsInCarpool = (personId, carpoolId, selectedStudents) => {
		return dispatch => {
				return fetch(`${apiHost}ebi/carpoolArea/member/studentsInCarpool/` + personId + `/` + carpoolId, {
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
						body: JSON.stringify(selectedStudents)
				})
				.then(() => dispatch(init(personId, true)))
		}
}

export const updateCarpoolDate = (personId, carpoolDate) => {
		return dispatch => {
				return fetch(`${apiHost}ebi/carpool/date/update/` + personId, {
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
						body: JSON.stringify(carpoolDate)
				})
				.then(() => dispatch(init(personId, true)))
		}
}


export const setCarpoolDateStudent = (personId, carpoolDateStudent) => {
		return dispatch => {
				return fetch(`${apiHost}ebi/carpool/date/student/update/` + personId, {
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
						body: JSON.stringify(carpoolDateStudent)
				})
				.then(() => dispatch(init(personId, true)))
		}
}

export const setCarpoolDateInCarPickUp = (personId, carpoolDateInCarPickup) => {
		return dispatch => {
				return fetch(`${apiHost}ebi/carpool/date/student/inCarPickUp/` + personId, {
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
						body: JSON.stringify(carpoolDateInCarPickup)
				})
				.then(() => dispatch(init(personId, true)))
		}
}

export const setArrivalNotice = (personId, dropOffOrPickUp, carpoolDateId, arrivalNotice) => {
		return dispatch => {
				return fetch(`${apiHost}ebi/carpool/date/driver/arrivalNotice/` + personId + `/` + dropOffOrPickUp + `/` + carpoolDateId + `/` + arrivalNotice, {
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
				.then(() => dispatch(init(personId, true)))
		}
}

export const setCarpoolTimeStudentAssign = (personId, carpoolId, studentPersonId, carpoolTimeId, dayOfWeek, dropOffOrPickUp) => {
		carpoolTimeId = carpoolTimeId && carpoolTimeId !== guidEmpty ? carpoolTimeId : guidEmpty
		carpoolId = carpoolId && carpoolId !== guidEmpty ? carpoolId : guidEmpty

    return dispatch => {
				dispatch({type: types.CARPOOL_TIME_STUDENT_ASSIGN, payload: {carpoolTimeId, dayOfWeek, studentPersonId, dropOffOrPickUp}})
        return fetch(`${apiHost}ebi/carpool/timeStudentAssign/` + personId + `/` + carpoolId + `/` + studentPersonId + `/` + carpoolTimeId + `/` + dayOfWeek + `/` + dropOffOrPickUp, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const setCarpoolTimeStudentAssignDayChange = (personId, carpoolId, carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange) => {
		carpoolTimeId = carpoolTimeId ? carpoolTimeId : guidEmpty
    return dispatch => {
				dispatch({type: types.CARPOOL_TIME_STUDENT_ASSIGN_EXCEPTION, payload: {carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange}})
        return fetch(`${apiHost}ebi/carpool/timeStudentAssign/change/` + personId + `/` + carpoolId + `/` + carpoolTimeId + `/` + dropOffOrPickUp + `/` + studentPersonId + `/` + dayOfWeek + `/` + dateChange, {
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
        //.then(() => dispatch(init(personId, true)));  Don't call this since it will use localStorage and cause the interface to jump.
    }
}

export const addDirectRequest = (personId, carpoolRequestDirect) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/directRequest/add/` + personId, {
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
						body: JSON.stringify(carpoolRequestDirect),
        })
        .then(() => dispatch(init(personId, true)))
    }
}

export const acceptDirectRequest = (personId, carpoolRequestDirectId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/directRequest/accept/` + personId + `/` + carpoolRequestDirectId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const declineDirectRequest = (personId, carpoolRequestDirectId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/directRequest/decline/` + personId + `/` + carpoolRequestDirectId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const removeDirectRequest = (personId, carpoolRequestDirectId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/directRequest/remove/` + personId + `/` + carpoolRequestDirectId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}


export const toggleStudentIncluded = (personId, carpoolId, studentPersonId) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/carpoolMemberStudent/toggleIncluded/` + personId + `/` + carpoolId + `/` + studentPersonId, {
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
        .then(() => dispatch(init(personId, true)))
    }
}


export const toggleCarpoolRequestDirectCanDoDay = (personId, carpoolTimeId, driveDay) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/carpoolRequestDirectCanDoDay/toggle/${personId}/${carpoolTimeId}/${driveDay}`, {
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
        .then(() => dispatch(init(personId, true)))
    }
}

export const toggleCarpoolRequestFinalCanDoDay = (personId, carpoolTimeId, driveDay) => {
    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/carpoolRequestFinalCanDoDay/toggle/${personId}/${carpoolTimeId}/${driveDay}`, {
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
        .then(() => dispatch(init(personId, true)))
    }
}


export const setDriverTimeDate = (personId, driverPersonId, carpoolTimeId, driverDate, repeatWeeks=0) => {
		personId = personId ? personId : guidEmpty

    return dispatch => {
        return fetch(`${apiHost}ebi/carpool/driver/set/${driverPersonId}/${carpoolTimeId}/${driverDate}/${repeatWeeks}`, {
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
        .then(() => dispatch(init(personId, true)))
    }
}
