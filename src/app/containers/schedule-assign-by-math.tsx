import { useEffect } from 'react'
import ScheduleAssignByMathView from '../views/ScheduleAssignByMathView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionSchedMath from '../actions/schedule-assign-by-math'
import * as actionCoursesSched from '../actions/course-to-schedule'
import * as actionPersonConfig from '../actions/person-config'
import * as actionIntervals from '../actions/semester-intervals'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCoursesScheduled, selectScheduleAssignByMath, selectScheduleAssignMathNames, selectPersonConfig, selectCompanyConfig,
 					selectIntervals, selectFetchingRecord} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let scheduledCourses = selectCoursesScheduled(state)
		if (scheduledCourses && scheduledCourses.length > 0) scheduledCourses = scheduledCourses.filter(m => m.courseTypeName === 'Academy')

    return {
        personId: me.personId,
        langCode: me.langCode,
        scheduleAssignByMathId: props.params && props.params.scheduleAssignByMathId,
        mathNames: selectScheduleAssignMathNames(state),
        scheduleAssignByMathList: selectScheduleAssignByMath(state),
        scheduledCourses,
				personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				intervals: selectIntervals(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getScheduleMathNames: (personId) => dispatch(actionSchedMath.getScheduleMathNames(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getCoursesScheduled: (personId) => dispatch(actionCoursesSched.getCoursesScheduled(personId)),
    getScheduleAssignByMath: (personId, scheduleAssignByMathId) => dispatch(actionSchedMath.getScheduleAssignByMath(personId, scheduleAssignByMathId)),
    removeScheduleAssignByMath: (personId, scheduleAssignByMathId, scheduleAssignByMathCourseAssignId) => dispatch(actionSchedMath.removeScheduleAssignByMath(personId, scheduleAssignByMathId, scheduleAssignByMathCourseAssignId)),
    setScheduleAssignByMath: (personId, selectedCourses, scheduleAssignByMathId) => dispatch(actionSchedMath.setScheduleAssignByMath(personId, selectedCourses, scheduleAssignByMathId)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getIntervals: (personId)  => dispatch(actionIntervals.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getCoursesScheduled, getScheduleMathNames, getScheduleAssignByMath, getIntervals} = props
            getPageLangs(personId, langCode, 'ScheduleAssignByMathView')
            getScheduleAssignByMath(personId, 0);  //Blank this out to start with.
            getScheduleMathNames(personId)
            //getCoursesScheduled(personId);  This is already done at login for everyone.
    				getIntervals(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Schedule Assign by Admin`})
        
  }, [])

  return props.scheduledCourses && props.mathNames ? <ScheduleAssignByMathView {...props} /> : null
}

export default Container
