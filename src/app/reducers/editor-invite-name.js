import * as types  from '../actions/actionTypes';

export default function(state = {}, action) {
  switch (action.type) {
    case types.EDITOR_INVITE_NAME_EMAIL:
      //This sets a new EditorInviteName object in the store and will overwrite any previously existing one.
      //  This record is a holder of data until the user goes to the next step of assigning one or more documents, which will be the editorInviteWork.
      //  So far, we just have first name, last name, and email address here.
      let newInvite = action.payload;
      return newInvite ? newInvite : state;

    default:
        return state;
  }
}

export const selectEditorInviteName = (state) => state;
