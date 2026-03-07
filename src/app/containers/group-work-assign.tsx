import { useEffect } from 'react'
import GroupWorkAssignView from '../views/GroupWorkAssignView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionPeerGroup from '../actions/peer-group'
import * as actionGroupWorkAssignAccess from '../actions/group-work-assign-access'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectGroups, selectWorkSummary, selectGroupWorkAssignAccess } from '../store'

const mapStateToProps = (state, props) => {
    const {groupChosen, masterWorkId, peerGroupId} = props.params
    let me = selectMe(state)
    let group = selectGroups(state) && selectGroups(state).filter(m => m.groupId === groupChosen)[0]
    let peerGroup = (peerGroupId && group && group.peerGroups && group.peerGroups.filter(({peerGroup}) => peerGroup.peerGroupId === peerGroupId)[0]) || []

    let subGroupCountOptions = []
    let maxLength = group && group.members && group.members.length ? group.members.length : 100
    for(let i = 1; i <= maxLength; i++) {
        let option = { id: i, label: i}
        subGroupCountOptions = subGroupCountOptions ? subGroupCountOptions.concat(option) : [option]
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        masterWorkId,
        groupSummary: group,
        workSummary: selectWorkSummary(state, masterWorkId),
        subGroupCountOptions,
        accessAssigned: selectGroupWorkAssignAccess(state),
        peerGroupId: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.peerGroupId,
        subGroupCount: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.subGroupCount,
        peerGroupName: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.peerGroupName,
    }
}

const bindActionsToDispatch = dispatch => ({
    addOrUpdatePeerGroup: (peerGroup, subGroups) => dispatch(actionPeerGroup.addOrUpdatePeerGroup(peerGroup, subGroups)),
    deletePeerGroup: (personId, peerGroupId) => dispatch(actionPeerGroup.deletePeerGroup(personId, peerGroupId)),
    addUpdateGroupWorkAssignAccess: (accessAssigned) => dispatch(actionGroupWorkAssignAccess.addUpdateGroupWorkAssignAccess(accessAssigned)),
    initGroupWorkAssignAccess: (personId, groupId, masterWorkId) => dispatch(actionGroupWorkAssignAccess.init(personId, groupId, masterWorkId)),
    copyPeerGroupGroupWorkAssignAccess: (personId, masterWorkId, previousPeerGroupId) => dispatch(actionGroupWorkAssignAccess.copyPeerGroupGroupWorkAssignAccess(personId, masterWorkId, previousPeerGroupId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})





function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, initGroupWorkAssignAccess, personId, groupSummary, masterWorkId} = props
            initGroupWorkAssignAccess(personId, groupSummary.groupId, masterWorkId)
            getPageLangs(personId, langCode, 'GroupWorkAssignView')
        
  }, [])

  const {groupSummary, workSummary, accessAssigned} = props
          return workSummary && groupSummary && accessAssigned && accessAssigned.personId ? <GroupWorkAssignView {...props} /> : null
}

export default Container
