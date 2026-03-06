import React, {Component} from 'react';
import RegPoliciesAcademyView from '../views/RegPoliciesAcademyView';
import * as actionMyVisitedPages from '../actions/my-visited-pages.js';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
    return {
    }
};

const bindActionsToDispatch = dispatch => ({
  setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    componentDidMount() {
        const {setMyVisitedPage, personId} = this.props;
        this.props.location && this.props.location.pathname && setMyVisitedPage(personId, {path: this.props.location.pathname, description: `Registration Policies`});
    }

    render() {
        return <RegPoliciesAcademyView {...this.props} />;
    }
}

export default storeConnector(Container);
