import React, {Component} from 'react';
import styles from './PeerGroupAddNewView.css';
const p = 'PeerGroupAddNewView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import TextDisplay from '../../components/TextDisplay';
import Icon from '../../components/Icon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import * as guid from '../../utils/GuidValidate.js';

export default class PeerGroupAddNewView extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            peerGroupName: '',
            subGroupCount: '',
            peerGroupNameError: '',
            subGroupCountError: '',
            notAssigned: [],
            assignedSubGroup: [],
            unevenCount: 0,
            memberToBeAssigned: '',
            isSubmitted: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubGroupNameChange = this.handleSubGroupNameChange.bind(this);
        this.handleSubGroupCountChange = this.handleSubGroupCountChange.bind(this);
        this.handleSubGroupCreate = this.handleSubGroupCreate.bind(this);
        this.handleRemoveMember = this.handleRemoveMember.bind(this);
        this.getUnassignedOptions = this.getUnassignedOptions.bind(this);
        this.handleAddUnassigned = this.handleAddUnassigned.bind(this);
        this.handleMemberToBeAssigned = this.handleMemberToBeAssigned.bind(this);
    }

    handleNameChange(event) {
        this.setState({ peerGroupName: event.target.value });
    }

    handleMemberToBeAssigned(event) {
        this.setState({ memberToBeAssigned: event.target.value})
    }

    handleAddUnassigned(groupSequence) {
        const {summary} = this.props;
        const {assignedSubGroup, memberToBeAssigned} = this.state;
        let subGroups = !!assignedSubGroup && assignedSubGroup.length > 0 && assignedSubGroup.map(g => {
            if (g.sequence === groupSequence) {
                g.members.unshift(summary.members.filter(p => p.personId === memberToBeAssigned.personId)[0])
            }
            return g;
        });

        this.setState({ assignedSubGroup: subGroups })
        this.getUnassignedOptions(subGroups);
    }

    getUnassignedOptions(subGroups) {
        //We pass in the subGroups here right after the remove member so we can be sure to have the latest data and we don't have to wait
        const {summary} = this.props;

        let members = Object.assign([], summary.members);
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
        const {assignedSubGroup} = this.state;
        let subGroups = !!assignedSubGroup && assignedSubGroup.length > 0 && assignedSubGroup.map(m => {
            if (m.sequence === groupSequence && m.members.length > 0) {
                return { ...m, members: m.members.filter(p => p.personId !== memberPersonId) };
            } else {
                return m;
            }
        });
        this.setState({ assignedSubGroup: subGroups })
        this.getUnassignedOptions(subGroups);
    }

    handleSubGroupCreate() {
        const {summary} = this.props;
        const {subGroupCount} = this.state;
        let subGroups = [];
        let subGroup = {
            name: 1,
            sequence: 1,
            members: [],
        };
        let memberCount = summary && summary.members && summary.members.length;
        let membersPerGroup = memberCount / subGroupCount;
        let unevenCount = memberCount % subGroupCount;
        let newGroupCount = 0;
        let remainderDistributeIndex = 0;

        for(var i = 0; i < memberCount; i++) {
            //There is a good chance that the groups won't come out even.  Assign all of the extras at the end that exceed the exact division of members.
            if (newGroupCount === Math.floor(membersPerGroup) && subGroups.length < subGroupCount-1) {
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
            if (i >= Math.floor(membersPerGroup) * subGroupCount) {
                subGroups = subGroups.map((m, index) => {
                    if (index === remainderDistributeIndex) {
                        m.members.push(summary.members[i])
                    }
                    return m;
                });
                remainderDistributeIndex++;
            } else {
                subGroup.members = !!subGroup.members ? subGroup.members.concat(summary.members[i]) : [summary.members[i]];
            }
            newGroupCount++;
        }
        //We need to pick up the last one after the circulation of the final group.
        subGroups = subGroups ? subGroups.concat(subGroup) : [subGroup];
        this.setState({ assignedSubGroup: subGroups, unevenCount })
    }


    componentDidMount () {
        const {assignedSubGroup, subGroupCount, peerGroupName} = this.props;
        //document.getElementById('peerGroupName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
        this.setState({
            assignedSubGroup,
            subGroupCount: subGroupCount ? subGroupCount : 1,
            peerGroupName
        });
    }

    handleSubGroupNameChange(sequence, event) {
        const {assignedSubGroup} = this.state;
        let newAssigned = !!assignedSubGroup && assignedSubGroup.map(m => {
            if (m.sequence === sequence) {
                m.name = event.target.value;
            }
            return m;
        })
        this.setState({ assignedSubGroup: newAssigned })
    }

    handleSubGroupCountChange(event) {
        this.setState({ subGroupCount: event.target.value})
    }

    handleSubmit() {
        const {addOrUpdatePeerGroup, personId, peerGroupId, summary} = this.props;
        const {peerGroupName, subGroupCount, assignedSubGroup} = this.state;
        var isValid = true;

        if (!peerGroupName) {
            this.setState({ peerGroupNameError: <L p={p} t={`Please enter a peer group name`}/> });
            isValid = false;
        }

        if (!subGroupCount) {
            this.setState({ subGroupCountError: <L p={p} t={`Please choose the number of sub groups that you want.`}/> });
            isValid = false;
        }
        let sendPeerGroupId = peerGroupId ? peerGroupId : guid.emptyGuid();
        isValid && addOrUpdatePeerGroup({groupId: summary.groupId, personId, peerGroupId: sendPeerGroupId, peerGroupName, subGroupCount}, assignedSubGroup);
        isValid && this.setState({ isSubmitted: true });
    }

    render() {
          let {summary, subGroupCountOptions} = this.props;
          let {peerGroupName, subGroupCount, peerGroupNameError, subGroupCountError, assignedSubGroup, unevenCount,
                unassignedMembers, memberToBeAssigned, isSubmitted} = this.state;

          return (
            <div className={styles.container}>
                <form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
                    <div className={globalStyles.pageTitle}>
                        <L p={p} t={`Create New Peer Group`}/>
                    </div>
                    <div className={styles.subTitle}>
                        {summary.groupName}
                    </div>
                    <div className={styles.containerName}>
                        <InputText
                            value={peerGroupName}
                            size={"medium-long"}
                            name={"peerGroupName"}
                            label={<L p={p} t={`Peer group name`}/>}
                            onChange={this.handleNameChange}
                            error={peerGroupNameError}/>

                        <TextDisplay label={<L p={p} t={`Group members`}/>} text={summary && summary.members && summary.members.length} className={styles.textDisplay}/>

                        <div className={styles.marginTop}>
                            <SelectSingleDropDown
                                id={`subGroupCount`}
                                label={<L p={p} t={`Number of groups desired`}/>}
                                value={subGroupCount}
                                options={subGroupCountOptions}
                                className={styles.singleDropDown}
                                noBlank={true}
                                error={subGroupCountError}
                                height={`medium-short`}
                                onChange={this.handleSubGroupCountChange} />
                        </div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <span onClick={this.handleSubGroupCreate} className={styles.button}>{!!assignedSubGroup && assignedSubGroup.length > 0 ? <L p={p} t={`Update Groups`}/> : <L p={p} t={`Make Groups`}/>}</span>
                        {!isSubmitted &&
                            <span onClick={!!assignedSubGroup && assignedSubGroup.length > 0 ? this.handleSubmit : () => {}} className={classes(styles.button, !!assignedSubGroup && assignedSubGroup.length > 0 ? styles.fullOpacity : styles.lowOpacity) }>
                                <L p={p} t={`Finish`}/>
                            </span>
                        }
                    </div>
                    <hr />
                    {!!unevenCount &&
                        <div className={styles.extraMembers}>
                            {unevenCount === 1
                                ? <L p={p} t={`The first group has one more member than the other groups`}/>
                                : <L p={p} t={`The first ${unevenCount} groups have one more member than the other groups`}/>
                            }
                        </div>
                    }
                    {unassignedMembers && unassignedMembers.length > 0 &&
                        <div className={styles.unassignedMembers}>
                            {unassignedMembers.length === 1
                                ? <L p={p} t={`There is one unassigned member`}/>
                                : <L p={p} t={`There are ${unassignedMembers.length} unassigned members`}/>
                            }
                        </div>
                    }
                    {assignedSubGroup &&
                            !!assignedSubGroup && assignedSubGroup.map((m, i) =>
                                <div key={i}>
                                    <InputText
                                        value={m.name}
                                        size={"medium"}
                                        name={m.sequence}
                                        label={<L p={p} t={`Sub group name`}/>}
                                        onChange={(event) => this.handleSubGroupNameChange(m.sequence, event)}/>
                                    {unassignedMembers && unassignedMembers.length > 0 &&
                                        <div className={classes(styles.row)}>
                                            <div>
                                                <SelectSingleDropDown
                                                    id={`unassignedMembers`}
                                                    label={<L p={p} t={`Unassigned members`}/>}
                                                    value={memberToBeAssigned}
                                                    options={unassignedMembers}
                                                    className={styles.singleDropDown}
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
                                        <div key={ind} className={styles.row}>
                                            <a onClick={() => this.handleRemoveMember(m.sequence, d.personId)}>
                                                <Icon pathName={`move_sentence`} className={styles.image}/>
                                            </a>
                                            <span className={styles.member}>{d.firstName + ' ' + d.lastName}</span>
                                        </div>
                                    )}
                                </div>
                            )
                    }
                    <OneFJefFooter />
                </form>
            </div>
        )
    }
};

//    djsConfig={djsConfig} />
