import React, {Component} from 'react';
import PasswordResetAdminView from '../views/PasswordResetAdminView';
import NotFound from '../components/Error';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';
import * as loginUser from '../actions/login.js';
import * as actionMyFrequentPlaces from '../actions/my-frequent-places.js';
import {doSort} from '../utils/sort.js';
import { selectMe, selectStudents, selectGuardians, selectUsers, selectAccessRoles, selectMyFrequentPlaces } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let users = selectUsers(state, 'Facilitator');
    users = users.concat(selectGuardians(state));
    users = users.concat(selectStudents(state));
    users = doSort(users, { sortField: 'label', isAsc: true, isNumber: false });

    return {
        personId: me.personId,
        langCode: me.langCode,
  			newLoginPersonId: props.params && props.params.personId,
        loginData: selectMe(state),
        accessRoles: selectAccessRoles(state),
        users,
        myFrequentPlaces: selectMyFrequentPlaces(state),
    }
};

const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		resetPasswordByAdmin: (personId, userPersonId, password) => dispatch(loginUser.resetPasswordByAdmin(personId, userPersonId, password)),
    setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
});

const storeConnector = connect(mapStateToProps, bindActionsToDispatch);

class Container extends Component {
    componentDidMount() {
        const {getPageLangs, personId, langCode} = this.props;
        getPageLangs(personId, langCode, 'PasswordResetAdminView');
    }

    render() {
        const {accessRoles} = this.props;
        return accessRoles.admin ? <PasswordResetAdminView {...this.props} /> : <NotFound />
    }
}

export default storeConnector(Container);
