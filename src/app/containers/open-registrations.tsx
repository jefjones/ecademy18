import { useEffect } from 'react'
import OpenRegistrationView from '../views/OpenRegistrationView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMyProfile from '../actions/my-profile'
import * as actionOpenRegistrations from '../actions/open-registrations'
import * as actionStudentSchedule from '../actions/student-schedule'
import * as actionAnnouncement from '../actions/announcements'
import * as actionUserPersonClipboard from '../actions/user-person-clipboard'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionCourseDocuments from '../actions/course-documents'
import * as actionGradeLevel from '../actions/grade-level'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectAccessRoles, selectOpenRegistrations, selectCompanyConfig, selectGradeLevels, selectUserPersonClipboard,
 					selectStudents} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let openRegistrationTableId = props.params && props.params.openRegistrationTableId
		let openRegistrations = selectOpenRegistrations(state)
		let openRegistration = {}
		if (openRegistrationTableId) {
				openRegistration = (openRegistrations && openRegistrations.length > 0 && openRegistrations.filter(m => m.openRegistrationTableId === openRegistrationTableId)[0]) || []
				if (openRegistration && openRegistration.openDateFrom && openRegistration.openDateFrom.indexOf('T') > -1) {
						openRegistration.openDateFrom = openRegistration.openDateFrom.substring(0, openRegistration.openDateFrom.indexOf('T'))
				}
				if (openRegistration && openRegistration.openDateTo && openRegistration.openDateTo.indexOf('T') > -1) {
						openRegistration.openDateTo = openRegistration.openDateTo.substring(0, openRegistration.openDateTo.indexOf('T'))
				}
		}
		let userPersonClipboard = selectUserPersonClipboard(state)
		let students = selectStudents(state)
		let clipboardStudents = []
		if (students && students.length > 0 && userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0) {
				clipboardStudents = students.filter(m => userPersonClipboard.personList.indexOf(m.studentPersonId) > -1)
		}

    return {
				clipboardStudents,
				langCode: me.langCode,
        personId: me.personId,
				openRegistrationTableId,
				accessRoles: selectAccessRoles(state),
				openRegistrations,
				openRegistration,
				companyConfig: selectCompanyConfig(state),
				gradeLevels: selectGradeLevels(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getMyProfile: (personId) => dispatch(actionMyProfile.getMyProfile(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeOpenRegistration: (personId, openRegistrationTableId) => dispatch(actionOpenRegistrations.removeOpenRegistration(personId, openRegistrationTableId)),
		removeStudentOpenRegistration: (personId, openRegistrationTableId, studentPersonId) => dispatch(actionOpenRegistrations.removeStudentOpenRegistration(personId, openRegistrationTableId, studentPersonId)),
		addOrUpdateOpenRegistration: (personId, openRegistration) => dispatch(actionOpenRegistrations.addOrUpdateOpenRegistration(personId, openRegistration)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		removeAllUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.removeAllUserPersonClipboard(personId, personType)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		getOpenRegistrations: (personId) => dispatch(actionOpenRegistrations.init(personId)),
		getUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.init(personId, personType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getGradeLevels, getOpenRegistrations, getUserPersonClipboard} = props
    				getPageLangs(personId, langCode, 'OpenRegistrationView')
    				getGradeLevels(personId)
    				getOpenRegistrations(personId)
    				getUserPersonClipboard(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Open Registration`})
    		
  }, [])

  return <OpenRegistrationView {...props} />
}

export default Container
