import { useEffect, useState } from 'react'
import StudentAssignmentAssignView from '../views/StudentAssignmentAssignView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudentAssignmentAssign from '../actions/student-assignment-assign'
import * as actionPersonConfig from '../actions/person-config'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionContentTypes from '../actions/content-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectStudents, selectCoursesScheduled, selectCompanyConfig, selectContentTypes, selectPersonConfig, selectAccessRoles,
					selectFetchingRecord, selectIntervals, selectStudentAssignmentAssign, selectSchoolYears, selectMyFrequentPlaces} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let accessRoles = selectAccessRoles(state)
		let courses = selectCoursesScheduled(state)
		let students = selectStudents(state)

		courses = courses && courses.length > 0 && courses.reduce((acc, m) => {
				let hasInterval = m.intervals && m.intervals.length > 0 && m.intervals.filter(m => m.intervalId === personConfig.intervalId)[0]
				if (hasInterval && hasInterval.intervalId) {
						acc = acc && acc.length > 0 ? acc.concat(m) : [m]
				}
				return acc
			},
		[])

		if (courses && courses.length > 0 && !accessRoles.admin) {
				if (accessRoles.facilitator) {
						courses = courses.filter(m => {
								let found = false
								m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
										if (t.id === me.personId) found = true
								})
								return found
						})

				}
		}

		let contentTypes = selectContentTypes(state)
		let studentAssignmentAssign = selectStudentAssignmentAssign(state)

    return {
        personId: me.personId,
				langCode: me.langCode,
				studentAssignmentAssign,
				students,
        courses,
        contentTypes,
        courseScheduledId: props.params && props.params.courseScheduledId,
				studentPersonId: props.params && props.params.studentPersonId,
				contentTypeId: props.params && props.params.contentTypeId,
				courseEntryId: studentAssignmentAssign && studentAssignmentAssign.courseEntryId,
        companyConfig: selectCompanyConfig(state),
				personConfig,
				accessRoles,
				fetchingRecord: selectFetchingRecord(state),
				intervals: selectIntervals(state),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getStudentAssignmentAssign: (personId, courseScheduledId, jumpToAssignmentId, assignmentId, clearRedux) => dispatch(actionStudentAssignmentAssign.init(personId, courseScheduledId, jumpToAssignmentId, assignmentId, clearRedux)),
    setStudentAssignmentAssign: (studentPersonId, assignmentId, runFunction) => dispatch(actionStudentAssignmentAssign.setStudentAssignmentAssign(studentPersonId, assignmentId, runFunction)),
		clearStudentAssignmentAssign: () => dispatch(actionStudentAssignmentAssign.clearStudentAssignmentAssign()),
		updatePersonConfigCourse: (personId, courseScheduledId, jumpToAssignmentId)  => dispatch(actionPersonConfig.updatePersonConfigCourse(personId, courseScheduledId, jumpToAssignmentId)),
		getStudentAssignments: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, getContentTypes, getStudentAssignmentAssign, courseScheduledId} = props
    				getPageLangs(personId, langCode, 'StudentAssignmentAssignView')
    				getStudentAssignmentAssign(personId, courseScheduledId)
    				getContentTypes(personId)
    		
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, getStudentAssignmentAssign, courseScheduledId, courses} = props
    				
    
    				let courseName = courses && courses.length > 0 && courses.filter(m => m.id === courseScheduledId)[0]
    				if (courseName && courseName.label) courseName = courseName.label
    
    				if (courseName && (!isInit || courseScheduledId !== state.courseScheduledId)) {
    						getStudentAssignmentAssign(personId, courseScheduledId)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Assignments Assigned: ${courseName}`})
    						setIsInit(true); setCourseScheduledId(courseScheduledId)
    				}
    		
  }, [])

  const {accessRoles} = props
          return accessRoles.admin || accessRoles.facilitator ? <StudentAssignmentAssignView {...props} /> : null
}

export default Container
