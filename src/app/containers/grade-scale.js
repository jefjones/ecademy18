import React, {Component} from 'react';
import GradeScaleSettingsView from '../views/GradeScaleSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionGradeScale from '../actions/grade-scale';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectGradeScale, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        gradeScales: selectGradeScale(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    gradeScaleInit: (personId) => dispatch(actionGradeScale.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeGradeScaleDetail: (personId, gradeScaleDetailId) => dispatch(actionGradeScale.removeGradeScaleDetail(personId, gradeScaleDetailId)),
    removeGradeScaleTable: (personId, gradeScaleTableId) => dispatch(actionGradeScale.removeGradeScaleTable(personId, gradeScaleTableId)),
    addOrUpdateGradeScaleDetail: (personId, gradeScaleDetail) => dispatch(actionGradeScale.addOrUpdateGradeScaleDetail(personId, gradeScaleDetail)),
		addNewGradeScaleName: (personId, newGradaeScaleName) => dispatch(actionGradeScale.addNewGradeScaleName(personId, newGradaeScaleName)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, gradeScaleInit, personId} = this.props;
        getPageLangs(personId, langCode, 'GradeScaleSettingsView');
        gradeScaleInit(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Grade Scale`});
    }

    render() {
        return <GradeScaleSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
