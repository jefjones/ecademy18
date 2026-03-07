import { useEffect } from 'react'
import RegistrationPendingView from '../views/RegistrationPendingView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionRegistrationPending from '../actions/registration-pending'
import * as actionPersonConfig from '../actions/person-config'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectRegistrationPending, selectPersonConfig, selectFetchingRecord, selectGradeLevels,
					selectCompanyConfig } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let registrationStati = [
				{ id: 'CARSONSMITH', label: 'Carson Smith'},
				{ id: 'WAITINGLIST', label: 'Waiting List'},
				{ id: 'IEP', label: 'IEP Review'},
				{ id: 'PARENTHOLD', label: 'Parent Hold'},
		]
		let registrationPending = selectRegistrationPending(state)

		let students = registrationPending && registrationPending.students && registrationPending.students.length > 0 && registrationPending.students.reduce((acc, m) => {
				let option = {
						id: m.studentPersonId,
						label: m.firstName + ' ' + m.lastName,
						studentPersonId: m.studentPersonId,
				}
				return acc && acc.length > 0 ? acc.concat(option) : [option]
		},[])

    return {
        personId: me.personId,
        langCode: me.langCode,
				registrationPending,
				personConfig: selectPersonConfig(state),
				companyConfig: selectCompanyConfig(state),
				registrationStati,
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
				students,
				gradeLevels: selectGradeLevels(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getRegistrationPending: (personId) => dispatch(actionRegistrationPending.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setRegistrationPaidDate: (personId, registrationTableId) => dispatch(actionRegistrationPending.setRegistrationPaidDate(personId, registrationTableId)),
		setRegistrationAcceptedDenied: (personId, registrationTableId, studentPersonId, regApprovedOrDenied, regReviewNote) => dispatch(actionRegistrationPending.setRegistrationAcceptedDenied(personId, registrationTableId, studentPersonId, regApprovedOrDenied, regReviewNote)),
		updatePersonConfig: (personId, field, value, runFunction)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value, runFunction)),
		updateRegistrationStatus: (personId, registrationTableId, registrationStatus)  => dispatch(actionRegistrationPending.updateRegistrationStatus(personId, registrationTableId, registrationStatus)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    				const {getPageLangs, langCode, setMyVisitedPage, getRegistrationPending, personId} = props
    				getPageLangs(personId, langCode, 'RegistrationPendingView')
    				getRegistrationPending(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Pending Registration`})
    		
  }, [])

  return <RegistrationPendingView {...props} />
}

export default Container
