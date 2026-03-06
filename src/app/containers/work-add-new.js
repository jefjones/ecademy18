import React, {Component} from 'react';
import WorkAddView from '../views/WorkAddView';
import { connect } from 'react-redux';
import * as actionWorks from '../actions/works.js';
import * as fromWorks from '../reducers/works.js';
import * as actionChapters from '../actions/chapters.js';
import * as actionWorkFilter from '../actions/works.js';
import * as actionLanguageList from '../actions/language-list';
import * as actionPageLang from '../actions/language-list';

import { selectMe, selectLanguageList, selectGroups } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let isAuthorAlready = fromWorks.selectWorks(state.works) ? fromWorks.selectWorks(state.works).filter(m => m.personId === me.personId)[0] : [];
    let isNewUser = !isAuthorAlready;
    let isWorkNameChange = false;

    return {
        personId: me.personId,
        langCode: me.langCode,
        isNewUser,
        isWorkNameChange,
        languageChosen: 1,
        groupChosen: props && props.params && props.params.groupChosen,
        workId: null,
        workName: null,
        hasSections: null,
        languageList: selectLanguageList(state),
        groupList: selectGroups(state),
				parentWorkFolderId: props.params && props.params.parentWorkFolderId,
				workFolderId: props.params && props.params.workFolderId,
				mineOrOthers: props.params && props.params.mineOrOthers,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    setWorkCurrentSelected: (personId, workId, chapterId, languageId, goToPage) => dispatch(actionWorks.setWorkCurrentSelected(personId, workId, chapterId, languageId, goToPage)),
    deleteWork: (personId, workId) => dispatch(actionWorks.deleteWork(personId, workId)),
    deleteChapter: (personId, workId, chapterId) => dispatch(actionChapters.deleteChapter(personId, workId, chapterId)),
    addOrUpdateDocument: (workRecord, isFileUpload) => dispatch(actionWorks.addOrUpdateDocument(workRecord, isFileUpload)),
    getWorkList: (personId) => dispatch(actionWorkFilter.init(personId)),
    getLanguageList: () => dispatch(actionLanguageList.init()),
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
        const {personId, getPageLangs, langCode, getLanguageList} = this.props;
        getLanguageList();
        getPageLangs(personId, langCode, 'WorkAddView');
    }

    render() {
        return <WorkAddView {...this.props} />
    }
}

export default storeConnector(Container);
