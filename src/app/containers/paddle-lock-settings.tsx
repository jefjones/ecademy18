import { useEffect } from 'react'
import PaddleLockSettingView from '../views/PaddleLockSettingView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionPaddlelocks from '../actions/paddlelocks'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectPaddlelocks, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        paddlelocks: selectPaddlelocks(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

const bindActionsToDispatch = dispatch => ({
  getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
  addOrUpdatePaddlelock: (personId, paddlelock) => dispatch(actionPaddlelocks.addOrUpdatePaddlelock(personId, paddlelock)),
  removePaddlelock: (personId, paddlelockId) => dispatch(actionPaddlelocks.removePaddlelock(personId, paddlelockId)),
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, getPaddlelocks, personId} = props
            getPageLangs(personId, langCode, 'PaddleLockSettingView')
            getPaddlelocks(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Padlock Settings`})
        
  }, [])

  return <PaddleLockSettingView {...props} />
}

export default Container
