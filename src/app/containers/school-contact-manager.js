import React, {Component} from 'react';
import SchoolContactManagerView from '../views/SchoolContactManagerView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionSchoolContacts from '../actions/school-contact-manager';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionUsStates from '../actions/us-states';
import * as actionPersonConfig from '../actions/person-config';
import { selectMe, selectMyFrequentPlaces, selectSchoolContacts, selectFetchingRecord, selectUSStates, selectPersonConfig } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        schoolContacts: selectSchoolContacts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
        usStates: selectUSStates(state),
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getSchoolContacts: (personId) => dispatch(actionSchoolContacts.getSchoolContacts(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeSchoolContact: (personId, schoolContactId) => dispatch(actionSchoolContacts.removeSchoolContact(personId, schoolContactId)),
    removeSchoolContactFileUpload: (personId, fileUploadId) => dispatch(actionSchoolContacts.removeSchoolContactFileUpload(personId, fileUploadId)),
    addOrUpdateSchoolContact: (personId, schoolContact) => dispatch(actionSchoolContacts.addOrUpdateSchoolContact(personId, schoolContact)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    getUsStates: () => dispatch(actionUsStates.init()),
    setPersonConfigChoice: (personId, configKey, value) => dispatch(actionPersonConfig.setPersonConfigChoice(personId, configKey, value)),
})

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, getUsStates, setMyVisitedPage, getSchoolContacts, personId} = this.props;
        getPageLangs(personId, langCode, 'SchoolContactManagerView');
        getSchoolContacts(personId);
        getUsStates();
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `School Contact Manager (Jef)`});
    }

    render() {
        return <SchoolContactManagerView {...this.props} />;
    }
}

export default storeConnector(Container);
