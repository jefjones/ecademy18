import React, {Component} from 'react';
import VolunteerCheckInOutView from '../views/VolunteerCheckInOutView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionVolunteerEvent from '../actions/volunteer-event.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectVolunteerEvents, selectVolunteerTypes } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let volunteerEvents = selectVolunteerEvents(state);

		let volunteerEventId = props.params && props.params.volunteerEventId;
		volunteerEvents = volunteerEventId
				? volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.filter(m => m.volunteerEventId === volunteerEventId)
				: volunteerEvents;

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerEvents,
				volunteerEventId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerEvents: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.getVolunteerEvents(personId, volunteerEventId)),
		addVolunteerEvent: (personId, volunteerEvent) => dispatch(actionVolunteerEvent.addVolunteerEvent(personId, volunteerEvent)),
		setVolunteerCheckOut: (personId, checkOutDetails) => dispatch(actionVolunteerEvent.setVolunteerCheckOut(personId, checkOutDetails)),
		removeVolunteerHours: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.removeVolunteerHours(personId, volunteerEventId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getVolunteerEvents} = this.props;
				getVolunteerEvents(personId)
        getPageLangs(personId, langCode, 'VolunteerCheckInOutView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Volunteer check-in/out`});
    }

    render() {
        return <VolunteerCheckInOutView {...this.props} />;
    }
}

export default storeConnector(Container);
