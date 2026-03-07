import { useEffect } from 'react'
import EditorInviteNameView from '../views/EditorInviteNameView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as editorInviteName from '../actions/editor-invite-name'
import * as fromEditorInviteWorkAssign from '../actions/editor-invite-work'
import * as actionEditorInvitePending from '../actions/editor-invite-pending'
import * as actionContacts from '../actions/contacts'
import * as editorInviteWork from '../actions/editor-invite-work'
import * as fromContacts from '../reducers/contacts'
import * as fromWorks from '../reducers/works'
import * as fromMe from '../reducers/login'
import * as actionPageLang from '../actions/language-list'
import { selectEditorInvitePending, selectEditorInviteName } from '../store'

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let contacts = fromContacts.selectContactsArray(state.contacts)
    let me = fromMe.selectMe(state.me)
		let works = fromWorks.selectWorks(state.works)

    return {
        personId: me.personId,
        langCode: me.langCode,
        editorInvitePending: selectEditorInvitePending(state),
        editorInviteName: selectEditorInviteName(state),
        contacts,
				works,
    }
}

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
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {personId, langCode, getPageLangs, blankOutWorkAssign} = props
          	getPageLangs(personId, langCode, 'EditorInviteNameView')
            blankOutWorkAssign()
        
  }, [])

  return <EditorInviteNameView {...props} />
}

export default Container
