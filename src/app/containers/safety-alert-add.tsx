import { useEffect, useState } from 'react'
import SafetyAlertAddView from '../views/SafetyAlertAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings'
import * as actionSafetyAlert from '../actions/safety-alert'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig, selectSafetyAlertTypes,
					selectSafetyAlerts } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    return {
				buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
				langCode: me.langCode,
				personId: me.personId,
				personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				safetyAlertTypes: selectSafetyAlertTypes(state),
				safetyAlerts: selectSafetyAlerts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getSafetyAlerts: (personId, safetyAlertId) => dispatch(actionSafetyAlert.getSafetyAlerts(personId, safetyAlertId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addSafetyAlert: (personId, fileData, safetyAlertTypeId, note) => dispatch(actionSafetyAlert.addSafetyAlert(personId, fileData, safetyAlertTypeId, note)),
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		toggleSafetyAlertLocation: (personId, recordType, recordId) => dispatch(actionSafetyAlert.toggleSafetyAlertLocation(personId, recordType, recordId)),
		clearSafetyAlertLocations: (personId) => dispatch(actionSafetyAlert.clearSafetyAlertLocations(personId)),
		clearBuildingAndFieldSettings: () => dispatch(actionBuildingAndFieldSettings.clearBuildingAndFieldSettings()),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isNotFirstTime, setIsNotFirstTime] = useState(false)

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getBuildingAndFieldSettings, clearSafetyAlertLocations, getSafetyAlerts} = props
            getPageLangs(personId, langCode, 'SafetyAlertAddView')
    				getSafetyAlerts(personId)
    				getBuildingAndFieldSettings(personId)
    				if (!isNotFirstTime) {
    						clearSafetyAlertLocations(personId)
    						setIsNotFirstTime(true)
    				}
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Safety Alert`})
        
  }, [])

  return <SafetyAlertAddView {...props} />
}

export default Container
