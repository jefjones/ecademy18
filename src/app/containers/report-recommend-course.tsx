import { useEffect } from 'react'
import ReportRecommendCourseView from '../views/ReportRecommendCourseView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseRecommendation from '../actions/course-recommendation'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {  selectMe, selectReportRecommendCourseName, selectReportRecommendByTeacher, selectReportRecommendByStudent } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
				personId: me.personId,
				langCode: me.langCode,
        reportRecommendCourseName: selectReportRecommendCourseName(state),
				reportRecommendByTeacher: selectReportRecommendByTeacher(state),
				reportRecommendByStudent: selectReportRecommendByStudent(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getReportCourseCount: (personId) => dispatch(actionCourseRecommendation.getReportCourseCount(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getReportByTeacher: (personId) => dispatch(actionCourseRecommendation.getReportByTeacher(personId)),
		getReportByStudent: (personId) => dispatch(actionCourseRecommendation.getReportByStudent(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, setMyVisitedPage, getReportCourseCount, getReportByTeacher, getReportByStudent, personId} = props
          getPageLangs(personId, langCode, 'ReportRecommendCourseView')
          getReportCourseCount(personId)
    			getReportByTeacher(personId)
    			getReportByStudent(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Recommendation Report`})
      
  }, [])

  return <ReportRecommendCourseView {...props} />
}
export default Container
