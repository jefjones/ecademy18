import React, {Component} from 'react';
import DoctorInviteLoginView from '../views/DoctorInviteLoginView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionDoctorNoteInvite from '../actions/doctor-note-invite';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionUsStates from '../actions/us-states';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectAccessRoles, selectCompanyConfig, selectDoctorNoteInvites, selectUSStates } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let doctorNoteInviteId = props.params && props.params.doctorNoteInviteId;
		let doctorNoteInvites = selectDoctorNoteInvites(state);
		let doctorNoteInvite = doctorNoteInviteId &&  doctorNoteInvites && doctorNoteInvites.length > 0 && doctorNoteInvites.filter(m => m.doctorNoteInviteId === doctorNoteInviteId)[0];

    return {
				loginData: me,
				langCode: me.langCode,
				doctorNoteInvite,
				accessRoles: selectAccessRoles(state),
				doctorNoteInviteId,
				companyConfig: selectCompanyConfig(state),
				usStates: selectUSStates(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getCompanyConfig: (personId, schoolCode, doctorNoteInviteId) => dispatch(actionCompanyConfig.init(personId, schoolCode, doctorNoteInviteId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getDoctorNoteInvites: (personId) => dispatch(actionDoctorNoteInvite.getDoctorNoteInvites(personId)),
		setDoctorNoteInviteIdLogin: (doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.setDoctorNoteInviteIdLogin(doctorNoteInviteId)),
		loginDoctorOffice: (office, doctorNoteInviteId) => dispatch(actionDoctorNoteInvite.loginDoctorOffice(office, doctorNoteInviteId)),
		getUsStates: () => dispatch(actionUsStates.init()),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
	  mapStateToProps,
	  bindActionsToDispatch,
);

class HomeContainer extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, setMyVisitedPage, getCompanyConfig, getDoctorNoteInvites, loginData, doctorNoteInviteId, setDoctorNoteInviteIdLogin, getUsStates} = this.props;
				getPageLangs(personId, langCode, 'DoctorInviteLoginView');
				getCompanyConfig(loginData && loginData.personId, '', doctorNoteInviteId);
				getDoctorNoteInvites(loginData && loginData.personId, doctorNoteInviteId);
				setDoctorNoteInviteIdLogin(doctorNoteInviteId);
				getUsStates();
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Doctor Invite Login`});
		}

	  render() {
	    	return <DoctorInviteLoginView {...this.props} />
	  }
}

export default storeConnector(HomeContainer);
