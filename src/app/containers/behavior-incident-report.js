import React, {Component} from 'react';
import BehaviorIncidentReportView from '../views/BehaviorIncidentReportView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBehaviorIncident from '../actions/behavior-incident.js';
import * as actionBehaviorIncidentTypes from '../actions/behavior-incident-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectUsers, selectBehaviorIncidentTypes, selectBehaviorIncidentResponseTypes, selectStudents, selectBehaviorIncidents,
 					selectAccessRoles, selectMyFrequentPlaces, selectGradeLevels, selectBehaviorIncidentFilterGroups} from '../store.js';


const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        behaviorIncidents: selectBehaviorIncidents(state),
				behaviorIncidentTypes: selectBehaviorIncidentTypes(state),
				behaviorIncidentResponseTypes: selectBehaviorIncidentResponseTypes(state),
        filterGroups: selectBehaviorIncidentFilterGroups(state),
        gradeLevels: selectGradeLevels(state),
				students: selectStudents(state),
				facilitators: selectUsers(state, 'Facilitator'),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getBehaviorIncidents: (personId) => dispatch(actionBehaviorIncident.getBehaviorIncidents(personId)),
		getResponseTypes: (personId) => dispatch(actionBehaviorIncidentTypes.getResponseTypes(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeBehaviorIncidentFile: (personId, behaviorIncidentId) => dispatch(actionBehaviorIncident.removeBehaviorIncidentFile(personId, behaviorIncidentId)),
    setBehaviorIncidentEdit: (behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes) => dispatch(actionBehaviorIncident.setBehaviorIncidentEdit(behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    addOrUpdateBehaviorIncident: (personId, behaviorIncident) => dispatch(actionBehaviorIncident.addOrUpdateBehaviorIncident(personId, behaviorIncident)),
    getFilterGroups: (personId) => dispatch(actionBehaviorIncident.getFilterGroups(personId)),
		addOrUpdateFilterGroup: (personId, messageGroup) => dispatch(actionBehaviorIncident.addOrUpdateFilterGroup(personId, messageGroup)),
		removeFilterGroup: (personId, messageGroupId) => dispatch(actionBehaviorIncident.removeFilterGroup(personId, messageGroupId)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {personId, getBehaviorIncidents, getFilterGroups, getPageLangs, langCode, setMyVisitedPage} = this.props;
        getPageLangs(personId, langCode, 'BehaviorIncidentReportView');
        getFilterGroups(personId);
        getBehaviorIncidents(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Behavior Incident Report`});
    }

    render() {
        return <BehaviorIncidentReportView {...this.props} />;
    }
}

export default storeConnector(Container);
