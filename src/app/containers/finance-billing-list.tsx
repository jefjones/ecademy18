import { useEffect } from 'react'
import FinanceBillingListView from '../views/FinanceBillingListView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceBilling from '../actions/finance-billing'
import * as actionFinanceFeeTypes from '../actions/finance-fee-types'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceBillings, selectFinanceFeeTypes, selectCompanyConfig, selectAccessRoles, selectMyFrequentPlaces,
					selectFetchingRecord, selectStudents } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId,
				onlyBillingDue: props.params.onlyBillingDue,
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
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
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
    
        	const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceBillings, getFinanceFeeTypes } = props
        	getPageLangs(personId, langCode, 'FinanceBillingListView')
    	    getFinanceBillings(personId)
    			getFinanceFeeTypes(personId)
    			props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Billing List`})
      
  }, [])

  return <FinanceBillingListView {...props} />
}

export default Container
