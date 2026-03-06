import React, {Component} from 'react';
import FinanceCourseFeeAddView from '../views/FinanceCourseFeeAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionFinanceCourseFee from '../actions/finance-course-fee.js';
import * as actionFinanceFeeTypes from '../actions/finance-fee-types.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers.js';
import * as actionFinanceGLCodes from '../actions/finance-gl-codes.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectFinanceCourseFees, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectCoursesBase,
					selectFetchingRecord, selectPersonConfig, selectFinanceLowIncomeWaivers, selectFinanceGLCodes} from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
		let financeFeeTypes = selectFinanceFeeTypes(state);
		financeFeeTypes = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.isCourseTypeByUser);

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				refundOptions,
				financeCourseFees: selectFinanceCourseFees(state),
				financeFeeTypes,
        companyConfig: selectCompanyConfig(state),
				personConfig: selectPersonConfig(state),
				accessRoles: selectAccessRoles(state),
				financeGLCodes: selectFinanceGLCodes(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				baseCourses: selectCoursesBase(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
		getFinanceCourseFees: (personId) => dispatch(actionFinanceCourseFee.getFinanceCourseFees(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeFinanceCourseFee: (personId, financeCourseFeeId) => dispatch(actionFinanceCourseFee.removeFinanceCourseFee(personId, financeCourseFeeId)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		addOrUpdateFinanceCourseFee: (personId, financeCourseFee) => dispatch(actionFinanceCourseFee.addOrUpdateFinanceCourseFee(personId, financeCourseFee)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
    	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCourseFees, getFinanceFeeTypes, getFinanceGLCodes, getFinanceLowIncomeWaivers } = this.props;
    	getPageLangs(personId, langCode, 'FinanceCourseFeeAddView');
	    getFinanceCourseFees(personId);
			getFinanceFeeTypes(personId);
			getFinanceGLCodes(personId);
			getFinanceLowIncomeWaivers(personId);
			this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add Course Fee`});
  }

  render() {
    return <FinanceCourseFeeAddView {...this.props} />;
  }
}

export default storeConnector(Container);
