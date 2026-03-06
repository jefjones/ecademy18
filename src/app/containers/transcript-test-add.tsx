import { useEffect } from 'react'
import TranscriptTestAddView from '../views/TranscriptTestAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionPersonConfig from '../actions/person-config'
import * as actionTranscripts from '../actions/transcripts'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectCompanyConfig, selectAccessRoles, selectStudents, selectPersonConfig, selectTranscripts,
					selectFetchingRecord} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let studentPersonId = props.params && props.params.studentPersonId

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				transcripts: selectTranscripts(state),
				students: selectStudents(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				personConfig: selectPersonConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getTranscripts: (personId, studentPersonId, includeInternal) => dispatch(actionTranscripts.getTranscripts(personId, studentPersonId, includeInternal)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		addOrUpdateTranscriptTest: (personId, transcriptTest) => dispatch(actionTranscripts.addOrUpdateTranscriptTest(personId, transcriptTest)),
		removeTranscriptTest: (personId, transcriptTestId) => dispatch(actionTranscripts.removeTranscriptTest(personId, transcriptTestId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, studentPersonId, getTranscripts} = props
    		    getPageLangs(personId, langCode, 'TranscriptTestAddView')
    				getTranscripts(personId, studentPersonId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Transcript Test`})
    	  
  }, [])

  return <TranscriptTestAddView {...props} />
}

export default Container
