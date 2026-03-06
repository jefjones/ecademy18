import React, {Component} from 'react';
import FacilitatorMentorSetView from '../views/FacilitatorMentorSetView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionMentors from '../actions/mentors.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectUsers, selectCompanyConfig, } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state);
    let mentors = selectUsers(state, 'Mentor');
    let facilitators = selectUsers(state, 'Facilitator');

    return {
        mentors,
        langCode: me.langCode,
        facilitators,
        personId: me.personId,
        companyConfig: selectCompanyConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addFacilitatorAsMentor: (personId, facilitatorPersonId) => dispatch(actionMentors.addFacilitatorAsMentor(personId, facilitatorPersonId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'FacilitatorMentorSetView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Set Facilitator as Mentor`});
    }

    render() {
        return <FacilitatorMentorSetView {...this.props} />
    }
}

export default storeConnector(Container);
