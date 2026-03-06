import { useEffect, useState } from 'react'
import TranscriptsView from '../views/TranscriptsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudent from '../actions/student'
import * as actionTranscripts from '../actions/transcripts'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectTranscripts, selectCompanyConfig, selectAccessRoles, selectStudents, selectPersonConfig, selectGradeScale,
 					selectGradeLevels, selectMyFrequentPlaces, selectFetchingRecord, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let studentChosenSession = selectStudentChosenSession(state)
		let studentPersonId = (props.params && props.params.studentPersonId) || studentChosenSession
		let students = selectStudents(state)
		let gradeLevels = selectGradeLevels(state)
		let ninthGradeLevelId = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name === "9")[0]
		ninthGradeLevelId = ninthGradeLevelId && ninthGradeLevelId.gradeLevelId
		let tenthGradeLevelId = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name === "10")[0]
		tenthGradeLevelId = tenthGradeLevelId && tenthGradeLevelId.gradeLevelId
		let eleventhGradeLevelId = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name === "11")[0]
		eleventhGradeLevelId = eleventhGradeLevelId && eleventhGradeLevelId.gradeLevelId
		let twelfthGradeLevelId = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => m.name === "12")[0]
		twelfthGradeLevelId = twelfthGradeLevelId && twelfthGradeLevelId.gradeLevelId

		students = students && students.length > 0
				&& students.filter(m => m.gradeLevelId === ninthGradeLevelId
						|| m.gradeLevelId === tenthGradeLevelId
						|| m.gradeLevelId === eleventhGradeLevelId
						|| m.gradeLevelId === twelfthGradeLevelId)

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				students,
				transcripts: selectTranscripts(state),
				companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				personConfig: selectPersonConfig(state),
				gradeScale: selectGradeScale(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getTranscripts: (personId, studentPersonId, includeInternal) => dispatch(actionTranscripts.getTranscripts(personId, studentPersonId, includeInternal)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		updateGraduationDate: (personId, studentPersonId, graduationDate) => dispatch(actionTranscripts.updateGraduationDate(personId, studentPersonId, graduationDate)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, getTranscripts, studentPersonId} = props
    		    getPageLangs(personId, langCode, 'TranscriptsView')
    				studentPersonId && getTranscripts(personId, studentPersonId, true)
    	  
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, getTranscripts, studentPersonId, students} = props
    				
    
    				let studentName = students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
    				if (studentName && studentName.firstName) studentName = studentName.firstName + ' ' + studentName.lastName
    
    				if (studentName && (!isInit || studentPersonId !== state.studentPersonId)) {
    						getTranscripts(personId, studentPersonId, true)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Transcripts: ${studentName}`})
    						setIsInit(true); setStudentPersonId(studentPersonId)
    				}
    		
  }, [])

  return <TranscriptsView {...props} />
}

export default Container
