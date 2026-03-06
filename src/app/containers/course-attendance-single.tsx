import { useEffect, useState } from 'react'
import CourseAttendanceSingleView from '../views/CourseAttendanceSingleView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseAttendance from '../actions/course-attendance'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionStudent from '../actions/student'
import {formatYYYY_MM_DD} from '../utils/dateFormatYYYY_MM_DD'
import {guidEmpty} from '../utils/guidValidate'
import { selectMe, selectMyFrequentPlaces, selectCourseAttendanceSingle, selectStudents, selectCourseAttendanceDays, selectCompanyConfig, selectAccessRoles,
 					selectFetchingRecord, selectPersonConfig, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
		let students = selectStudents(state)
		//Just consider the students who are Academy.
		students = students && students.length > 0 && students.filter(m => m.studentType !== "DE")
    let attendanceSingle = selectCourseAttendanceSingle(state)
    let studentChosenSession = selectStudentChosenSession(state)
    let studentPersonId = (props.params && props.params.studentPersonId) || studentChosenSession
		let studentName = students && students.length > 0 && studentPersonId && studentPersonId !== guidEmpty
				? students.filter(m => m.id === studentPersonId)[0]
				: ''

		studentName = studentName && studentName.firstName
				? studentName.firstName + ' ' + studentName.lastName
				: ''

    return {
        studentPersonId,
        langCode: me.langCode,
				studentName,
        personId: me.personId,
        attendanceSingle,
				personConfig,
				accessRoles: selectAccessRoles(state),
        courseDates: selectCourseAttendanceDays(state),
        courseScheduledId: props.params && props.params.courseScheduledId,
        students,
        companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getCourseAttendanceSingle: (personId, studentPersonId, dayFrom, dayTo) => dispatch(actionCourseAttendance.getCourseAttendanceSingle(personId, studentPersonId, dayFrom, dayTo)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		clearCourseAttendanceSingle: () => dispatch(actionCourseAttendance.clearCourseAttendanceSingle()),
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
    
            const {getPageLangs, langCode, personId, getCourseAttendanceSingle, studentPersonId} = props
            getPageLangs(personId, langCode, 'CourseAttendanceSingleView')
            //We want to have the entire view of the learner's attendance to start with up to today (since the future hasn't happened yet).
            let today = formatYYYY_MM_DD(new Date())
            if (studentPersonId) getCourseAttendanceSingle(personId, studentPersonId, today, today)
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, getCourseAttendanceSingle, studentPersonId, dayFrom, dayTo, studentName} = props
    				
    
    				if (studentName && (!isInit || studentPersonId !== state.studentPersonId)) {
    						getCourseAttendanceSingle(personId, studentPersonId, dayFrom, dayTo)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Attendance (single): ${studentName}`})
    						setIsInit(true); setStudentPersonId(studentPersonId)
    				}
    		
  }, [])

  return <CourseAttendanceSingleView {...props} />
}

export default Container
