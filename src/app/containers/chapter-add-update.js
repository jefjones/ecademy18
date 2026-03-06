import React, {Component} from 'react';
import ChapterAddOrUpdateView from '../views/ChapterAddOrUpdateView';
import { connect } from 'react-redux';
import * as actionChapters from '../actions/chapters.js';
import * as actionWorks from '../actions/works.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionPageLang from '../actions/language-list';
import {selectMe, selectWorkStatusList, selectEditSeverityList, selectWorkSummaryCurrent, selectPersonConfig} from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    const workSummary = selectWorkSummaryCurrent(state);
    let chapter = props.params && props.params.chapterId && workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length > 0
        && workSummary.chapterOptions.filter(m => m.chapterId === props.params.chapterId)[0];

    let chapterCount = workSummary && workSummary.chapterOptions && workSummary.chapterOptions.length;
    let chapterSequenceOptions = [];
    for(var count = 1; count <= chapterCount; count++) {
        chapterSequenceOptions = chapterSequenceOptions ? chapterSequenceOptions.concat({label: count, id: count }) : [{label: count, id: count }];
    }
    //Add one more to the sequence count for the new chapter;
    chapterSequenceOptions = chapterSequenceOptions.concat({label: count, id: count });

    return {
        personId: me.personId,
        langCode: me.langCode,
        workId: workSummary.workId,
        chapter,
        chapterSequenceOptions,
        workStatusOptions: selectWorkStatusList(state),
        editSeverityOptions: selectEditSeverityList(state),
        workSummary,
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addOrUpdateChapter: (personId, workId, chapter, isFileUpload, isUpdate) => dispatch(actionChapters.addOrUpdateChapter(personId, workId, chapter, isFileUpload, isUpdate)),
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
      	getPageLangs(personId, langCode, 'ChapterAddOrUpdateView');
    }

    render() {
        return <ChapterAddOrUpdateView {...this.props} />
    }
}

export default storeConnector(Container);
