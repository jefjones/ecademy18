import React, {Component} from 'react';
import VolunteerOpportunityAddView from '../views/VolunteerOpportunityAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionVolunteerOpportunity from '../actions/volunteer-opportunity.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectVolunteerOpportunities, selectVolunteerTypes } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let volunteerOpportunities = selectVolunteerOpportunities(state);
		let volunteerOpportunityId = props.params && props.params.volunteerOpportunityId;
		let volunteerOpportunity = (volunteerOpportunityId && volunteerOpportunities && volunteerOpportunities.length > 0 && volunteerOpportunities.filter(m => m.volunteerOpportunityId === volunteerOpportunityId)[0]) || {};

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerOpportunity,
				volunteerOpportunityId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerOpportunities: (personId) => dispatch(actionVolunteerOpportunity.getVolunteerOpportunities(personId)),
		addOrUpdateVolunteerOpportunity: (personId, volunteerOpportunity) => dispatch(actionVolunteerOpportunity.addOrUpdateVolunteerOpportunity(personId, volunteerOpportunity)),
		removeVolunteerOpportunity: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteerOpportunity(personId, volunteerOpportunityId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerOpportunities} = this.props;
        getPageLangs(personId, langCode, 'VolunteerOpportunityAddView');
				getVolunteerOpportunities(personId)
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Volunteer Opportunity`});
    }

    render() {
        return <VolunteerOpportunityAddView {...this.props} />;
    }
}

export default storeConnector(Container);
