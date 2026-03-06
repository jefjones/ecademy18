import React, {Component} from 'react';
import DoctorNoteInviteListView from '../views/DoctorNoteInviteListView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {returnDistinctList} from '../utils/javascriptUtils.js';
import { selectMe, selectFetchingRecord, selectAccessRoles, selectCompanyConfig, selectDoctorNoteInvites } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let doctorNoteInvites = selectDoctorNoteInvites(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				doctorNoteInvites,
				doctorList: returnDistinctList(doctorNoteInvites, 'doctorPersonId', 'doctorOfficeName'),
				doctorEmailAddressList: returnDistinctList(doctorNoteInvites, 'doctorEmailAddress', 'doctorEmailAddress'),
				studentList: returnDistinctList(doctorNoteInvites, 'studentPersonId', 'studentName'),
				fetchingRecord: selectFetchingRecord(state),
				accessRoles: selectAccessRoles(state),
				companyConfig: selectCompanyConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getDoctorNoteInvites: (personId) => dispatch(actionDoctorNoteInvite.getDoctorNoteInvites(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeDoctorNoteInvite: (personId, doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.removeDoctorNoteInvite(personId, doctorNoteInviteId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getDoctorNoteInvites, personId} = this.props;
        getPageLangs(personId, langCode, 'DoctorNoteInviteListView');
        getDoctorNoteInvites(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Doctor Note Invite List`});
    }

    render() {
        return <DoctorNoteInviteListView {...this.props} />;
    }
}

export default storeConnector(Container);
