import React, {Component} from 'react';
import PeerGroupAddNewView from '../views/PeerGroupAddNewView';
import { connect } from 'react-redux';
import * as actionPeerGroup from '../actions/peer-group.js';
import * as actionPageLang from '../actions/language-list';
import { selectMe, selectGroups } from '../store.js';

const mapStateToProps = (state, props) => {
    const {groupChosen, peerGroupId} = props.params;
    let me = selectMe(state);
    let group = selectGroups(state) && selectGroups(state).filter(m => m.groupId === groupChosen)[0];

    let peerGroup = (peerGroupId && group && group.peerGroups && group.peerGroups.filter(({peerGroup}) => peerGroup.peerGroupId === peerGroupId)[0]) || [];

    let subGroupCountOptions = []
    let maxLength = group && group.members && group.members.length ? group.members.length : 100;
    for(var i = 1; i <= maxLength; i++) {
        let option = { id: i, label: i};
        subGroupCountOptions = subGroupCountOptions ? subGroupCountOptions.concat(option) : [option];
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
};

const bindActionsToDispatch = dispatch => ({
    addOrUpdatePeerGroup: (peerGroup, subGroups) => dispatch(actionPeerGroup.addOrUpdatePeerGroup(peerGroup, subGroups)),
    deletePeerGroup: (personId, peerGroupId) => dispatch(actionPeerGroup.updatePeerGroup(personId, peerGroupId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
  mergeAllProps
);

class Container extends Component {
  componentDidMount() {
    	const {personId, langCode, getPageLangs} = this.props;
    	getPageLangs(personId, langCode, 'PeerGroupAddNewView');
  }

  render() {
      const {summary} = this.props;
    return summary ? <PeerGroupAddNewView {...this.props} /> : null;
  }
}

export default storeConnector(Container);
