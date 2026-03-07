import { useEffect } from 'react'
import WorkUploadFileView from '../views/WorkUploadFileView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as fromWorks from '../reducers/works'
import * as actionChapters from '../actions/chapters'
import * as actionWorkFilter from '../actions/works'
import * as actionTextProcessingProgress from '../actions/text-processing-progress'
import * as actionPageLang from '../actions/language-list'

import { selectMe, selectWorkSummaryCurrent, selectTextProcessingProgress } from '../store'

//At this point the user would have come from the WorkAddOrUpdate page or the ChapterAddOrUpdate page.
//So we will have the work set as the workId_current.  We can get the name and the workId and languageId from the store.

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state)
    //We don't want a current work for this page nor for the MobileHeader to show the current work.  The idea is to add a new one.
    //  Later, when we want to update a work, we can use that current work.
    let isAuthorAlready = fromWorks.selectWorks(state.works) ? fromWorks.selectWorks(state.works).filter(m => m.personId === me.personId)[0] : []
    let isNewUser = !isAuthorAlready
    let work = selectWorkSummaryCurrent(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
        isNewUser,
        isExistingChapter: false,
        workSummary: work,
        textProcessingProgress: selectTextProcessingProgress(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    getWorkList: (personId) => dispatch(actionWorkFilter.init(personId)),
    getTextProcessingProgress: (personId) => dispatch(actionTextProcessingProgress.getTextProcessingProgress(personId)),
    setBlankTextProcessingProgress: (personId) => dispatch(actionTextProcessingProgress.setBlankTextProcessingProgress(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {personId, langCode, getPageLangs} = props
        	getPageLangs(personId, langCode, 'WorkUploadFileView')
      
  }, [])

  return <WorkUploadFileView {...props} />
}

export default Container
