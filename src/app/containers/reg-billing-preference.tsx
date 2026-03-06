import { useEffect } from 'react'
import RegBillingPreferenceView from '../views/RegBillingPreferenceView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegBillingPreference from '../actions/reg-billing-preference'
import * as actionCountries from '../actions/countries'
import * as actionUSStates from '../actions/us-states'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectRegistration, selectUSStates, selectCountries, selectPaymentProcessingResponse, selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let registration = selectRegistration(state)
		let billing = registration && registration.billing

		let guardians = []
		if (registration && registration.guardianContacts  && (registration.guardianContacts.primaryGuardians || registration.guardianContacts.secondaryGuardians)) {
				registration.guardianContacts.primaryGuardians.length > 0 && registration.guardianContacts.primaryGuardians.forEach(m => {
						let option = { id: m.personId, label: m.fname + ' ' + m.lname}
						guardians = guardians && guardians.length > 0 ? guardians.concat(option) : [option]
				})
				registration.guardianContacts.secondaryGuardians.length > 0 && registration.guardianContacts.secondaryGuardians.forEach(m => {
						let option = { id: m.personId, label: m.fname + ' ' + m.lname}
						guardians = guardians && guardians.length > 0 ? guardians.concat(option) : [option]
				})
				registration.guardianContacts.emergencyContacts.length > 0 && registration.guardianContacts.emergencyContacts.forEach(m => {
						let option = { id: m.personId, label: m.fname + ' ' + m.lname}
						guardians = guardians && guardians.length > 0 ? guardians.concat(option) : [option]
				})
		}
		if (guardians.length === 1) {
  			if (!billing) {
  					billing = { responsiblePersonId: guardians[0].id}
  			} else {
  				  billing.responsiblePersonId = guardians[0].id
  			}
		}

    return {
        personId: me.personId,
        langCode: me.langCode,
				registration,
        billing,
				guardians,
				countries: selectCountries(state),
				usStates: selectUSStates(state),
				paymentProcessResponse: selectPaymentProcessingResponse(state),
				schoolYearId: props.params && props.params.schoolYearId,
        companyConfig: selectCompanyConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    addOrUpdateBilling: (personId, billing, schoolYearId) => dispatch(actionRegBillingPreference.addOrUpdateBilling(personId, billing, schoolYearId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		clearPaymentProcessingResponse: () => dispatch(actionRegBillingPreference.clearPaymentProcessingResponse()),
		getCountries: () => dispatch(actionCountries.init()),
		getUSStates: () => dispatch(actionUSStates.init()),
		//getRegistration: (personId, personId, schoolYearId)
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, personId, setMyVisitedPage, getCountries, getUSStates} = props
    				getPageLangs(personId, langCode, 'RegBillingPreferenceView')
    				getCountries()
    				getUSStates()
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Billing Preference`})
    		
  }, [])

  return <RegBillingPreferenceView {...props} />
}

export default Container
