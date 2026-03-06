import { useEffect } from 'react'
import FinanceTransferAddView from '../views/FinanceTransferAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceAccountSummaries from '../actions/finance-account-summaries'
import * as actionFinanceTransfer from '../actions/finance-transfer'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectFinanceAccountSummaries } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		//If this page is called from the financeTransferList, then this is an intended reversal of a transfer, but that needs to be done by the user "manually"
		//	in case credit amounts have changed and funds do not exist to make that reversed transfer.

    return {
				fromPersonId: props.params.fromPersonId || props.params.paramPersonId,
				langCode: me.langCode,
				toPersonId: props.params.toPersonId,
        personId: me.personId,
				financeAccountSummaries: selectFinanceAccountSummaries(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getFinanceAccountSummaries: (personId) => dispatch(actionFinanceAccountSummaries.getFinanceAccountSummaries(personId)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		addFinanceTransfer: (personId, financeTransfer) => dispatch(actionFinanceTransfer.addFinanceTransfer(personId, financeTransfer)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, personId, setMyVisitedPage, getFinanceAccountSummaries} = props
            getPageLangs(personId, langCode, 'FinanceTransferAddView')
    				getFinanceAccountSummaries(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Transfer (Finance)`})
        
  }, [])

  return <FinanceTransferAddView {...props} />
}

export default Container
