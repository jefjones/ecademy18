import { useEffect } from 'react'
import LandingView from '../views/LandingView'
import { useSelector, useDispatch, connect } from 'react-redux'
import { setPageMeta } from '../actions/page-meta'
import * as actionLandingSteps from '../actions/landing-steps'
import { selectMe, selectLandingSteps  } from '../store'

const pageMeta = {
  title: "edit by invite",
  tags: [
      {"name": "description", "content": "edit by invite, multiple editors, document editing, tranlating, translation, collaboration"},
      {"property": "og:type", "content": "article"}
  ]
}

// takes values from the redux store and maps them to props
const mapStateToProps = (state, ownProps) => {
    return {
        personId: selectMe(state) && selectMe(state).personId,
				landingSteps: selectLandingSteps(state),
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
  	setPageMeta: (meta) => dispatch(setPageMeta(meta)),
		getLandingSteps: () => dispatch(actionLandingSteps.init()),
})

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component




function HomeContainer(props) {
  useEffect(() => {
    
    	      props.init()
    				props.getLandingSteps()
    	  
  }, [])

  return <LandingView {...props} />
}

export default connect(mapStateToProps, bindActionsToDispatch)(HomeContainer)
