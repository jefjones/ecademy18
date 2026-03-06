import React, {Component} from 'react';
import InitStudentLoginView from '../views/InitStudentLoginView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
import { selectMe} from '../store.js';


const mapStateToProps = (state, props) => {
		let me = selectMe(state);

    return {
			newLoginPersonId: props.params && props.params.personId,
			langCode: me.langCode,
			username: props.params && props.params.username,
    }
};

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		setPassword: (newLoginPersonId, user) => dispatch(loginUser.setPassword(newLoginPersonId, user)),
});

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
				getPageLangs(personId, langCode, 'InitStudentLoginView');
		}

    render() {
        return <InitStudentLoginView {...this.props} />
    }
}

export default storeConnector(Container);
