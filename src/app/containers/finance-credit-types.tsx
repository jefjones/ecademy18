import { useEffect } from 'react'
import FinanceCreditTypesView from '../views/FinanceCreditTypesView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceCreditTypes from '../actions/finance-credit-types'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceCreditTypes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeCreditTypes: selectFinanceCreditTypes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceCreditTypes: (personId) => dispatch(actionFinanceCreditTypes.getFinanceCreditTypes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceCreditType: (personId, financeCreditTypeId) => dispatch(actionFinanceCreditTypes.removeFinanceCreditType(personId, financeCreditTypeId)),
    addOrUpdateFinanceCreditType: (personId, financeCreditType) => dispatch(actionFinanceCreditTypes.addOrUpdateFinanceCreditType(personId, financeCreditType)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getFinanceCreditTypes, personId} = props
            getPageLangs(personId, langCode, 'FinanceCreditTypesView')
            getFinanceCreditTypes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Credit Types`})
        
  }, [])

  return <FinanceCreditTypesView {...props} />
}

export default Container
