import React, {Component} from 'react';
import ChapterMergeView from '../views/ChapterMergeView';
import { connect } from 'react-redux';
import * as actionChapters from '../actions/chapters.js';
import * as actionWorks from '../actions/works.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionPageLang from '../actions/language-list';
import {selectMe, selectWorkSummaryCurrent, selectPersonConfig} from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state);
    const workSummary = selectWorkSummaryCurrent(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        workId: workSummary.workId,
        chapterOptions: workSummary.chapterOptions,
        workSummary,
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    mergeChapters: (personId, workId, fromChapterId, toChapterId) => dispatch(actionChapters.mergeChapters(personId, workId, fromChapterId, toChapterId)),
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    updateChapterComment: (personId, workId, chapterId, comment) => dispatch(actionChapters.updateChapterComment(personId, workId, chapterId, comment)),
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
      	getPageLangs(personId, langCode, 'ChapterMergeView');
    }

    render() {
        return <ChapterMergeView {...this.props} />
    }
}

export default storeConnector(Container);
