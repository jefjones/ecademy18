import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './GroupSummary.css';
import classes from 'classnames';
import GroupTools from '../../components/GroupTools';
import TextDisplay from '../../components/TextDisplay';
import Icon from '../../components/Icon';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import numberFormat from '../../utils/numberFormat.js';
import * as guid from '../../utils/GuidValidate.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class GroupSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caretClassName: classes(styles.jef_caret, props.expanded ? styles.jefCaretUp : styles.jefCaretDown),
      expanded: props.expanded ? true : false,
      isShowingModal_deleteMember: false,
      isShowingModal_noMemberChosen: false,
      isShowingModal_deleteWork: false,
      isShowingModal_deletePeerGroup: false,
      isShowingModal_noPeerGroupChosen: false,
      member_personId: '',
      peerGroupId: '',
    };
}

handleEditPeerGroup = () => {
    const {summary} = this.props;
    browserHistory.push("/peerGroupAddOrUpdate/" + summary.groupId + "/" + this.state.peerGroupId);
}

handleAddNewPeerGroup = () => {
    const {summary} = this.props;
    browserHistory.push("/peerGroupAddOrUpdate/" + summary.groupId);
}

handleDeleteMember = () => {
    const {personId, groupId, removeMember} = this.props;
    const {member_personId} = this.state;
    removeMember(personId, groupId, member_personId);
    this.handleDeleteMemberClose();
}

handleDeleteWork = () => {
    const {personId, summary, deleteWork} = this.props;
    deleteWork(personId, summary.masterWorkId);
    this.handleDeleteWorkClose();
}

handleDeletePeerGroup = () => {
    const {personId, deletePeerGroup} = this.props;
    const {peerGroupId} = this.state;
    deletePeerGroup(personId, peerGroupId);
    this.handleDeleteMemberClose();
}

handleAddNewWork = () => {
    const {summary, setWorkCurrentSelected,  personId } = this.props;
    setWorkCurrentSelected(personId, summary.memberWorkId, '', '', "workAddNew/" + summary.groupId);
}

handleAddNewMember = () => {
    const {summary, setWorkCurrentSelected,  personId } = this.props;
    setWorkCurrentSelected(personId, summary && summary.memberWorkId, '', '', "groupMemberAdd");
}

sendToEditReview = () => {
    const {summary, setWorkCurrentSelected,  personId } = this.props;
    setWorkCurrentSelected(personId, summary.memberWorkId, '', '', "editReview");
}

onChangeMemberWork = (event) => {
    const {setGroupCurrentSelected, personId, summary} = this.props;
    setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, event.target.value, 'STAY');
}

onChangePeerGroup = (event) => {
    this.setState({ peerGroupId: event.target.value });
}

onChangeMember = (event) => {
    this.setState({ member_personId: event.target.value });
}

onChangeWork = (event) => {
    const {groupInit, setWorkCurrentSelected, setGroupCurrentSelected, personId, summary} = this.props;
    setGroupCurrentSelected(personId, summary.groupId, event.target.value, summary.memberWorkId, 'STAY');
    setWorkCurrentSelected(personId, event.target.value, '', '', 'STAY');
    groupInit(personId);
}

handleToggle = (ev) => {
    ev.preventDefault();
    const {expanded}  = this.state;
    expanded ? this.handleCollapse() : this.handleExpand();
}

handleExpand = () => {
    this.setState({ expanded: true, caretClassName: classes(styles.jef_caret, styles.jefCaretUp) });
}

