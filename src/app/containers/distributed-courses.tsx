import { useEffect } from 'react'
import DistributedCoursesView from '../views/DistributedCoursesView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionDistributedCourses from '../actions/distributed-courses'
import { selectMe, selectCompanyConfig, selectAccessRoles, selectStudents, selectDistributedCourses, selectPersonConfig, selectFetchingRecord,
					selectGradeLevels } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				distributedCourses: selectDistributedCourses(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				students: selectStudents(state),
				personConfig: selectPersonConfig(state),
				fetchingRecord: selectFetchingRecord(state),
				gradeLevels: selectGradeLevels(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getDistributedCourses: (personId) => dispatch(actionDistributedCourses.getDistributedCourses(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		activateDistributedCourses: (personId, courseAssignByAdminId) => dispatch(actionDistributedCourses.activateDistributedCourses(personId, courseAssignByAdminId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, setMyVisitedPage, getDistributedCourses} = props
    		    getPageLangs(personId, langCode, 'DistributedCoursesView')
    				getDistributedCourses(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Distributed Courses`})
    	  
  }, [])

  return <DistributedCoursesView {...props} />
}

export default Container
