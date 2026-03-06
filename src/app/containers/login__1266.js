import React, {Component} from 'react';
import LoginView from '../views/LoginView/LoginView__1266';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import { selectMe } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, params) => {
		let me = selectMe(state);

    return {
      username: params.username,
      langCode: me.langCode,
      password: params.password,
      loginData: me,
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: ()  => dispatch(loginUser.logout()),
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
			const {getPageLangs, personId, langCode} = this.props;
			getPageLangs(personId, langCode, 'LoginView__1266');
	}

    render() {
        return <LoginView {...this.props} />
    }
}

export default storeConnector(Container);
