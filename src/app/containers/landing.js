import React, {Component} from 'react';
import LandingView from '../views/LandingView';
import { connect } from 'react-redux';
import * as actionPageLang from '../actions/language-list';
import * as loginUser from '../actions/login.js';
//import * as actionJefFeature from '../actions/jef-feature.js';
import * as actionCourseToSchedule from '../actions/course-to-schedule.js';
import {guidEmpty} from '../utils/guidValidate';

import { selectMe, selectJefFeatures } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
		let loginData = selectMe(state);

    return {
			newLoginPersonId: props.params && props.params.newLoginPersonId,
			langCode: loginData.langCode,
      username: props.username,
      password: props.password,
      loginData,
			jefFeatures: selectJefFeatures(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (userData, inviteResponse) => dispatch(loginUser.login(userData, inviteResponse)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		hasInitialPassword: (newLoginPersonId) => dispatch(loginUser.hasInitialPassword(newLoginPersonId)),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
		//getJefFeatures: () => dispatch(actionJefFeature.getJefFeatures()),
		getCoursesScheduled: (personId, clearRedux) => dispatch(actionCourseToSchedule.getCoursesScheduled(personId, clearRedux)),
});

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component
const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
    title: "eCADEMY.app"
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
  mergeAllProps
);

class Container extends Component {
		componentDidMount() {
				const {getPageLangs, langCode, hasInitialPassword, newLoginPersonId} = this.props; //, getJefFeatures
				getPageLangs(guidEmpty, langCode, 'LandingView');
				if (newLoginPersonId) hasInitialPassword(newLoginPersonId);
				//getJefFeatures();
				// for(var i = 0; i < 250; i++) {
	      //   getCoursesScheduled('41CFCE19-D050-472E-80D8-CC1AB0968EF9', false);
	      // }
		}


    render() {
        return !this.props.newLoginPersonId ? <LandingView {...this.props} /> : null;
    }
}

export default storeConnector(Container);
