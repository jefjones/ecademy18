import React, {Component} from 'react';
import GroupTypeChoiceView from '../views/GroupTypeChoiceView';
import * as actionPageLang from '../actions/language-list';
import { connect } from 'react-redux';

import { selectMe, selectGroupTypes } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = state => {
    let me = selectMe(state);

    return {
        personId: me.personId,
        langCode: me.langCode,
        groupTypes: selectGroupTypes(state),
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {

  componentDidMount() {
    const {personId, langCode, getPageLangs} = this.props;
  	getPageLangs(personId, langCode, 'GroupTypeChoiceView');
  }

  render() {
    return <GroupTypeChoiceView {...this.props} />
  }
}

export default storeConnector(Container);
