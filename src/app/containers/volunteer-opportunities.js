import React, {Component} from 'react';
import VolunteerOpportunitiesView from '../views/VolunteerOpportunitiesView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionVolunteerOpportunity from '../actions/volunteer-opportunity.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectVolunteerOpportunities, selectVolunteerTypes, selectAccessRoles, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let volunteerOpportunities = selectVolunteerOpportunities(state);
		//We need to get a distinct list of volunteers for the drop down list.
		let volunteerList = [];
		volunteerOpportunities && volunteerOpportunities.volunteers && volunteerOpportunities.volunteers.length > 0 && volunteerOpportunities.volunteers.forEach(m => {
				let hasRecord = false;
				volunteerList && volunteerList.length > 0 && volunteerList.forEach(v => {
						if (v.id === m.id) hasRecord = true;
				})
				if (!hasRecord) {
						volunteerList = volunteerList.concat({id: m.id, label: m.label });
				}
		});


    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerOpportunities,
				accessRoles: selectAccessRoles(state),
				volunteerList,
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerOpportunities: (personId) => dispatch(actionVolunteerOpportunity.getVolunteerOpportunities(personId)),
		removeVolunteerOpportunity: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteerOpportunity(personId, volunteerOpportunityId)),
		addVolunteer: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.addVolunteer(personId, volunteerOpportunityId)),
		removeVolunteer: (personId, volunteerOpportunityId) => dispatch(actionVolunteerOpportunity.removeVolunteer(personId, volunteerOpportunityId)),
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
        getPageLangs(personId, langCode, 'VolunteerOpportunitiesView');
				getVolunteerOpportunities(personId)
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Volunteer Opportunities`});
    }

    render() {
        return <VolunteerOpportunitiesView {...this.props} />;
    }
}

export default storeConnector(Container);
