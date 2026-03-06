import React, {Component} from 'react';
import MentorNotAssignedView from '../views/MentorNotAssignedView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMentorsAssigned from '../actions/mentors-assigned.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectUsers, selectMentorsAssigned, selectCompanyConfig } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let learnersNot = selectMentorsAssigned(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        learnersNot,
        mentors: selectUsers(state, 'Mentor'),
        companyConfig: selectCompanyConfig(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getUnassignedLearnersMentors: (personId) => dispatch(actionMentorsAssigned.getUnassignedLearnersMentors(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addLearnersMentorsAssign: (personId, learnersChosen, learningCoach) => dispatch(actionMentorsAssigned.addLearnersMentorsAssign(personId, learnersChosen, learningCoach)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getUnassignedLearnersMentors, personId} = this.props;
        getPageLangs(personId, langCode, 'MentorNotAssignedView');
        getUnassignedLearnersMentors(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Mentor Not Assigned`});
    }

    render() {
        return <MentorNotAssignedView {...this.props} />;
    }
}

export default storeConnector(Container);
