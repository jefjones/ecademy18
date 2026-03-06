import * as types from '../actions/actionTypes'

export default function(state = {}, action) {
    switch(action.type) {
        case types.PERSON_CONFIG_CALENDAR_INIT:
            return action.payload

				case types.PERSON_CONFIG_CALENDAR_UPDATE: {
						const {field, value} = action.payload
						let newState = Object.assign({}, state)
						newState[field] = value === 'true' ? true : value === 'false' ? false : value
						return newState
				}

				//This setCalendarViewRange call causes the browser to freeze ... probably due to the local redux update when the timer is going off every 10 seconds.
				// case types.PERSON_CONFIG_CALENDAR_VIEW_RANGE_SET: {
				// 		const viewRange = action.payload;
				// 		let newState = Object.assign({}, state);
				// 		newState.viewRange = viewRange;
				// 		return newState;
				// }

        default:
            return state
    }
}

export const selectPersonConfigCalendar = (state, facilitators, students, courses) => {
		let newObject = Object.assign({}, state)
		if (newObject.teacherIdList) {
					let selected = newObject.teacherIdList.split(',')
					if (newObject.teacherIdList.length > 0 && facilitators && facilitators.length > 0) {
							selected = selected && selected.length > 0 && selected.reduce((acc, m) => {
									let name = facilitators.filter(f => f.id === m)[0]
									if (name && name.id) {
											name = name.firstName + ' ' + name.lastName
											let option = {
													id: m,
													label: name,
											}
											acc = acc && acc.length > 0 ? acc.concat(option) : [option]
									}
									return acc
							},[])
					}
					newObject['teacherIdList'] = selected
		}

		if (newObject.studentIdList) {
					let selected = newObject.studentIdList.split(',')
					if (newObject.studentIdList.length > 0 && students && students.length > 0) {
							selected = selected && selected.length > 0 && selected.reduce((acc, m) => {
									let name = students.filter(f => f.id === m)[0]
									if (name && name.id) {
											name = name.firstName + ' ' + name.lastName
											let option = {
													id: m,
													label: name,
											}
											acc = acc && acc.length > 0 ? acc.concat(option) : [option]
									}
									return acc
							},[])
					}
					newObject['studentIdList'] = selected
		}

		if (newObject.classIdList) {
					let selected = newObject.classIdList.split(',')
					if (newObject.classIdList.length > 0 && courses && courses.length > 0) {
							selected = selected && selected.length > 0 && selected.reduce((acc, m) => {
									let name = courses.filter(f => f.id === m)[0]
									if (name && name.id) {
											let option = {
													id: m,
													label: name.courseName && name.courseName.length > 20 ? name.courseName.substring(0,20) + '...' : name.courseName,
											}
											acc = acc && acc.length > 0 ? acc.concat(option) : [option]
									}
									return acc
							},[])
					}
					newObject['classIdList'] = selected
		}

		if (newObject.homeworkClassIdList) {
					let selected = newObject.homeworkClassIdList.split(',')
					if (newObject.homeworkClassIdList.length > 0 && courses && courses.length > 0) {
							selected = selected && selected.length > 0 && selected.reduce((acc, m) => {
									let name = courses.filter(f => f.id === m)[0]
									if (name && name.id) {
											let option = {
													id: m,
													label: name.courseName && name.courseName.length > 20 ? name.courseName.substring(0,20) + '...' : name.courseName,
											}
											acc = acc && acc.length > 0 ? acc.concat(option) : [option]
									}
									return acc
							},[])
					}
					newObject['homeworkClassIdList'] = selected
		}
		return newObject
}
