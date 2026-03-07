import { useEffect } from 'react'
import AnnouncementEditView from '../views/AnnouncementEditView'
import { useSelector, shallowEqual, useDispatch, connect } from 'react-redux';import * as actionPageLang from '../actions/language-list'
import * as actionAnnouncement from '../actions/announcements'
import * as actionAnnouncementAttachments from '../actions/announcement-attachments'
import * as actionUserPersonClipboard from '../actions/user-person-clipboard'
import * as actionStudentAssignments from '../actions/student-assignments'
import * as actionCourseDocuments from '../actions/course-documents'
import * as actionMessageSave from '../actions/message-save'
import * as actionMessageGroups from '../actions/message-groups'
import * as actionGradeLevel from '../actions/grade-level'
import * as actionGuardians from '../actions/guardians'
import * as actionCourseToSchedule from '../actions/course-to-schedule'
import * as fromAnnouncements from '../reducers/announcements'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from '../utils/sort'
import { selectStudents, selectUsers, selectMe, selectAnnouncementList, selectCompanyConfig, selectAccessRoles, selectGuardians, selectAnnouncementAttachments,
          selectGradeLevels, selectMessageSave, selectCoursesScheduled, selectMessageGroups, selectMyFrequentPlaces, selectStudentCourseAssigns} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let editType = props.params && props.params.editType
    let reply_announcementId = ''
		let accessRoles = selectAccessRoles(state)
		let companyConfig = selectCompanyConfig(state)
		let gradeLevels = selectGradeLevels(state)
		let announcementsList = selectAnnouncementList(state)
		let announcementEdit = (props.params && props.params.announcementId && announcementsList && announcementsList.length > 0
				&& announcementsList.filter(m => m.announcementId === props.params.announcementId)[0]) || {}

    if (editType === 'reply' && announcementEdit && announcementEdit.announcementId) reply_announcementId = announcementEdit.announcementId

		let students = selectStudents(state)
		students = students && students.length > 0 && students.filter(m => !m.withdrawnDate)
		let guardians = selectGuardians(state)
		let facilitators = selectUsers(state, 'Facilitator')
		let mentors = selectUsers(state, 'Mentor')
		let counselors = selectUsers(state, 'Counselor')
		let admins = selectUsers(state, 'Admin')
		let carpoolRequests = props.params && props.params.carpoolRequestId &&
				{
						id: props.params && props.params.toPersonId,
						label: (props.params && props.params.toPersonName) + ' (Carpool)'
				}

		let coursesScheduled = selectCoursesScheduled(state)
		if (accessRoles.facilitator) {
				coursesScheduled = coursesScheduled && coursesScheduled.length > 0 && coursesScheduled.filter(m => {
						let found = false
						m.teachers && m.teachers.length > 0 && m.teachers.forEach(t => {
								if (t.id === me.personId) found = true
						})
						return found
				})
		}
		gradeLevels = gradeLevels && gradeLevels.length > 0 && gradeLevels.filter(m => {
				let foundGrade = false
				students && students.length > 0 && students.forEach(l => {
						if (m.id === l.gradeLevelId) foundGrade = true
				})
				return foundGrade
		})
		let messageGroups = selectMessageGroups(state)
		messageGroups = messageGroups && messageGroups.length > 0 && messageGroups.map(m => ({
				...m,
				id: m.messageGroupId,
				value: m.messageGroupId,
				label: m.groupName,
				messageGroupId: m.messageGroupId,
				groupName: m.groupName,
		}))

		let singleSimpleList = []
		singleSimpleList = students && students.length > 0 && students.map(m => ({
				id: m.personId || m.studentPersonId,
				label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Student)'
		}))
		//Carpool Request
		if (editType === 'carpoolRequest' && props.params && props.params.toPersonName) {
				let option = {
						id: props.params && props.params.toPersonId,
						label: (props.params && props.params.toPersonName) + ' (Carpool)'
				}
				singleSimpleList = singleSimpleList ? singleSimpleList.concat(option) : [option]
		}

		let guardianList = guardians && guardians.length > 0 && guardians.reduce((acc, m) => {
				let isDup = acc.filter(f => f.id === m.personId)[0]
				if (!(isDup && isDup.id)) {
						let option = {
							id: m.personId,
							label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Guardian)'
						}
						acc = acc && acc.length > 0 ? acc.concat(option) : [option]
				}
				return acc
		}, [])
		if (guardianList) singleSimpleList = singleSimpleList ? singleSimpleList.concat(guardianList) : guardianList
		let facilitatorList = facilitators && facilitators.length > 0 && facilitators.map(m => ({
				id: m.personId,
				label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Teacher)'
		}))
		if (facilitatorList) singleSimpleList = singleSimpleList ? singleSimpleList.concat(facilitatorList) : facilitatorList
		let mentorList = mentors && mentors.length > 0 && mentors.map(m => ({
				id: m.personId,
				label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Mentor)'
		}))
		if (mentorList) singleSimpleList = mentorList && singleSimpleList ? singleSimpleList.concat(mentorList) : mentorList
		let counselorList = counselors && counselors.length > 0 && counselors.map(m => ({
				id: m.personId,
				label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Counselor)'
		}))
		if (counselorList) singleSimpleList = counselorList && singleSimpleList ? singleSimpleList.concat(counselorList) : counselorList
		let adminList = admins && admins.length > 0 && admins.map(m => ({
				id: m.personId,
				label: (companyConfig.studentNameFirst === 'FIRSTNAME' ? m.firstName + ' ' + m.lastName : m.lastName + ', ' + m.firstName) + ' (Admin)'
		}))
		if (adminList) singleSimpleList = adminList && singleSimpleList ? singleSimpleList.concat(adminList) : adminList
		singleSimpleList = doSort(singleSimpleList, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
				editType,
        reply_announcementId,
				fromPersonId: props.params && props.params.fromPersonId,
				fromFirstName: props.params && props.params.fromFirstName,
				fromLastName: props.params && props.params.fromLastName,
				announcementId: props.params && props.params.announcementId,
				carpoolRequestId: props.params && props.params.carpoolRequestId,
				toPersonId: props.params && props.params.toPersonId,
				toPersonName: props.params && props.params.toPersonName,
				carpoolRequests,
				students,
				guardians,
				facilitators,
        mentors,
				counselors,
        announcementEdit,
        companyConfig,
				accessRoles,
				announcementAttachments: selectAnnouncementAttachments(state),
				gradeLevels,
				messageSave: selectMessageSave(state),
				coursesScheduled,
				admins,
				messageGroups,
				singleSimpleList,
				chosenMessageGroupId: fromAnnouncements.selectChosenMessageGroupId(state.announcements),
				myFrequentPlaces: selectMyFrequentPlaces(state),
        studentCourseAssigns: selectStudentCourseAssigns(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getAnnouncementAttachments: (personId, announcementId) => dispatch(actionAnnouncementAttachments.init(personId, announcementId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getAnnouncementsRecipient: (personId, editType) => dispatch(actionAnnouncement.getAnnouncementsRecipient(personId, editType)),
		addOrUpdateAnnouncement: (personId, announcement, announcementId) => dispatch(actionAnnouncement.addOrUpdateAnnouncement(personId, announcement, announcementId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		removeAnnouncementAttachmentsUnused: (personId) => dispatch(actionAnnouncementAttachments.removeAnnouncementAttachmentsUnused(personId)),
		removeAnnouncementAttachmentFile: (personId, announcementAttachmentId) => dispatch(actionAnnouncementAttachments.removeAnnouncementAttachmentFile(personId, announcementAttachmentId)),
		removeAllUserPersonClipboard: (personId, personType) => dispatch(actionUserPersonClipboard.removeAllUserPersonClipboard(personId, personType)),
		removeStudentUserPersonClipboard: (personId, chosenPersonId, personType) => dispatch(actionUserPersonClipboard.removeStudentUserPersonClipboard(personId, chosenPersonId, personType)),
		studentAssignmentsInit: (personId, studentPersonId, courseScheduledId) => dispatch(actionStudentAssignments.init(personId, studentPersonId, courseScheduledId)),
		courseDocumentsInit: (personId, courseEntryId) => dispatch(actionCourseDocuments.init(personId, courseEntryId)),
		saveMessage: (subject, message) => dispatch(actionMessageSave.saveMessage(subject, message)),
		getMessageGroups: (personId) => dispatch(actionMessageGroups.getMessageGroups(personId)),
		addOrUpdateMessageGroup: (personId, messageGroup) => dispatch(actionMessageGroups.addOrUpdateMessageGroup(personId, messageGroup)),
		removeMessageGroup: (personId, messageGroupId) => dispatch(actionMessageGroups.removeMessageGroup(personId, messageGroupId)),
		getGradeLevels: () => dispatch(actionGradeLevel.init()),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		getCoursesScheduled: (personId) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getStudentCoursesAssignsByTeacher: (personId) => dispatch(actionCourseToSchedule.getStudentCoursesAssignsByTeacher(personId)),

})

const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
})

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
    mergeAllProps
)

function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		    const {getPageLangs, langCode, getAnnouncementsRecipient, setMyVisitedPage, personId, editType, getAnnouncementAttachments, announcementId, getMessageGroups, getGradeLevels,
    								getGuardians, getStudentCoursesAssignsByTeacher} = props
            getPageLangs(personId, langCode, 'AnnouncementEditView')
    		    getAnnouncementsRecipient(personId, editType) //This coule be 'reply' in which case we use the original sender in order to create a new message back.
    				getAnnouncementAttachments(personId, announcementId)
    				getMessageGroups(personId)
    				getGradeLevels()
    				getGuardians(personId)
            getStudentCoursesAssignsByTeacher(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Message`})
    	  
  }, [])

  return <AnnouncementEditView {...props} />
}

export default Container