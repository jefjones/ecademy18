import React, {Component} from 'react';
import WorkSectionsView from '../views/WorkSectionsView';
import { connect } from 'react-redux';
import * as actionWorks from '../actions/works.js';
import * as actionChapters from '../actions/chapters.js';
import * as fromWorks from '../reducers/works.js';
import * as actionPersonConfig from '../actions/person-config.js';
import * as actionPageLang from '../actions/language-list';
import { selectWorkSummaryCurrent, selectMe, selectWorkIdCurrent, selectPersonConfig } from '../store.js';

const mapStateToProps = state => {
    let me = selectMe(state);
    let sections = selectWorkIdCurrent(state) && fromWorks.selectChaptersArray(state.works, selectWorkIdCurrent(state));
    let sectionSummaries = sections && sections.map(chapter => fromWorks.selectChapterSummary(state.works, selectWorkIdCurrent(state), selectWorkIdCurrent(state), chapter, me.personId));
    const workSummary = selectWorkSummaryCurrent(state);

    return {
        sectionSummaries,
        workSummary,
        personId: me.personId,
        langCode: me.langCode,
        personConfig: selectPersonConfig(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    updateChapterDueDate: (personId, workId, chapterId, languageId, dueDate) => dispatch(actionChapters.updateChapterDueDate(personId, workId, chapterId, languageId, dueDate)),
    onChangeSequence: (personId, workId, chapterId, sequence) => dispatch(actionChapters.onChangeSequence(personId, workId, chapterId, sequence)),
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
  	getPageLangs(personId, langCode, 'WorkSectionsView');
  }
  render() {
    return this.props.sectionSummaries ? <WorkSectionsView {...this.props} /> : null;
  }
}

export default storeConnector(Container);
