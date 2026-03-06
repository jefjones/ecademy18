import React, {Component} from 'react';
import WorkDownloadView from '../views/WorkDownloadView';
import { connect } from 'react-redux';
import * as fromMe from '../reducers/login.js';
import * as actionWorks from '../actions/works.js';
import * as actionChapters from '../actions/chapters.js';
import * as actionEditReview from '../actions/edit-review.js';
import * as actionPageLang from '../actions/language-list';

import { selectWorkSummaryCurrent, selectWorkIdCurrent, selectLanguageList, selectChapterTabText} from '../store.js';

const mapStateToProps = state => {
    let me = fromMe.selectMe(state.me);
    const currentWork = selectWorkSummaryCurrent(state);
    //Help toDo:  The selectChapterTabText has changed.  See reducers/edit-review.js
    const chapterText = selectChapterTabText(state, selectWorkIdCurrent(state))

    return {
        personId: me.personId,
        langCode: me.langCode,
        fileName: currentWork.fileName,
        workId: currentWork.workId,
        chapterId: currentWork.chapterId,
        languageId: currentWork.languageId,
        owner_personId: currentWork.personId,
        workSummary: currentWork,
        chapterOptions: currentWork.chapterOptions && currentWork.chapterOptions,
        languageOptions: selectLanguageList(state),
        chapterText,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    getChapterText: (personId, workId, chapterId, languageId) => dispatch(actionEditReview.getChapterText(personId, workId, chapterId, languageId)),
    downloadWork: (personId, workId, chapterId, languageId) => dispatch(actionWorks.downloadWork(personId, workId, chapterId, languageId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, downloadWork, getChapterText, personId, workId, chapterId, languageId} = this.props;
        getChapterText(personId, workId, chapterId, languageId);
        downloadWork(personId, workId, chapterId, languageId);
        getPageLangs(personId, langCode, 'WorkDownloadView');
    }

    render() {
        if (!this.props.chapterText) return null;
    return <WorkDownloadView {...this.props} />
  }
}

export default storeConnector(Container);
