import React, {Component} from 'react';
import LunchMenuMonthView from '../views/LunchMenuMonthView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionLunchMenuOptions from '../actions/lunch-menu-options';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectLunchMenuMonth, selectLunchMenuOptions } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let lunchMenuMonth = selectLunchMenuMonth(state);
		let months = [
        {id: 0, label: 'LunchMenuMonthView'},
				{id: 1, label: 'January'},
				{id: 2, label: 'February'},
				{id: 3, label: 'March'},
				{id: 4, label: 'April'},
				{id: 5, label: 'May'},
				{id: 6, label: 'June'},
				{id: 7, label: 'July'},
				{id: 8, label: 'August'},
				{id: 9, label: 'September'},
				{id: 10, label: 'October'},
				{id: 11, label: 'November'},
				{id: 12, label: 'December'},
		];

		let daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

    return {
        personId: me.personId,
        langCode: me.langCode,
        lunchMenuMonth,
				months,
				daysOfWeek,
				lunchMenuOptions: selectLunchMenuOptions(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getLunchMenuMonth: (personId, month) => dispatch(actionLunchMenuOptions.getLunchMenuMonth(personId, month)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    setLunchMenuDay: (personId, day, lunchMenuOptionId) => dispatch(actionLunchMenuOptions.setLunchMenuDay(personId, day, lunchMenuOptionId)),
		getLunchMenuOptions: (personId) => dispatch(actionLunchMenuOptions.init(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, setMyVisitedPage, getLunchMenuOptions, personId} = this.props;
				getPageLangs(personId, langCode, 'LunchMenuMonthView');
				getLunchMenuOptions(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Lunch Menu Month`});
		}

    render() {
        return <LunchMenuMonthView {...this.props} />;
    }
}

export default storeConnector(Container);
