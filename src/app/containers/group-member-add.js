import React, {Component} from 'react';
import GroupMemberAddView from '../views/GroupMemberAddView';
import { connect } from 'react-redux';
import * as actionGroups from '../actions/groups.js';
import * as actionEditorInvitePending from '../actions/editor-invite-pending.js';
import * as actionPageLang from '../actions/language-list';
import { selectMe, selectGroups, selectGroupIdCurrent, selectEditorInvitePending } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {

    return {
        personId: selectMe(state) && selectMe(state).personId,
        langCode: selectMe(state) && selectMe(state).langCode,
        tabsData: {chosenTab: 'FieldEntry', tabs: [{id: 'FieldEntry', label: 'Field Entry'}, {id: 'BulkPaste', label: 'Bulk Paste'}]},
        editorInvitePending: selectEditorInvitePending(state) && selectEditorInvitePending(state).length > 0 &&
            selectEditorInvitePending(state).filter(m => m.groupId === selectGroupIdCurrent(state)),
        bulkDelimiterOptions: [{id: 'comma', label: ', comma'},
            {id: 'semicolon', label: '; semicolon'},
            {id: 'hyphen', label: '- hyphen'},
            {id: 'tab', label: 'tab'},
        ],
        fieldOptions: [
            {id: 'firstName', label: 'first name'},
            {id: 'lastName', label: 'last name'},
            {id: 'fullNameLastFirst', label: 'full name (last name first)'},
            {id: 'fullNameFirstFirst', label: 'full name (first name first)'},
            {id: 'memberId', label: 'internal member id'},
            {id: 'emailAddress', label: 'email address'},
            {id: 'phone', label: 'phone'},
        ],
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setGroupMembers: (personId, groupId, members) => dispatch(actionGroups.setGroupMembers(personId, groupId, members)),
    removeMember: (personId, groupId, member_personId) => dispatch(actionGroups.removeMember(personId, groupId, member_personId)),
    deleteInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.deleteInvite(personId, friendInvitationId)),
    acceptInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.acceptInvite(personId, friendInvitationId)),
    resendInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.resendInvite(personId, friendInvitationId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
      	const {personId, langCode, getPageLangs} = this.props;
      	getPageLangs(personId, langCode, 'GroupMemberAddView');
    }
    render() {
        //!this.props.group ? null :
        return <GroupMemberAddView {...this.props} />
    }
}

export default storeConnector(Container);
