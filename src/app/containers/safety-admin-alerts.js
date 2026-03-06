import React, {Component} from 'react';
import SafetyAdminAlertView from '../views/SafetyAdminAlertView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionGuardians from '../actions/guardians.js';
import * as actionSafetyAlert from '../actions/safety-alert.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectSafetyAlerts, selectGuardians, selectAccessRoles, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
				guardians: selectGuardians(state),
				safetyAlerts: selectSafetyAlerts(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getSafetyAlerts: (personId, safetyAlertId) => dispatch(actionSafetyAlert.getSafetyAlerts(personId, safetyAlertId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		confirmSafetyAlert: (personId, adminConfirm) => dispatch(actionSafetyAlert.confirmSafetyAlert(personId, adminConfirm)),
		dismissSafetyAlert: (personId, safetyAlertId) => dispatch(actionSafetyAlert.dismissSafetyAlert(personId, safetyAlertId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getSafetyAlerts, getGuardians} = this.props;
        getPageLangs(personId, langCode, 'SafetyAdminAlertView');
				getSafetyAlerts(personId)
				getGuardians(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Safety Alert (admin)`});
    }

    render() {
        return <SafetyAdminAlertView {...this.props} />;
    }
}

export default storeConnector(Container);
