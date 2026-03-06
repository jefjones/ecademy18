import { useEffect } from 'react'
import WorkAddView from '../views/WorkAddView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as fromWorks from '../reducers/works'
import * as actionChapters from '../actions/chapters'
import * as actionWorkFilter from '../actions/works'
import * as actionLanguageList from '../actions/language-list'
import * as actionPageLang from '../actions/language-list'

import { selectMe, selectLanguageList, selectGroups } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let isAuthorAlready = fromWorks.selectWorks(state.works) ? fromWorks.selectWorks(state.works).filter(m => m.personId === me.personId)[0] : []
    let isNewUser = !isAuthorAlready
    let isWorkNameChange = false

    return {
        personId: me.personId,
        langCode: me.langCode,
        isNewUser,
        isWorkNameChange,
        languageChosen: 1,
        groupChosen: props && props.params && props.params.groupChosen,
        workId: null,
        workName: null,
        hasSections: null,
        languageList: selectLanguageList(state),
        groupList: selectGroups(state),
				parentWorkFolderId: props.params && props.params.parentWorkFolderId,
				workFolderId: props.params && props.params.workFolderId,
				mineOrOthers: props.params && props.params.mineOrOthers,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    addOrUpdateDocument: (workRecord, isFileUpload) => dispatch(actionWorks.addOrUpdateDocument(workRecord, isFileUpload)),
    getWorkList: (personId) => dispatch(actionWorkFilter.init(personId)),
    getLanguageList: () => dispatch(actionLanguageList.init()),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})



function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {personId, getPageLangs, langCode, getLanguageList} = props
            getLanguageList()
            getPageLangs(personId, langCode, 'WorkAddView')
        
  }, [])

  return <WorkAddView {...props} />
}

export default Container
