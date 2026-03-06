import React, {Component} from 'react';
import UserAddView from '../views/UserAddView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as actionUsers from '../actions/users.js';
import * as loginUser from '../actions/login.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import {doSort} from '../utils/sort.js';
import { selectMe, selectMyFrequentPlaces, selectUsers, selectCompanyConfig, selectAccessRoles, selectPersonConfig } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
		let userRole = props.params && props.params.userRole;
		let personConfig = selectPersonConfig(state);
    let users = selectUsers(state, userRole);
		let user = users && users.length > 0 && users.filter(m => m.personId === props.params.userPersonId)[0]
		let gradeLevels = personConfig && personConfig.gradeLevels;
		if (user && user.personId) {
				let userGradeLevels = doSort(user.gradeLevels, { sortField: 'sequence', isAsc: true, isNumber: true });
				user.fromGradeLevelId = userGradeLevels && userGradeLevels.length > 0 && userGradeLevels[0].gradeLevelId;
				user.toGradeLevelId = userGradeLevels && userGradeLevels.length > 0 && userGradeLevels[userGradeLevels.length-1*1].gradeLevelId;
		}

    return {
				userRole,
				user,
				personId: me.personId,
				langCode: me.langCode,
				loginData: selectMe(state),
				userPersonId: props.params && props.params.userPersonId,
        companyConfig: selectCompanyConfig(state),
        existingUsers: selectUsers(state, userRole),
				accessRoles: selectAccessRoles(state),
				gradeLevels,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = (dispatch, props) => {
		return {
			  getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		    addUser: (personId, user) => dispatch(actionUsers.addUser(personId, user)),
		    updateUser: (personId, user) => dispatch(actionUsers.updateUser(personId, user)),
		    removeUser: (personId, member_personId) => dispatch(actionUsers.removeUser(personId, member_personId)),
				login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
				isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
				setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
				setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
		}
};

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
	      const {getPageLangs, langCode, setMyVisitedPage, personId} = this.props;
	      getPageLangs(personId, langCode, 'UserAddView');
	      this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Add User`});
	  }

    render() {
        return <UserAddView {...this.props} />
    }
}

export default storeConnector(Container);
