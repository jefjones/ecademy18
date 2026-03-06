import React, {Component} from 'react';
import WorkSettingsView from '../views/WorkSettingsView';
import { connect } from 'react-redux';
import * as actionWorks from '../actions/works.js';
import * as actionChapters from '../actions/chapters.js';
import * as actionPageLang from '../actions/language-list';
import { selectWorkSummaryCurrent, selectMe, selectGroups } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state);
    const workMenu = ""; //selectWorkMenu(state);
    const workSummary = selectWorkSummaryCurrent(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        workMenu,
        workSummary,
        groupList: selectGroups(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    addOrUpdateDocument: (workRecord, isFileUpload) => dispatch(actionWorks.addOrUpdateDocument(workRecord, isFileUpload)),
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
  	getPageLangs(personId, langCode, 'WorkSettingsView');
  }

  render() {
    return this.props.workSummary ? <WorkSettingsView {...this.props} /> : null;
  }
}

export default storeConnector(Container);
