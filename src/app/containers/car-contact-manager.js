import React, {Component} from 'react';
import CarContactManagerView from '../views/CarContactManagerView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionCarContacts from '../actions/car-contact-manager';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionUsStates from '../actions/us-states';
import * as actionPersonConfig from '../actions/person-config';
import { selectMe, selectMyFrequentPlaces, selectCarContacts, selectFetchingRecord, selectUSStates, selectPersonConfig } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        carContacts: selectCarContacts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
        usStates: selectUSStates(state),
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getCarContacts: (personId) => dispatch(actionCarContacts.getCarContacts(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeCarContact: (personId, carContactId) => dispatch(actionCarContacts.removeCarContact(personId, carContactId)),
    removeCarContactFileUpload: (personId, fileUploadId) => dispatch(actionCarContacts.removeCarContactFileUpload(personId, fileUploadId)),
    addOrUpdateCarContact: (personId, carContact) => dispatch(actionCarContacts.addOrUpdateCarContact(personId, carContact)),
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
        const {getPageLangs, langCode, getUsStates, setMyVisitedPage, getCarContacts, personId} = this.props;
        getPageLangs(personId, langCode, 'CarContactManagerView');
        getCarContacts(personId);
        getUsStates();
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Car Contact Manager (Jef)`});
    }

    render() {
        return <CarContactManagerView {...this.props} />;
    }
}

export default storeConnector(Container);