handleCollapse = () => {
    this.setState({ expanded: false, caretClassName: classes(styles.jef_caret, styles.jefCaretDown) });
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
    const {summary, showTitle=true, setGroupCurrentSelected, personId, deleteGroup, isHeaderDisplay=false,
            hideCaret=false, indexName, currentGroupTool, isMainMenu, showDelete=false, updatePersonConfig, personConfig} = this.props;
    const {caretClassName, expanded, isShowingModal_deleteMember, isShowingModal_noMemberChosen, isShowingModal_deleteWork,
            isShowingModal_deletePeerGroup, isShowingModal_noPeerGroupChosen, peerGroupId} = this.state;

    return (
        <div className={styles.container}>
            <table className={styles.tableDisplay}>
              <tbody>
                {isHeaderDisplay && showTitle &&
                    <tr>
                        <td colSpan={4} className={classes(isMainMenu ? styles.whiteBack : '')}>
                            <div className={hideCaret ? styles.rowLeft : styles.row}>
                                <div className={classes(styles.rowLeft, styles.linkStyle)}
                                        onClick={() => setGroupCurrentSelected(personId, summary.groupId, summary.masterWorkId, summary.memberWorkId, "assignmentDashboard/" + summary.groupId + "/" + summary.masterWorkId)}>
                                    {showTitle && isMainMenu
                                        ? <TextDisplay label={<L p={p} t={`Group (current)`}/>} text={summary.groupName} />
                                        :  <div className={classes(styles.title, (isMainMenu ? styles.titleCurrentWork : ''))} id={"title"}>
                                              {summary.groupName}
                                            </div>
                                    }
                                </div>
                                {!hideCaret &&
                                    <a onClick={this.handleToggle}>
                                        <div className={caretClassName}/>
                                    </a>
                                }
                            </div>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) &&
                    <tr>
                        <td className={styles.label}>
                            <span className={styles.label}><L p={p} t={`group owner`}/></span>
                        </td>
                        <td colSpan={4}>
                            <span className={styles.text}>{summary.ownerName}</span>
                        </td>
                    </tr>
                }
                {setGroupCurrentSelected &&
                    <tr>
                        <td colSpan={4}>
                            <GroupTools personId={personId} summary={summary} currentTool={currentGroupTool} showDelete={showDelete}
                                setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                                isOwner={personId === summary.ownerPersonId} className={styles.tools}
                                updatePersonConfig={updatePersonConfig} personConfig={personConfig}/>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) && summary && summary.memberWorkOptions && summary.memberWorkOptions.length > 0 &&
                    <tr>
                        <td className={styles.label}>
                            <span className={styles.label}>{`review`}</span>
                        </td>
                        <td className={styles.label}>
                            <span className={styles.count}>{summary.memberWorkOptions && numberFormat(summary.memberWorkOptions.length || 0)}</span>
                        </td>
                        <td colSpan={3}>
                            <div className={styles.rowTight}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`membersWorks`}
                                        label={``}
                                        value={summary.memberWorkId}
                                        options={summary.memberWorkOptions}
                                        className={styles.singleDropDown}
                                        noBlank={true}
                                        error={''}
                                        height={`medium`}
                                        onChange={this.onChangeMemberWork} />
                                </div>
                                <a onClick={summary.memberWorkId ? this.sendToEditReview : () => {}}>
                                    <Icon pathName={`file_text2`} className={classes(styles.image, summary.memberWorkId === guid.emptyGuid() || !summary.memberWorkId ? styles.lowOpacity : styles.highOpacity)}/>
                                </a>
                            </div>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) &&
                    <tr>
                        <td className={styles.label}>
                            <span className={styles.label}>{summary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`assignments`}/> : <L p={p} t={`documents`}/>}</span>
                        </td>
                        <td className={styles.label}>
                            <span className={styles.count}>{numberFormat(summary.workSummaries.length || 0)}</span>
                        </td>
                        <td colSpan={3}>
                            <div className={styles.rowTight}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`works`}
                                        indexName={indexName}
                                        label={``}
                                        value={summary.masterWorkId}
                                        options={summary.workSummaries}
                                        className={styles.singleDropDown}
                                        noBlank={true}
                                        error={''}
                                        height={`medium`}
                                        onChange={this.onChangeWork} />
                                </div>
                                <a onClick={this.handleAddNewWork} className={styles.linkStyle}>
                                    <Icon pathName={`plus`} className={styles.image}/>
                                </a>
                                <a onClick={this.handleDeleteWorkOpen} className={styles.linkStyle}>
                                    <Icon pathName={`garbage_bin`} className={styles.image}/>
                                </a>
                            </div>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) &&
                    <tr>
                        <td className={styles.label}>
                            <span className={styles.label}>{summary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`students`}/> : <L p={p} t={`editors`}/>}</span>
                        </td>
                        <td className={styles.label}>
                            <span className={styles.count}>{numberFormat(summary.members.length || 0)}</span>
                        </td>
                        <td>
                            <div className={styles.rowTight}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`members`}
                                        label={``}
                                        options={summary.members}
                                        className={styles.singleDropDown}
                                        error={''}
                                        height={`medium`}
                                        onChange={this.onChangeMember}/>
                                </div>
                                <a onClick={this.handleAddNewMember} className={styles.linkStyle}>
                                    <Icon pathName={`plus`} className={styles.image}/>
                                </a>
                                <a onClick={this.handleDeleteMemberOpen} className={styles.linkStyle}>
                                    <Icon pathName={`garbage_bin`} className={styles.image}/>
                                </a>
                            </div>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) &&
                    <tr>
                        <td className={styles.label}>
                            <span className={styles.label}><L p={p} t={`peer groups`}/></span>
                        </td>
                        <td className={styles.label}>
                            <span className={styles.count}>{summary.peerGroups ? numberFormat(summary.peerGroups.length || 0) : 0}</span>
                        </td>
                        <td>
                            <div className={styles.rowTight}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`peerGroups`}
                                        label={``}
                                        value={peerGroupId}
                                        options={summary.peerGroupOptions}
                                        className={styles.singleDropDown}
                                        error={''}
                                        height={`medium`}
                                        onChange={this.onChangePeerGroup}/>
                                </div>
                                <a onClick={peerGroupId ? this.handleEditPeerGroup : () => {}} className={classes(styles.linkStyle, peerGroupId ? styles.fullOpacity : styles.lowOpacity)}>
                                    <Icon pathName={`pencil`} className={styles.image}/>
                                </a>
                                <a onClick={this.handleAddNewPeerGroup} className={styles.linkStyle}>
                                    <Icon pathName={`plus`} className={styles.image}/>
                                </a>
                                <a onClick={this.handleDeletePeerGroupOpen} className={styles.linkStyle}>
                                    <Icon pathName={`garbage_bin`} className={styles.image}/>
                                </a>
                            </div>
                        </td>
                    </tr>
                }
                {(!isHeaderDisplay || expanded) &&
                    <tr>
                        <td colSpan={4} className={styles.lastLine}>
                            <hr />
                        </td>
                    </tr>
                }
                </tbody>
                </table>
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
                       explainJSX={<L p={p} t={`Please choose a peer group before requesting to delete a peer group.`}/>} isConfirmType={false}
                       onClick={this.handlePeerGroupNotChosenClose} />
                }
            </div>
        )
    }
}
