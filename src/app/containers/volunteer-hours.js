import React, {Component} from 'react';
import VolunteerHoursView from '../views/VolunteerHoursView';
import {doSort} from '../utils/sort.js';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';
import * as actionVolunteerEvent from '../actions/volunteer-event.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectVolunteerEvents, selectVolunteerTypes, selectStudents, selectGuardians, selectAccessRoles,
 						selectFetchingRecord} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let volunteerEvents = selectVolunteerEvents(state);
		let volunteerList = [];
		volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.forEach(m => {
				let foundRecord = false;
				volunteerList && volunteerList.length > 0 && volunteerList.forEach(v => {
						if (v.id === m.volunteerPersonId) foundRecord = true;
				})
				if (!foundRecord) volunteerList = volunteerList.concat({id: m.volunteerPersonId, label: m.volunteerPersonName});
		})

		volunteerList = doSort(volunteerList, { sortField: 'label', isAsc: true, isNumber: false });

    return {
        personId: me.personId,
        langCode: me.langCode,
				volunteerTypes: selectVolunteerTypes(state),
				volunteerEvents,
				volunteerList,
				students: selectStudents(state),
				guardians: selectGuardians(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
	  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getVolunteerEvents: (personId, volunteerEventId) => dispatch(actionVolunteerEvent.getVolunteerEvents(personId, volunteerEventId)),
		addVolunteerEvent: (personId, volunteerEvent) => dispatch(actionVolunteerEvent.addVolunteerEvent(personId, volunteerEvent)),
		confirmVolunteerHour: (personId, adminConfirm) => dispatch(actionVolunteerEvent.confirmVolunteerHour(personId, adminConfirm)),
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
        getPageLangs(personId, langCode, 'VolunteerHoursView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Volunteer Hours`});
    }

    render() {
        return <VolunteerHoursView {...this.props} />;
    }
}

export default storeConnector(Container);
