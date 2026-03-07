import { useEffect } from 'react'
import GroupSettingsView from '../views/GroupSettingsView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionGroups from '../actions/groups'
import * as actionWorks from '../actions/works'
import * as actionPersonConfig from '../actions/person-config'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectGroups, selectGroupIdCurrent, selectPersonConfig } from '../store'

const mapStateToProps = (state, props) => {
    const {groupChosen} = props.params
    let groupId = groupChosen ? groupChosen : selectGroupIdCurrent(state)
    let me = selectMe(state)
    let group = selectGroups(state) && selectGroups(state).length > 0 && selectGroups(state).filter(m => m.groupId === groupId)[0]

    return {
        personId: me.personId,
        langCode: me.langCode,
        languageChosen: 1,
        groupSummary: group,
        currentGroupId: selectGroupIdCurrent(state),
        personConfig: selectPersonConfig(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    setGroupCurrentSelected: (personId, groupId, masterWorkId, memberWorkId, goToPage) => dispatch(actionGroups.setGroupCurrentSelected(personId, groupId, masterWorkId, memberWorkId, goToPage)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    groupInit: (personId) => dispatch(actionGroups.init(personId)),
    updateGroup: (personId, groupId, groupName, internalId, description, goToPage)  => dispatch(actionGroups.updateGroup(personId, groupId, groupName, internalId, description, goToPage)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          	const {personId, langCode, getPageLangs} = props
          	getPageLangs(personId, langCode, 'GroupSettingsView')
        
  }, [])

  return !!props.groupSummary ? <GroupSettingsView {...props} /> : null
}

export default Container
