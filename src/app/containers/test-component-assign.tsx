import { useEffect } from 'react'
import TestComponentAssignView from '../views/TestComponentAssignView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionTestSettings from '../actions/test-settings'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectTestSettings, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		const testSettings = selectTestSettings(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        testSettings,
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    removeTestComponentAssign: (personId, testComponentAssignId) => dispatch(actionTestSettings.removeTestComponentAssign(personId, testComponentAssignId)),
    addTestComponentAssign: (personId, testComponentAssign) => dispatch(actionTestSettings.addTestComponentAssign(personId, testComponentAssign)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = props
            getPageLangs(personId, langCode, 'TestComponentAssignView')
            getTestSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Test Component Assign`})
        
  }, [])

  return <TestComponentAssignView {...props} />
}

export default Container
