import { useEffect } from 'react'
import RegInstructionsView from '../views/RegInstructionsView'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionPageLang from '../actions/language-list'
import { useSelector, useDispatch } from 'react-redux'
import {selectMe} from '../store'

const mapStateToProps = (state, props) => {
		let me = selectMe(state)

    return {
	    langCode: me.langCode,
    }
}

const bindActionsToDispatch = dispatch => ({
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'RegInstructionsView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Registration Instructions`})
        
  }, [])

  return <RegInstructionsView {...props} />
}

export default Container
