import { useEffect } from 'react'
import ChapterSplitterView from '../views/ChapterSplitterView/ChapterSplitterView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionChapter from '../actions/chapters'
import * as actionEditReview from '../actions/edit-review'
import * as actionLeftSidePanel from '../actions/left-side-panel'
import * as actionPageLang from '../actions/language-list'
//import MediaQueryable from 'react-media-queryable'; //https://github.com/substantial/react-media-queryable

import { selectMe, selectWorkSummaryCurrent, selectWorkIdCurrent, selectChapterText, selectLeftSidePanelOpen} from '../store'

 let mediaQueries = {
   small: "(max-width: 800px)",
   large: "(min-width: 801px)"
 }

const mapStateToProps = (state, props) => {
    const workSummary = selectWorkSummaryCurrent(state)
    const chapterText = selectChapterText(state, selectWorkIdCurrent(state)) ? selectChapterText(state, selectWorkIdCurrent(state)) : "Start writing or paste in your text...<br/><br/><br/><br/><br/><br/>"

  return {
    personId: selectMe(state).personId,
    langCode: selectMe(state).langCode,
    authorPersonId: workSummary && workSummary.authorPersonId,
    workId: workSummary && workSummary.workId,
    chapterId: workSummary && workSummary.chapterId_current,
    languageId: workSummary && workSummary.languageId_current,
    leftSidePanelOpen: selectLeftSidePanelOpen(state),
    chapterText,
    workSummary,
  }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    splitChapter: (personId, workId, chapterId, newSections) => dispatch(actionChapter.splitChapter(personId, workId, chapterId, newSections)),
    getChapterText: (personId, workId, chapterId, languageId) => dispatch(actionEditReview.getChapterText(personId, workId, chapterId, languageId)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    toggleLeftSidePanelOpen: () => dispatch(actionLeftSidePanel.toggleLeftSidePanelOpen()),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {personId, workId, chapterId, languageId, getPageLangs, langCode, getChapterText} = props
            getChapterText(personId, workId, chapterId, languageId)
            getPageLangs(personId, langCode, 'ChapterSplitterView')
        
  }, [])

  if (!props.chapterText || !props.chapterId || !props.chapterId) return null
          return (
              <ChapterSplitterView {...props} />
          )
}

export default Container


// <MediaQueryable mediaQueries={mediaQueries} defaultMediaQuery="small">
//     <ChapterSplitterView {...this.props} />
// </MediaQueryable>
