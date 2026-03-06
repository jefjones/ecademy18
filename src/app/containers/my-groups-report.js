import React, { Component } from 'react';
import { connect } from 'react-redux';
import MyGroupsReportView from '../views/MyGroupsReportView';
import actionGroups from '../actions/groups';
import * as actionPageLang from '../actions/language-list';

import { selectMe, selectGroups } from '../store.js';

const mapStateToProps = (state, props) => {
    let me = selectMe(state);
    let groups = selectGroups(state);

    let headings = [{
        label: '', //Empty first cell which is the column for the group names,
    },
    {
        label: 'Members',
        verticalText: true,
    },
    {
        label: 'Documents',
        verticalText: true,
    },
    {
        label: 'Pending Review',
        verticalText: true,
    },
    {
        label: 'Past due',
        verticalText: true,
    },
    {
        label: 'Assigned',
        verticalText: true,
    },
    {
        label: 'Completed',
        verticalText: true,
    }];

    let data = !!groups && groups.length > 0 && groups.reduce((acc, g) => {
        let groupName = g.groupName && g.groupName.length > 30 ? g.groupName.substring(0,30) + '...' : g.groupName;
        let row = [
            { id: g.groupId, value: groupName, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: !!g.members && g.members.length, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: !!g.workSummaries && g.workSummaries.length, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: g.pending, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: g.pastDue, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: g.assigned, pathLink: '/assignmentDashboard/' + g.groupId },
            { id: 0, value: g.completed, pathLink: '/assignmentDashboard/' + g.groupId },
        ];
        return acc ? acc.concat([row]) : [[row]];
    },[])

    return {
        personId: me.personId,
        langCode: me.langCode,
        headings,
        data,
    }
};

const bindActionsToDispatch = (dispatch) => ({
    initGroups: (personId) => dispatch(actionGroups.init(personId)),
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
});

const storeConnector = connect(
  mapStateToProps,
  bindActionsToDispatch,
);

class Container extends Component {
  componentDidMount() {
      const {getPageLangs, langCode, initGroups, personId} = this.props;
      //initGroups(personId);
      getPageLangs(personId, langCode, 'MyGroupsReportView');
  }

  render() {
      return <MyGroupsReportView {...this.props} />
  }
}

export default storeConnector(Container);
