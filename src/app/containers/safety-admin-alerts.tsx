import { useEffect } from 'react'
import SafetyAdminAlertView from '../views/SafetyAdminAlertView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionGuardians from '../actions/guardians'
import * as actionSafetyAlert from '../actions/safety-alert'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectStudents, selectSafetyAlerts, selectGuardians, selectAccessRoles, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
				guardians: selectGuardians(state),
				safetyAlerts: selectSafetyAlerts(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getSafetyAlerts: (personId, safetyAlertId) => dispatch(actionSafetyAlert.getSafetyAlerts(personId, safetyAlertId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		confirmSafetyAlert: (personId, adminConfirm) => dispatch(actionSafetyAlert.confirmSafetyAlert(personId, adminConfirm)),
		dismissSafetyAlert: (personId, safetyAlertId) => dispatch(actionSafetyAlert.dismissSafetyAlert(personId, safetyAlertId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getSafetyAlerts, getGuardians} = props
            getPageLangs(personId, langCode, 'SafetyAdminAlertView')
    				getSafetyAlerts(personId)
    				getGuardians(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Safety Alert (admin)`})
        
  }, [])

  return <SafetyAdminAlertView {...props} />
}

export default Container
