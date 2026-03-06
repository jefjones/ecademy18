import * as types from '../actions/actionTypes'


export default function(state = {}, action) {
    switch(action.type) {
        case types.CARPOOL_INIT: {
            return action.payload
        }

				case types.CARPOOL_TIME_STUDENT_ASSIGN: {
						const {carpoolTimeId, dayOfWeek, studentPersonId, dropOffOrPickUp} = action.payload
						let newState = Object.assign({}, state)
						let carpool = newState && newState.myCarpools && newState.myCarpools.length > 0 && newState.myCarpools[0]
						if (carpool && carpool.carpoolId) {
								//Cut out the timeStudentAssigns in case it already exists and the time is changing.
								let timeStudentAssigns = carpool && carpool.timeStudentAssigns && carpool.timeStudentAssigns.length > 0
										&& carpool.timeStudentAssigns.filter(m => !(m.dropOffOrPickUp === dropOffOrPickUp && m.studentPersonId === studentPersonId && m.dayOfWeek === dayOfWeek))
								//Then add the new timeStudentAssigns for this student.
								let option = {
										 studentPersonId,
										 carpoolTimeId,
										 dayOfWeek,
										 dropOffOrPickUp,
								}
								timeStudentAssigns = timeStudentAssigns && timeStudentAssigns.length > 0 ? timeStudentAssigns.concat(option) : [option]
								carpool.timeStudentAssigns = timeStudentAssigns
								newState.myCarpools = newState.myCarpools && newState.myCarpools.length > 0 && newState.myCarpools.filter(m => m.carpoolId !== carpool.carpoolId)
								newState.myCarpools = newState.myCarpools && newState.myCarpools.length > 0 ? newState.myCarpools.concat(carpool) : [carpool]
								return newState
						} else {
								return state
						}
				}

				case types.CARPOOL_TIME_STUDENT_ASSIGN_EXCEPTION: {
						const {carpoolTimeId, dropOffOrPickUp, studentPersonId, dayOfWeek, dateChange} = action.payload
						let newState = Object.assign({}, state)
						let carpool = newState && newState.myCarpools && newState.myCarpools.length > 0 && newState.myCarpools[0]
						if (carpool && carpool.carpoolId) {
								//Cut out the timeStudentAssigns in case it already exists and the time is changing.
								let timeStudentAssignDayChanges = carpool && carpool.timeStudentAssignDayChanges && carpool.timeStudentAssignDayChanges.length > 0
										&& carpool.timeStudentAssignDayChanges.filter(m => !(m.dropOffOrPickUp === dropOffOrPickUp && m.studentPersonId === studentPersonId && m.dateChange.substring(0,10) === dateChange))
								//Then add the new timeStudentAssignDayChanges for this student.
								let option = {
										 studentPersonId,
										 carpoolTimeId,
										 dayOfWeek,
										 dateChange,
										 dropOffOrPickUp,
								}
								timeStudentAssignDayChanges = timeStudentAssignDayChanges && timeStudentAssignDayChanges.length > 0 ? timeStudentAssignDayChanges.concat(option) : [option]
								carpool.timeStudentAssignDayChanges = timeStudentAssignDayChanges
								newState.myCarpools = newState.myCarpools && newState.myCarpools.length > 0 && newState.myCarpools.filter(m => m.carpoolId !== carpool.carpoolId)
								newState.myCarpools = newState.myCarpools && newState.myCarpools.length > 0 ? newState.myCarpools.concat(carpool) : [carpool]
								return newState
						} else {
								return state
						}
				}
				// //const areaNames  = (state = [], action) => {
        // case types.CARPOOL_AREAS_INIT:
        //     return action.payload;
				//
				// //const myCarpools  = (state = [], action) => {
        // case types.MY_CAR_POOLS:
        //     return action.payload;
				//
				// //const requests  = (state = [], action) => {
        // case types.CARPOOL_REQUESTS:
				// 		return action.payload;
				//
				// //const inivitations  = (state = [], action) => {
        // case types.CARPOOL_INVITATIONS:
        //     return action.payload;
				//
				// //const carpoolDates  = (state = [], action) => {
        // case types.CARPOOL_DATES:
        //     return action.payload ? action.payload : [];
				//
				// //const daysOfWeek  = (state = [], action) => {
        // case types.DAYS_OF_THE_WEEK:
        //     return action.payload ? action.payload : [];

        default:
            return state
    }
}

//export default combineReducers({ areaNames, myCarpools, requests, inivitations, carpoolDates, daysOfWeek});

//export const selectCarpoolAreaNames = (state) => state && state.carpoolAreas;
export const selectCarpool = (state) => state
