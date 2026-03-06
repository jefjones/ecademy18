import { useEffect } from 'react'
import ChapterAddOrUpdateView from '../views/ChapterAddOrUpdateView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionChapters from '../actions/chapters'
import * as actionWorks from '../actions/works'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'
import {selectMe, selectWorkStatusList, selectEditSeverityList, selectWorkSummaryCurrent, selectPersonConfig} from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    const workSummary = selectWorkSummaryCurrent(state)
    let chapter = props.params && props.params.chapterId && workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length > 0
        && workSummary.chapterOptions.filter(m => m.chapterId === props.params.chapterId)[0]

    let chapterCount = workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length
    let chapterSequenceOptions = []
    for(let count = 1; count <= chapterCount; count++) {
        chapterSequenceOptions = chapterSequenceOptions ? chapterSequenceOptions.concat({label: count, id: count }) : [{label: count, id: count }]
    }
    //Add one more to the sequence count for the new chapter;
    chapterSequenceOptions = chapterSequenceOptions.concat({label: count, id: count })

    return {
        personId: me.personId,
        langCode: me.langCode,
        workId: workSummary.workId,
        chapter,
        chapterSequenceOptions,
        workStatusOptions: selectWorkStatusList(state),
        editSeverityOptions: selectEditSeverityList(state),
        workSummary,
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addOrUpdateChapter: (personId, workId, chapter, isFileUpload, isUpdate) => dispatch(actionChapters.addOrUpdateChapter(personId, workId, chapter, isFileUpload, isUpdate)),
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
          	getPageLangs(personId, langCode, 'ChapterAddOrUpdateView')
        
  }, [])

  return <ChapterAddOrUpdateView {...props} />
}

export default Container
