import React, {Component} from 'react';
import ProfileResetPasswordView from '../views/ProfileResetPasswordView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import { selectMe } from '../store.js';

const mapStateToProps = (state, props) => {
		let me = selectMe(state);
    return {
			personId: me.personId,
			newLoginPersonId: props.params && props.params.personId,
			langCode: me.langCode,
      loginData: me,
    }
};

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		resetPasswordByAdmin: (personId, userPersonId, password) => dispatch(loginUser.resetPasswordByAdmin(personId, userPersonId, password)),
		resetMyProfilePassword: (newLoginPersonId, password) => dispatch(loginUser.resetMyProfilePassword(newLoginPersonId, password)),
});

const storeConnector = connect(mapStateToProps, bindActionsToDispatch);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, personId, langCode} = this.props;
				getPageLangs(personId, langCode, 'ProfileResetPasswordView');
		}

    render() {
        return <ProfileResetPasswordView {...this.props} />
    }
}

export default storeConnector(Container);
