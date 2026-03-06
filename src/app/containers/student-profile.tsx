import { useEffect } from 'react'
import StudentProfileView from '../views/StudentProfileView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegistration from '../actions/registration'
import * as loginUser from '../actions/login'
import * as actionAnnouncement from '../actions/announcements'
import * as actionStudentDocuments from '../actions/student-documents'
import * as actionGradeLevel from '../actions/grade-level'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectRegistration, selectAccessRoles, selectFetchingRecord, selectCompanyConfig, selectSchoolYears, selectPersonConfig,
					selectStudents, selectStudentDocuments} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let studentProfile = selectRegistration(state)
		let studentPersonId = props.params && props.params.studentPersonId
		let students = selectStudents(state)
		students = studentProfile && studentProfile.primaryGuardian && students && students.length > 0 && students.filter(m => m.primaryGuardianPersonId === studentProfile.primaryGuardian.personId)

    return {
				personId: me.personId,
				langCode: me.langCode,
				studentProfile,
				students,
				schoolYearId: (props.params && props.params.schoolYearId),
				studentPersonId,
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				companyConfig: selectCompanyConfig(state),
				schoolYears: selectSchoolYears(state),
				personConfig: selectPersonConfig(state),
				studentDocuments: selectStudentDocuments(state),
    }
}

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getRegistrationByStudent: (personId, studentPersonId, schoolYearId) => dispatch(actionRegistration.getRegistrationByStudent(personId, studentPersonId, schoolYearId)),
		login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
		sendLoginInstructions: (personId, primaryGuardianPersonId) => dispatch(actionRegistration.sendLoginInstructions(personId, primaryGuardianPersonId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		updatePersonConfig: (personId, field, value, runFunction) => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		updateStudentProfile: (personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId) => dispatch(actionRegistration.updateStudentProfile(personId, studentPersonId, withdrawnDate, selfPaced, newNote, schoolYearId)),
		removeStudentAdminNote: (personId, studentPersonId, studentAdminNoteId, schoolYearId) => dispatch(actionRegistration.removeStudentAdminNote(personId, studentPersonId, studentAdminNoteId, schoolYearId)),
		getStudentDocuments: (personId, studentPersonId) => dispatch(actionStudentDocuments.getStudentDocuments(personId, studentPersonId)),
		removeStudentDocumentFile: (personId, studentDocumentId) => dispatch(actionStudentDocuments.removeStudentDocumentFile(personId, studentDocumentId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const{getPageLangs, langCode, setMyVisitedPage, getRegistrationByStudent, personId, studentPersonId, schoolYearId, getStudentDocuments} = props
    				getPageLangs(personId, langCode, 'StudentProfileView')
    				getRegistrationByStudent(personId, studentPersonId, schoolYearId)
    				getStudentDocuments(personId, studentPersonId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Student Profile`})
    		
  }, [])

  const {fetchingRecord} = props
  	    	return fetchingRecord && !fetchingRecord.studentProfile ? <StudentProfileView {...props} /> : null
}

export default Container
