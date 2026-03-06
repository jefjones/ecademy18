import { useEffect } from 'react'
import LoginView from '../views/LoginView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import { selectMe } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let loginData = selectMe(state)

    return {
			newLoginPersonId: props.params && props.params.newLoginPersonId,
			langCode: loginData.langCode,
      username: props.username,
      password: props.password,
      loginData,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		hasInitialPassword: (newLoginPersonId) => dispatch(loginUser.hasInitialPassword(newLoginPersonId)),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),

})

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, hasInitialPassword, newLoginPersonId} = props
    				getPageLangs(personId, langCode, 'LoginView')
    				if (newLoginPersonId) hasInitialPassword(newLoginPersonId)
    		
  }, [])

  return !props.newLoginPersonId ? <LoginView {...props} /> : null
}

export default Container
