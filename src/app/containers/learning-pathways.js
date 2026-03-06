import React, {Component} from 'react';
import LearningPathwaysSettingsView from '../views/LearningPathwaysSettingsView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLearningPathways from '../actions/learning-pathways';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectLearningPathways, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        learningPathways: selectLearningPathways(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    learningPathwaysInit: (personId) => dispatch(actionLearningPathways.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeLearningPathway: (personId, learningPathwayId) => dispatch(actionLearningPathways.removeLearningPathway(personId, learningPathwayId)),
    addOrUpdateLearningPathway: (personId, learningPathway) => dispatch(actionLearningPathways.addOrUpdateLearningPathway(personId, learningPathway)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, learningPathwaysInit, personId} = this.props;
        getPageLangs(personId, langCode, 'LearningPathwaysSettingsView');
        learningPathwaysInit(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Subject Discipline Entry`});
    }

    render() {
        return <LearningPathwaysSettingsView {...this.props} />;
    }
}

export default storeConnector(Container);
