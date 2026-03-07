import { useEffect } from 'react'
import DraftSettingsView from '../views/DraftSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as fromMe from '../reducers/login'
import * as actionWorks from '../actions/works'
import * as actionChapters from '../actions/chapters'
import * as actionDraftSettings from '../actions/draft-settings'
import * as actionPersonConfig from '../actions/person-config'

import { selectWorkSummaryCurrent, selectDraftSettings, selectPersonConfig } from '../store'

const mapStateToProps = state => {
    let me = fromMe.selectMe(state.me)
    const currentWork = selectWorkSummaryCurrent(state)
    const draftSettings = selectDraftSettings(state)

    return {
        personId: me.personId,
        workId: currentWork.workId,
        chapterId: currentWork.chapterId,
        languageId: currentWork.languageId,
        draftSettings,
        workSummary: currentWork,
        personConfig: selectPersonConfig(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    getDraftSettings: (personId, workId, chapterId, languageId) => dispatch(actionDraftSettings.init(personId, workId, chapterId, languageId)),
    addDraftSetting: (personId, workId, chapterId, languageId, name, isFromCurrent, isFromDataRecovery) => dispatch(actionDraftSettings.addDraftSetting(personId, workId, chapterId, languageId, name, isFromCurrent, isFromDataRecovery)),
    deleteDraftSetting: (personId, draftComparisonId) => dispatch(actionDraftSettings.deleteDraftSetting(personId, draftComparisonId)),
    toggleDraftSettingChosen: (personId, draftComparisonId, isChosen) => dispatch(actionDraftSettings.toggleDraftSettingChosen(personId, draftComparisonId, isChosen)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getDraftSettings, personId, workId, chapterId, languageId} = props
            getDraftSettings(personId, workId, chapterId, languageId)
        
  }, [])

  if (!props.draftSettings) return null
          return <DraftSettingsView {...props} />
}

export default Container
