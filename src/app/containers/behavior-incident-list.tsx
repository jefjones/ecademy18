import { useEffect } from 'react'
import BehaviorIncidentListView from '../views/BehaviorIncidentListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionBehaviorIncident from '../actions/behavior-incident'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionStudent from '../actions/student'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectBehaviorIncidents, selectBehaviorIncidentTypes, selectStudents, selectAccessRoles,
 					selectFetchingRecord, selectPersonConfig, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let students = selectStudents(state)
    let studentChosenSession = selectStudentChosenSession(state)
		let behaviorIncidents = selectBehaviorIncidents(state)
    behaviorIncidents = behaviorIncidents && behaviorIncidents.length > 0 && behaviorIncidents.filter(m => m.accusedStudents && m.accusedStudents.length > 0); //There can be records with just a file if the user didn't finish the rest of the record.
		students = behaviorIncidents && behaviorIncidents.length > 0 && students && students.length > 0 && students.filter(m => {
				let foundStudent = false
				behaviorIncidents.forEach(b => {
						b.accusedStudents && b.accusedStudents.length > 0 && b.accusedStudents.forEach(a => {
								if (a.id === m.personId) foundStudent = true
						})
				})
				return foundStudent
		})

    return {
        personId: me.personId,
        langCode: me.langCode,
				behaviorIncidents,
				students,
				accessRoles: selectAccessRoles(state),
				personConfig,
				studentPersonId: studentChosenSession,
				behaviorIncidentTypes: selectBehaviorIncidentTypes(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getBehaviorIncidents: (personId) => dispatch(actionBehaviorIncident.getBehaviorIncidents(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeBehaviorIncident: (personId, behaviorIncidentId) => dispatch(actionBehaviorIncident.removeBehaviorIncident(personId, behaviorIncidentId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getBehaviorIncidents} = props
            getPageLangs(personId, langCode, 'BehaviorIncidentListView')
    				getBehaviorIncidents(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Behavior Incident List`})
        
  }, [])

  return <BehaviorIncidentListView {...props} />
}

export default Container
