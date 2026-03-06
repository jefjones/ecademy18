import React, {Component} from 'react';
import {Link} from 'react-router';
import {penspringHost} from '../../penspring_host.js';
import styles from './PenspringWorkAddView.css';
const p = 'PenspringWorkAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import Icon from '../../components/Icon';
import penspringSmall from '../../assets/Penspring_small.png';
import classes from 'classnames';
import InputText from '../../components/InputText';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DateTimePicker from '../../components/DateTimePicker';

export default class PenspringWorkAddView extends Component {
    constructor ( props ) {
        super( props );

        this.state = {
            isFileUpload: false,
            isShowingSectionInfo: false,
            isShowingChooseEntry: false,
						data: {
								workName: props.presetName || '',
								languageId: 1,
								dueDate: '',
								description: '',
						}
        }
    }

		toggleShowMoreInfo = () => this.setState({ localShowMoreInfo: !this.state.localShowMoreInfo})

    handleSectionInfoClose = () => this.setState({isShowingSectionInfo: false})
    handleSectionInfoOpen = () => this.setState({isShowingSectionInfo: true})
    handleChooseEntryClose = () => this.setState({ isShowingChooseEntry: false });
    handleChooseEntryOpen = () => this.setState({ isShowingChooseEntry: true });

		changeData = (event) => {
				let data = this.state.data;
				let field = event.target.name;
				data[field] = event.target.value;
				this.setState({ data });
		}

		processForm = (isFileUpload) => {
	      const {personId, createWorkAndPenspringTransfer, accessRoles, studentPersonId, course, assignmentId, recallInitRecords, isDistributableAssignment,
								companyConfig}  = this.props;
	      let data = this.state.data;
	      let hasError = false;
				//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.

				if (!data.workName) {
	          hasError = true;
	          this.setState({ errorWorkName: 'A document name is required'});
	      }

				if (!data.languageId) {
	          hasError = true;
	          this.setState({ errorLanguageId: 'A language is required'});
	      }

	      if (!hasError) {
						data.isDistributableAssignment = isDistributableAssignment;
						data.personId = personId;
						//data.transferCode = isFileUpload ? 'FILEUPLOAD' : 'STARTWRITING';
						data.transferCode = 'STARTWRITING';
						data.ownerPersonId = studentPersonId || personId;
						data.editorPersonId = isDistributableAssignment ? '' : course.facilitatorPersonId;
						data.studentPersonId = isDistributableAssignment ? '' : studentPersonId;
						data.assignmentId = assignmentId;
						data.companyId = companyConfig.companyId;
						data.schoolYearId = course.schoolYearId;
						data.intervalId = course.intervalId;
						data.courseEntryId  = course.courseEntryId;
						data.courseScheduledId = course.courseScheduledId;
						data.isTeacher = accessRoles.facilitator;
						data.courseEntryId = course.courseEntryId;

	          createWorkAndPenspringTransfer(personId, data, recallInitRecords);
	      }
	  }

    unsetRunVerifyForm = () => {
        this.setState({ runVerifyForm: false });
    }

    submitOuterPage = (workRecord) => {
        const {addOrUpdateDocument} = this.props;
        const {isFileUpload} = this.state;
        addOrUpdateDocument(workRecord, isFileUpload);
    }

