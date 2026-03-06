import React, {Component} from 'react';
import AnnouncementManageView from '../views/AnnouncementManageView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionAnnouncement from '../actions/announcements';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectAnnouncementsAdmin, selectCompanyConfig } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let announcements = selectAnnouncementsAdmin(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        announcements,
        companyConfig: selectCompanyConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getAnnouncementsAdmin: (personId) => dispatch(actionAnnouncement.getAnnouncementsAdmin(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeAnnouncementAdmin: (personId, announcementId) => dispatch(actionAnnouncement.removeAnnouncementAdmin(personId, announcementId)),
		setStudentsSelected: (studentList, reply_announcementId) => dispatch(actionAnnouncement.setStudentsSelected(studentList, reply_announcementId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
    mergeAllProps
);

class Container extends Component {
  componentDidMount() {
	    const {getPageLangs, langCode, setMyVisitedPage, getAnnouncementsAdmin, personId} = this.props;
	    getPageLangs(personId, langCode, 'AnnouncementManageView');
	    getAnnouncementsAdmin(personId);
      this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Manage Announcements`});
  }

  render() {
    	return <AnnouncementManageView {...this.props} />;
  }
}

export default storeConnector(Container);
