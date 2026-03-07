import { useEffect } from 'react'
import FinancePaymentTypesView from '../views/FinancePaymentTypesView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinancePaymentTypes from '../actions/finance-payment-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinancePaymentTypes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        financePaymentTypes: selectFinancePaymentTypes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinancePaymentTypes: (personId) => dispatch(actionFinancePaymentTypes.getFinancePaymentTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinancePaymentType: (personId, financePaymentTypeId) => dispatch(actionFinancePaymentTypes.removeFinancePaymentType(personId, financePaymentTypeId)),
    addOrUpdateFinancePaymentType: (personId, financePaymentType) => dispatch(actionFinancePaymentTypes.addOrUpdateFinancePaymentType(personId, financePaymentType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getFinancePaymentTypes, personId} = props
            getPageLangs(personId, langCode, 'FinancePaymentTypesView')
            getFinancePaymentTypes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Finance Payment Types`})
        
  }, [])

  return <FinancePaymentTypesView {...props} />
}

export default Container
