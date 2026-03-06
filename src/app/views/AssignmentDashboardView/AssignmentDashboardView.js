import React, {Component} from 'react';
import {browserHistory, Link} from 'react-router';
import styles from './AssignmentDashboardView.css';
const p = 'AssignmentDashboardView';
import L from '../../components/PageLanguage';
import classes from 'classnames';
import globalStyles from '../../utils/globalStyles.css';
import GroupTools from '../../components/GroupTools';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import EditTable from '../../components/EditTable';
import StatusLegend from '../../components/StatusLegend';
import numberFormat from '../../utils/numberFormat.js';
import OneFJefFooter from '../../components/OneFJefFooter';

class AssignmentDashboardView extends Component {
    constructor(props) {
      super(props);

      this.state = {
          isShowingSubMenu: false,
          timerId: null,
      };
    }

    componentDidMount = () => {
        const {initGroupEditReport, personId, currentGroupId} = this.props;
        this.setState({ timerId: setInterval(() => initGroupEditReport(personId, currentGroupId), 15000) });
    }

    componentWillUnmount = () => {
        clearInterval(this.state.timerId);
    }

    handleSendMemberUpdate = () => {
        const {member_personId} = this.state;
        member_personId && browserHistory.push("/groupMemberUpdate/" + member_personId);
    }

