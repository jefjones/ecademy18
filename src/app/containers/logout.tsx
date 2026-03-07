import { useEffect } from 'react'
import { navigate, navigateReplace, goBack } from './'
import LandingView from '../views/LandingView'
import * as actionPageLang from '../actions/language-list'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as loginUser from '../actions/login'
import * as actionStudentSchedule from '../actions/student-schedule'
//import * as actionJefFeature from '../actions/jef-feature';
import { selectMe, selectJefFeatures } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
		let me = selectMe(state)

    return {
        loginData: me,
        langCode: me.langCode,
				jefFeatures: selectJefFeatures(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (user) => dispatch(loginUser.login(user)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		blankOutStudentScheduleLocal: () => dispatch(actionStudentSchedule.blankOutStudentScheduleLocal()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
		//getJefFeatures: () => dispatch(actionJefFeature.getJefFeatures()),
})

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    			const {getPageLangs, langCode, loginData, blankOutStudentScheduleLocal, logout} = props; //, getJefFeatures = this call takes way too long.
    			getPageLangs(loginData.personId, langCode, 'LandingView')
    	    logout()
    			blankOutStudentScheduleLocal()
    			//getJefFeatures();
          window.localStorage.setItem('person', null)
          window.localStorage.setItem('isLoggingIn', false)
          navigate('/')
      
  }, [])

  return <LandingView {...props} />
}

export default Container
