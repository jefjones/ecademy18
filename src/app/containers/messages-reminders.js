import React, {Component} from 'react';
import MessagesAndRemindersView from '../views/MessagesAndRemindersView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionAnnouncement from '../actions/announcements.js';
import * as actionCountsMainMenu from '../actions/counts-main-menu.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFetchingRecord, selectPersonConfig, selectCoursesBase, selectStudents, selectUsers,
            selectCountsMainMenu, selectCalendarEvents, selectAccessRoles, selectCompanyConfig, selectAnnouncementList,
						selectAnnouncementsSentBy, selectAnnouncementsDeleted, selectMessageFullThread, selectMyProfile, selectMyFrequentPlaces} from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let counts = selectCountsMainMenu(state);
		counts = counts && counts.messages;

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
};

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
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getAnnouncementsRecipient, getCountsMessages} = this.props;
				getPageLangs(personId, langCode, 'MessagesAndRemindersView');
				getAnnouncementsRecipient(personId);
				getCountsMessages(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: ``});
    }

    render() {
        const {accessRoles} = this.props;
        return accessRoles ? <MessagesAndRemindersView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
