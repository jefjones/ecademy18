import React, {Component} from 'react';
import AssignLockerView from '../views/AssignLockerView';
import * as actionLockers from '../actions/lockers';
import * as actionPageLang from '../actions/language-list';
import * as actionPaddlelocks from '../actions/paddlelocks';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import { connect } from 'react-redux';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectLockers, selectPaddlelocks, selectLockerStudentAssigns, selectCompanyConfig,
					selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    return {
        personId: me.personId,
        langCode: me.langCode,
				students: selectStudents(state),
				lockers: selectLockers(state),
				padlocks: selectPaddlelocks(state),
				lockerStudentAssigns: selectLockerStudentAssigns(state),
				companyConfig: selectCompanyConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		removeLockerStudentAssign: (personId, lockerStudentAssignId) => dispatch(actionLockers.removeLockerStudentAssign(personId, lockerStudentAssignId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getLockerStudentAssign: (personId) => dispatch(actionLockers.getLockerStudentAssign(personId)),
		getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
		getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
		setLockerStudentAssign: (personId, assign) => dispatch(actionLockers.setLockerStudentAssign(personId, assign)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getLockerStudentAssign, getLockers, getPaddlelocks} = this.props;
				getPageLangs(personId, langCode, 'AssignLockerView');
				getLockerStudentAssign(personId);
				getLockers(personId);
				getPaddlelocks(personId);
				this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Assign Locker`});
		}

    render() {
        return <AssignLockerView {...this.props} />;
    }
}

export default storeConnector(Container);
