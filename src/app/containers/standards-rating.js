import React, {Component} from 'react';
import StandardsRatingSettingsView from '../views/StandardsRatingSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionStandardsRating from '../actions/standards-rating';
//import {doSort} from '../utils/sort.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectStandardsRating, selectFetchingRecord, selectPersonConfig } from '../store.js';
import {doSort} from '../utils/sort.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);
		let gradeLevels = personConfig && personConfig.gradeLevels;
		let standardsRatings = selectStandardsRating(state);

		let standardsRatingTables = standardsRatings && standardsRatings.length > 0 && standardsRatings.reduce((acc, m) => {
				let alreadyEntered = false;
				acc && acc.length > 0 && acc.forEach(g => {
					if (m.standardsRatingTableId === g.id) alreadyEntered = true;
				})
				if (!alreadyEntered) {
						let scaleGradeLevels = doSort(m.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true });
						let fromGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[0].name;
						let toGradeLevelName = scaleGradeLevels && scaleGradeLevels.length > 0 && scaleGradeLevels[scaleGradeLevels.length-1*1].name;
						let standardsRatingNameChosen = `${m.standardsRatingName} (${fromGradeLevelName} - ${toGradeLevelName})`;
						let option = {
								id: m.standardsRatingTableId,
								label: standardsRatingNameChosen,
                isLevelOnly: m.isLevelOnly,
						};
						acc = acc ? acc.concat(option) : [option];
				}
				return acc;
		}, []);

    return {
        personId: me.personId,
        langCode: me.langCode,
				gradeLevels,
        standardsRatings,
				fetchingRecord: selectFetchingRecord(state),
				standardsRatingTables,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
		getStandardsRating: (personId) => dispatch(actionStandardsRating.getStandardsRating(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setStandardsRatingColor: (personId, standardsRatingDetailId, color) => dispatch(actionStandardsRating.setStandardsRatingColor(personId, standardsRatingDetailId, color)),
		removeStandardsRatingDetail: (personId, standardsRatingDetailId) => dispatch(actionStandardsRating.removeStandardsRatingDetail(personId, standardsRatingDetailId)),
    removeStandardsRatingTable: (personId, standardsRatingTableId) => dispatch(actionStandardsRating.removeStandardsRatingTable(personId, standardsRatingTableId)),
    addOrUpdateStandardsRatingDetail: (personId, standardsRatingDetail) => dispatch(actionStandardsRating.addOrUpdateStandardsRatingDetail(personId, standardsRatingDetail)),
		addOrUpdateStandardsRatingTable: (personId, newStandardsRatingName, fromGradeLevelId, toGradeLevelId, standardsRatingTableId, isLevelOnly) => dispatch(actionStandardsRating.addOrUpdateStandardsRatingTable(personId, newStandardsRatingName, fromGradeLevelId, toGradeLevelId, standardsRatingTableId, isLevelOnly)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getStandardsRating, personId} = this.props;
        getPageLangs(personId, langCode, 'StandardsRatingSettingsView');
        getStandardsRating(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Standards Ratings`});
    }

    render() {
        return <StandardsRatingSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
