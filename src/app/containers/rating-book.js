import React, {Component} from 'react';
import RatingBookView from '../views/RatingBookView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionRatingBook from '../actions/rating-book';
import { selectMe, selectRatingBook, selectCoursesBase, selectStudents, selectUsers, selectLearnerOutcomes, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        studentPersonId: props.params && props.params.studentPersonId,
        students: selectStudents(state),
        courses: selectCoursesBase(state),
        facilitators: selectUsers(state, 'Facilitator'),
        learnerOutcomes: selectLearnerOutcomes(state),
        ratingBook: selectRatingBook(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    ratingBookInit: (personId, studentPersonId) => dispatch(actionRatingBook.init(personId, studentPersonId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setRatingBook: (personId, studentPersonId, learnerOutcomeId, rating) => dispatch(actionRatingBook.setRatingBook(personId, studentPersonId, learnerOutcomeId, rating)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, ratingBookInit, personId, studentPersonId} = this.props;
        getPageLangs(personId, langCode, 'RatingBookView');
        ratingBookInit(personId, studentPersonId);
    }

    render() {
        return <RatingBookView {...this.props} />;
    }
}

export default storeConnector(Container);
