import React, {Component} from 'react';
import DraftSettingsView from '../views/DraftSettingsView';
import { connect } from 'react-redux';
import * as fromMe from '../reducers/login.js';
import * as actionWorks from '../actions/works.js';
import * as actionChapters from '../actions/chapters.js';
import * as actionDraftSettings from '../actions/draft-settings.js';
import * as actionPersonConfig from '../actions/person-config.js';

import { selectWorkSummaryCurrent, selectDraftSettings, selectPersonConfig } from '../store.js';

const mapStateToProps = state => {
    let me = fromMe.selectMe(state.me);
    const currentWork = selectWorkSummaryCurrent(state);
    const draftSettings = selectDraftSettings(state)

    return {
        personId: me.personId,
        workId: currentWork.workId,
        chapterId: currentWork.chapterId,
        languageId: currentWork.languageId,
        draftSettings,
        workSummary: currentWork,
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    getDraftSettings: (personId, workId, chapterId, languageId) => dispatch(actionDraftSettings.init(personId, workId, chapterId, languageId)),
    addDraftSetting: (personId, workId, chapterId, languageId, name, isFromCurrent, isFromDataRecovery) => dispatch(actionDraftSettings.addDraftSetting(personId, workId, chapterId, languageId, name, isFromCurrent, isFromDataRecovery)),
    deleteDraftSetting: (personId, draftComparisonId) => dispatch(actionDraftSettings.deleteDraftSetting(personId, draftComparisonId)),
    toggleDraftSettingChosen: (personId, draftComparisonId, isChosen) => dispatch(actionDraftSettings.toggleDraftSettingChosen(personId, draftComparisonId, isChosen)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    updatePersonConfig: (personId, field, value)  => dispatch(actionPersonConfig.updatePersonConfig(personId, field, value)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getDraftSettings, personId, workId, chapterId, languageId} = this.props;
        getDraftSettings(personId, workId, chapterId, languageId);
    }

    render() {
        if (!this.props.draftSettings) return null;
        return <DraftSettingsView {...this.props} />
  }
}

export default storeConnector(Container);
