import { useEffect } from 'react'
import CourseAttendanceAdminView from '../views/CourseAttendanceAdminView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudent from '../actions/student'
import * as actionCourseAttendance from '../actions/course-attendance'
import * as actionPersonConfig from '../actions/person-config'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCourseAttendanceAdmin, selectCoursesScheduled, selectStudents, selectCourseAttendanceDays, selectAccessRoles,
					selectFetchingRecord, selectCompanyConfig, selectPersonConfig, selectIntervals, selectSchoolYears, selectMyFrequentPlaces,
				 	selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let students = selectStudents(state)
		let studentChosenSession = selectStudentChosenSession(state)
		//Get the Academy students only.
		students = students && students.length > 0 && students.filter(m => m.studentType === 'ACADEMY' || !m.studentType)
		let courses = selectCoursesScheduled(state)
		//Get the Academy classes only.
		courses = courses && courses.length > 0 && courses.filter(m => m.courseTypeName === 'Academy')

    return {
        personId: me.personId,
        langCode: me.langCode,
        attendanceAdmin: selectCourseAttendanceAdmin(state),
        courseDates: selectCourseAttendanceDays(state),
        courseScheduledId: props.params && props.params.courseScheduledId,
				studentPersonId: studentChosenSession,
        fetchingRecord: selectFetchingRecord(state),
        students,
        courses,
        companyConfig: selectCompanyConfig(state),
				personConfig,
				intervals: selectIntervals(state),
				schoolYears: selectSchoolYears(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				accessRoles: selectAccessRoles(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCourseAttendanceAdmin: (personId, dayFrom, dayTo) => dispatch(actionCourseAttendance.getCourseAttendanceAdmin(personId, dayFrom, dayTo)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setMassCourseAttendanceAdmin: (personId, attendanceTypeCode, isDelete, courseAttendances, runFunction) => dispatch(actionCourseAttendance.setMassCourseAttendanceAdmin(personId, attendanceTypeCode, isDelete, courseAttendances, runFunction)),
    clearCourseAttendanceAdmin: () => dispatch(actionCourseAttendance.clearCourseAttendanceAdmin()),
    setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		updatePersonConfig: (personId, field, value, runFunction)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		getStudents: (personId) => dispatch(actionStudent.getStudents(personId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage} = props
    				getPageLangs(personId, langCode, 'CourseAttendanceAdminView')
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Attendance (admin)`})
    		
  }, [])

  return <CourseAttendanceAdminView {...props} />
}

export default Container
