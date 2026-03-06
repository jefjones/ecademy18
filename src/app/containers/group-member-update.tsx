import { useEffect } from 'react'
import GroupMemberUpdateView from '../views/GroupMemberUpdateView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionGroups from '../actions/groups'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectGroups, selectGroupIdCurrent } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    const {memberPersonId} = props.params
    let group = selectGroups(state) && selectGroups(state).filter(m => m.groupId === selectGroupIdCurrent(state))[0]
    let member = group && group.members && group.members.length > 0 && group.members.filter(m => m.personId === memberPersonId)[0]

    return {
        personId: selectMe(state) && selectMe(state).personId,
        langCode: selectMe(state) && selectMe(state).langCode,
        group,
        member,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    updateGroupMember: (personId, groupId, member) => dispatch(actionGroups.updateGroupMember(personId, groupId, member)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
          	const {personId, langCode, getPageLangs} = props
          	getPageLangs(personId, langCode, 'GroupMemberUpdateView')
        
  }, [])

  return !!props.member ? <GroupMemberUpdateView {...props} /> : null
}

export default Container
