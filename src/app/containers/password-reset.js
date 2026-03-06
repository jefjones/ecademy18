import React, {Component} from 'react';
import ResetPasswordView from '../views/LoginView/ResetPasswordView.js';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import {selectMe} from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
		let me = selectMe(state);

    return {
        loginData: me,
				langCode: me.langCode,
    }
};

const bindActionsToDispatch = dispatch => ({
    setResetPasswordResponse: (resetPasswordCode, emailAddress, password) => dispatch(loginUser.setResetPasswordResponse(resetPasswordCode, emailAddress, password)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, personId, langCode} = this.props;
				getPageLangs(personId, langCode, 'ResetPasswordView');
		}


    render() {
        return <ResetPasswordView {...this.props} />
    }
}

export default storeConnector(Container);
