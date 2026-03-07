import { useEffect } from 'react'
import GradebookSummaryView from '../views/GradebookSummaryView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionGradebook from '../actions/gradebook-entry'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectStudents, selectCoursesScheduled, selectCompanyConfig, selectGradebookSummary, selectPersonConfig,
					selectAccessRoles, selectFetchingRecord, selectMyFrequentPlaces} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let accessRoles = selectAccessRoles(state)
		let courses = selectCoursesScheduled(state)
		let students = selectStudents(state)
		//admin gets everything
		if (courses && courses.length > 0 && !accessRoles.admin) {
				if (accessRoles.facilitator) {
						courses = courses.filter(m => {
								let found = false
								m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
										if (t.id === me.personId) found = true
								})
								return found
						})

				} else if (accessRoles.learner) {
						courses = courses.filter(m => m.studentList.indexOf(me.personId) > -1)
				} else if (accessRoles.observer) {
						courses = courses.reduce((acc, m) => {
								students && students.length > 0 && students.forEach(s => {
										if (m.studentList.indexOf(s.personId) > -1) {
												acc = acc ? acc.concat(m) : [m]
										}
								})
								return acc
						}, [])
				}
		}

		let courseScheduledId = props.params && props.params.courseScheduledId
		let studentPersonId = props.params && props.params.studentPersonId
		let gradebookSummary = selectGradebookSummary(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        courseScheduledId,
				studentPersonId,
				courseEntryId: gradebookSummary && gradebookSummary.courseEntry,
        gradebookSummary,
        students,
        courses,
        companyConfig: selectCompanyConfig(state),
				personConfig: selectPersonConfig(state),
				accessRoles,
				fetchingRecord: selectFetchingRecord(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getGradebookSummary: (personId, courseScheduledId) => dispatch(actionGradebook.getGradebookSummary(personId, courseScheduledId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage} = props
    				getPageLangs(personId, langCode, 'GradebookSummaryView')
    				//getCoursesScheduled(personId);  This is already done at login for everyone.
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Gradebook Summary`})
    		
  }, [])

  return <GradebookSummaryView {...props} />
}

export default Container
