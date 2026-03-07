import { useEffect } from 'react'
import FinanceBillingAddView from '../views/FinanceBillingAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceBilling from '../actions/finance-billing'
import * as actionFinanceFeeTypes from '../actions/finance-fee-types'
import * as actionFinanceGroups from '../actions/finance-groups'
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers'
import * as actionFinanceGLCodes from '../actions/finance-gl-codes'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from  '../utils/sort'

import { selectMe, selectMyFrequentPlaces, selectFinanceFeeTypes, selectStudents, selectFinanceBillings, selectFinanceGroups, selectFinanceLowIncomeWaivers,
					selectFinanceGLCodes } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let financeBillings = selectFinanceBillings(state)
		let financeBillingId = props.params && props.params.financeBillingId
		let financeBilling = financeBillingId && financeBillings && financeBillings.length > 0 && financeBillings.filter(m => m.financeBillingId === financeBillingId)[0]
		let financeFeeTypes = selectFinanceFeeTypes(state)
		financeFeeTypes = financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => !m.isCourseTypeByUser && !m.isCredit && !m.isCourse)
		financeFeeTypes = doSort(financeFeeTypes, { sortField: 'label', isAsc: true, isNumber: false })
		let addLunchBilling = props.params.addLunchBilling
		let financeFeeType = addLunchBilling === 'addLunchBilling' && financeFeeTypes && financeFeeTypes.length > 0 && financeFeeTypes.filter(m => m.label === 'Lunch')[0]
		let financeFeeTypeId = financeFeeType && financeFeeType.financeFeeTypeId ? financeFeeType.financeFeeTypeId : ''

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]
		if (financeBilling && !financeBilling.refundType) financeBilling.refundType = 'REFUNDSCHEDULE'

    return {
        personId: me.personId,
        langCode: me.langCode,
				financeBillingId,
				financeBilling,
				financeBillings,
				financeFeeTypes,
				financeFeeTypeId, //If this is for adding lunch billing.
				students: selectStudents(state),
				financeGroups: selectFinanceGroups(state),
				paramPersonId: props.params.paramPersonId,
				refundOptions,
				financeGLCodes: selectFinanceGLCodes(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceBillings: (personId) => dispatch(actionFinanceBilling.getFinanceBillings(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
		getFinanceGroups: (personId) => dispatch(actionFinanceGroups.getFinanceGroups(personId)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceFeeTypes, getFinanceBillings, getFinanceGroups, getFinanceGLCodes, getFinanceLowIncomeWaivers} = props
            getPageLangs(personId, langCode, 'FinanceBillingAddView')
    				getFinanceFeeTypes(personId)
    				getFinanceBillings(personId)
    				getFinanceGroups(personId)
    				getFinanceGLCodes(personId)
    				getFinanceLowIncomeWaivers(personId)
    				props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Billing`})
        
  }, [])

  return <FinanceBillingAddView {...props} />
}

export default Container
