import React, {Component} from 'react';
import RegSelfServiceCourseCountView from '../views/RegSelfServiceCourseCountView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionRegSelfServiceCourseCount from '../actions/reg-self-service-course-count';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from '../utils/sort.js';
import { selectMe, selectRegSelfServiceCourseCount, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let counts = selectRegSelfServiceCourseCount(state);
    counts = doSort(counts, { sortField: 'grade', isAsc: true, isNumber: true });

    return {
        personId: me.personId,
        langCode: me.langCode,
        counts,
        fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getRegSelfServiceCourseCount: (personId) => dispatch(actionRegSelfServiceCourseCount.getRegSelfServiceCourseCount(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getRegSelfServiceCourseCount, personId} = this.props;
        getPageLangs(personId, langCode, 'RegSelfServiceCourseCountView');
        getRegSelfServiceCourseCount(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Self Service Student Course Count`});
    }

    render() {
        return <RegSelfServiceCourseCountView {...this.props} />;
    }
}

export default storeConnector(Container);
