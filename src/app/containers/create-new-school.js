import React, {Component} from 'react';
import CreateNewSchoolView from '../views/CreateNewSchoolView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import * as actionOrganizationNames from '../actions/organization-names.js';
import { selectOrganizationNames, selectMe } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
			personId: me.personId,
			langCode: me.langCode,
			//newLoginPersonId: props.params && props.params.newLoginPersonId,
      // username: props.username,
      // password: props.password,
      //loginData: selectMe(state),
			organizationNames: selectOrganizationNames(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		// hasInitialPassword: (newLoginPersonId) => dispatch(loginUser.hasInitialPassword(newLoginPersonId)),
		getOrganizationNames: () => dispatch(actionOrganizationNames.init()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {personId, getPageLangs, langCode, getOrganizationNames} = this.props;
				getPageLangs(personId, langCode, 'CreateNewSchoolView');
				//if (newLoginPersonId) hasInitialPassword(newLoginPersonId);
				getOrganizationNames();
		}

    render() {
        return <CreateNewSchoolView {...this.props} />;
    }
}

export default storeConnector(Container);
