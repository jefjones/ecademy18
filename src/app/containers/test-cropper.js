import React, {Component} from 'react';
import TestCropperView from '../views/TestCropperView';
import { connect } from 'react-redux';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    return {
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
});

const storeConnector = connect(
    mapStateToProps,
    bindActionsToDispatch,
);

class Container extends Component {
    render() {
        return <TestCropperView {...this.props} />
    }
}

export default storeConnector(Container);
