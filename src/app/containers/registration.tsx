import { useEffect } from 'react'
import RegistrationLoginView from '../views/RegistrationLoginView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegistration from '../actions/registration'
import * as actionCompanyConfig from '../actions/company-config'
import * as actionSchoolYears from '../actions/school-years'
import { selectMe, selectSchoolCode, selectAccessRoles, selectCompanyConfig, selectSchoolYears } from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)
		let schoolYears = selectSchoolYears(state)
		schoolYears = schoolYears && schoolYears.length > 0 && schoolYears.filter(m => m.yearInt === 2020)

    return {
				loginData: me,
				langCode: me.langCode,
				registrationSchoolCode: selectSchoolCode(state),
				accessRoles: selectAccessRoles(state),
				schoolCode: props.params && (props.params.schoolCode || props.params.schoolRegistrationCode),
				companyConfig: selectCompanyConfig(state),
				schoolYears,
    }
}

const bindActionsToDispatch = dispatch => ({
		setRegistrationSchoolCode: (schoolCode) => dispatch(actionRegistration.setRegistrationSchoolCode(schoolCode)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		registrationLogin: (userData, schoolCode, adminPersonId, registrationPersonId) => dispatch(actionRegistration.registrationLogin(userData, schoolCode, adminPersonId, registrationPersonId)),
    logout: ()  => dispatch(actionRegistration.logout()),
		getCompanyConfig: (personId, schoolCode) => dispatch(actionCompanyConfig.init(personId, schoolCode)),
		getSchoolYears: () => dispatch(actionSchoolYears.init()),
})


function HomeContainer(props) {
  useEffect(() => {
    
    				const {getPageLangs, langCode, getCompanyConfig, schoolCode, loginData, getSchoolYears} = props
    				getPageLangs(loginData.personId, langCode, 'RegistrationLoginView')
    				getCompanyConfig(loginData && loginData.personId, schoolCode)
    				getSchoolYears()
    		
  }, [])

  return <RegistrationLoginView {...props} />
}

export default storeConnector(HomeContainer)
