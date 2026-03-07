import { useEffect } from 'react'
import FinanceGLCodesView from '../views/FinanceGLCodesView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionFinanceGLCodes from '../actions/finance-gl-codes'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectFinanceGLCodes, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        financeGLCodes: selectFinanceGLCodes(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getFinanceGLCodes: (personId) => dispatch(actionFinanceGLCodes.getFinanceGLCodes(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeFinanceGLCode: (personId, financeGLCodeId) => dispatch(actionFinanceGLCodes.removeFinanceGLCode(personId, financeGLCodeId)),
    addOrUpdateFinanceGLCode: (personId, financeGLCode) => dispatch(actionFinanceGLCodes.addOrUpdateFinanceGLCode(personId, financeGLCode)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getFinanceGLCodes, personId} = props
            getPageLangs(personId, langCode, 'FinanceGLCodesView')
            getFinanceGLCodes(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Finance GL Codes`})
        
  }, [])

  return <FinanceGLCodesView {...props} />
}

export default Container
