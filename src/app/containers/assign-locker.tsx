import { useEffect } from 'react'
import AssignLockerView from '../views/AssignLockerView'
import * as actionLockers from '../actions/lockers'
import * as actionPageLang from '../actions/language-list'
import * as actionPaddlelocks from '../actions/paddlelocks'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import { useSelector, useDispatch } from 'react-redux'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectLockers, selectPaddlelocks, selectLockerStudentAssigns, selectCompanyConfig,
					selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
				lockers: selectLockers(state),
				padlocks: selectPaddlelocks(state),
				lockerStudentAssigns: selectLockerStudentAssigns(state),
				companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		removeLockerStudentAssign: (personId, lockerStudentAssignId) => dispatch(actionLockers.removeLockerStudentAssign(personId, lockerStudentAssignId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLockerStudentAssign: (personId) => dispatch(actionLockers.getLockerStudentAssign(personId)),
		getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
		getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
		setLockerStudentAssign: (personId, assign) => dispatch(actionLockers.setLockerStudentAssign(personId, assign)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getLockerStudentAssign, getLockers, getPaddlelocks} = props
    				getPageLangs(personId, langCode, 'AssignLockerView')
    				getLockerStudentAssign(personId)
    				getLockers(personId)
    				getPaddlelocks(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assign Locker`})
    		
  }, [])

  return <AssignLockerView {...props} />
}

export default Container
