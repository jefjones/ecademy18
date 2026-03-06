import { useEffect } from 'react'
import RegGuardiansContactsView from '../views/RegGuardiansContactsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegGuardianContacts from '../actions/reg-guardian-contact'
import * as actionCountries from '../actions/countries'
import * as actionUSStates from '../actions/us-states'
import * as actionMaritalStatus from '../actions/marital-status'
import * as actionGender from '../actions/gender'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectRegistration, selectMaritalStati, selectGender, selectCountries, selectUSStates } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let personType = props.params && props.params.personType
		let contactPersonId = props.params && props.params.contactPersonId
		let registration = selectRegistration(state)
		let guardianContacts = registration && registration.guardianContacts
		let personEntry = {}
		if (personType === "PRIMARYGUARDIAN" && guardianContacts && guardianContacts.primaryGuardians && guardianContacts.primaryGuardians.length > 0) {
				personEntry = guardianContacts.primaryGuardians.filter(m => m.personId === contactPersonId)[0]
		}
		if (personType === "SECONDARYGUARDIAN" && guardianContacts && guardianContacts.secondaryGuardians && guardianContacts.secondaryGuardians.length > 0) {
				personEntry = guardianContacts.secondaryGuardians.filter(m => m.personId === contactPersonId)[0]
		}
		if (personType === "EMERGENCYCONTACT" && guardianContacts && guardianContacts.emergencyContacts && guardianContacts.emergencyContacts.length > 0) {
				personEntry = guardianContacts.emergencyContacts.filter(m => m.personId === contactPersonId)[0]
		}
    return {
        personId: me.personId,
        langCode: me.langCode,
				registration,
				contactPersonId,
				personType,
        personEntry,
				maritalStati: selectMaritalStati(state),
				genders: selectGender(state),
				countries: selectCountries(state),
				usStates: selectUSStates(state),
				schoolYearId: props && props.params && props.params.schoolYearId,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addOrUpdatePerson: (personId, person, schoolYearId) => dispatch(actionRegGuardianContacts.addOrUpdatePerson(personId, person, schoolYearId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		removeGuardianContact: (personId, contactPersonId, personType, schoolYearId) => dispatch(actionRegGuardianContacts.removeGuardianContact(personId, contactPersonId, personType, schoolYearId)),
		getCountries: () => dispatch(actionCountries.init()),
		getUSStates: () => dispatch(actionUSStates.init()),
		getMaritalStatus: (personId) => dispatch(actionMaritalStatus.init(personId)),
		getGender: () => dispatch(actionGender.init()),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    			const {getPageLangs, langCode, personId, setMyVisitedPage, getCountries, getUSStates, getGender, getMaritalStatus} = props
    			getPageLangs(personId, langCode, 'RegGuardiansContactsView')
    			getCountries()
    			getUSStates()
    			getMaritalStatus(personId)
    			getGender()
          props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Guardian Contacts`})
    	
  }, [])

  return <RegGuardiansContactsView {...props} />
}

export default Container
