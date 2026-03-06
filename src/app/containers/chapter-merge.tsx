import { useEffect } from 'react'
import ChapterMergeView from '../views/ChapterMergeView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionChapters from '../actions/chapters'
import * as actionWorks from '../actions/works'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'
import {selectMe, selectWorkSummaryCurrent, selectPersonConfig} from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state)
    const workSummary = selectWorkSummaryCurrent(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        workId: workSummary.workId,
        chapterOptions: workSummary.chapterOptions,
        workSummary,
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    mergeChapters: (personId, workId, fromChapterId, toChapterId) => dispatch(actionChapters.mergeChapters(personId, workId, fromChapterId, toChapterId)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
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
          	getPageLangs(personId, langCode, 'ChapterMergeView')
        
  }, [])

  return <ChapterMergeView {...props} />
}

export default Container
