import { useEffect } from 'react'
import WorkSectionsView from '../views/WorkSectionsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as fromWorks from '../reducers/works'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'
import { selectWorkSummaryCurrent, selectMe, selectWorkIdCurrent, selectPersonConfig } from '../store'

const mapStateToProps = state => {
    let me = selectMe(state)
    let sections = selectWorkIdCurrent(state) && fromWorks.selectChaptersArray(state.works, selectWorkIdCurrent(state))
    let sectionSummaries = sections && sections.map(chapter => fromWorks.selectChapterSummary(state.works, selectWorkIdCurrent(state), selectWorkIdCurrent(state), chapter, me.personId))
    const workSummary = selectWorkSummaryCurrent(state)

    return {
        sectionSummaries,
        workSummary,
        personId: me.personId,
        langCode: me.langCode,
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    onChangeSequence: (personId, workId, chapterId, sequence) => dispatch(actionChapters.onChangeSequence(personId, workId, chapterId, sequence)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
      	const {personId, langCode, getPageLangs} = props
      	getPageLangs(personId, langCode, 'WorkSectionsView')
      
  }, [])

  return props.sectionSummaries ? <WorkSectionsView {...props} /> : null
}

export default Container
