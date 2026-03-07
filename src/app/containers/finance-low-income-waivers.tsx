import { useEffect } from 'react'
import FinanceLowIncomeWaiversView from '../views/FinanceLowIncomeWaiversView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceLowIncomeWaivers from '../actions/finance-low-income-waivers'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceLowIncomeWaivers, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeLowIncomeWaivers: selectFinanceLowIncomeWaivers(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceLowIncomeWaivers: (personId) => dispatch(actionFinanceLowIncomeWaivers.getFinanceLowIncomeWaivers(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceLowIncomeWaiver: (personId, financeLowIncomeWaiverId) => dispatch(actionFinanceLowIncomeWaivers.removeFinanceLowIncomeWaiver(personId, financeLowIncomeWaiverId)),
    addOrUpdateFinanceLowIncomeWaiver: (personId, financeLowIncomeWaiver) => dispatch(actionFinanceLowIncomeWaivers.addOrUpdateFinanceLowIncomeWaiver(personId, financeLowIncomeWaiver)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getFinanceLowIncomeWaivers, personId} = props
            getPageLangs(personId, langCode, 'FinanceLowIncomeWaiversView')
            getFinanceLowIncomeWaivers(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Finance Low Income Waiver`})
        
  }, [])

  return <FinanceLowIncomeWaiversView {...props} />
}

export default Container
