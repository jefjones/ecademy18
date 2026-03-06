import { useEffect } from 'react'
import LearningPathwaysSettingsView from '../views/LearningPathwaysSettingsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionLearningPathways from '../actions/learning-pathways'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectLearningPathways, selectFetchingRecord } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        learningPathways: selectLearningPathways(state),
				fetchingRecord: selectFetchingRecord(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    learningPathwaysInit: (personId) => dispatch(actionLearningPathways.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeLearningPathway: (personId, learningPathwayId) => dispatch(actionLearningPathways.removeLearningPathway(personId, learningPathwayId)),
    addOrUpdateLearningPathway: (personId, learningPathway) => dispatch(actionLearningPathways.addOrUpdateLearningPathway(personId, learningPathway)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, learningPathwaysInit, personId} = props
            getPageLangs(personId, langCode, 'LearningPathwaysSettingsView')
            learningPathwaysInit(personId)
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Subject Discipline Entry`})
        
  }, [])

  return <LearningPathwaysSettingsView {...props} />
}

export default Container
