import { useEffect } from 'react'
import TutorialVideoView from '../views/TutorialVideoView'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import * as actionPageLang from '../actions/language-list'
import { useSelector, useDispatch } from 'react-redux'
import { selectMe, selectTutorialVideos } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    return {
				loginData: me,
				langCode: me.langCode,
				tutorialVideos: selectTutorialVideos(state),
				tutorialLabel: props.params.label,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'TutorialVideoView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Tutorial Videos`})
        
  }, [])

  return <TutorialVideoView {...props} />
}

export default Container
