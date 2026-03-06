import { useEffect } from 'react'
import BuildingAndFieldSettingsView from '../views/BuildingAndFieldSettingsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig, selectMapDirections } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
        langCode: me.langCode,
        personId: me.personId,
        personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				mapDirections: selectMapDirections(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		addOrUpdateBuildingAndField: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateBuildingAndField(personId, incomingRecord)),
		addOrUpdateBuildingAndFielddLevel: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateBuildingAndFielddLevel(personId, incomingRecord)),
		addOrUpdateLevelEntrance: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateLevelEntrance(personId, incomingRecord)),
		addOrUpdateRoom: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateRoom(personId, incomingRecord)),
		deleteRecord: (personId, recordType, recordId) => dispatch(actionBuildingAndFieldSettings.deleteRecord(personId, recordType, recordId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    	      const {getPageLangs, langCode, setMyVisitedPage, getBuildingAndFieldSettings, personId} = props
    	      getPageLangs(personId, langCode, 'BuildingAndFieldSettingsView')
    				getBuildingAndFieldSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Building and Field Settings`})
    	  
  }, [])

  return <BuildingAndFieldSettingsView {...props} />
}

export default Container
