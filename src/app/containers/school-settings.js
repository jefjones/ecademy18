import React, {Component} from 'react';
import SchoolSettingsView from '../views/SchoolSettingsView';
import NotFound from '../components/Error';
import * as actionPageLang from '../actions/language-list';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionLogin from '../actions/login';
import * as actionCompanyDocuments from '../actions/company-documents.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { connect } from 'react-redux';
import {selectMe, selectMyFrequentPlaces, selectCompanyConfig, selectSchoolYears, selectUsers, selectIntervals, selectAccessRoles} from '../store.js';

const mapStateToProps = (state, props) => {
	let me = selectMe(state);
    return {
			personId: me.personId,
			langCode: me.langCode,
			companyConfig: selectCompanyConfig(state),
			schoolYears: selectSchoolYears(state),
			intervals: selectIntervals(state),
			admins: selectUsers(state, 'Admin'),
			frontDesks: selectUsers(state, 'FrontDesk'),
			counselors: selectUsers(state, 'Counselor'),
			myFrequentPlaces: selectMyFrequentPlaces(state),
      accessRoles: selectAccessRoles(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getCompanyConfig: (personId) => dispatch(actionCompanyConfig.init(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setCompanyConfig: (personId, field, value) => dispatch(actionCompanyConfig.setCompanyConfig(personId, field, value)),
		removeLogoFileUpload: (personId, logoFileUploadId) => dispatch(actionCompanyConfig.removeLogoFileUpload(personId, logoFileUploadId)),
		removeSignatureFileUpload: (personId, signatureFileUploadId) => dispatch(actionCompanyConfig.removeSignatureFileUpload(personId, signatureFileUploadId)),
		removeOfficialSealFileUpload: (personId, officialSealFileUploadId) => dispatch(actionCompanyConfig.removeOfficialSealFileUpload(personId, officialSealFileUploadId)),
		removeDemoRecords: (personId) => dispatch(actionLogin.removeDemoRecords(personId)),
		saveCompanyWebsiteLink: (personId, courseEntryId, websiteLink, websiteTitle) => dispatch(actionCompanyDocuments.saveCompanyWebsiteLink(personId, courseEntryId, websiteLink, websiteTitle)),
		removeCompanyDocumentFile: (personId, courseDocumentId, fileUploadId) => dispatch(actionCompanyDocuments.removeCompanyDocumentFile(personId, courseDocumentId, fileUploadId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'SchoolSettingsView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `School Settings`});
    }

    render() {
        const {accessRoles} = this.props;
        return accessRoles.admin ? <SchoolSettingsView {...this.props} /> : <NotFound />
    }
}

export default storeConnector(Container);
