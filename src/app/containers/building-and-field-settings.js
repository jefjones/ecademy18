import React, {Component} from 'react';
import BuildingAndFieldSettingsView from '../views/BuildingAndFieldSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig, selectMapDirections } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
        langCode: me.langCode,
        personId: me.personId,
        personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				mapDirections: selectMapDirections(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		addOrUpdateBuildingAndField: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateBuildingAndField(personId, incomingRecord)),
		addOrUpdateBuildingAndFielddLevel: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateBuildingAndFielddLevel(personId, incomingRecord)),
		addOrUpdateLevelEntrance: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateLevelEntrance(personId, incomingRecord)),
		addOrUpdateRoom: (personId, incomingRecord) => dispatch(actionBuildingAndFieldSettings.addOrUpdateRoom(personId, incomingRecord)),
		deleteRecord: (personId, recordType, recordId) => dispatch(actionBuildingAndFieldSettings.deleteRecord(personId, recordType, recordId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
		mapStateToProps,
		bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
	      const {getPageLangs, langCode, setMyVisitedPage, getBuildingAndFieldSettings, personId} = this.props;
	      getPageLangs(personId, langCode, 'BuildingAndFieldSettingsView');
				getBuildingAndFieldSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Building and Field Settings`});
	  }

	  render() {
	    	return <BuildingAndFieldSettingsView {...this.props} />;
	  }
}

export default storeConnector(Container);
