import React, {Component} from 'react';
import LockerSettingView from '../views/LockerSettingView';
import * as actionLockers from '../actions/lockers';
import * as actionPageLang from '../actions/language-list';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { connect } from 'react-redux';
import { selectMe, selectLockers, selectFetchingRecord } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);

		let levels = [
			{ id: '1', label: '1' },
			{ id: '2', label: '2' },
			{ id: '3', label: '3' },
			{ id: '4', label: '4' },
			{ id: '5', label: '5' },
			{ id: '6', label: '6' },
		]

    return {
        personId: me.personId,
        langCode: me.langCode,
				levels: levels,
        lockers: selectLockers(state),
				fetchingRecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getLockers: (personId) => dispatch(actionLockers.getLockers(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    addOrUpdateLocker: (personId, locker) => dispatch(actionLockers.addOrUpdateLocker(personId, locker)),
    removeLocker: (personId, lockerId) => dispatch(actionLockers.removeLocker(personId, lockerId)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {

  componentDidMount() {
      const {getPageLangs, langCode, setMyVisitedPage, getLockers, personId} = this.props;
      getPageLangs(personId, langCode, 'LockerSettingView');
      getLockers(personId);
      this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Locker Settings`});
  }


    render() {
        return <LockerSettingView {...this.props} />;
    }
}

export default storeConnector(Container);
