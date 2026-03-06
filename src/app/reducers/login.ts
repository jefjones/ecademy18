import * as types  from '../actions/actionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case types.LOGIN_ATTEMPT:
      return Object.assign({}, {
        isLoggingIn: true,
        isLoggedIn: false,
        email: action.emailAddress,
      })
     case types.LOGIN_MATCHING_RECORD:
        return {
	          error: action.payload,
	          isLoggingIn: false,
	          isLoggedIn: false
	      }

		case types.INITIAL_PASSWORD_VALIDATE: {
				 let result = Object.assign({}, action.payload)
				 result.personId = ''; //Be sure to blank this out in case this is a non-email-address return which will have a personId in it.
	       return result ? result : state
		 }
    case types.LOGGED_FAILED:
      return {
	        error: 'Invalid Login',
	        isLoggingIn: false,
	        isLoggedIn: false
      }

    case types.LOGGED_SUCCESSFULLY: {
        return action.payload ? action.payload : state
    }

    case types.LOGGED_OUT:
	      return {
				          error: null,
				          isLoggingIn: false,
				          isLoggedIn: false,
				          email: '',
				          personId: null,
				    	}

    case types.PASSWORD_RESET_REQUEST:
        return { passwordResetRequest: action.payload }

    case types.PASSWORD_RESET_COMPLETE:
        return Object.assign({}, { passwordResetComplete: action.payload })

		case types.IS_DUPLICATE_USERNAME: {
				let newState = {...state}
				newState["isDuplicateUsername"] = action.payload
        return newState
		}

    case types.BYPASS_GRADE_RESTRICTION: {
        let newState = {...state}
        newState["bypassGradeRestriction"] = !newState["bypassGradeRestriction"]
        return newState
    }

    default:
        return state
  }
}

export const selectMe = (state) => state
