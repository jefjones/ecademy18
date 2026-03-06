import React, {Component} from 'react';
import RegPoliciesElementaryView from '../views/RegPoliciesElementaryView';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {

    return {
    }
};

const bindActionsToDispatch = dispatch => ({
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    render() {
        return <RegPoliciesElementaryView {...this.props} />;
    }
}

export default storeConnector(Container);
