import { useEffect } from 'react'
import DiscussionEntryView from '../views/DiscussionEntryView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionDiscussionEntries from '../actions/discussion-entries'
import * as actionVoiceRecording from '../actions/voice-recording'
import * as actionFetchingRecord from '../actions/fetching-record'
import * as actionPersonConfig from '../actions/person-config'
import * as actionStudentSchedule from '../actions/student-schedule'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from '../utils/sort'
import { selectMe, selectFetchingRecord, selectDiscussionEntries, selectCompanyConfig, selectCoursesBase, selectVoiceRecording,
					selectAccessRoles, selectStudents, selectPersonConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let course = selectCoursesBase(state)
    course = course.length > 0 && props.params && props.params.courseEntryId && course.filter(m => m.courseEntryId === props.params.courseEntryId)[0]
		let discussion = selectDiscussionEntries(state) || {}

		// let rootPostsBy = discussion && discussion.firstLevelEntries && discussion.firstLevelEntries.length > 0
		// 		&& discussion.firstLevelEntries.map(m => ({ id: m.discussionEntryId, label: m.entryPersonFirstName + ' ' + m.entryPersonLastName}));
		//
		// let	postedSubjects = discussion && discussion.firstLevelEntries && discussion.firstLevelEntries.length > 0
		// 		&& discussion.firstLevelEntries.map(m => ({ id: m.discussionEntryId, label: m.subject }));
		if (discussion && discussion.firstLevelEntries) {
				discussion.firstLevelEntries = doSort(discussion.firstLevelEntries, { sortField: 'entryDate', isAsc: true, isNumber: false })
				discussion.discussionEntries = doSort(discussion.discussionEntries, { sortField: 'entryDate', isAsc: true, isNumber: false })
		}
		let participants = discussion && discussion.discussionEntries && discussion.discussionEntries.length > 0
				&& discussion.discussionEntries.reduce((acc, m) => {
						let isDupEntry = false
						acc && acc.length > 0 && acc.forEach(a => { if (a.id === m.personId) isDupEntry = true })
						let option = [{ id: m.personId, label: m.entryPersonFirstName + ' ' + m.entryPersonLastName }]
						return !isDupEntry
								? acc
										? acc.concat(option)
										: option
								: acc
				}, [])

		let entryReport = discussion && discussion.firstLevelEntries && discussion.firstLevelEntries.length > 0
				&& discussion.firstLevelEntries.map(m => (
					{
							assignmentId: m.assignmentId,
							discussionEntryId: m.discussionEntryId,
							subject: m.subject,
							entryDate: m.entryDate,
							personName: m.entryPersonFirstName + ' ' + m.entryPersonLastName }))

		participants = doSort(participants, { sortField: 'label', isAsc: true, isNumber: false })
		// rootPostsBy = doSort(rootPostsBy, { sortField: 'label', isAsc: true, isNumber: false })
		// postedSubjects = doSort(postedSubjects, { sortField: 'entryDate', isAsc: true, isNumber: false })

    return {
				personId: me.personId,
				langCode: me.langCode,
				entryPersonFirstName: me.fname,
        entryPersonLastName: me.lname,
        companyConfig: selectCompanyConfig(state),
        course,
        discussion,
				courseEntryId: props.params.courseEntryId,
        discussionEntryId: props.params.discussionEntryId,
        fetchingRecord: selectFetchingRecord(state),
        voiceRecording: selectVoiceRecording(state),
				accessRoles: selectAccessRoles(state),
				// rootPostsBy,
				// postedSubjects,
				participants,
				entryReport,
				students: selectStudents(state),
				personConfig: selectPersonConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		discussionEntriesInit: (personId, courseEntryId, assignmentId) => dispatch(actionDiscussionEntries.init(personId, courseEntryId, assignmentId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateDiscussionEntry: (personId, studentPersonId, courseEntryId, discussionEntry) => dispatch(actionDiscussionEntries.addOrUpdateDiscussionEntry(personId, studentPersonId, courseEntryId, discussionEntry)),
    removeDiscussionEntry: (personId, discussionEntryId) => dispatch(actionDiscussionEntries.removeDiscussionEntry(personId, discussionEntryId)),
		removeDiscussionEntryByAdmin: (personId, discussionEntryId, studentPersonId, whyRemove) => dispatch(actionDiscussionEntries.removeDiscussionEntryByAdmin(personId, discussionEntryId, studentPersonId, whyRemove)),
    saveDiscussionEntryWebsiteLink: (personId, discussionEntryId, websiteLink) => dispatch(actionDiscussionEntries.saveDiscussionEntryWebsiteLink(personId, discussionEntryId, websiteLink)),
    removeDiscussionEntryWebsiteLink: (personId, discussionWebsiteLinkId) => dispatch(actionDiscussionEntries.removeDiscussionEntryWebsiteLink(personId, discussionWebsiteLinkId)),
    removeDiscussionEntryFileUpload: (personId, discussionFileUploadId) => dispatch(actionDiscussionEntries.removeDiscussionEntryFileUpload(personId, discussionFileUploadId)),
		waitingForFileUpload: () => dispatch(actionFetchingRecord.waitingForFileUpload()),
		fileUploadHasArrived: () => dispatch(actionFetchingRecord.fileUploadHasArrived()),
    resolveFetchingRecordDiscussionEntries: () => dispatch(actionFetchingRecord.resolveFetchingRecordDiscussionEntries()),
    addVoiceRecording: (personId, discussionEntryId, blobThing) => dispatch(actionVoiceRecording.addVoiceRecording(personId, discussionEntryId, blobThing)),
    getVoiceRecording: (personId, discussionEntryId) => dispatch(actionVoiceRecording.getVoiceRecording(personId, discussionEntryId)),
		updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		getStudentSchedule: (personId, studentPersonId, schoolYearId) => dispatch(actionStudentSchedule.getStudentSchedule(personId, studentPersonId, schoolYearId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          const {getPageLangs, langCode, setMyVisitedPage, getVoiceRecording, courseEntryId, discussionEntriesInit, personId} = props
          getPageLangs(personId, langCode, 'DiscussionEntryView')
          discussionEntriesInit(personId, courseEntryId); //This calls just the first levels if the assignmentId is blank.
          getVoiceRecording(personId, '')
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Discussion Entry`})
      
  }, [])

  //const {course, fetchingRecord, voiceRecording} = props;
      //voiceRecording &&
      // return course && course.courseName && fetchingRecord && fetchingRecord.discussionEntries === "ready"
  		// 		? <DiscussionEntryView {...props} />
  		// 		: null;
  		return <DiscussionEntryView {...props} />
}

export default Container
