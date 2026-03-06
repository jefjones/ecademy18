import { useEffect } from 'react'
import CourseAssignByAdminAddView from '../views/CourseAssignByAdminAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionCourseAssignByAdmin from '../actions/course-assign-by-admin'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionDepartment from '../actions/department'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectCoursesBase, selectPersonConfig, selectLearningPathways,
					selectFetchingRecord, selectGradeLevels, selectCoursesScheduled } from '../store'; //, selectDepartments

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
				me,
				langCode: me.langCode,
        personId: me.personId,
				baseCourses: selectCoursesBase(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				learningPathways: selectLearningPathways(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				//departments: selectDepartments(state),
				gradeLevels: selectGradeLevels(state),
				coursesScheduled: selectCoursesScheduled(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		addCourseAssignByAdmin: (studentPersonId, courseAssignByAdmin, runFunction) => dispatch(actionCourseAssignByAdmin.addCourseAssignByAdmin(studentPersonId, courseAssignByAdmin, runFunction)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLearningPathways: (personId) => dispatch(actionLearningPathways.init(personId)),
		getDepartments: (personId) => dispatch(actionDepartment.init(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, getDepartments, getLearningPathways} = props
    		    getPageLangs(personId, langCode, 'CourseAssignByAdminAddView')
    				getLearningPathways(personId)
    				getDepartments(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Course Assign by Admin`})
    	  
  }, [])

  return <CourseAssignByAdminAddView {...props} />
}

export default Container
