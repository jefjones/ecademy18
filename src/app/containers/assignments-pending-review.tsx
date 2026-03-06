import { useEffect } from 'react'
import AssignmentsPendingReviewView from '../views/AssignmentsPendingReviewView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionAssignmentPendingReview from '../actions/assignments-pending-review'
import * as actionGradebook from '../actions/gradebook-entry'
import * as actionAnnouncement from '../actions/announcements'
import * as actionPenspringTransfer from '../actions/penspring-transfer'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionResponseVisitedType from '../actions/response-visited-type'
import * as actionContentTypes from '../actions/content-types'
import * as actionCourseTypes from '../actions/course-types'
import * as actionCountsMainMenu from '../actions/counts-main-menu'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectFetchingRecord, selectAssignmentsPendingReview, selectCompanyConfig, selectCourseTypes,
 					selectContentTypes, selectAccessRoles} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let assignments = selectAssignmentsPendingReview(state)

		let visitedColor = {
				VISITED: '#c7c9c3',
				HIDE: '#4c8e10',
				DELETED: '',
				ATTENTION: '#f61010'
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
        companyConfig: selectCompanyConfig(state),
				contentTypes: selectContentTypes(state),
        assignments,
        fetchingRecord: selectFetchingRecord(state),
				courseTypes: selectCourseTypes(state),
				accessRoles: selectAccessRoles(state),
				visitedColor,
				myFrequentPlaces: selectMyFrequentPlaces(state),
        path: props.location.pathname,
    }
}

const bindActionsToDispatch = dispatch => ({
		setGradebookScore: (personId, courseScheduledId, studentPersonId, assignmentId, score) => dispatch(actionGradebook.setGradebookScore(personId, courseScheduledId, studentPersonId, assignmentId, score)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getAssignmentsPendingReview: (personId) => dispatch(actionAssignmentPendingReview.getAssignmentsPendingReview(personId)),
		setTeacherViewed: (personId, learnerCourseContentFileId) => dispatch(actionAssignmentPendingReview.setTeacherViewed(personId, learnerCourseContentFileId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		addOrUpdateStudentResponse: (personId, courseEntryId, courseScheduledId, studentResponse, assignmentId) => dispatch(actionStudentAssignments.addOrUpdateStudentResponse(personId, courseEntryId, courseScheduledId, studentResponse, assignmentId)),
		setResponseVisitedType: (personId, studentAssignmentResponseId, ResponseVisitedTypeCode) => dispatch(actionResponseVisitedType.setResponseVisitedType(personId, studentAssignmentResponseId, ResponseVisitedTypeCode)),
		removeStudentResponse: (personId, studentAssignmentResponseId, deleteFile) => dispatch(actionStudentAssignments.removeStudentResponse(personId, studentAssignmentResponseId, deleteFile)),
		getContentTypes: (personId) => dispatch(actionContentTypes.init(personId)),
		getCourseTypes: (personId) => dispatch(actionCourseTypes.init(personId)),
		getCountsMainMenu: (personId) => dispatch (actionCountsMainMenu.getCountsMainMenu(personId)),
		setPenspringTransfer: (personId, work) => dispatch(actionPenspringTransfer.setPenspringTransfer(personId, work)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, personId, setMyVisitedPage, path, getAssignmentsPendingReview, getContentTypes, getCourseTypes} = props
          getPageLangs(personId, langCode, 'AssignmentsPendingReviewView')
          getAssignmentsPendingReview(personId)
    			getContentTypes(personId)
    			getCourseTypes(personId)
          setMyVisitedPage(personId, {path, description: `Assignments pending review`})
      
  }, [])

  return <AssignmentsPendingReviewView {...props} />
}
export default Container
