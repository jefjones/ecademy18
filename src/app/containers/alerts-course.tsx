import { useEffect } from 'react'
import AlertCourseScheduleView from '../views/AlertCourseScheduleView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAlerts from '../actions/alerts'
import * as actionWaitList from '../actions/course-wait-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCoursesScheduled, selectCompanyConfig, selectAccessRoles, selectAlerts, selectClassPeriods, selectDoNotAddCourses } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let scheduledCourses = selectCoursesScheduled(state)
		let courseScheduledId = props.params && props.params.courseScheduledId
		let course = courseScheduledId && scheduledCourses && scheduledCourses.length > 0 && scheduledCourses.filter(m => m.courseScheduledId === courseScheduledId)[0]
		let seats = []
		if (course && course.maxSeats) {
				for(let i = course.maxSeats; i > 0; i--) {
						seats = seats ? seats.concat({id: i, label: i}) : [{id: i, label: i}]
				}
		}
		let classPeriods = selectClassPeriods(state)
		if (classPeriods && classPeriods.length > 0) {
			  classPeriods = classPeriods.filter(m => m.periodNumber !== '1A' && m.periodNumber !== '1B' && m.classPeriodId !== (course && course.classPeriodId)).map(m => {
						if (m.id === 20) m.label = '5th Credit (optional)'
						return m
				})
		}
		let doNotAddCourses = selectDoNotAddCourses(state)
		let doNotAddCourse = doNotAddCourses && doNotAddCourses.length > 0 && doNotAddCourses.filter(m => m.courseEntryId === (course && course.courseEntryId))[0]
		let alerts = selectAlerts(state)
		let alertWhenId = props.params && props.params.alertWhenId
		let alert = {}
		if (alerts && alerts.length > 0 && alertWhenId) {
				alert = alerts.filter(m => m.alertWhenId === alertWhenId)[0]
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseScheduledId,
				alerts,
				alert,
				course,
				classPeriods,
				seats,
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				doNotAddCourse,
    }
}

const bindActionsToDispatch = dispatch => ({
		addOrUpdateAlert: (personId, alert) => dispatch(actionAlerts.addOrUpdateAlert(personId, alert)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeAlert: (personId, alertWhenId, courseScheduledId) => dispatch(actionAlerts.removeAlert(personId, alertWhenId, courseScheduledId)),
		getAlerts: (personId) => dispatch(actionAlerts.init(personId)),
		getDoNotAddCourse: (personId) => dispatch(actionWaitList.getDoNotAddCourse(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getAlerts, getDoNotAddCourse} = props
    				getPageLangs(personId, langCode, 'AlertCourseScheduleView')
    				getAlerts(personId)
    				getDoNotAddCourse(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Alerts`})
    		
  }, [])

  return <AlertCourseScheduleView {...props} />
}

export default Container
