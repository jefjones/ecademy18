import { useEffect } from 'react'
import PeerGroupAddNewView from '../views/PeerGroupAddNewView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPeerGroup from '../actions/peer-group'
import * as actionPageLang from '../actions/language-list'
import { selectMe, selectGroups } from '../store'

const mapStateToProps = (state, props) => {
    const {groupChosen, peerGroupId} = props.params
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
        summary: group,
        subGroupCountOptions,
        assignedSubGroup: peerGroup && peerGroup.subGroups,
        peerGroupId: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.peerGroupId,
        subGroupCount: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.subGroupCount,
        peerGroupName: peerGroup && peerGroup.peerGroup && peerGroup.peerGroup.peerGroupName,
    }
}

const bindActionsToDispatch = dispatch => ({
    addOrUpdatePeerGroup: (peerGroup, subGroups) => dispatch(actionPeerGroup.addOrUpdatePeerGroup(peerGroup, subGroups)),
    deletePeerGroup: (personId, peerGroupId) => dispatch(actionPeerGroup.deletePeerGroup(personId, peerGroupId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})





function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
        	const {personId, langCode, getPageLangs} = props
        	getPageLangs(personId, langCode, 'PeerGroupAddNewView')
      
  }, [])

  const {summary} = props
      return summary ? <PeerGroupAddNewView {...props} /> : null
}

export default Container
