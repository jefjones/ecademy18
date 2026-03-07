import { useEffect } from 'react'
import AttendanceClassReportView from '../views/AttendanceClassReportView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import {guidEmpty} from '../utils/guidValidate'
import * as actionCourseAttendance from '../actions/course-attendance'
import * as actionPersonConfig from '../actions/person-config'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionStudent from '../actions/student'
import { selectMe, selectStudents, selectCoursesScheduled, selectCompanyConfig, selectCourseAttendanceClassReport, selectPersonConfig,
					selectAccessRoles, selectFetchingRecord, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let accessRoles = selectAccessRoles(state)
		let courses = selectCoursesScheduled(state)
		let students = selectStudents(state)
		let studentChosenSession = selectStudentChosenSession(state)
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

		let attendance = selectCourseAttendanceClassReport(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				attendance,
				students,
        courses,
        courseScheduledId: props.params && props.params.courseScheduledId,
				studentPersonId: (props.params && props.params.studentPersonId) || studentChosenSession,
				courseEntryId: attendance && attendance.courseEntry,
        companyConfig: selectCompanyConfig(state),
				personConfig,
				accessRoles,
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getAttendanceClassReport: (personId, courseScheduledId, jumpToDay) => dispatch(actionCourseAttendance.getAttendanceClassReport(personId, courseScheduledId, jumpToDay)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		updatePersonConfigCourse: (personId, courseScheduledId, jumpToAssignmentId)  => dispatch(actionPersonConfig.updatePersonConfigCourse(personId, courseScheduledId, jumpToAssignmentId)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, 	getAttendanceClassReport, courseScheduledId, getCoursesScheduled} = props
            getPageLangs(personId, langCode, 'AttendanceClassReportView')
    				if (!courseScheduledId && courseScheduledId !== guidEmpty) getAttendanceClassReport(personId, courseScheduledId)
    				//getCoursesScheduled(personId);  This is already done at login for everyone.
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Attendance Class Report`})
        
  }, [])

  return <AttendanceClassReportView {...props} />
}

export default Container
