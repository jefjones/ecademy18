import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import LandingView from '../views/LandingView';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';
import * as loginUser from '../actions/login.js';
import * as actionStudentSchedule from '../actions/student-schedule.js';
//import * as actionJefFeature from '../actions/jef-feature.js';
import { selectMe, selectJefFeatures } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
		let me = selectMe(state);

    return {
        loginData: me,
        langCode: me.langCode,
				jefFeatures: selectJefFeatures(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    login: (user) => dispatch(loginUser.login(user)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    logout: () => dispatch(loginUser.logout()),
		blankOutStudentScheduleLocal: () => dispatch(actionStudentSchedule.blankOutStudentScheduleLocal()),
		isDuplicateUsername: (username) => dispatch(loginUser.isDuplicateUsername(username)),
		//getJefFeatures: () => dispatch(actionJefFeature.getJefFeatures()),
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
			const {getPageLangs, langCode, loginData, blankOutStudentScheduleLocal, logout} = this.props; //, getJefFeatures = this call takes way too long.
			getPageLangs(loginData.personId, langCode, 'LandingView');
	    logout();
			blankOutStudentScheduleLocal();
			//getJefFeatures();
      window.localStorage.setItem('person', null);
      window.localStorage.setItem('isLoggingIn', false);
      browserHistory.push('/');
  }

  render() {
    return <LandingView {...this.props} />
  }
}

export default storeConnector(Container);
