import React, {Component} from 'react';
import LockerAssignmentsView from '../views/LockerAssignmentsView';
import * as actionLockers from '../actions/lockers';
import * as actionPageLang from '../actions/language-list';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionPaddlelocks from '../actions/paddlelocks';
import * as actionStudent from '../actions/student.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { connect } from 'react-redux';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectLockers, selectPaddlelocks, selectLockerStudentAssigns, selectCompanyConfig,
 					selectPersonConfig, selectStudentChosenSession} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let personConfig = selectPersonConfig(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
				lockers: selectLockers(state),
				padlocks: selectPaddlelocks(state),
				lockerStudentAssigns: selectLockerStudentAssigns(state),
				personConfig,
				studentPersonId: selectStudentChosenSession(state),
				companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		removeLockerStudentAssign: (personId, lockerStudentAssignId) => dispatch(actionLockers.removeLockerStudentAssign(personId, lockerStudentAssignId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLockerStudentAssign: (personId) => dispatch(actionLockers.getLockerStudentAssign(personId)),
		getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
		getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setStudentChosenSession: (studentPersonId) => dispatch(actionStudent.setStudentChosenSession(studentPersonId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getLockerStudentAssign, getLockers, getPaddlelocks} = this.props;
				getPageLangs(personId, langCode, 'LockerAssignmentsView');
				getLockerStudentAssign(personId);
				getLockers(personId);
				getPaddlelocks(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Locker Assignments`});
		}

    render() {
        return <LockerAssignmentsView {...this.props} />;
    }
}

export default storeConnector(Container);
