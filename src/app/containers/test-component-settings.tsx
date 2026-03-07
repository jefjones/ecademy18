import { useEffect } from 'react'
import TestComponentSettingsView from '../views/TestComponentSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionTestSettings from '../actions/test-settings'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		const testComponents = selectTestSettings(state) && selectTestSettings(state).testComponents

    return {
        personId: me.personId,
        langCode: me.langCode,
        testComponents,
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTestComponent: (personId, testComponentId) => dispatch(actionTestSettings.removeTestComponent(personId, testComponentId)),
    addOrUpdateTestComponent: (personId, testComponent) => dispatch(actionTestSettings.addOrUpdateTestComponent(personId, testComponent)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = props
            getPageLangs(personId, langCode, 'TestComponentSettingsView')
            getTestSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Test Component Settings`})
        
  }, [])

  return <TestComponentSettingsView {...props} />
}

export default Container
