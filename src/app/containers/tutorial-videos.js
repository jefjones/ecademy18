import React, {Component} from 'react';
import TutorialVideoView from '../views/TutorialVideoView';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';
import { selectMe, selectTutorialVideos } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    return {
				loginData: me,
				langCode: me.langCode,
				tutorialVideos: selectTutorialVideos(state),
				tutorialLabel: props.params.label,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
	getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
        getPageLangs(personId, langCode, 'TutorialVideoView');
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Tutorial Videos`});
    }

    render() {
        return <TutorialVideoView {...this.props} />
    }
}

export default storeConnector(Container);
