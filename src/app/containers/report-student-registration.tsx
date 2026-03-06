import { useEffect } from 'react'
import ReportStudentRegistrationView from '../views/ReportStudentRegistrationView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionStudentRegistration from '../actions/report-student-registration'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {  selectMe, selectReportStudentRegistration, selectReportCourseSeatStatus, selectReportStudentCourseAssign } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
				personId: me.personId,
				langCode: me.langCode,
				reportStudentRegistration: selectReportStudentRegistration(state),
        reportCourseSeatStatus: selectReportCourseSeatStatus(state),
				reportStudentCourseAssign: selectReportStudentCourseAssign(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getReportStudentRegistration: (personId) => dispatch(actionStudentRegistration.getReportStudentRegistration(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getReportCourseSeatStatus: (personId) => dispatch(actionStudentRegistration.getReportCourseSeatStatus(personId)),
		getReportStudentCourseAssign: (personId) => dispatch(actionStudentRegistration.getReportStudentCourseAssign(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    	      const {getPageLangs, langCode, personId, setMyVisitedPage, getReportStudentRegistration, getReportCourseSeatStatus, getReportStudentCourseAssign} = props
    	      getPageLangs(personId, langCode, 'ReportStudentRegistrationView')
    				getReportStudentRegistration(personId)
    	      getReportCourseSeatStatus(personId)
    				getReportStudentCourseAssign(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Student Registration Report`})
    	  
  }, [])

  return <ReportStudentRegistrationView {...props} />
}
export default Container
