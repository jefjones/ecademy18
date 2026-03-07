import { useEffect } from 'react'
import FinanceCreditAddView from '../views/FinanceCreditAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceCredit from '../actions/finance-credit'
import * as actionFinanceCreditTypes from '../actions/finance-credit-types'
import * as actionFinanceGroups from '../actions/finance-groups'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import {doSort} from  '../utils/sort'

import { selectMe, selectMyFrequentPlaces, selectFinanceCreditTypes, selectStudents, selectFinanceCredits, selectFinanceGroups } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let financeCredits = selectFinanceCredits(state)
		let financeCreditTransactionId = props.params && props.params.financeCreditTransactionId
		let financeCredit = financeCreditTransactionId && financeCredits && financeCredits.length > 0 && financeCredits.filter(m => m.financeCreditTransactionId === financeCreditTransactionId)[0]
		let financeCreditTypes = selectFinanceCreditTypes(state)
		financeCreditTypes = doSort(financeCreditTypes, { sortField: 'label', isAsc: true, isNumber: false })

    return {
        personId: me.personId,
        langCode: me.langCode,
				paramPersonId: props.params.paramPersonId, //This parameter would come from the Account Summaries page when the user clicks on the link to this page with a chosen person.
				financeCreditTransactionId,
				financeCredit,
				financeCredits,
				financeCreditTypes,
				students: selectStudents(state),
				financeGroups: selectFinanceGroups(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceCredits: (personId) => dispatch(actionFinanceCredit.getFinanceCredits(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
		getFinanceGroups: (personId) => dispatch(actionFinanceGroups.getFinanceGroups(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceCreditTypes, getFinanceCredits, getFinanceGroups} = props
            getPageLangs(personId, langCode, 'FinanceCreditAddView')
    				getFinanceCreditTypes(personId)
    				getFinanceCredits(personId)
    				getFinanceGroups(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Credit`})
        
  }, [])

  return <FinanceCreditAddView {...props} />
}

export default Container
