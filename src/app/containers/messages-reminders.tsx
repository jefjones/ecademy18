import { useEffect } from 'react'
import MessagesAndRemindersView from '../views/MessagesAndRemindersView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionAnnouncement from '../actions/announcements'
import * as actionCountsMainMenu from '../actions/counts-main-menu'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFetchingRecord, selectPersonConfig, selectCoursesBase, selectStudents, selectUsers,
            selectCountsMainMenu, selectCalendarEvents, selectAccessRoles, selectCompanyConfig, selectAnnouncementList,
						selectAnnouncementsSentBy, selectAnnouncementsDeleted, selectMessageFullThread, selectMyProfile, selectMyFrequentPlaces} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let counts = selectCountsMainMenu(state)
		counts = counts && counts.messages

    return {
        accessRoles: selectAccessRoles(state),
        langCode: me.langCode,
        calendarEvents: selectCalendarEvents(state) || [],
        personId:  me.personId,
        firstName:  selectMyProfile(state).fname,
        students: selectStudents(state),
        facilitators: selectUsers(state, 'Facilitator'),
        mentors: selectUsers(state, 'Mentor'),
        fetchingRecord: selectFetchingRecord(state),
        personConfig: selectPersonConfig(state),
        courseEntries: selectCoursesBase(state),
        counts,
        companyConfig: selectCompanyConfig(state),
				announcementList: selectAnnouncementList(state),
				announcementsSentBy: selectAnnouncementsSentBy(state),
				announcementsDeleted: selectAnnouncementsDeleted(state),
				messageFullThread: selectMessageFullThread(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		removeAnnouncement: (personId, announcementId, recipientPersonId, listType, deleteType) => dispatch(actionAnnouncement.removeAnnouncement(personId, announcementId, recipientPersonId, listType, deleteType)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
		setAsSeenByRecipient: (personId, announcementId) => dispatch(actionAnnouncement.setAsSeenByRecipient(personId, announcementId)),
		getAnnouncementsRecipient: (personId) => dispatch(actionAnnouncement.getAnnouncementsRecipient(personId)),
		getAnnouncementsSentBy: (personId) => dispatch(actionAnnouncement.getAnnouncementsSentBy(personId)),
		getAnnouncementsDeleted: (personId) => dispatch(actionAnnouncement.getAnnouncementsDeleted(personId)),
		clearAnnouncementList: () => dispatch(actionAnnouncement.clearAnnouncementList()),
		getMessageSingleFullThread: (personId) => dispatch(actionAnnouncement.getMessageSingleFullThread(personId)),
		getCountsMessages: (personId) => dispatch(actionCountsMainMenu.getCountsMessages(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getAnnouncementsRecipient, getCountsMessages} = props
    				getPageLangs(personId, langCode, 'MessagesAndRemindersView')
    				getAnnouncementsRecipient(personId)
    				getCountsMessages(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: ``})
        
  }, [])

  const {accessRoles} = props
          return accessRoles ? <MessagesAndRemindersView {...props} /> : null
}

export default Container
