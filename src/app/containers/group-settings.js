import React, {Component} from 'react';
import GroupSettingsView from '../views/GroupSettingsView';
import { connect } from 'react-redux';
import * as actionGroups from '../actions/groups.js';
import * as actionWorks from '../actions/works.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionPageLang from '../actions/language-list';
import { selectMe, selectGroups, selectGroupIdCurrent, selectPersonConfig } from '../store.js';

const mapStateToProps = (state, props) => {
    const {groupChosen} = props.params;
    let groupId = groupChosen ? groupChosen : selectGroupIdCurrent(state);
    let me = selectMe(state);
    let group = selectGroups(state) && selectGroups(state).length > 0 && selectGroups(state).filter(m => m.groupId === groupId)[0];

    return {
        personId: me.personId,
        langCode: me.langCode,
        languageChosen: 1,
        groupSummary: group,
        currentGroupId: selectGroupIdCurrent(state),
        personConfig: selectPersonConfig(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    setGroupCurrentSelected: (personId, groupId, masterWorkId, memberWorkId, goToPage) => dispatch(actionGroups.setGroupCurrentSelected(personId, groupId, masterWorkId, memberWorkId, goToPage)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    groupInit: (personId) => dispatch(actionGroups.init(personId)),
    updateGroup: (personId, groupId, groupName, internalId, description, goToPage)  => dispatch(actionGroups.updateGroup(personId, groupId, groupName, internalId, description, goToPage)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
      	const {personId, langCode, getPageLangs} = this.props;
      	getPageLangs(personId, langCode, 'GroupSettingsView');
    }

    render() {
        return !!this.props.groupSummary ? <GroupSettingsView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
