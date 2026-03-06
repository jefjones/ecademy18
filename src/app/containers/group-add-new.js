import React, {Component} from 'react';
import GroupAddNewView from '../views/GroupAddNewView';
import { connect } from 'react-redux';
import * as actionGroups from '../actions/groups.js';
import * as actionPageLang from '../actions/language-list';

import { selectMe, selectLanguageList, selectGroupTypes } from '../store.js';

// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let groupType = selectGroupTypes(state) && selectGroupTypes(state).length > 0 && selectGroupTypes(state).filter(m => m.name === props.params.groupTypeName)[0];

    return {
        personId: me.personId,
        langCode: me.langCode,
        languageChosen: 1,
        languageList: selectLanguageList(state),
        groupTypeDescription: !!groupType ? groupType.description : '',
        groupTypeName: !!groupType ? groupType.name : '',
    }
};

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addNewGroup: (personId, groupTypeName, groupName, languageChosen, internalId, description) => dispatch(actionGroups.addNewGroup(personId, groupTypeName, groupName, languageChosen, internalId, description)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const mergeAllProps = (store, actions) => ({
    ...store, ...actions,
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
  mergeAllProps
);

class Container extends Component {

  componentDidMount() {
    const {personId, langCode, getPageLangs} = this.props;
  	getPageLangs(personId, langCode, 'GroupAddNewView');
  }

  render() {
    return <GroupAddNewView {...this.props} />
  }
}

export default storeConnector(Container);
