import { useEffect } from 'react'
import FinancePaymentReceiptView from '../views/FinancePaymentReceiptView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinancePayment from '../actions/finance-payment'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceBillings, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces, selectFetchingRecord,
					selectFinancePayments } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let financePaymentTableId = props.params.financePaymentTableId
		let financePayments = selectFinancePayments(state)
		let financePayment = financePaymentTableId && financePayments && financePayments.length > 0 && financePayments.filter(m => m.financePaymentTableId === financePaymentTableId)[0]

    return {
        personId: me.personId,
        langCode: me.langCode,
				financePaymentTableId,
				financePayments,
				financePayment,
				financeBillings: selectFinanceBillings(state),
        companyConfig: selectCompanyConfig(state),
				accessRoles: selectAccessRoles(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinancePayments: (personId) => dispatch(actionFinancePayment.getFinancePayments(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinancePaymentBillings: (personId, financePaymentTableId) => dispatch(actionFinancePayment.getFinancePaymentBillings(personId, financePaymentTableId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinancePaymentBillings, getFinancePayments, financePaymentTableId } = props
        	getPageLangs(personId, langCode, 'FinancePaymentReceiptView')
    			financePaymentTableId && getFinancePaymentBillings(personId, financePaymentTableId)
    	    getFinancePayments(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Payment Receipt`})
      
  }, [])

  return <FinancePaymentReceiptView {...props} />
}

export default Container
