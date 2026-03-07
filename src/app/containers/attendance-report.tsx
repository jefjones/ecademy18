import { useEffect, useState } from 'react'
import AttendanceReportView from '../views/AttendanceReportView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAttendanceReport from '../actions/attendance-report'
import * as actionCourseAttendance from '../actions/course-attendance'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionStudent from '../actions/student'
import {guidEmpty} from '../utils/guidValidate'
import { selectMe, selectMyFrequentPlaces, selectAttendanceReport, selectCompanyConfig, selectAccessRoles, selectStudents, selectFetchingRecord,
 					selectPersonConfig, selectIntervals, selectStudentChosenSession} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personConfig = selectPersonConfig(state)
    let studentChosenSession = selectStudentChosenSession(state)
		let studentPersonId = (props.params && props.params.studentPersonId && props.params.studentPersonId !== '0' && props.params.studentPersonId !== guidEmpty) || studentChosenSession
		let intervalId = props.params && props.params.intervalId
		let students = selectStudents(state)
		students = students && students.length > 0 && students.filter(m => m.studentType !== 'DE')

    return {
        personId: me.personId,
        langCode: me.langCode,
				studentPersonId,
				intervalId,
				students,
				//schoolYearId: (props.params && props.params.schoolYearId) || 9,
				attendanceReport: selectAttendanceReport(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				personConfig,
				intervals: selectIntervals(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		setCourseAttendance: (personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction) => dispatch(actionCourseAttendance.setCourseAttendance(personId, AttendanceTypeCode, studentPersonId, courseScheduledId, day, isDelete, studentList, runFunction)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getAttendanceReport: (personId, studentPersonId, intervalId) => dispatch(actionAttendanceReport.getAttendanceReport(personId, studentPersonId, intervalId)),
		setEditMode: (studentPersonId, courseScheduledId, day) => dispatch(actionAttendanceReport.setEditMode(studentPersonId, courseScheduledId, day)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, getAttendanceReport, studentPersonId, intervalId} = props
    		    getPageLangs(personId, langCode, 'AttendanceReportView')
    				studentPersonId && getAttendanceReport(personId, studentPersonId, intervalId)
    	  
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, getAttendanceReport, studentPersonId, intervalId, students} = props
    				
    
    				let studentName = students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
    				if (studentName && studentName.label) studentName = studentName.label
    
    				if (intervalId && studentName && (!isInit || studentPersonId !== state.studentPersonId)) {
    						getAttendanceReport(personId, studentPersonId, intervalId)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Attendance Report: ${studentName}`})
    						setIsInit(true); setStudentPersonId(studentPersonId)
    				}
    		
  }, [])

  const {students} = props
  	    	return students && students.length > 0 ? <AttendanceReportView {...props} /> : null
}


export default Container
