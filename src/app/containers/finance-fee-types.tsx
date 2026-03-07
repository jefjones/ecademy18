import { useEffect } from 'react'
import FinanceFeeTypesView from '../views/FinanceFeeTypesView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceFeeTypes from '../actions/finance-fee-types'
import * as actionFinanceGLCodes from '../actions/finance-gl-codes'
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from '../utils/sort'
import { selectMe, selectFinanceFeeTypes, selectFetchingRecord, selectSchoolYears, selectFinanceGLCodes, selectFinanceWaiverSchedules, selectFinanceLowIncomeWaivers } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

		let refundOptions = [
				{ label: 'Not refundable', id: 'NotRefundable' },
				{ label: '100% refundable', id: 'FULLREFUNDABLE' },
				{ label: 'Refund schedule', id: 'REFUNDSCHEDULE' },
		]

    let financeFeeTypes = selectFinanceFeeTypes(state)
    financeFeeTypes = doSort(financeFeeTypes, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeFeeTypes,
				fetchingRecord: selectFetchingRecord(state),
				schoolYears: selectSchoolYears(state),
				financeGLCodes: selectFinanceGLCodes(state),
				financeWaiverSchedules: selectFinanceWaiverSchedules(state),
				financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				refundOptions,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceFeeTypes: (personId) => dispatch(actionFinanceFeeTypes.getFinanceFeeTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceFeeType: (personId, financeFeeTypeId) => dispatch(actionFinanceFeeTypes.removeFinanceFeeType(personId, financeFeeTypeId)),
    addOrUpdateFinanceFeeType: (personId, financeFeeType) => dispatch(actionFinanceFeeTypes.addOrUpdateFinanceFeeType(personId, financeFeeType)),
		getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
		getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceFeeTypes, getFinanceGLCodes, getFinanceLowIncomeWaivers} = props
            getPageLangs(personId, langCode, 'FinanceFeeTypesView')
            getFinanceFeeTypes(personId)
    				getFinanceGLCodes(personId)
    				getFinanceLowIncomeWaivers(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Finance Fee Types`})
        
  }, [])

  return <FinanceFeeTypesView {...props} />
}

export default Container
