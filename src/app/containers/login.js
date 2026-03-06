import React, {Component} from 'react';
import LoginView from '../views/LoginView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import { selectMe } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let loginData = selectMe(state);

    return {
			newLoginPersonId: props.params && props.params.newLoginPersonId,
			langCode: loginData.langCode,
      username: props.username,
      password: props.password,
      loginData,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		hasInitialPassword: (newLoginPersonId) => dispatch(loginUser.hasInitialPassword(newLoginPersonId)),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),

});

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component
const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
    title: "Penspring"
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
  mergeAllProps
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, hasInitialPassword, newLoginPersonId} = this.props;
				getPageLangs(personId, langCode, 'LoginView');
				if (newLoginPersonId) hasInitialPassword(newLoginPersonId);
		}

    render() {
        return !this.props.newLoginPersonId ? <LoginView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
