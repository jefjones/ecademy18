import { useEffect } from 'react'
import CourseAssignByAdminListView from '../views/CourseAssignByAdminListView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseAssignByAdmin from '../actions/course-assign-by-admin'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectCourseAssignByAdmins, selectPersonConfig, selectFetchingRecord,
					selectGradeLevels } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				courseAssignByAdmins: selectCourseAssignByAdmins(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				gradeLevels: selectGradeLevels(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getCourseAssignByAdmins: (personId) => dispatch(actionCourseAssignByAdmin.getCourseAssignByAdmins(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeCourseAssignByAdmin: (personId, courseAssignByAdminId, runFunction) => dispatch(actionCourseAssignByAdmin.removeCourseAssignByAdmin(personId, courseAssignByAdminId, runFunction)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, getCourseAssignByAdmins} = props
    		    getPageLangs(personId, langCode, 'CourseAssignByAdminListView')
    				getCourseAssignByAdmins(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Course Assign by Admin List`})
    	  
  }, [])

  return <CourseAssignByAdminListView {...props} />
}

export default Container
