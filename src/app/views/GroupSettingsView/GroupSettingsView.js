import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './GroupSettingsView.css';
const p = 'GroupSettingsView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import GroupTools from '../../components/GroupTools';
import InputText from '../../components/InputText';
import TextDisplay from '../../components/TextDisplay';
import numberFormat from '../../utils/numberFormat.js';
import OneFJefFooter from '../../components/OneFJefFooter';

class GroupSettingsView extends Component {
    constructor(props) {
      super(props);

      this.state = {
        isLocalNotEditMode: true,
        groupName: '',
        internalId: '',
        description: '',
        groupNameError: '',
        errors: {},
      };

      this.toggleEditMode = this.toggleEditMode.bind(this);
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleInternalIdChange = this.handleInternalIdChange.bind(this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCancelEdit = this.handleCancelEdit.bind(this);
    }

    handleCancelEdit() {
        const {groupSummary} = this.props;
        this.setState({
            groupName: groupSummary.groupName,
            internalId: groupSummary.internalId ? groupSummary.internalId : '- -',
            description: groupSummary.description ? groupSummary.description : '- -',
        });
        this.toggleEditMode();
    }

    toggleEditMode() {
        const {isLocalNotEditMode, internalId, description} = this.state;
        if (isLocalNotEditMode) {
            this.setState({
                isLocalNotEditMode: false,
                internalId:  internalId === '- -' ? '' : internalId,
                description: description === '- -' ? '' : description,
            })
        } else {
            this.setState({
                isLocalNotEditMode: true,
                internalId:  internalId ? internalId : '- -',
                description: description ? description : '- -',
            })
        }
    }

    componentDidMount() {
        const {groupSummary} = this.props;
        this.setState({
            groupName: groupSummary.groupName,
            internalId: groupSummary.internalId ? groupSummary.internalId : '- -',
            description: groupSummary.description ? groupSummary.description : '- -',
        });
    }

    handleNameChange(event) {
        this.setState({ groupName: event.target.value})
    }

    handleInternalIdChange(event) {
        this.setState({ internalId: event.target.value})
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value})
    }

    handleSubmit() {
        const {updateGroup, groupSummary, personId} = this.props;
        const {groupName, internalId, description} = this.state;
        var isValid = true;
        if (!groupName) {
            this.setState({ groupNameError: <L p={p} t={`Please enter a group name`}/> });
            isValid = false;
        }
        isValid && updateGroup(personId, groupSummary.groupId, groupName, internalId, description, "STAY");
        isValid && this.toggleEditMode();
    }

    render() {
      const {personId, groupSummary, setGroupCurrentSelected, deleteGroup, updatePersonConfig, personConfig} = this.props;
      const {groupName, groupNameError, internalId, description, isLocalNotEditMode} = this.state;

      return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Class Settings`}/>
            </div>
            <div className={styles.subTitle}>
                <GroupTools personId={personId} summary={groupSummary} currentTool={'groupSettings'} showDelete={true}
                    setGroupCurrentSelected={setGroupCurrentSelected} deleteGroup={deleteGroup}
                    isOwner={personId === groupSummary.ownerPersonId} className={styles.tools}
                    updatePersonConfig={updatePersonConfig} personConfig={personConfig} />
            </div>
            <hr />
            {isLocalNotEditMode &&
                <div>
                    <div className={styles.row}>
                        <TextDisplay label={`Group name`} text={groupName} />
                        <button className={styles.editButton} onClick={this.toggleEditMode}><L p={p} t={`Edit`}/></button>
                    </div>
                    <TextDisplay label={`Internal id`} text={internalId} />
                    <TextDisplay label={`Description`} text={description} />
                </div>
            }

            {!isLocalNotEditMode &&
                <ul className={styles.unorderedList}>
                    <div className={styles.row}>
                        <InputText
                            value={groupName}
                            size={"medium-long"}
                            label={<L p={p} t={`Group name`}/>}
                            name={"groupName"}
                            inputClassName={styles.input}
                            onChange={this.handleNameChange}
                            error={groupNameError}/>
                        <div className={styles.column}>
                            <button className={styles.editButton} onClick={this.handleSubmit}><L p={p} t={`Save`}/></button>
                            <span className={styles.cancelButton} onClick={this.handleCancelEdit}><L p={p} t={`Cancel`}/></span>
                        </div>
                    </div>
                    <InputText
                        value={internalId || ''}
                        size={"medium"}
                        label={<L p={p} t={`Internal Id (optional)`}/>}
                        name={"internalId"}
                        inputClassName={styles.input}
                        onChange={this.handleInternalIdChange}/>
                    <div className={styles.column}>
                        <span className={styles.label}><L p={p} t={`Internal Id (optional)`}/><L p={p} t={`Description (optional)`}/></span>
                        <textarea rows={5} cols={42} value={description || ''} id={`description`} className={styles.messageBox}
                            onChange={(event) => this.handleDescriptionChange(event)}></textarea>
                    </div>
                    <hr />
                </ul>
            }
            <hr />
            <div>
                <Link to={`/workAddNew/${groupSummary && groupSummary.groupId}`} className={styles.addNew}>
                    {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new assignment`}/> : <L p={p} t={`Add new document`}/>}
                    <span className={styles.count}>{numberFormat(groupSummary.workSummaries.length || 0)}</span>
                </Link>
            </div>
            <hr />
            <div>
                <Link to={`/groupMemberAdd`} className={styles.addNew}>
                    {groupSummary.groupTypeName === 'FACILITATORLEARNER' ? <L p={p} t={`Add new learner`}/> : <L p={p} t={`Add new member`}/>}
                    <span className={styles.count}>{numberFormat(groupSummary.members.length || 0)}</span>
                </Link>
            </div>
            <hr />
            <OneFJefFooter />
        </div>
    )};
}

export default GroupSettingsView;
