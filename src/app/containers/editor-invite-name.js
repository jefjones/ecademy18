import React, {Component} from 'react';
import EditorInviteNameView from '../views/EditorInviteNameView';
import { connect } from 'react-redux';
import * as editorInviteName from '../actions/editor-invite-name.js';
import * as fromEditorInviteWorkAssign from '../actions/editor-invite-work';
import * as actionEditorInvitePending from '../actions/editor-invite-pending.js';
import * as actionContacts from '../actions/contacts.js';
import * as editorInviteWork from '../actions/editor-invite-work.js';
import * as fromContacts from '../reducers/contacts.js';
import * as fromWorks from '../reducers/works.js';
import * as fromMe from '../reducers/login.js';
import * as actionPageLang from '../actions/language-list';
import { selectEditorInvitePending, selectEditorInviteName } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let contacts = fromContacts.selectContactsArray(state.contacts);
    let me = fromMe.selectMe(state.me);
		let works = fromWorks.selectWorks(state.works);

    return {
        personId: me.personId,
        langCode: me.langCode,
        editorInvitePending: selectEditorInvitePending(state),
        editorInviteName: selectEditorInviteName(state),
        contacts,
				works,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setNameAndEmail: (firstName, lastName, emailAddress, phone, inviteMessage) => dispatch(editorInviteName.setNameAndEmail(firstName, lastName, emailAddress, phone, inviteMessage)),
    blankOutWorkAssign: () => dispatch(fromEditorInviteWorkAssign.init()),
    deleteInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.deleteInvite(personId, friendInvitationId)),
    acceptInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.acceptInvite(personId, friendInvitationId)),
    resendInvite: (personId, friendInvitationId) => dispatch(actionEditorInvitePending.resendInvite(personId, friendInvitationId)),
    setContactCurrentSelected: (personId, contactPersonId, href) => dispatch(actionContacts.setContactCurrentSelected(personId, contactPersonId, href)),
		sendEditorInvite: (user_PersonId, editorInviteName, editorInviteWorkAssign) => dispatch(editorInviteWork.sendEditorInvite(user_PersonId, editorInviteName, editorInviteWorkAssign)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {personId, langCode, getPageLangs, blankOutWorkAssign} = this.props;
      	getPageLangs(personId, langCode, 'EditorInviteNameView');
        blankOutWorkAssign();
    }
    render() {
        return <EditorInviteNameView {...this.props} />
    }
}

export default storeConnector(Container);
