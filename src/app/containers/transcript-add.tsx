import { useEffect } from 'react'
import TranscriptAddView from '../views/TranscriptAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionPersonConfig from '../actions/person-config'
import * as actionTranscripts from '../actions/transcripts'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectPersonConfig, selectSchoolYears, selectGradeLevels,
					selectTranscripts, selectMyFrequentPlaces, selectFetchingRecord} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let studentPersonId = props.params && props.params.studentPersonId

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				transcripts: selectTranscripts(state),
				gradeLevels: selectGradeLevels(state),
				students: selectStudents(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				personConfig: selectPersonConfig(state),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getTranscripts: (personId, studentPersonId, includeInternal) => dispatch(actionTranscripts.getTranscripts(personId, studentPersonId, includeInternal)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		addOrUpdateTranscript: (personId, transcript) => dispatch(actionTranscripts.addOrUpdateTranscript(personId, transcript)),
		removeTranscript: (personId, transcriptId) => dispatch(actionTranscripts.removeTranscript(personId, transcriptId)),
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
    		    getPageLangs(personId, langCode, 'TranscriptAddView')
    				getTranscripts(personId, studentPersonId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Transcript`})
    	  
  }, [])

  return <TranscriptAddView {...props} />
}

export default Container
