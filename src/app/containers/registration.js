import React, {Component} from 'react';
import RegistrationLoginView from '../views/RegistrationLoginView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionRegistration from '../actions/registration';
import * as actionCompanyConfig from '../actions/company-config';
import * as actionSchoolYears from '../actions/school-years';
import { selectMe, selectSchoolCode, selectAccessRoles, selectCompanyConfig, selectSchoolYears } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let schoolYears = selectSchoolYears(state);
		schoolYears = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.yearInt === 2020);

    return {
				loginData: me,
				langCode: me.langCode,
				registrationSchoolCode: selectSchoolCode(state),
				accessRoles: selectAccessRoles(state),
				schoolCode: props.params && (props.params.schoolCode || props.params.schoolRegistrationCode),
				companyConfig: selectCompanyConfig(state),
				schoolYears,
    }
};

const bindActionsToDispatch = dispatch => ({
		setRegistrationSchoolCode: (schoolCode) => dispatch(actionRegistration.setRegistrationSchoolCode(schoolCode)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		registrationLogin: (userData, schoolCode, adminPersonId, registrationPersonId) => dispatch(actionRegistration.registrationLogin(userData, schoolCode, adminPersonId, registrationPersonId)),
    logout: ()  => dispatch(actionRegistration.logout()),
		getCompanyConfig: (personId, schoolCode) => dispatch(actionCompanyConfig.init(personId, schoolCode)),
		getSchoolYears: () => dispatch(actionSchoolYears.init()),
});

const storeConnector = connect(
	  mapStateToProps,
	  bindActionsToDispatch,
);

class HomeContainer extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, getCompanyConfig, schoolCode, loginData, getSchoolYears} = this.props;
				getPageLangs(loginData.personId, langCode, 'RegistrationLoginView');
				getCompanyConfig(loginData && loginData.personId, schoolCode);
				getSchoolYears();
		}

	  render() {
	    	return <RegistrationLoginView {...this.props} />
	  }
}

export default storeConnector(HomeContainer);
