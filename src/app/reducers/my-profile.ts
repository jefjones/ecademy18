import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.MY_PROFILE_INIT:
      return action.payload

		case types.MY_PROFILE_UPDATE: {
				const {field, value} = action.payload
				let myProfile = Object.assign({}, state)
				myProfile[field] = value === 'true' ? true : value === 'false' ? false : value

				return myProfile
		}

    default:
        return state
  }
}

export const selectMyProfile = (state) => state
