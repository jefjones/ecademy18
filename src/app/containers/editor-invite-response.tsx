import { useEffect } from 'react'
import LandingView from '../views/LandingView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionEditorInvite from '../actions/editor-invite-response'
import * as actionLandingSteps from '../actions/landing-steps'
import { selectLandingSteps } from '../store'

const mapStateToProps = (state) => {
    return {
				landingSteps: selectLandingSteps(state),
    }
}

const bindActionsToDispatch = dispatch => ({
  setEditorInviteGUIDResponse: (inviteCode, firstName, lastName, emailAddress, createNew) => dispatch(actionEditorInvite.setEditorInviteGUIDResponse(inviteCode, firstName, lastName, emailAddress, createNew)),
	getLandingSteps: () => dispatch(actionLandingSteps.init()),
})


function HomeContainer(props) {
  useEffect(() => {
    
    			const {setEditorInviteGUIDResponse, params} = props
    			if (params) setEditorInviteGUIDResponse(params.inviteCode, params.firstName, params.lastName, params.emailAddress, params.createNew)
    			props.getLandingSteps()
    	
  }, [])

  return <LandingView {...props} />
}

export default storeConnector(HomeContainer)
