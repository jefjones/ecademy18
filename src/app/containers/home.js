import React, {Component} from 'react';
import LandingView from '../views/LandingView';
import { connect } from 'react-redux';
import { setPageMeta } from '../actions/page-meta';
import * as actionLandingSteps from '../actions/landing-steps';
import { selectMe, selectLandingSteps  } from '../store.js';

const pageMeta = {
  title: "edit by invite",
  tags: [
      {"name": "description", "content": "edit by invite, multiple editors, document editing, tranlating, translation, collaboration"},
      {"property": "og:type", "content": "article"}
  ]
};

// takes values from the redux store and maps them to props
const mapStateToProps = (state, ownProps) => {
    return {
        personId: selectMe(state) && selectMe(state).personId,
				landingSteps: selectLandingSteps(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
  	setPageMeta: (meta) => dispatch(setPageMeta(meta)),
		getLandingSteps: () => dispatch(actionLandingSteps.init()),
});

// takes the result of mapStateToProps as store, and bindActionsToDispatch as actions
// returns the final resulting props which will be passed to the component
const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
    init: () => actions.setPageMeta(pageMeta),
    title: "React/Redux Starter"
});

const storeConnector = connect(
	  mapStateToProps,
	  bindActionsToDispatch,
	  mergeAllProps
);

class HomeContainer extends Component {

	  static onServer(props, store) {
	    	return Promise.all([store.dispatch(setPageMeta(pageMeta))]);
	  }

	  componentDidMount() {
	      this.props.init();
				this.props.getLandingSteps();
	  }

	  render() {
	    	return <LandingView {...this.props} />
	  }
}

export default storeConnector(HomeContainer);