    handleToggleSubMenu = () => {
        this.setState({ isShowingSubMenu: !this.state.isShowingSubMenu})
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.data !== this.props.data || nextProps.groupSummary !== this.props.groupSummary) {
    //         return true;
    //     }
    //     return false;
    // }

    sendToWorkAssign = () => {
        const {groupSummary} = this.props;
        browserHistory.push('/groupWorkAssign/' + groupSummary.groupId + '/' + groupSummary.masterWorkId);
    }

    handlePathLink = (pathLink) => {
        const {initWorkWithAssignmentWorkId, updateGroupWorkStatus, personId, groupSummary} = this.props;
        if (pathLink.indexOf('EDITREVIEW!!') > -1) {
            let workId  = pathLink.substring(12);
            initWorkWithAssignmentWorkId(personId, workId);
        } else if (pathLink.indexOf('STATUSUPDATE!!') > -1) {
            let workId = pathLink.substring(pathLink.indexOf('^^') + 2);
            let groupWorkStatusName = pathLink.substring(pathLink.indexOf('!!') + 2, pathLink.indexOf('^^'));
            let newStatus = groupWorkStatusName === "SUBMITTED" || groupWorkStatusName === "ACCEPTED" ? "REVIEWRESPONDED" : "SUBMITTED";
            updateGroupWorkStatus(personId, groupSummary.groupId, workId, newStatus);
        } else {
            pathLink && browserHistory.push(pathLink);
        }
    }

    handleDeleteMember = () => {
        const {personId, groupId, removeMember} = this.props;
        const {member_personId} = this.state;
        removeMember(personId, groupId, member_personId);
        this.handleDeleteMemberClose();
    }

    handleDeleteWork = () => {
        const {personId, groupSummary, deleteWork} = this.props;
        deleteWork(personId, groupSummary.masterWorkId);
        this.handleDeleteWorkClose();
    }

    onChangeMemberWork = (event) => {
        const {setGroupCurrentSelected, personId, groupSummary} = this.props;
        setGroupCurrentSelected(personId, groupSummary.groupId, groupSummary.masterWorkId, event.target.value, 'STAY');
    }

    onChangePeerGroup = (event) => {
        this.setState({ peerGroupId: event.target.value });
    }

    onChangeMember = (event) => {
        this.setState({ member_personId: event.target.value });
    }

    onChangeWork = (event) => {
        const {groupInit, setWorkCurrentSelected, setGroupCurrentSelected, personId, groupSummary} = this.props;
        setGroupCurrentSelected(personId, groupSummary.groupId, event.target.value, groupSummary.memberWorkId, 'STAY');
        setWorkCurrentSelected(personId, event.target.value, '', '', 'STAY');
        groupInit(personId);
    }

    handleMemberNotChosenOpen = () => this.setState({isShowingModal_noMemberChosen: true})
    handleMemberNotChosenClose = () => this.setState({isShowingModal_noMemberChosen: false})

    handleDeleteMemberClose = () => this.setState({isShowingModal_deleteMember: false})
    handleDeleteMemberOpen = () => {
        if (!this.state.member_personId) {
            this.handleMemberNotChosenOpen();
            return;
        }
        this.setState({isShowingModal_deleteMember: true });
    }

    handleDeleteWorkClose = () => this.setState({isShowingModal_deleteWork: false})
    handleDeleteWorkOpen = () => this.setState({isShowingModal_deleteWork: true})

    handlePeerGroupNotChosenOpen = () => this.setState({isShowingModal_noPeerGroupChosen: true})
    handlePeerGroupNotChosenClose = () => this.setState({isShowingModal_noPeerGroupChosen: false})

    handleDeletePeerGroupClose = () => this.setState({isShowingModal_deletePeerGroup: false})
    handleDeletePeerGroupOpen = () => {
        if (!this.state.peerGroupId) {
            this.handlePeerGroupNotChosenOpen();
            return;
        }
        this.setState({isShowingModal_deletePeerGroup: true });
    }

    render() {
      const {personId, groupSummary, setGroupCurrentSelected, deleteGroup, headTitle, subHeadTitle, headings, data,  statusLegend,
                setWorkCurrentSelected, updatePersonConfig, personConfig} = this.props;
      const {isShowingModal_deleteMember, isShowingModal_noMemberChosen, isShowingModal_deleteWork,isShowingModal_deletePeerGroup,
               isShowingModal_noPeerGroupChosen, member_personId, isShowingSubMenu} = this.state;

      return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Assignment Dashboard`}/>
            </div>
            <div className={styles.subTitle}>
                {groupSummary.groupName}
            </div>
            <div className={styles.subTitle}>
                <GroupTools personId={personId} summary={groupSummary} currentTool={'assignmentDashboard'}
                    setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                    isOwner={personId === groupSummary.ownerPersonId} className={styles.tools}
                    updatePersonConfig={updatePersonConfig} personConfig={personConfig} />
            </div>
            <hr />
            <div className={styles.menuItem}>
                <Link to={`/workAddNew/${groupSummary && groupSummary.groupId}`} className={styles.addNew}>
                    {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new assignment`}/> : <L p={p} t={`Add new document`}/>}
                </Link>
            </div>
            <hr />
            <div className={styles.menuItem}>
                <Link to={`/groupMemberAdd`} className={styles.addNew}>
                    {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new learner`}/> : <L p={p} t={`Add new member`}/>}
                </Link>
            </div>
            <hr />
            <table className={styles.tableDisplay}>
              <tbody>
                <tr>
                    <td className={styles.tableLabel}>
                        <span className={styles.tableLabel}>{groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Assignments`}/> : <L p={p} t={`Documents`}/>}</span>
                    </td>
                    <td className={styles.tableLabel}>
                        <span className={styles.count}>{numberFormat(groupSummary.workSummaries.length || 0)}</span>
                    </td>
                    <td colSpan={3}>
                        <div className={styles.rowTight}>
                            <div>
                                <SelectSingleDropDown
                                    id={`works`}
                                    label={``}
                                    value={groupSummary.masterWorkId}
                                    options={groupSummary.workSummaries}
                                    className={styles.singleDropDown}
                                    noBlank={true}
                                    error={''}
                                    height={`medium`}
                                    onChange={this.onChangeWork} />
                            </div>
                            <a onClick={() => setWorkCurrentSelected(personId, groupSummary.masterWorkId, '', '', "/workSettings")} className={styles.linkStyle}>
                                <Icon pathName={`pencil0`} premium={true} className={styles.image}/>
                            </a>
                            <a onClick={this.handleDeleteWorkOpen} className={styles.linkStyle}>
                                <Icon pathName={`trash2`} premium={true} className={styles.image}/>
                            </a>
                            {!!groupSummary.workSummaries &&
                                <a onClick={this.sendToWorkAssign} className={styles.rowTight}>
                                    <Icon pathName={`document0`} premium={true} className={styles.imageDocument}/>
                                    <Icon pathName={`user_plus0`} premium={true} className={styles.imageOverlay}/>
                                </a>
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className={styles.tableLabel}>
                        <span className={styles.tableLabel}>{groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Learners`}/> : <L p={p} t={`Editors`}/>}</span>
                    </td>
                    <td className={styles.tableLabel}>
                        <span className={styles.count}>{numberFormat(groupSummary.members.length || 0)}</span>
                    </td>
                    <td>
                        <div className={styles.rowTight}>
                            <div>
                                <SelectSingleDropDown
                                    id={`members`}
                                    label={``}
                                    value={member_personId}
                                    options={groupSummary.members}
                                    className={styles.singleDropDown}
                                    error={''}
                                    height={`medium`}
                                    onChange={this.onChangeMember}/>
                            </div>
                            <a onClick={this.handleSendMemberUpdate} className={classes(styles.linkStyle, member_personId ? styles.fullOpacity : styles.lowOpacity)}>
                                <Icon pathName={`pencil0`} premium={true} className={styles.image}/>
                            </a>
                            <a onClick={this.handleDeleteMemberOpen} className={styles.linkStyle}>
                                <Icon pathName={`trash2`} premium={true} className={styles.image}/>
                            </a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr />
        {data && data.length > 0 &&
            <div>
                <div className={styles.column}>
                    <div>
                        <div className={styles.headTitle}>{headTitle}</div>
                        <div className={styles.subHeadTitle}>{subHeadTitle}</div>
                    </div>
                    <StatusLegend opened={isShowingSubMenu} toggleOpen={this.handleToggleSubMenu} subjectBody={statusLegend}
                        headerText={<L p={p} t={`status legend`}/>} className={styles.statusLegend}/>
                </div>
                <EditTable labelClass={styles.tableLabelClass} headings={headings}
                    data={data} noCount={true} firstColumnClass={styles.firstColumnClass}
                    sendToReport={this.handlePathLink}/>
            </div>
        }
        {(!data || data.length === 0) &&
            <div className={styles.noAccess}>
                <L p={p} t={`Access to this assignment has not yet been granted.`}/><br />
                <L p={p} t={`You can grant access`}/>
                <a onClick={this.sendToWorkAssign} className={styles.linkStyle}>
                    here.
                </a>
                <a onClick={this.sendToWorkAssign} className={classes(styles.moreLeftMargin, styles.linkStyle)}>
                    <Icon pathName={`user_plus0`} premium={true} className={styles.image}/>
                </a>
                <L p={p} t={`Or if you just granted access, the new assignments are being copied out to the learners.`}/>
                <L p={p} t={`Please refresh this page in a few moments.`}/>
            </div>
        }
        {isShowingModal_deleteMember &&
            <MessageModal handleClose={this.handleDeleteMemberClose} heading={<L p={p} t={`Remove this member from this group?`}/>}
               explainJSX={<L p={p} t={`Are you sure you want to delete this member from this group?`}/>} isConfirmType={true}
               onClick={this.handleDeleteMember} />
        }
        {isShowingModal_noMemberChosen &&
            <MessageModal handleClose={this.handleMemberNotChosenClose} heading={<L p={p} t={`No member chosen`}/>}
               explainJSX={<L p={p} t={`Please choose a member before requesting to delete a member.`}/>} isConfirmType={false}
               onClick={this.handleMemberNotChosenClose} />
        }
        {isShowingModal_deleteWork &&
            <MessageModal handleClose={this.handleDeleteWorkClose} heading={<L p={p} t={`Remove this document from this group?`}/>}
               explainJSX={<L p={p} t={`Are you sure you want to delete this document from this group?`}/>} isConfirmType={true}
               onClick={this.handleDeleteWork} />
        }
        {isShowingModal_deletePeerGroup &&
            <MessageModal handleClose={this.handleDeletePeerGroupClose} heading={<L p={p} t={`Delete this peer group?`}/>}
               explainJSX={<L p={p} t={`Are you sure you want to delete this peer group?`}/>} isConfirmType={true}
               onClick={this.handleDeletePeerGroup} />
        }
        {isShowingModal_noPeerGroupChosen &&
            <MessageModal handleClose={this.handlePeerGroupNotChosenClose} heading={<L p={p} t={`No peer group chosen`}/>}
               explain={<L p={p} t={`Please choose a peer group before requesting to delete a peer group.`}/>} isConfirmType={false}
               onClick={this.handlePeerGroupNotChosenClose} />
        }

        <OneFJefFooter />
    </div>
)};
}

export default AssignmentDashboardView;
