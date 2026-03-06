import {Component} from 'react';
import { connect } from 'react-redux';
import * as lms from '../actions/learning-management-system.js';
import { selectMe } from '../store.js';

const mapStateToProps = (state, props) => {
    return {
      loginData: selectMe(state),
			params_personId: props.params && props.params.personId,
			params_workId: props.params && props.params.workId
    }
};

const bindActionsToDispatch = dispatch => ({
    lmsLogin: (personId, workId) => dispatch(lms.lmsLogin(personId, workId)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
		constructor(props) {
				super(props);

				this.state = {
						timerId: null,
						timerCount: 0,
				};
		}

		componentDidMount() {
				this.setState({ timerId: setInterval(() => this.checkForTransfer(), 1000) });
		}

		checkForTransfer = () => {
				const {lmsLogin, params_personId, params_workId, loginData} = this.props;
				const {timerId} = this.state;
				let timerCount = ++this.state.timerCount;

				if (timerCount > 20 || (loginData.penspringTransferSite && loginData.penspringTransferSite.penspringTransferSiteId)) {
						clearInterval(timerId);
				}

				if (params_personId && !loginData.personId) {
						lmsLogin(params_personId, params_workId); //It is most likely that the params_workId could be blank.  We pick it up from recentWorks which is where it is stored in this case for now.
						this.setState({ timerCount });
				}
		}

    render() {
        return null;
    }
}

export default storeConnector(Container);
