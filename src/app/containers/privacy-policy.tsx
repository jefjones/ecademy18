import { useEffect } from 'react'
import PrivacyPolicyView from '../views/PrivacyPolicyView'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionPageLang from '../actions/language-list'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'

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
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'PrivacyPolicyView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Privacy Policy`})
        
  }, [])

  return <PrivacyPolicyView {...props} />
}

export default Container
