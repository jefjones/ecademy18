import React, {Component} from 'react';
import BuildingAndFieldFrequentMineView from '../views/BuildingAndFieldFrequentMineView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBuildingAndFieldSettings from '../actions/building-and-field-settings.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectBuildingAndFieldTreeExplorer, selectPersonConfig, selectCompanyConfig } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        buildingAndFieldTreeExplorer: selectBuildingAndFieldTreeExplorer(state),
        langCode: me.langCode,
        personId: me.personId,
        personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getBuildingAndFieldSettings: (personId) => dispatch(actionBuildingAndFieldSettings.getBuildingAndFieldSettings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleExpanded: (personId, id, forceExpanded) => dispatch(actionBuildingAndFieldSettings.toggleExpanded(personId, id, forceExpanded)),
		toggleAllExpanded: (personId, expandAll) => dispatch(actionBuildingAndFieldSettings.toggleAllExpanded(personId, expandAll)),
		toggleFrequentMine: (personId, recordType, recordId) => dispatch(actionBuildingAndFieldSettings.toggleFrequentMine(personId, recordType, recordId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
		mapStateToProps,
		bindActionsToDispatch,
);

class Container extends Component {
	  componentDidMount() {
	      const {getPageLangs, langCode, setMyVisitedPage, getBuildingAndFieldSettings, personId} = this.props;
	      getPageLangs(personId, langCode, 'BuildingAndFieldFrequentMineView');
				getBuildingAndFieldSettings(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `My Building and Field Places`});
    }

	  render() {
	    	return <BuildingAndFieldFrequentMineView {...this.props} />;
	  }
}

export default storeConnector(Container);
