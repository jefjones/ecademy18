import { useEffect } from 'react'
import CalendarAndEventsView from '../views/CalendarAndEventsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAccessRoles from '../actions/access-roles'
import * as actionCalendarEvents from '../actions/calendar-events'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionPersonConfigCalendar from '../actions/person-config-calendar'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import moment from 'moment'
import { selectMe, selectMyFrequentPlaces, selectCalendarEvents, selectAccessRoles, selectCompanyConfig, selectMyProfile,
					selectPersonConfigCalendar, selectUsers, selectStudents, selectCoursesScheduled, selectStudentCourseAssigns} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let accessRoles = selectAccessRoles(state)
		let personId =  selectMe(state).personId
		let calendarEvents = selectCalendarEvents(state) || []
		let courses = selectCoursesScheduled(state)
		let students = selectStudents(state)
		let studentCourseAssigns = selectStudentCourseAssigns(state)

		//Any changes to the data gathering here needs to be duplicated in the container/app.js file as well since CalendarAndEvents is the home page for the app
		//	so this actual container will not be called automatically.  The user would have to click on the menu item for this container to be called.
		//	This code is not necessary in container/firstNav.js
		let myClasses = students && students.length > 0 && students.filter(m => m.id === personId)[0]
		if (accessRoles.learner && myClasses && myClasses.courseScheduledIdList && myClasses.courseScheduledIdList.length > 0) {
				myClasses = courses && courses.length > 0 && courses.filter(m => myClasses.courseScheduledIdList.indexOf(m.id) > -1)
				myClasses = myClasses && myClasses.length > 0 && myClasses.map(m => {
						m.value = m.id
						return m
				})
		}
		//For the student, assign their StudentPersonId to the event record for the link that will open up the assignment list page.
		if ((accessRoles.learner || accessRoles.observer) && calendarEvents && calendarEvents.length > 0) {
				calendarEvents = calendarEvents.map(c => {
						if (c.calendarEventType === 'homework') {
								c.studentPersonId = personId
								c.pathLink = `studentAssignments/${c.courseScheduledId}/${personId}/${c.assignmentId}`
						}
						if (c.calendarEventType === 'course') {
								c.studentPersonId = personId
								c.pathLink = `studentAssignments/${c.courseScheduledId}/${personId}`
						}
						return c
				})
		}

		//For the Observer, cut back the classes according to the students that belong to this Observer.
		let myStudentsClasses = []
		if (accessRoles.observer && students && students.length > 0 && courses && courses.length > 0) {
				students.forEach(m => {
						courses.forEach(c => {
								let found = false
								studentCourseAssigns.forEach(s => { if (s.id === c.id) found = true; })
								if (found) {
										myStudentsClasses = myStudentsClasses && myStudentsClasses.length > 0 ? myStudentsClasses.concat(c) : [c]
								}
						})
				})
		}

		//For the Observer, assign the StudentPersonId that belongs to the given class
		if (accessRoles.observer && students && students.length > 0 && calendarEvents && calendarEvents.length > 0) {
				students.forEach(m => {
						calendarEvents = calendarEvents.map(c => {
								let found = false
								studentCourseAssigns.forEach(s => { if (s.id === c.id) found = true; })

								if (c.calendarEventType === 'homework' && found) {
										c.studentPersonId = m.id
										c.pathLink = `studentAssignments/${c.courseScheduledId}/${m.id}/${c.assignmentId}`
								}
								if (c.calendarEventType === 'student' && found) {
										c.studentPersonId = m.id
										c.pathLink = `studentAssignments/${c.courseScheduledId}/${m.id}`
								}
								return c
						})
				})
		}

    return {
				personId,
				langCode: me.langCode,
        accessRoles,
				personConfigCalendar: selectPersonConfigCalendar(state),
				calendarEvents,
        firstName:  selectMyProfile(state).fname,
        companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				facilitators: selectUsers(state, 'Facilitator'),
				students,
				courses,
				myClasses, //for student's when they are logged in only.
				myStudentsClasses, //for observers
    }
}

const bindActionsToDispatch = dispatch => ({
    getAccessRoles: (personId) => dispatch(actionAccessRoles.getAccessRoles(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getCalendarEvents: (personId, calendarDateRange) => dispatch(actionCalendarEvents.getCalendarEvents(personId, calendarDateRange)),
    removeCalendarEvent: (personId, calendarEventId) => dispatch(actionCalendarEvents.removeCalendarEvent(personId, calendarEventId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setPersonConfigCalendar: (personId, field, value, runFunction) => dispatch(actionPersonConfigCalendar.setPersonConfigCalendar(personId, field, value, runFunction)),
		getPersonConfigCalendar: (personId) => dispatch(actionPersonConfigCalendar.getPersonConfigCalendar(personId)),
		//This setCalendarViewRange call causes the browser to freeze ... probably due to the local redux update when the timer is going off every 10 seconds.
		//setCalendarViewRange: (viewRange) => dispatch(actionPersonConfigCalendar.setCalendarViewRange(viewRange)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getCalendarEvents, getPersonConfigCalendar} = props
    				getPageLangs(personId, langCode, 'CalendarAndEventsView')
    				getCalendarEvents(personId, {fromDate: moment().format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD')})
    				getPersonConfigCalendar(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Calendar and events`})
        
  }, [])

  return <CalendarAndEventsView {...props} />
}

export default Container
