import { useEffect } from 'react'
import LoginView from '../views/LoginView/LoginView__1266'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as loginUser from '../actions/login'
import { selectMe } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, params) => {
		let me = selectMe(state)

    return {
      username: params.username,
      langCode: me.langCode,
      password: params.password,
      loginData: me,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: ()  => dispatch(loginUser.logout()),
})

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    			const {getPageLangs, personId, langCode} = props
    			getPageLangs(personId, langCode, 'LoginView__1266')
    	
  }, [])

  return <LoginView {...props} />
}

export default Container
