import React, {Component} from 'react';
import styles from './WorkAddOrUpdate.css';
import classes from 'classnames';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateTimePicker from '../../components/DateTimePicker';
import TextDisplay from '../../components/TextDisplay';
import {formatDayShortMonthYear} from '../../utils/dateFormat.js';
const p = 'component';
import L from '../../components/PageLanguage';

export default class WorkAddOrUpdate extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            isLocalNotEditMode: false,
        	workName: '',
            dueDate: '',
            internalId: '',
            description: '',
            languageChosen: 1,
            groupId: '',
            workNameError: '',
            languageError: '',
            isVerified: false,
            localShowMoreInfo: false,
        }
    }

    toggleShowMoreInfo = () => {
        this.setState({ localShowMoreInfo: !this.state.localShowMoreInfo});
    }

    componentDidMount () {
        const {groupChosen, workSummary, isNotEditMode, showMoreInfo} = this.props;
        if (!isNotEditMode) {
            //document.getElementById('workName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
            document.getElementById('workName').addEventListener('keydown', this.checkForKeypress);
        }
        this.setState({ groupId: groupChosen, isLocalNotEditMode: isNotEditMode });
        if (workSummary) {
            this.setState({
                workName: workSummary.title,
                dueDate: formatDayShortMonthYear(workSummary.chapterDueDate, true),
                internalId: workSummary.internalId,
                description: workSummary.description,
                languageChosen: workSummary.nativeLanguageId,
            });
        }
        if (showMoreInfo || (workSummary && (workSummary.description || workSummary.chapterDueDate))) {
            this.setState({ localShowMoreInfo: showMoreInfo })
        }

        let baseDueDate = workSummary && workSummary.chapterDueDate;
        if (baseDueDate && baseDueDate.indexOf('T') > -1) {
            baseDueDate = baseDueDate.substring(0, baseDueDate.indexOf('T'));
        }
        this.setState({ dueDate: baseDueDate });
    }

    componentDidUpdate() {
        if (!this.state.isVerified && this.props.runVerifyForm) {
            this.setState({ isVerified: true });
            this.handleExternalSubmit();
        }
        if (!this.state.isCleared && this.props.runClearForm) {
            this.setState({ isCleared: true });
            this.handleClearForm();
        }
    }

    changeEditMode = () => {
        this.setState({ isLocalNotEditMode: false })
    }

    handleGroupChange = (event) => {
        this.setState({ groupId: event.target.value });
    }

    handleDueDateChange = (event) => {
        this.setState({ dueDate: event.target.value });
    }

    handleInternalIdChange = (event) => {
        this.setState({ internalId: event.target.value})
    }

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value})
    }

    checkForKeypress = (evt) => {
        if (evt.key === 'Enter') {
            evt.stopPropagation();
            evt.preventDefault();
            this.handleChooseEntryOpen();
            return false;
        }
    }

    handleNameUpdate = (event) => {
        this.setState({ workName: event.target.value, workNameError: '', isVerified: false})
        this.props.unsetRunVerifyForm();
    }

    handleLanguageChange = (event) => {
        this.setState({ languageChosen: event.target.value, languageError: '', isVerified: false });
        this.props.unsetRunVerifyForm();
    }

    handleInternalSubmit = () => {
        const {addOrUpdateDocument} = this.props;
        let workRecord = this.verifyForm();
        if (workRecord) {
            addOrUpdateDocument(workRecord, "STAY");
            this.setState({ isLocalNotEditMode: true });
        }
    }

    handleExternalSubmit = () => {
        const {submitOuterPage} = this.props;
        let workRecord = this.verifyForm();
        workRecord && submitOuterPage(workRecord);
    }

    handleClearForm = () => {
        this.setState( {
            workName: '',
            dueDate: '',
            internalId: '',
            description: '',
            languageChosen: 1,
        });
        //document.getElementById('workName').focus();  //don't automatically put the focus on page controls since that will immediately open up the smart phone keyboard and cover a portion of the page.
    }

    verifyForm = () => {
        const {workId, personId} = this.props;
        const {workName, languageChosen, groupId=null, description, dueDate, internalId} = this.state;

        if (!workName) {
            this.setState({ workNameError: <L p={p} t={`Please enter a document name`}/> });
            return false;
        }

        if (!languageChosen || languageChosen === '- -') {
            this.setState({ languageError: <L p={p} t={`Please choose a native text language`}/> });
            return false;
        }
        return {
            personId,
            workId,
            workName,
            languageId: languageChosen,
            groupId: groupId === 'undefined' ? null : groupId,
            description,
            dueDate,
            internalId,
        }
    }

    render() {
        //the showButton and the isNotEditMOde is used in workSettings.  the handleSubmit is used in
          const {languageList, groupList, showButton} = this.props;
          const {languageChosen, workName, workNameError, languageError, internalId, description, dueDate, groupId, isLocalNotEditMode,
                    localShowMoreInfo} = this.state;
          let languageIdChosen = languageList && languageList.length > 0 && languageList.filter(m => m.id === languageChosen)[0];
          let languageName = !!languageIdChosen ? languageIdChosen.label : '';

          let groupIdChosen = groupList && groupList.length > 0 && groupList.filter(m => m.groupId === groupId)[0];
          let groupName = !!groupIdChosen ? groupIdChosen.label : '';

          return (
            <div className={styles.inputControls}>
                {!isLocalNotEditMode &&
                    <div>
                        <div className={styles.row}>
                            <div>
                                <InputText
                                    value={workName}
                                    size={"medium-long"}
                                    name={"workName"}
                                    label={<L p={p} t={`Document name`}/>}
                                    inputClassName={styles.input}
                                    onChange={this.handleNameUpdate}/>
                            </div>
                            {showButton && <button className={styles.editButton} onClick={this.handleInternalSubmit}>Save</button>}
                        </div>
                        <div className={styles.errorName}>{workNameError}</div>
                        <div>
                            <SelectSingleDropDown
                                label={<L p={p} t={`Native Text Language`}/>}
                                value={languageChosen}
                                options={languageList || []}
                                error={''}
                                height={`medium`}
                                className={styles.singleDropDown}
                                id={`languageId`}
                                onChange={this.handleLanguageChange} />
                        </div>
                        <div className={styles.errorLanguage}>{languageError}</div>
                        {groupList && groupList.length > 1 &&
                            <div>
                                <SelectSingleDropDown
                                    label={<L p={p} t={`Group`}/>}
                                    value={groupId}
                                    options={groupList || []}
                                    error={''}
                                    height={`medium`}
                                    className={styles.singleDropDown}
                                    id={`groupId`}
                                    onChange={this.handleGroupChange} />
                            </div>
                        }
                        {groupId &&
                            <div>
                                <InputText
                                    value={internalId || ''}
                                    size={"medium"}
                                    name={"internalId"}
                                    label={<L p={p} t={`Internal id`}/>}
                                    inputClassName={styles.input}
                                    onChange={this.handleInternalIdChange}/>
                            </div>
                        }
                        <div className={classes(styles.showMore, styles.rowTight)} onClick={this.toggleShowMoreInfo}>
                            {localShowMoreInfo ? <L p={p} t={`Show less info`}/> : <L p={p} t={`Show more info`}/>}
                            <div className={classes(styles.moreLeftMargin, styles.jef_caret, localShowMoreInfo ? styles.jefCaretUp : styles.jefCaretDown)}/>
                        </div>
                        {localShowMoreInfo &&
                            <div>
                                <div className={styles.dueDate}>
                                    <span className={styles.labelHigher}><L p={p} t={`Due date`}/></span>
                                    <DateTimePicker value={dueDate} onChange={this.handleDueDateChange}/>
                                </div>
                                <div className={styles.column}>
                                    <span className={styles.labelHigher}>Description (optional)</span>
                                    <textarea rows={5} cols={42} value={description || ''} id={`description`} className={styles.messageBox}
                                        onChange={(event) => this.handleDescriptionChange(event)}></textarea>
                                </div>
                            </div>
                        }
                    </div>
                }
                {isLocalNotEditMode &&
                    <div>
                        <div className={styles.row}>
                            <TextDisplay label={<L p={p} t={`Document name`}/>} text={workName} />
                            <button className={styles.editButton} onClick={this.changeEditMode}><L p={p} t={`Edit`}/></button>
                        </div>
                        <TextDisplay label={<L p={p} t={`Due date`}/>} text={formatDayShortMonthYear(dueDate, true) || '- -'} />
                        <TextDisplay label={<L p={p} t={`Description`}/>} text={description || '- -'} />
                        <TextDisplay label={<L p={p} t={`Native text language`}/>}
                            text={languageName || '- -'} />
                        {groupList && <TextDisplay label={<L p={p} t={`Group`}/>}
                            text={groupName || '- -'} />
                        }
                        {groupName && <TextDisplay label={<L p={p} t={`Internal id`}/>}
                            text={internalId || '- -'} />
                        }
                    </div>
                }
            </div>
        )
    }
};
