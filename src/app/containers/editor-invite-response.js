import React, {Component} from 'react';
import LandingView from '../views/LandingView';
import { connect } from 'react-redux';
import * as actionEditorInvite from '../actions/editor-invite-response';
import * as actionLandingSteps from '../actions/landing-steps';
import { selectLandingSteps } from '../store.js';

const mapStateToProps = (state) => {
    return {
				landingSteps: selectLandingSteps(state),
    }
};

const bindActionsToDispatch = dispatch => ({
  setEditorInviteGUIDResponse: (inviteCode, firstName, lastName, emailAddress, createNew) => dispatch(actionEditorInvite.setEditorInviteGUIDResponse(inviteCode, firstName, lastName, emailAddress, createNew)),
	getLandingSteps: () => dispatch(actionLandingSteps.init()),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class HomeContainer extends Component {
	componentDidMount() {
			const {setEditorInviteGUIDResponse, params} = this.props;
			if (params) setEditorInviteGUIDResponse(params.inviteCode, params.firstName, params.lastName, params.emailAddress, params.createNew)
			this.props.getLandingSteps();
	}

  render() {
    return <LandingView {...this.props} />
  }
}

export default storeConnector(HomeContainer);
