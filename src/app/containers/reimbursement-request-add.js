import React, {Component} from 'react';
import ReimbursementRequestAddView from '../views/ReimbursementRequestAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionReimbursementRequest from '../actions/reimbursement-request.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectMyFrequentPlaces, selectReimbursementRequests } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				reimbursementRequests: selectReimbursementRequests(state),
				reimbursementRequestId: props.params && props.params.reimbursementRequestId,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getReimbursementRequests: (personId, curbsideReimbursementRequestsId) => dispatch(actionReimbursementRequest.getReimbursementRequests(personId, curbsideReimbursementRequestsId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addReimbursementRequest: (personId, checkInOrOut) => dispatch(actionReimbursementRequest.addReimbursementRequest(personId, checkInOrOut)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, personId, setMyVisitedPage, getReimbursementRequests} = this.props;
        getPageLangs(personId, langCode, 'ReimbursementRequestAddView');
				getReimbursementRequests(personId)
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Reimbursement Request`});
    }

    render() {
        return <ReimbursementRequestAddView {...this.props} />;
    }
}

export default storeConnector(Container);
