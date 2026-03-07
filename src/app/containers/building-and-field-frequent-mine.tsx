import { useEffect } from 'react'
import BuildingAndFieldFrequentMineView from '../views/BuildingAndFieldFrequentMineView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
        langCode: me.langCode,
        personId: me.personId,
        personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		toggleFrequentMine: (personId, recordType, recordId) => dispatch(actionBuildingAndFieldSettings.toggleFrequentMine(personId, recordType, recordId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    	      const {getPageLangs, langCode, setMyVisitedPage, getBuildingAndFieldSettings, personId} = props
    	      getPageLangs(personId, langCode, 'BuildingAndFieldFrequentMineView')
    				getBuildingAndFieldSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `My Building and Field Places`})
        
  }, [])

  return <BuildingAndFieldFrequentMineView {...props} />
}

export default Container
