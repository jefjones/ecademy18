import React, {Component} from 'react';
import CurbsideAdminCheckInOrOutView from '../views/CurbsideAdminCheckInOrOutView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionGuardians from '../actions/guardians.js';
import * as actionCheckInOrOut from '../actions/curbside-check-in-out.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectCheckInOrOuts, selectGuardians, selectAccessRoles, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        students: selectStudents(state),
				guardians: selectGuardians(state),
				checkInOrOuts: selectCheckInOrOuts(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getCheckInOrOuts: (personId, curbsideCheckInOrOutId) => dispatch(actionCheckInOrOut.getCheckInOrOuts(personId, curbsideCheckInOrOutId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGuardians: (personId) => dispatch(actionGuardians.init(personId)),
		confirmCheckInOrOut: (personId, adminConfirm) => dispatch(actionCheckInOrOut.confirmCheckInOrOut(personId, adminConfirm)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getCheckInOrOuts, getGuardians} = this.props;
        getPageLangs(personId, langCode, 'CurbsideAdminCheckInOrOutView');
				getCheckInOrOuts(personId)
				getGuardians(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Curbside Check-in/out (admin)`});
    }

    render() {
        return <CurbsideAdminCheckInOrOutView {...this.props} />;
    }
}

export default storeConnector(Container);
