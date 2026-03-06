import { useEffect } from 'react'
import WorkSettingsView from '../views/WorkSettingsView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as actionPageLang from '../actions/language-list'
import { selectWorkSummaryCurrent, selectMe, selectGroups } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state)
    const workMenu = ""; //selectWorkMenu(state);
    const workSummary = selectWorkSummaryCurrent(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        workMenu,
        workSummary,
        groupList: selectGroups(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    addOrUpdateDocument: (workRecord, isFileUpload) => dispatch(actionWorks.addOrUpdateDocument(workRecord, isFileUpload)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
      	const {personId, langCode, getPageLangs} = props
      	getPageLangs(personId, langCode, 'WorkSettingsView')
      
  }, [])

  return props.workSummary ? <WorkSettingsView {...props} /> : null
}

export default Container
