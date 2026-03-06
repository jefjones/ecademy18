import React, {Component} from 'react';
import SafetyAlertAddView from '../views/SafetyAlertAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings.js';
import * as actionSafetyAlert from '../actions/safety-alert.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig, selectSafetyAlertTypes,
					selectSafetyAlerts } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    return {
				buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
				langCode: me.langCode,
				personId: me.personId,
				personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				safetyAlertTypes: selectSafetyAlertTypes(state),
				safetyAlerts: selectSafetyAlerts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getSafetyAlerts: (personId, safetyAlertId) => dispatch(actionSafetyAlert.getSafetyAlerts(personId, safetyAlertId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addSafetyAlert: (personId, fileData, safetyAlertTypeId, note) => dispatch(actionSafetyAlert.addSafetyAlert(personId, fileData, safetyAlertTypeId, note)),
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		toggleSafetyAlertLocation: (personId, recordType, recordId) => dispatch(actionSafetyAlert.toggleSafetyAlertLocation(personId, recordType, recordId)),
		clearSafetyAlertLocations: (personId) => dispatch(actionSafetyAlert.clearSafetyAlertLocations(personId)),
		clearBuildingAndFieldSettings: () => dispatch(actionBuildingAndFieldSettings.clearBuildingAndFieldSettings()),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		constructor(props) {
		    super(props);

		    this.state = {
						isNotFirstTime: false,
				}
		}

    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getBuildingAndFieldSettings, clearSafetyAlertLocations, getSafetyAlerts} = this.props;
        getPageLangs(personId, langCode, 'SafetyAlertAddView');
				getSafetyAlerts(personId)
				getBuildingAndFieldSettings(personId);
				if (!this.state.isNotFirstTime) {
						clearSafetyAlertLocations(personId);
						this.setState({ isNotFirstTime: true });
				}
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Safety Alert`});
    }

    render() {
        return <SafetyAlertAddView {...this.props} />;
    }
}

export default storeConnector(Container);
