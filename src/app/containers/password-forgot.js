import React, {Component} from 'react';
import ForgotPasswordView from '../views/LoginView/ForgotPasswordView.js';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import {selectMe} from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
    return {
        loginData: me,
        langCode: me.langCode,
				salta: props.params && props.params.salta,
    }
};

const bindActionsToDispatch = dispatch => ({
    forgotPassword: (emailAddress, phone, salta) => dispatch(loginUser.forgotPassword(emailAddress, phone, salta)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, personId, langCode} = this.props;
				getPageLangs(personId, langCode, 'ForgotPasswordView');
		}

    render() {
        return <ForgotPasswordView {...this.props} />
    }
}

export default storeConnector(Container);
