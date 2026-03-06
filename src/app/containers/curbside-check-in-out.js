import React, {Component} from 'react';
import CurbsideCheckInOrOutView from '../views/CurbsideCheckInOrOutView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionCheckInOrOut from '../actions/curbside-check-in-out.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectStudents, selectCheckInOrOuts, selectCheckInOrOutReasons } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let students = selectStudents(state);
		let reasons = selectCheckInOrOutReasons(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        students,
				reasons,
				checkInOrOuts: selectCheckInOrOuts(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getCheckInOrOuts: (personId, curbsideCheckInOrOutId) => dispatch(actionCheckInOrOut.getCheckInOrOuts(personId, curbsideCheckInOrOutId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    getCheckInOrOutReasons: (personId) => dispatch(actionCheckInOrOut.getCheckInOrOutReasons(personId)),
		addCheckInOrOut: (personId, checkInOrOut) => dispatch(actionCheckInOrOut.addCheckInOrOut(personId, checkInOrOut)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getCheckInOrOutReasons, getCheckInOrOuts} = this.props;
        getPageLangs(personId, langCode, 'CurbsideCheckInOrOutView');
        getCheckInOrOutReasons(personId);
				getCheckInOrOuts(personId)
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Curbside check-in/out`});
    }

    render() {
        return <CurbsideCheckInOrOutView {...this.props} />;
    }
}

export default storeConnector(Container);
