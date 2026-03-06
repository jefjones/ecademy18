import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './GroupWorkAssignView.css';
const p = 'GroupWorkAssignView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import TextDisplay from '../../components/TextDisplay';
import Checkbox from '../../components/Checkbox';
import Icon from '../../components/Icon';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import * as guid from '../../utils/GuidValidate.js';

export default class GroupWorkAssignView extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            peerGroupOpen: false,
            copyPreviousPeerGroupId: '',
            subGroupCountError: '',
            notAssigned: [],
            accessAssigned: [],
            unevenCount: 0,
            memberToBeAssigned: '',
            isSubmitted: false,
            hasRemainderMessage: '',
            isShowingPeerGroupInfo: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubGroupNameChange = this.handleSubGroupNameChange.bind(this);
        this.handleSubGroupCountChange = this.handleSubGroupCountChange.bind(this);
        this.handleMembersPerGroupChange = this.handleMembersPerGroupChange.bind(this);
        this.handleSubGroupCreate = this.handleSubGroupCreate.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.getUnassignedOptions = this.getUnassignedOptions.bind(this);
        this.handleAddUnassigned = this.handleAddUnassigned.bind(this);
        this.handleMemberToBeAssigned = this.handleMemberToBeAssigned.bind(this);
        this.togglePeerGroupOpen = this.togglePeerGroupOpen.bind(this);
        this.handleCellClick = this.handleCellClick.bind(this);
        this.resetData = this.resetData.bind(this);
        this.handlePeerGroupInfoClose = this.handlePeerGroupInfoClose.bind(this);
        this.handlePeerGroupInfoOpen = this.handlePeerGroupInfoOpen.bind(this);
        this.handleParentPeerGroupNameChange = this.handleParentPeerGroupNameChange.bind(this);
        this.handlePrevPeerGroupChange = this.handlePrevPeerGroupChange.bind(this);
        this.handleAccessChange = this.handleAccessChange.bind(this);
        this.setAllAccess = this.setAllAccess.bind(this);
        this.processForm = this.processForm.bind(this);
        this.shuffleMemberList = this.shuffleMemberList.bind(this);
        this.handleCopyPreviousPeerGroup = this.handleCopyPreviousPeerGroup.bind(this);
    }

    handleCopyPreviousPeerGroup() {
        const {copyPeerGroupGroupWorkAssignAccess, personId, accessAssigned} = this.props;
        const {copyPreviousPeerGroupId} = this.state;
        if (copyPreviousPeerGroupId) copyPeerGroupGroupWorkAssignAccess(personId, accessAssigned.masterWorkId, copyPreviousPeerGroupId)
    }

    setAllAccess() {
        //workAccess is not turned off, really, if it is turned on already. It is placed in lock mode so that it cannot be changed.
        //originalWorkAccess comes from the database so we can determine if the workAccess given so far might just be local on this page and can be backed out before going back to the database.
        const {accessAssigned} = this.state;
        let newAccessAssigned = Object.assign({}, accessAssigned);
        newAccessAssigned.peerGroups = newAccessAssigned.peerGroups.map((p, i) => {
            p.members = p.members.map((m, ind) => {
                if (!m.originalWorkAccess) {
                    m.isLockedAccess = false;
                    m.workAccess = m.workAccess ? false : true;
                } else {
                    m.isLockedAccess = m.workAccess ? !m.isLockedAccess : false;
                    m.workAccess = true; //Force this to stay checked
                }
                return m;
            })
            return p;
        });
        this.setState({ accessAssigned: newAccessAssigned });
    }

    handleAccessChange(subGroupIndex, memberIndex) {
        //workAccess is not turned off, really, if it is turned on already. It is placed in lock mode so that it cannot be changed.
        //originalWorkAccess comes from the database so we can determine if the workAccess given so far might just be local on this page and can be backed out before going back to the database.
        const {accessAssigned} = this.state;
        let newAccessAssigned = Object.assign({}, accessAssigned);
        newAccessAssigned.peerGroups = newAccessAssigned.peerGroups.map((p, i) => {
            if (i === subGroupIndex) {
                p.members = p.members.map((m, ind) => {
                    if (ind === memberIndex) {
                        if (!m.originalWorkAccess) {
                            m.isLockedAccess = false;
                            m.workAccess = m.workAccess ? false : true;
                        } else {
                            m.isLockedAccess = m.workAccess ? !m.isLockedAccess : false;
                            m.workAccess = true; //Force this to stay checked
                        }
                    }
                    return m;
                })
            }
            return p;
        });
        this.setState({ accessAssigned: newAccessAssigned });
    }

    resetData() {
        const {accessAssigned} = this.props;
        let newAccessAssigned = accessAssigned;
        this.setState({ accessAssigned: newAccessAssigned });
    }

    handlePrevPeerGroupChange(event) {
        this.setState({ copyPreviousPeerGroupId: event.target.value })
    }

    handleCellClick(personId, workId) {
        //Find the cell that matches the personId and workId (id and headingId, respectively)
        //  and toggle the value from whatever it currently is.
        const {localData} = this.state;
        let newData = localData.map(row => row.map((cell, index) =>
          cell.id === personId && cell.headingId === workId
              ? {
                  ...cell,
                  id: cell.id,
                  headingId: cell.headingId,
                  value: !cell.boolValue ? this.createCheckmarkIcon(cell.id, cell.headingId) : this.createNoAccessIcon(cell.id, cell.headingId),
                  boolValue: !cell.boolValue,

                }
              : cell));
        this.setState({ localData: newData });
        this.handleCompareChanges(newData);
    }

    handleParentPeerGroupNameChange(event) {
        const {accessAssigned} = this.state;
        this.setState({ accessAssigned: {...accessAssigned, parentPeerGroupName: event.target.value }});
    }

    togglePeerGroupOpen() {
        this.setState({ peerGroupOpen : !this.state.peerGroupOpen });
    }

    handleNameChange(event) {
        this.setState({ peerGroupName: event.target.value });
    }

    handleMemberToBeAssigned(event) {
        this.setState({ memberToBeAssigned: event.target.value})
    }

    handleAddUnassigned(groupSequence) {
        const {groupSummary} = this.props;
        const {accessAssigned, memberToBeAssigned} = this.state;
        let subGroups = !!accessAssigned.peerGroups && accessAssigned.peerGroups.map(g => {
            if (g.sequence === groupSequence) {
                g.members.unshift(groupSummary.members.filter(p => p.personId === memberToBeAssigned.personId)[0])
            }
            return g;
        });

        this.setState({ accessAssigned: { ...accessAssigned, peerGroups: subGroups} })
        this.getUnassignedOptions(subGroups);
    }

    getUnassignedOptions(subGroups) {
        //We pass in the subGroups here right after the remove member so we can be sure to have the latest data and we don't have to wait
        const {groupSummary} = this.props;

        let members = Object.assign([], groupSummary.members);
        if (members && members.length > 0) {
            subGroups.length > 0 && subGroups.forEach(m => {
                m.members.length > 0 && m.members.forEach(p => {
                    members = members.filter(b => b.personId !== p.personId);
                });
            });
        }
        this.setState({ unassignedMembers: members, memberToBeAssigned: members[0] })
    }

    handleRemoveMember(groupSequence, memberPersonId) {
        //Go to the groupSequence and then splice out the memberPersonId

        const {accessAssigned} = this.state;
        let subGroups = !!accessAssigned.peerGroups && accessAssigned.peerGroups.map(m => {
            if (m.sequence === groupSequence && m.members.length > 0) {
                return { ...m, members: m.members.filter(p => p.personId !== memberPersonId) };
            } else {
                return m;
            }
        });
        this.setState({ accessAssigned: {...accessAssigned, peerGroups: subGroups} })
        this.getUnassignedOptions(subGroups);
    }

    shuffleMemberList() {
        const {accessAssigned} = this.state;
        let array = accessAssigned.allMembers;
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    handleSubGroupCreate() {
        const {accessAssigned} = this.state;
        let subGroups = [];
        let subGroup = {
            name: 1,
            sequence: 1,
            members: [],
        };
        let memberCount = !!accessAssigned.allMembers && accessAssigned.allMembers.length;
        let unevenCount = memberCount % accessAssigned.subGroupCount;
        let newGroupCount = 0;
        let remainderDistributeIndex = 0;
        let randomMembers = this.shuffleMemberList();

        for(var i = 0; i < memberCount; i++) {
            //There is a good chance that the groups won't come out even.  Assign all of the extras at the end that exceed the exact division of members.
            if (newGroupCount === Math.floor(accessAssigned.membersPerGroup) && subGroups.length < accessAssigned.subGroupCount-1) {
                newGroupCount = 0;
                subGroups = subGroups ? subGroups.concat(subGroup) : [subGroup];
                subGroup = {
                    name: subGroups.length + 1,
                    sequence: subGroups.length + 1,
                    members: [],
                }
            }
            //If the loop index, i, is now greater than the membersPerGroup multiplied by the subGroupCount,
            //Then add each remainder member into the groups, starting from the beginning, 1.
            if (i >= Math.floor(accessAssigned.membersPerGroup) * accessAssigned.subGroupCount) {
                subGroups = subGroups.map((m, index) => {
                    if (index === remainderDistributeIndex) {
                        m.members.push(randomMembers[i])
                    }
                    return m;
                });
                remainderDistributeIndex++;
            } else {
                subGroup.members = !!subGroup.members ? subGroup.members.concat(randomMembers[i]) : [randomMembers[i]];
            }
            newGroupCount++;
        }
        //We need to pick up the last one after the circulation of the final group.
        subGroups = subGroups ? subGroups.concat(subGroup) : [subGroup];
        this.setState({ accessAssigned: { ...accessAssigned, peerGroups: subGroups }, unevenCount })
    }

    componentDidMount () {
        const {accessAssigned, peerGroupName} = this.props;
        this.setState({
            accessAssigned,
            peerGroupName
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.accessAssigned !== this.props.accessAssigned) {
            this.setState({ accessAssigned: this.props.accessAssigned })
            this.getUnassignedOptions(this.props.accessAssigned.peerGroups)
        }
        if (prevState.accessAssigned !== this.state.accessAssigned) {
            this.setState({ accessAssigned: this.state.accessAssigned })
        }
    }

    handleSubGroupNameChange(sequence, event) {
        const {accessAssigned} = this.state;
        let newAssigned = Object.assign({}, accessAssigned);
        newAssigned.peerGroups = !!accessAssigned.peerGroups && accessAssigned.peerGroups.map(m => {
            if (m.sequence === sequence) {
                m.name = event.target.value;
            }
            return m;
        })
        this.setState({ accessAssigned: newAssigned })
    }

    handleSubGroupCountChange(event) {
        const {groupSummary} = this.props;
        const {accessAssigned} = this.state;
        if (!event.target.value) return;
        //1. Get the member memberCount
        //2. Divide the members by the numbers of groups chosen.
        //3. Get the remainder
        //4. Set the groups but keep the remainder in mind.
        let memberCount = groupSummary.members && groupSummary.members.length;
        let groupCount = event.target.value;
        let membersPerGroup  = memberCount / groupCount;
        let hasRemainder = memberCount % groupCount;
        let hasRemainderMessage = '';
        if (hasRemainder) {
            let theLastGroups = groupCount - hasRemainder + 1;
            hasRemainderMessage = Math.floor(membersPerGroup) === 1
                ? theLastGroups === 1
                    ? <L p={p} t={`The last group will only have ${Math.floor(membersPerGroup)} member`}/>
                    : <L p={p} t={`The last ${theLastGroups} groups will only have ' + Math.floor(membersPerGroup) + ' member`}/>
                : theLastGroups === 1
                    ? <L p={p} t={`The last group will only have ${Math.floor(membersPerGroup)} members`}/>
                    : <L p={p} t={`The last ${theLastGroups} groups will only have ${Math.floor(membersPerGroup)} members`}/>;
            membersPerGroup = Math.floor(++membersPerGroup);
        }
        this.setState({ hasRemainderMessage, accessAssigned: {...accessAssigned, membersPerGroup, subGroupCount: event.target.value} });
    }

    handleMembersPerGroupChange(event) {
        const {groupSummary} = this.props;
        const {accessAssigned} = this.state;
        if (!event.target.value) return;
        //1. Get the member memberCount
        //2. Divide the members by the members per group.
        //3. Get the remainder
        //4. Set the groups but keep the remainder in mind.
        let memberCount = groupSummary.members && groupSummary.members.length;
        let membersPerGroup  = event.target.value;
        let groupCount = memberCount / membersPerGroup;
        let hasRemainder = memberCount % membersPerGroup;
        let hasRemainderMessage = '';
        if (hasRemainder) {
            hasRemainderMessage = hasRemainder === 1
                ? <L p={p} t={`The last group will have ${hasRemainder} member`}/>
                : <L p={p} t={`The last group will have ${hasRemainder} members`}/>;
            groupCount = Math.floor(++groupCount);
        }
        this.setState({ hasRemainderMessage, accessAssigned: {...accessAssigned, membersPerGroup: event.target.value, subGroupCount: groupCount} });
    }

    handleSubmit() {
        const {addOrUpdatePeerGroup, personId, peerGroupId, groupSummary} = this.props;
        const {parentPeerGroupName, accessAssigned} = this.state;
        var isValid = true;

        if (!accessAssigned.subGroupCount && !accessAssigned.membersPerGroup) {
            this.setState({ subGroupCountError: <L p={p} t={`Please choose the number of sub groups that you want.`}/> });
            isValid = false;
        }
        let sendPeerGroupId = peerGroupId ? peerGroupId : guid.emptyGuid();
        isValid && addOrUpdatePeerGroup({groupId: groupSummary.groupId, personId, peerGroupId: sendPeerGroupId, parentPeerGroupName, subGroupCount: accessAssigned.subGroupCount}, accessAssigned);
        isValid && this.setState({ isSubmitted: true });
    }

    processForm(stayOrFinish) {
        const {addUpdateGroupWorkAssignAccess} = this.props;
        const {accessAssigned} = this.state;

        addUpdateGroupWorkAssignAccess(accessAssigned);
        if (stayOrFinish === "FINISH") {
            browserHistory.push("/assignmentDashboard/" + accessAssigned.groupId + "/" + accessAssigned.masterWorkId);
        }
    }

    handlePeerGroupInfoClose = () => this.setState({isShowingPeerGroupInfo: false})
    handlePeerGroupInfoOpen = () => this.setState({isShowingPeerGroupInfo: true})

    render() {
          let {groupSummary, workSummary, subGroupCountOptions} = this.props;
          let {subGroupCountError, accessAssigned, unassignedMembers, hasRemainderMessage, memberToBeAssigned,peerGroupOpen,
                isShowingPeerGroupInfo, copyPreviousPeerGroupId} = this.state;

          return (
            <div className={styles.container}>
                <div className={globalStyles.pageTitle}>
                    {groupSummary.groupTypeName === "FACILITATORLEARNER"
                        ? <L p={p} t={`Grant Access to Learners`}/>
                        : <L p={p} t={`Grant Access to Members`}/>
                    }
                </div>
                <div className={styles.subTitle}>
                    <span className={styles.subLabel}>group:</span>
                    {groupSummary.groupName}
                </div>
                <div className={styles.subTitle}>
                    <span className={styles.subLabel}>assignment:</span>
                    {workSummary.workName}
                </div>
                <div className={styles.containerName}>
                    <TextDisplay label={<L p={p} t={`Group members`}/>} text={groupSummary && groupSummary.members && groupSummary.members.length} className={styles.textDisplay}/>

                    <div className={classes(styles.row, styles.clickable)}>
                        <a onClick={this.togglePeerGroupOpen}><Icon pathName={'group_work'} premium={true}/></a>
                        <span className={styles.text} onClick={this.togglePeerGroupOpen}><L p={p} t={`Split the class into peer groups?`}/></span>
                        <a onClick={this.togglePeerGroupOpen} className={styles.caretPosition}>
                            <Icon pathName={'chevron_down'} className={peerGroupOpen ? styles.chevronUp : styles.chevronDown} />
                        </a>
                        <a onClick={this.handlePeerGroupInfoOpen}><Icon pathName={`info0`} className={styles.infoImage}/></a>
                    </div>

                    {peerGroupOpen &&
                        <div>
                            <div className={styles.row}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`copyPreviousPeerGroupId`}
                                        label={<L p={p} t={`(optional) Copy peer group from previous assignment`}/>}
                                        value={copyPreviousPeerGroupId}
                                        options={accessAssigned.otherWorkPeerGroups}
                                        className={styles.singleDropDown}
                                        height={`medium`}
                                        onChange={this.handlePrevPeerGroupChange} />
                                </div>
                                <a onClick={this.handleCopyPreviousPeerGroup}>
                                    <Icon pathName={`checkmark`} className={classes(styles.farLeft, styles.imageTopMargin)}/>
                                </a>
                            </div>
                            <div className={styles.row}>
                                <div>
                                    <SelectSingleDropDown
                                        id={`subGroupCount`}
                                        label={<L p={p} t={`Number of groups`}/>}
                                        value={accessAssigned.subGroupCount}
                                        options={subGroupCountOptions}
                                        className={styles.singleDropDown}
                                        error={subGroupCountError}
                                        height={`medium-short`}
                                        onChange={this.handleSubGroupCountChange} />
                                </div>
                                <span className={styles.bigText}>- OR -</span>
                                <div>
                                    <SelectSingleDropDown
                                        id={`membersPerGroup`}
                                        label={<L p={p} t={`Members per group`}/>}
                                        value={accessAssigned.membersPerGroup}
                                        options={subGroupCountOptions}
                                        className={styles.singleDropDown}
                                        error={subGroupCountError}
                                        height={`medium-short`}
                                        onChange={this.handleMembersPerGroupChange} />
                                </div>
                            </div>
                            <div className={styles.textWarning}>{hasRemainderMessage}</div>
                            <div className={styles.parentGroup}>
                                <InputText
                                    value={accessAssigned.parentPeerGroupName || ''}
                                    size={"medium-long"}
                                    name={'parentPeerGroupName'}
                                    label={<L p={p} t={`(optional) Give this peer group setup a name`}/>}
                                    onChange={this.handleParentPeerGroupNameChange}/>
                            </div>
                            <div onClick={this.handleSubGroupCreate} className={styles.button}>
                                {accessAssigned && !!accessAssigned.peerGroups && accessAssigned.peerGroups.length > 0 ? <L p={p} t={`Reset Groups`}/> : <L p={p} t={`Make Groups`}/>}
                            </div>
                        </div>
                    }
                </div>
                <hr />
                {unassignedMembers && unassignedMembers.length > 0 &&
                    <div className={styles.unassignedMembers}>
                        {unassignedMembers.length === 1
                            ? <L p={p} t={`There is one unassigned member`}/>
                            : <L p={p} t={`There are ${unassignedMembers.length} unassigned members`}/>
                        }
                    </div>
                }
                <div className={classes(styles.row)}>
                    <button className={styles.button} onClick={(event) => this.processForm("STAY", event)}>
                        <L p={p} t={`Save & Stay`}/>
                    </button>
                    <button className={styles.button} onClick={(event) => this.processForm("FINISH", event)}>
                        <L p={p} t={`Save & Finish`}/>
                    </button>
                    <a className={styles.resetButton} onClick={this.resetData}>reset</a>
                </div>
                {accessAssigned &&
                    accessAssigned && !!accessAssigned.peerGroups && accessAssigned.peerGroups.map((m, i) =>
                        <div key={i}>
                            <div className={styles.setAll}>
                                <a onClick={this.setAllAccess}>set all</a>
                            </div>
                            {accessAssigned.peerGroups.length > 1 &&
                                <InputText
                                    value={m.name}
                                    size={"medium"}
                                    name={m.sequence}
                                    inputClassName={styles.subGroupInput}
                                    label={<L p={p} t={`Sub group name`}/>}
                                    onChange={(event) => this.handleSubGroupNameChange(m.sequence, event)}/>
                            }
                            {unassignedMembers && unassignedMembers.length > 0 &&
                                <div className={classes(styles.row)}>
                                    <div>
                                        <SelectSingleDropDown
                                            id={`unassignedMembers`}
                                            label={<L p={p} t={`Unassigned members`}/>}
                                            value={memberToBeAssigned}
                                            options={unassignedMembers}
                                            className={classes(styles.singleDropDown, styles.moreLeft)}
                                            noBlank={true}
                                            height={`medium`}
                                            onChange={this.handleMemberToBeAssigned} />
                                    </div>
                                    <a onClick={() => this.handleAddUnassigned(m.sequence)}>
                                        <Icon pathName={`checkmark`} className={styles.imageTopMargin}/>
                                    </a>
                                </div>
                            }
                            {m.members && m.members.length > 0 && m.members.map((d, ind) =>
                                <div key={ind} className={classes(styles.row, styles.leftMargin)}>
                                    {accessAssigned.peerGroups.length > 1 &&
                                        <a onClick={() => this.handleRemoveMember(m.sequence, d.personId)}>
                                            <Icon pathName={`move`} className={styles.image} premium={true}/>
                                        </a>
                                    }
                                    <Checkbox
                                        id={`memberAccess`}
                                        label={``}
                                        checked={d.workAccess}
                                        className={styles.checkbox}
                                        onClick={() => this.handleAccessChange(i, ind)}/>
                                    {d.workAccess && d.isLockedAccess && <Icon pathName={`locked0`} premium={true} fillColor={'maroon'} className={styles.locked}/>}
                                    <span className={styles.member} onClick={() => this.handleAccessChange(i, ind)}>
                                        {d.firstName + ' ' + d.lastName}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                }
                <OneFJefFooter />
                {isShowingPeerGroupInfo &&
                    <MessageModal handleClose={this.handlePeerGroupInfoClose} heading={<L p={p} t={`How to use peer groups with an assignment`}/>} showPeerGroupInfo={true}
                        explainJSX={[<L p={p} t={`Peer groups will allow members of each sub group to view and edit each other's assignments.`}/>,<br/>,<br/>,
                            <L p={p} t={`If you only want one assignment per peer group, grant access to one student. That student will become the one person who can finalize the document by accepting the others' edits.`}/>,<br/>,<br/>,
                            <L p={p} t={`Or, if you want every student to have their own copy to turn in, give access to everyone.  They will each become the author of their own assignment and the others can contribute by making edits.`}/>]}
                        onClick={this.handlePeerGroupInfoClose}/>
                }
            </div>
        )
    }
};
