import { useEffect } from 'react'
import FinancePaymentListView from '../views/FinancePaymentListView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinancePayment from '../actions/finance-payment'
import * as actionFinancePaymentTypes from '../actions/finance-payment-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceBillings, selectFinancePaymentTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents, selectFinancePayments } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financePayments: selectFinancePayments(state),
				students: selectStudents(state),
				financeBillings: selectFinanceBillings(state),
				financePaymentTypes: selectFinancePaymentTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinancePayments: (personId) => dispatch(actionFinancePayment.getFinancePayments(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinancePaymentBillings: (personId, financePaymentTableId, runFunction) => dispatch(actionFinancePayment.getFinancePaymentBillings(personId, financePaymentTableId, runFunction)),
		getFinancePaymentTypes: (personId) => dispatch(actionFinancePaymentTypes.getFinancePaymentTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinancePaymentTypes, getFinancePayments} = props
        	getPageLangs(personId, langCode, 'FinancePaymentListView')
    			getFinancePayments(personId)
    			getFinancePaymentTypes(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Payment`})
      
  }, [])

  return <FinancePaymentListView {...props} />
}

export default Container
