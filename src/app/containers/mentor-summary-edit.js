import React, {Component} from 'react';
import MentorSummaryEditView from '../views/MentorSummaryEditView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMentorSummary from '../actions/mentor-summary-edit';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectLearners, selectMe, selectLearnerPathways, selectPathwayComments, selectCompanyConfig } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				pathwayComments: selectPathwayComments(state),
        learners: selectLearners(state),
				entries: selectLearnerPathways(state),
        companyConfig: selectCompanyConfig(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getLearnerPathways: (personId, studentPersonId) => dispatch(actionMentorSummary.getLearnerPathways(personId, studentPersonId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getMentorComments: (personId, studentPersonId, limitReturn) => dispatch(actionMentorSummary.getMentorComments(personId, studentPersonId, limitReturn)),
		removeMentorComment: (personId, mentorCommentId) => dispatch(actionMentorSummary.removeMentorComment(personId, mentorCommentId)),
		addOrUpdateMentorComment: (personId, mentorComment) => dispatch(actionMentorSummary.addOrUpdateMentorComment(personId, mentorComment)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
				const {getPageLangs, langCode, setMyVisitedPage, getMentorComments, personId, studentPersonId} = this.props;
				getPageLangs(personId, langCode, 'MentorSummaryEditView');
				getMentorComments(personId, studentPersonId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Mentor Summary`});
    }

    render() {
        return <MentorSummaryEditView {...this.props} />;
    }
}

export default storeConnector(Container);
