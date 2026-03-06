import { Component } from 'react';
import {browserHistory} from 'react-router';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { selectMe } from '../store.js';
import * as actionLogin from '../actions/login.js';
//import {guidEmpty} from '../utils/guidValidate';


// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
  return {
		person: selectMe(state),
		ownProps,
    currentURL: ownProps.location.pathname,
		initialPassword: selectMe(state),
  }
}

const bindActionsToDispatch = dispatch => ({
    initRecords: (person) => dispatch(actionLogin.initRecords(person)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class EnsureLoggedInContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
						isLoggedIn: false,
        }
    }

    componentDidMount() {
        const { initRecords } = this.props
				let isLoggedIn = false;
        let isLoggingIn = window.localStorage.getItem('isLoggingIn');
        isLoggingIn = isLoggingIn === 'true';

				try {
            const { exp } = jwtDecode(window.localStorage.getItem('authToken'));

						isLoggedIn = new Date().getTime() < (exp * 1000);
						this.setState({ isLoggedIn });
				}
				catch (e) {
				}

        if (!isLoggedIn) {
            // set the current url/path for future redirection (we use a Redux action)
            // then redirect (we use a React Router method)
            //dispatch(setRedirectUrl(currentURL))
            if(window.location.pathName !== '/') browserHistory.replace("/login")
        } else {
						// if (window.performance) {
						// 		if (performance.navigation.type === 1 && (!this.props.person || !this.props.person.personId)) {
						// 				let person = window.localStorage.getItem('person')
						// 				initRecords(JSON.parse(person));
						// 		}
						// }
						let person = window.localStorage.getItem('person')
            //
            // if (person && person.personId && person.personId !== guidEmpty && !isLoggingIn) {
            //if (!isLoggingIn) {
                initRecords(JSON.parse(person));
            //}
				}
    }

    render() {
        if (this.state.isLoggedIn) {
          	return this.props.children
        } else {
          	return null
        }
    }
}

export default storeConnector(EnsureLoggedInContainer);
