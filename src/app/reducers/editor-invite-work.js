import * as types  from '../actions/actionTypes';

export default function(state=[], action) {
  switch (action.type) {
    case types.EDITOR_INVITE_WORK_CHAPTERS_INIT:
        return [];  //This is necessary to blank this out on a new invite request which starts with the EditorInviteName

    case types.EDITOR_INVITE_WORK_CHAPTERS:
      //This adds to the EditorInviteWorkAssign object (which gets initialized when the EditorInviteName record is started)
      //  This record is a holder of data until the user submits the invitation to the editor.  They will also get an email listing the
      //    one or more documents that they have been give for editing.
      //  the objects looks like:  [ {workId: 123, chapterIdList: [567, 789], languageIdList: [1]}, {workId: 345, chapterIdList: [555, 777], languageIdList: [1, 161]} ]
      //  If part of the action.payload comes through with a 'deleteChoice: true' value, then the workId assignment needs to be erased from this object.
      let {workId, chapterIdList, languageIdList, deleteChoice} = action.payload;
      let newState = state;
      if (deleteChoice && deleteChoice !== "skip") {
          newState = state.filter(m => m.workId !== workId);
      } else {
          newState = state.filter(m => m.workId !== workId);
          newState = newState && newState.length > 0
                ? newState.concat({workId, chapterIdList, languageIdList})
                : [{workId, chapterIdList, languageIdList}];
      }
      return newState;

    default:
        return state;
  }
}

export const selectEditorInviteWorkAssign = (state) => state;
