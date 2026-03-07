import { useEffect, useState } from 'react'
import StudentScheduleWeekView from '../views/StudentScheduleWeekView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudentSchedule from '../actions/student-schedule'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionStudent from '../actions/student'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import moment from 'moment'
import { selectMe, selectMyFrequentPlaces, selectStudentScheduleWeek, selectStudents, selectCompanyConfig, selectIntervals, selectSchoolYears,
				selectPersonConfig, selectStudentChosenSession } from '../store'

const mapStateToProps = (state, props) => {
	let me = selectMe(state)
	let students = selectStudents(state)
	let schoolYears = selectSchoolYears(state)
	let personConfig = selectPersonConfig(state)
	let schoolYear = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.id === personConfig.schoolYearId)[0]
	schoolYear = schoolYear && schoolYear.label
	let studentSchedule = selectStudentScheduleWeek(state)
	let calendarEvents = []
	let daysOfWeek =['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

	schoolYear && studentSchedule && studentSchedule.courses && studentSchedule.courses.length > 0 && studentSchedule.courses.forEach(m => {
			//let year = m.semesterFromMonth > 6 ? schoolYear.substring(0,4) : schoolYear.substring(5);
			//let fromDate = moment.utc(`${year}-${m.semesterFromMonth+1}-${m.semesterFromDay} 00:00:00.000`);
			let fromDate = moment.utc(m.fromDate)
			let fromMondayDate = moment(fromDate)
			fromMondayDate = fromMondayDate.isoWeekday(0)
			//year = m.semesterToMonth > 6 ? schoolYear.substring(0,4) : schoolYear.substring(5);
			//let toDate = moment.utc(`${year}-${m.semesterToMonth+1}-${m.semesterToDay} 00:00:00.000`);
			let toDate = moment.utc(m.toDate)
			let pointerDate = fromMondayDate

			m.scheduleDays && m.scheduleDays.length > 0 && m.scheduleDays.forEach(s => {
					pointerDate = fromMondayDate.clone().day(daysOfWeek.indexOf(s.dayOfTheWeek))
					while(pointerDate.isSameOrBefore(toDate)){
							if (pointerDate.isSameOrAfter(fromDate)) {
									let startTime = moment(s.startTime)
									let endTime = moment(s.startTime).add(s.duration, 'minutes')
									calendarEvents.push({
											title: m.courseName,
											start: new Date(pointerDate.format('YYYY-MM-DD') + " " + startTime.format('HH:mm')),
											end: new Date(pointerDate.format('YYYY-MM-DD') + " " + endTime.format('HH:mm')),
											isAllDay: false,
									})
							}
							pointerDate.add(7, 'days')
					}
			})
	})

	let studentChosenSession = selectStudentChosenSession(state)
	let studentPersonId = (props.params && props.params.studentPersonId) || studentChosenSession
	let studentName = studentPersonId && students && students.length > 0 && students.filter(m => m.id === studentPersonId)[0]
	studentName = studentName && studentName.firstName ? studentName.firstName + ' ' + studentName.lastName : ''

  return {
			calendarEvents,
			langCode: me.langCode,
      personId: selectMe(state).personId,
			studentPersonId,
			students,
			studentName,
			companyConfig: selectCompanyConfig(state),
			intervals: selectIntervals(state),
			schoolYears: selectSchoolYears(state),
			personConfig,
			myFrequentPlaces: selectMyFrequentPlaces(state),
  }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
	    getStudentScheduleWeek: (personId, studentPersonId, runFunction) => dispatch(actionStudentSchedule.getStudentScheduleWeek(personId, studentPersonId, runFunction)),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
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
    
            const {getPageLangs, langCode, personId, getStudentScheduleWeek, studentPersonId} = props
            getPageLangs(personId, langCode, 'StudentScheduleWeekView')
            studentPersonId && getStudentScheduleWeek(personId, studentPersonId)
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {personId, setMyVisitedPage, getStudentScheduleWeek, studentPersonId, studentName} = props
    				
    
    				if (studentName && (!isInit  || studentPersonId !== state.studentPersonId)) {
    						getStudentScheduleWeek(personId, studentPersonId)
    						props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Student Schedule (week): ${studentName}`})
    						setIsInit(true); setStudentPersonId(studentPersonId)
    				}
    		
  }, [])

  return <StudentScheduleWeekView {...props} />
}

export default Container
