import { useEffect } from 'react'
import ReportCourseWaitListView from '../views/ReportCourseWaitListView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionWaitList from '../actions/course-wait-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {  selectMe, selectReportExcelCourseWaitList, selectCoursesBase, selectDoNotAddCourses, selectFetchingRecord, selectCompanyConfig,
						selectUsers, selectClassPeriods, selectLearningPathways, selectIntervals, selectDepartments} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
				personId: me.personId,
				langCode: me.langCode,
        reportExcelCourseWaitList: selectReportExcelCourseWaitList(state),
				coursesBase: selectCoursesBase(state),
				doNotAddCourses: selectDoNotAddCourses(state),
				fetchingRecord: selectFetchingRecord(state),
				companyConfig: selectCompanyConfig(state),
				teachers: selectUsers(state),
				classPeriods: selectClassPeriods(state),
				learningPathways: selectLearningPathways(state),
				intervals: selectIntervals(state),
				departments: selectDepartments(state),

    }
}

const bindActionsToDispatch = dispatch => ({
		getReportCourseWaitListCount: (personId) => dispatch(actionWaitList.getReportCourseWaitListCount(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleDoNotAddCourse: (personId, courseEntryId) => dispatch(actionWaitList.toggleDoNotAddCourse(personId, courseEntryId)),
		getDoNotAddCourse: (personId) => dispatch(actionWaitList.getDoNotAddCourse(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, setMyVisitedPage, getReportCourseWaitListCount, getDoNotAddCourse} = props
          getPageLangs(personId, langCode, 'ReportCourseWaitListView')
          getReportCourseWaitListCount(personId)
    			getDoNotAddCourse(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Wait List`})
      
  }, [])

  return <ReportCourseWaitListView {...props} />
}
export default Container
