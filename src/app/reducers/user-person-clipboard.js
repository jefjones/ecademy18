import * as types  from '../actions/actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case types.USER_PERSON_CLIPBOARD_INIT:
      	return action.payload === {} ? {} : action.payload;

		case types.USER_PERSON_CLIPBOARD_UPDATE: {
	      return action.payload === {} ? {} : action.payload;
		}

		case types.USER_PERSON_CLIPBOARD_ADD: {
				let newState = Object.assign({}, state);
				let {personList} = action.payload;
        let studentPersonId = personList && personList.length > 0 && personList[0];
				newState.personList = newState.personList ? newState.personList.concat(studentPersonId) : [studentPersonId];
	      return newState;
		}

		case types.USER_PERSON_CLIPBOARD_REMOVE: {
				let newState = Object.assign({}, state);
				let removePersonId = action.payload;
				if (removePersonId && newState.personList.indexOf(removePersonId) > -1) newState.personList = newState.personList.filter(f => f !== removePersonId);
      	return newState;
		}

    default:
        return state;
  }
}

export const selectUserPersonClipboard = (state) => state;
