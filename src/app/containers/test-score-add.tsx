import { useEffect } from 'react'
import TestScoreAddView from '../views/TestScoreAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionTestSettings from '../actions/test-settings'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectTestSettings, selectStudents } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		const testSettings = selectTestSettings(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        testSettings,
				students: selectStudents(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getTestSettings: (personId) => dispatch(actionTestSettings.getTestSettings(personId)),
    addOrUpdateTestScore: (personId, testScore) => dispatch(actionTestSettings.addOrUpdateTestScore(personId, testScore)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getTestSettings, personId} = props
            getPageLangs(personId, langCode, 'TestScoreAddView')
            getTestSettings(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Test Score`})
        
  }, [])

  return <TestScoreAddView {...props} />
}

export default Container
