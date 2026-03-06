import * as types from '../actions/actionTypes';
import {combineReducers} from 'redux';
import {doSort} from '../utils/sort.js';
import {guidEmpty} from '../utils/guidValidate.js';

const calendarEventTypes  = (state = [], action) => {
	switch(action.type) {
			case types.CALENDAR_EVENT_TYPES_INIT:
					return action.payload;

			default:
					return state;
	}
}

const calendarEvents  = (state = [], action) => {
    switch(action.type) {
        case types.CALENDAR_EVENTS_INIT:
            return action.payload;

				case types.CALENDAR_EVENTS_REMOVE: {
						const calendarEventId = action.payload;
						let newState = Object.assign([], state);
						newState = newState && newState.length > 0 && newState.filter(m => m.calendarEventId !== calendarEventId);
						return newState;
				}

        default:
            return state;
    }
}

const calendarEventConfig  = (state = [], action) => {
	switch(action.type) {
			case types.CALENDAR_EVENT_CONFIG_INIT:
					return action.payload;

			default:
					return state;
	}
}


export default combineReducers({ calendarEvents, calendarEventTypes, calendarEventConfig });

export const selectCalendarEventTypes = (state) => {
		let calendarEventTypes = state.calendarEventTypes && state.calendarEventTypes.length > 0 && state.calendarEventTypes.map(m => ({
				id: m.courseScheduledId && m.courseScheduledId !== guidEmpty ? m.courseScheduledId : m.calendarEventType,
				value: m.courseScheduledId && m.courseScheduledId !== guidEmpty ? m.courseScheduledId : m.calendarEventType,
				label: m.courseScheduledId && m.courseScheduledId !== guidEmpty ? m.courseName : m.calendarEventType,
		}))
		//calendarEventTypes = calendarEventTypes && calendarEventTypes.length > 0 && calendarEventTypes.filter(m => m.label !== 'course');
		return doSort(calendarEventTypes, { sortField: 'label', isAsc: true, isNumber: false })
};

export const selectCalendarEvents = (state) => {
		let calendarEvents = state.calendarEvents;
		return calendarEvents && calendarEvents.length > 0 && calendarEvents.map(m => ({
				...m,
				title: m.title,
        allDay: m.allDay,
        start: new Date(m.start),
        end: new Date(m.end),
    }));
}

export const selectCalendarEventConfig = (state) => state.calendarEventConfig;
