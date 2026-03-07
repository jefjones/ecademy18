import { useEffect } from 'react'
import LockerAssignmentsView from '../views/LockerAssignmentsView'
import * as actionLockers from '../actions/lockers'
import * as actionPageLang from '../actions/language-list'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionPaddlelocks from '../actions/paddlelocks'
import * as actionStudent from '../actions/student'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectLockers, selectPaddlelocks, selectLockerStudentAssigns, selectCompanyConfig,
 					selectPersonConfig, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
				lockers: selectLockers(state),
				padlocks: selectPaddlelocks(state),
				lockerStudentAssigns: selectLockerStudentAssigns(state),
				personConfig,
				studentPersonId: selectStudentChosenSession(state),
				companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		removeLockerStudentAssign: (personId, lockerStudentAssignId) => dispatch(actionLockers.removeLockerStudentAssign(personId, lockerStudentAssignId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLockerStudentAssign: (personId) => dispatch(actionLockers.getLockerStudentAssign(personId)),
		getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
		getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getLockerStudentAssign, getLockers, getPaddlelocks} = props
    				getPageLangs(personId, langCode, 'LockerAssignmentsView')
    				getLockerStudentAssign(personId)
    				getLockers(personId)
    				getPaddlelocks(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Locker Assignments`})
    		
  }, [])

  return <LockerAssignmentsView {...props} />
}

export default Container
