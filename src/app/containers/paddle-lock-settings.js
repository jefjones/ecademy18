import React, {Component} from 'react';
import PaddleLockSettingView from '../views/PaddleLockSettingView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionPaddlelocks from '../actions/paddlelocks';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { selectMe, selectPaddlelocks, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        paddlelocks: selectPaddlelocks(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
  getPaddlelocks: (personId) => dispatch(actionPaddlelocks.getPaddlelocks(personId)),
  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
  addOrUpdatePaddlelock: (personId, paddlelock) => dispatch(actionPaddlelocks.addOrUpdatePaddlelock(personId, paddlelock)),
  removePaddlelock: (personId, paddlelockId) => dispatch(actionPaddlelocks.removePaddlelock(personId, paddlelockId)),
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, langCode, setMyVisitedPage, getPaddlelocks, personId} = this.props;
        getPageLangs(personId, langCode, 'PaddleLockSettingView');
        getPaddlelocks(personId);
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Padlock Settings`});
    }

    render() {
        return <PaddleLockSettingView {...this.props} />;
    }
}

export default storeConnector(Container);
