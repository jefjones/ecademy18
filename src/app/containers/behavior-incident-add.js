import React, {Component} from 'react';
import BehaviorIncidentAddView from '../views/BehaviorIncidentAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionBehaviorIncident from '../actions/behavior-incident.js';
import * as actionBehaviorIncidentTypes from '../actions/behavior-incident-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectUsers, selectBehaviorIncidentTypes, selectBehaviorIncidentResponseTypes, selectStudents, selectBehaviorIncidents,
 					selectAccessRoles, selectMyFrequentPlaces} from '../store.js';


const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let behaviorIncidentList = selectBehaviorIncidents(state);
    let behaviorIncidentTypes = selectBehaviorIncidentTypes(state);
    let behaviorIncidentId = props.params && props.params.behaviorIncidentId;
		let behaviorIncident = behaviorIncidentId && behaviorIncidentList && behaviorIncidentList.length > 0 && behaviorIncidentList.filter(m => m.behaviorIncidentId === behaviorIncidentId)[0];
    if (behaviorIncident && behaviorIncident.behaviorIncidentId) {
        let time = behaviorIncident.incidentDate;
        behaviorIncident.incidentTime = time.indexOf('T') > -1 ? time.substring(time.indexOf('T')+1,time.indexOf('T')+6) : '';
        let parentTime = behaviorIncident.parentContactDateTime;
        behaviorIncident.parentContactTime = parentTime && parentTime.length > 0 && parentTime.indexOf('T') > -1 ? parentTime.substring(parentTime.indexOf('T')+1, parentTime.indexOf('T')+6) : '';
        behaviorIncident.shouldAdminFollowUpStudent = behaviorIncident.shouldAdminFollowUpStudent && behaviorIncident.shouldAdminFollowUpStudent !== 'false' ? 'true' : 'false';
        behaviorIncident.haveParentsBeenContacted = behaviorIncident.haveParentsBeenContacted && behaviorIncident.haveParentsBeenContacted !== 'false' ? 'true' : 'false';
        behaviorIncident.planToContactParents = behaviorIncident.planToContactParents && behaviorIncident.planToContactParents !== 'false' ? 'true' : 'false';
        //The behaviorIncidentTypeChoices need to be split up into their level (remember only one level group can be chosen), and then behaviorIncidentTypeChoices needs to be cut
        //    back to an array of Ids and not the full data object.
        behaviorIncident.teacherResponses = behaviorIncident.adminTeacherResponses && behaviorIncident.adminTeacherResponses.length > 0
                                  && behaviorIncident.adminTeacherResponses.filter(m => m.adminOrTeacher === "Teacher")
                                      .reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.behaviorIncidentResponseTypeId) : [m.behaviorIncidentResponseTypeId], []);
        behaviorIncident.adminResponses = behaviorIncident.adminTeacherResponses && behaviorIncident.adminTeacherResponses.length > 0
                                && behaviorIncident.adminTeacherResponses.filter(m => m.adminOrTeacher === "Admin")
                                    .reduce((acc, m) => acc && acc.length > 0 ? acc.concat(m.behaviorIncidentResponseTypeId) : [m.behaviorIncidentResponseTypeId], []);
        behaviorIncident.behaviorIncidentTypeChoices1 = behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 1).reduce((acc, m) => {
            behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.forEach(b => {
                if (b.id === m.id) acc = acc && acc.length > 0 ? acc.concat(b.id) : [b.id];
            })
            return acc;
        }, []);
        behaviorIncident.behaviorIncidentTypeChoices2 = behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 2).reduce((acc, m) => {
            behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.forEach(b => {
                if (b.id === m.id) acc = acc && acc.length > 0 ? acc.concat(b.id) : [b.id];
            })
            return acc;
        }, []);
        behaviorIncident.behaviorIncidentTypeChoices3 = behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 3).reduce((acc, m) => {
            behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.forEach(b => {
                if (b.id === m.id) acc = acc && acc.length > 0 ? acc.concat(b.id) : [b.id];
            })
            return acc;
        }, []);
        // behaviorIncident.behaviorIncidentTypeChoices = behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.reduce((acc, m) =>
        //     acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
				behaviorIncident,
        behaviorIncidentId,
        behaviorIncidentList,
				behaviorIncidentTypes,
				behaviorIncidentResponseTypes: selectBehaviorIncidentResponseTypes(state),
				students: selectStudents(state),
				facilitators: selectUsers(state, 'Facilitator'),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getResponseTypes: (personId) => dispatch(actionBehaviorIncidentTypes.getResponseTypes(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeBehaviorIncidentFile: (personId, behaviorIncidentId) => dispatch(actionBehaviorIncident.removeBehaviorIncidentFile(personId, behaviorIncidentId)),
    setBehaviorIncidentEdit: (behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes) => dispatch(actionBehaviorIncident.setBehaviorIncidentEdit(behaviorIncidentList, behaviorIncidentId, behaviorIncidentTypes)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    addOrUpdateBehaviorIncident: (personId, behaviorIncident) => dispatch(actionBehaviorIncident.addOrUpdateBehaviorIncident(personId, behaviorIncident)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage} = this.props;
        getPageLangs(personId, langCode, 'BehaviorIncidentAddView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Behavior Incident`});
    }

    render() {
        return <BehaviorIncidentAddView {...this.props} />;
    }
}

export default storeConnector(Container);