    render() {
          const {personId, isNewUser, languageList, groupChosen, showMoreInfo=true, hideSectionMessage} = this.props;
          let {localShowMoreInfo, isShowingSectionInfo, isShowingChooseEntry, data, errorWorkName, errorLanguageId } = this.state;

          return (
            <div className={styles.container}>
                <div className={globalStyles.pageTitle}>
                    {isNewUser
												? <L p={p} t={`Add Your First Document`}/>
												: groupChosen
														? <L p={p} t={`Add New Assignment`}/>
														: <div className={styles.row}><L p={p} t={`Add a new `}/><img className={classes(styles.penspringLogo, styles.pointer)} src={penspringSmall} alt="penspring"/><L p={p} t={`file`}/></div>
										}
                </div>
								<div className={styles.row}>
										<InputText
												value={data.workName}
												size={"medium-long"}
												name={"workName"}
												maxLength={225}
												label={<L p={p} t={`Document name`}/>}
												inputClassName={styles.input}
												onChange={this.changeData}/>
								</div>
								<div className={styles.errorName}>{errorWorkName}</div>
								{showMoreInfo &&
										<div className={classes(styles.showMore, styles.rowTight)} onClick={this.toggleShowMoreInfo}>
												{localShowMoreInfo ? <L p={p} t={`Show less info`}/> : <L p={p} t={`Show more info`}/>}
												<div className={classes(styles.moreLeftMargin, styles.jef_caret, localShowMoreInfo ? styles.jefCaretUp : styles.jefCaretDown)}/>
										</div>
								}
								{localShowMoreInfo &&
										<div>
												<div>
														<SelectSingleDropDown
																label={<L p={p} t={`Native Text Language`}/>}
																value={data.languageId}
																options={languageList || []}
																error={''}
																height={`medium`}
																className={styles.singleDropDown}
																id={`languageId`}
																onChange={this.changeData} />
												</div>
												<div className={styles.errorLanguage}>{errorLanguageId}</div>
												<div className={styles.dueDate}>
														<span className={styles.labelHigher}><L p={p} t={`Due date`}/></span>
														<DateTimePicker id={'dueDate'} value={data.dueDate} onChange={this.changeData}/>
												</div>
												<div className={styles.column}>
														<span className={styles.labelHigher}><L p={p} t={`Description (optional)`}/></span>
														<textarea rows={5} cols={42} value={data.description || ''} id={`description`} className={styles.messageBox}
																onChange={this.changeData}></textarea>
												</div>
										</div>
								}
                {showMoreInfo && <hr />}
                <div className={styles.row}>
										{/*<Link to={`${penspringHost}/lms/${personId}`}
														onClick={data && data.workName && data.languageId ? () => this.processForm(true) : (event) => event.preventDefault()}
															className={styles.button} target={'_penspring'}>
												{`Upload File...`}
										</Link>*/}
                    <Link to={`${penspringHost}/lms/${personId}`}
														onClick={data && data.workName && data.languageId ? () => this.processForm(false) : (event) => event.preventDefault()}
															className={styles.button} target={'_penspring'}>
												<L p={p} t={`Start Writing`}/>
										</Link>
                </div>
                {!hideSectionMessage &&
										<a onClick={this.handleSectionInfoOpen} className={styles.explanation}>
		                    <L p={p} t={`Do you have sections or chapters?`}/>
		                    <Icon pathName={`info`} className={styles.image}/>
		                </a>
								}
                {isShowingSectionInfo &&
                    <MessageModal handleClose={this.handleSectionInfoClose} heading={<L p={p} t={`Do you have Sections or Chapters?`}/>} showSectionInfo={true}
                        explainJSX={<div><L p={p} t={`You can either load your entire document and then choose to split it up by section.`}/>&nbsp;
                        <L p={p} t={`Or, you can upload your first section/chapter here and add additional sections or chapters with the section menu options.`}/>&nbsp;
                        <L p={p} t={`You can always reorder the sequence of your sections and chapters.`}/></div>}
                        onClick={this.handleSectionInfoClose}/>
                }
                {isShowingChooseEntry &&
                    <MessageModal handleClose={this.handleChooseEntryClose} heading={<L p={p} t={`Choose Entry Type`}/>}
                        explainJSX={<L p={p} t={`Please choose how you want to enter your data. You can choose to start writing or you can upload a file.`}/>}
                        onClick={this.handleChooseEntryClose}/>
                }
            </div>
        )
    }
};

//    djsConfig={djsConfig} />
