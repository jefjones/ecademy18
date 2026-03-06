import { useEffect } from 'react'
import FinanceRefundListView from '../views/FinanceRefundListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceRefund from '../actions/finance-refund'
import * as actionFinanceBilling from '../actions/finance-billing'
import * as actionFinanceFeeTypes from '../actions/finance-fee-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceBillings, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents, selectFinanceRefunds } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financeRefunds: selectFinanceRefunds(state),
				students: selectStudents(state),
				financeBillings: selectFinanceBillings(state),
				financeFeeTypes: selectFinanceFeeTypes(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceRefunds: (personId) => dispatch(actionFinanceRefund.getFinanceRefunds(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		removeFinanceBilling: (personId, financeBillingId) => dispatch(actionFinanceBilling.removeFinanceBilling(personId, financeBillingId)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceBillings, getFinanceFeeTypes, getFinanceRefunds} = props
        	getPageLangs(personId, langCode, 'FinanceRefundListView')
    	    getFinanceBillings(personId)
    			getFinanceFeeTypes(personId)
    			getFinanceRefunds(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Refund List`})
      
  }, [])

  return <FinanceRefundListView {...props} />
}

export default Container
