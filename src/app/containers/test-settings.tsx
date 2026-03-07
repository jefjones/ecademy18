import { useEffect } from 'react'
import TestSettingsView from '../views/TestSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionTestSettings from '../actions/test-settings'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		const tests = selectTestSettings(state) && selectTestSettings(state).tests

    return {
        personId: me.personId,
        langCode: me.langCode,
        tests,
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTest: (personId, testId) => dispatch(actionTestSettings.removeTest(personId, testId)),
    addOrUpdateTest: (personId, test) => dispatch(actionTestSettings.addOrUpdateTest(personId, test)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = props
            getPageLangs(personId, langCode, 'TestSettingsView')
            getTestSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Test Settings`})
        
  }, [])

  return <TestSettingsView {...props} />
}

export default Container
