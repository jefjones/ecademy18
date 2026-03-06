import React, {Component} from 'react';
import MyProfileView from '../views/MyProfileView';
import { connect } from 'react-redux';
import * as actionMyProfile from '../actions/my-profile.js';
import * as actionFetchingRecord from '../actions/fetching-record.js';
import * as actionLanguageList from '../actions/language-list';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import * as actionPageLang from '../actions/language-list';
import { selectMe, selectMyProfile, selectLanguageList, selectAccessRoles, selectFetchingRecord } from '../store.js';

const mapStateToProps = state => {
		let me = selectMe(state);
    return {
        personId: me.personId,
        langCode: me.langCode,
        user: selectMyProfile(state),
        languageOptions: selectLanguageList(state),
				accessRoles: selectAccessRoles(state),
				fetchingrecord: selectFetchingRecord(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    getMyProfile: (personId) => dispatch(actionMyProfile.getMyProfile(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setMyProfile: (personId, field, value) => dispatch(actionMyProfile.setMyProfile(personId, field, value)),
    updateMyProfile: (user) => dispatch(actionMyProfile.updateMyProfile(user)),
		resolveFetchingRecordMyProfile: () => dispatch(actionFetchingRecord.resolveFetchingRecordMyProfile()),
		getLanguageList: () => dispatch(actionLanguageList.init()),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
    removeProfilePicture: (personId, profilePictureId) => dispatch(actionMyProfile.removeProfilePicture(personId, profilePictureId)),
});

const storeConnector = connect(
	  mapStateToProps,
	  bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
				const {getPageLangs, langCode, personId, setMyVisitedPage, getMyProfile, getLanguageList} = this.props;
				getPageLangs(personId, langCode, 'MyProfileView');
        getMyProfile(personId);
				getLanguageList();
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `My Profile`});
    }

    render() {
        return <MyProfileView {...this.props} />;
    }
}

export default storeConnector(Container);
