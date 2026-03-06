import React, {Component} from 'react';
import LunchMenuStudentDayView from '../views/LunchMenuStudentDayView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLunchMenuOptions from '../actions/lunch-menu-options';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectLunchMenuStudentDays } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
				lunchMenuStudentDays: selectLunchMenuStudentDays(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getLunchMenuStudentDays: (personId) => dispatch(actionLunchMenuOptions.getLunchMenuStudentDays(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		toggleLunchMenuStudentDay: (personId, day, studentPersonId) => dispatch(actionLunchMenuOptions.toggleLunchMenuStudentDay(personId, day, studentPersonId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, setMyVisitedPage, getLunchMenuStudentDays, personId} = this.props;
				getPageLangs(personId, langCode, 'LunchMenuStudentDayView');
				getLunchMenuStudentDays(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Lunch Menu Student Days`});
		}

    render() {
        return <LunchMenuStudentDayView {...this.props} />;
    }
}

export default storeConnector(Container);
