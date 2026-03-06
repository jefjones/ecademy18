import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import {browserHistory} from 'react-router';
import globalStyles from '../../utils/globalStyles.css';
import styles from './StudentAddBulkView.css';
const p = 'StudentAddBulkView';
import L from '../../components/PageLanguage';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import { withAlert } from 'react-alert';
import DropZone from 'react-dropzone-component';
import classes from 'classnames';

let file = {};
//let fileSubmitted = false;

class StudentAddBulkView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false,
			//isFileChosen: false,
			personConfigLocal: props.personConfigEntry,
      bulk: {
					lineStart: 1,
          firstField: 'firstName',
          secondField: 'lastName',
          thirdField: 'emailAddress',
          fourthField: 'birthDate',
          fifthField: 'gradeLevelCode',
          sixthField: 'firstNameParent1',
          seventhField: 'lastNameParent1',
          eighthField: 'emailAddressParent1',
          ninthField: 'phoneParent1',
          tenthField: '',
          memberData: '', //This should always be text for the textarea.  Never an array of objects.
      },
    };

    this.djsConfig = {
        addRemoveLinks: true,
				acceptedFiles: ".csv",
        autoProcessQueue: false,
        maxFiles: 1,
        paramName: "ebiFile",
    };

    this.componentConfig = {
				iconFiletypes: ['csv', '.csv'],
        showFiletypeIcon: false,
        postUrl: this.buildURL,
        method: 'post',
        paramName: "file", // The name that will be used to transfer the file
        accept: function(file, done) {
          if (file.name === "justinbieber.jpg") {
            done("Naha, you don't.");
          }
          else { done(); }
        }
        //uploadMultiple: false,
    };

    this.dropzone = null;
  }

	componentDidUpdate() {
			if (!this.state.hasInit && this.props.personConfigEntry !== this.state.personConfigLocal)
					this.setState({ personConfigLocal: this.props.personConfigEntry, hasInit: true})
	}

  changeBulk = ({target}) => {
			const {personId, setPersonConfigFileFields} = this.props;
			let personConfigLocal = this.state.personConfigLocal;
			let foundSequence = false;
			personConfigLocal = personConfigLocal && personConfigLocal.length > 0 && personConfigLocal.map(m => {
					if (m.sequence === Number(target.id)) {
							foundSequence = true;
							m.fileFieldId = target.value;
					}
					return m;
			})
			if (!foundSequence && !!target.value && target.value !== 0) {
					let option = {
							fileFieldId: Number(target.value),
							sequence: Number(target.id),
					};
					personConfigLocal = personConfigLocal ? personConfigLocal.concat(option) : [option];
			}
    	this.setState({ personConfigLocal });
			setPersonConfigFileFields(personId, personConfigLocal);
  }

  handleNoBulkEntryMessageOpen = () => this.setState({isShowingNoBulkEntryMessage: true})
  handleNoBulkEntryMessageClose = () => this.setState({isShowingNoBulkEntryMessage: false})

	handleFileAdded = (incomingFile) => {
			file = incomingFile;
	    this.setState({ file, isFileChosen: true })
	}

	handleSubmit = () => {
			const {hasRequiredStudentName} = this.props;
			if (!hasRequiredStudentName) {
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`At least a student's first name is required.`}/></div>)
			} else {
			    this.dropzone.processQueue();
					this.setState({ fileSubmitted: true });
					browserHistory.push('/studentAddBulkConfirm');  //This will be called in the action after the data is saved up and comes back for the init.
			}
	}

	buildURL = () => {
			const {personId} = this.props;
			const {bulk} = this.state;
			//browserHistory.push('/studentAddBulkConfirm');
	    return `${apiHost}ebi/studentAdd/fileUpload/bulkEntry/` + personId + `/` + (bulk && bulk.lineStart) || 1;
	}

	handleNoFileOpen = () => this.setState({isShowingModal: true })
	handleNoFileClose = () => this.setState({isShowingModal: false})

	isValueSet = (sequence) => {
			const {personConfigLocal} = this.state;
			let fileFieldId = '';
			if (personConfigLocal && personConfigLocal.length > 0) {
					personConfigLocal.forEach(m => {
							if (Number(m.sequence) === Number(sequence)) fileFieldId = Number(m.fileFieldId);
					})
			}
			return fileFieldId;
	}

	handleUpdateSchoolYear = ({target}) => {
			const {personId, updatePersonConfig, getLearners} = this.props;
			this.setState({ courseScheduledschoolYearId: target.value });
			updatePersonConfig(personId, 'SchoolYearId', target.value, () => getLearners(personId));
	}

  render() {
    const {fileFieldOptions, schoolYears, personConfig, companyConfig} = this.props;
    const {bulk, isShowingModal, fileSubmitted, schoolYearId} = this.state;
		const config = this.componentConfig;
		const djsConfig = this.djsConfig;

		const eventHandlers = {
				init: dz => this.dropzone = dz,
				addedfile: this.handleFileAdded,
		}

    return (
        <div className={styles.container}>
						<form method="post" encType="multipart/form-data" id="my-awesome-dropzone" className={styles.form}>
		            <div className={globalStyles.pageTitle}>
		                Add Students in Bulk
		            </div>
								<div>
										<div className={classes(styles.row, styles.space)}>
												<div className={styles.optionLabel}>Step</div>
												<div className={styles.optionCount}>1</div>
												<div className={styles.description}>Upload a spreadsheet (.xlsx) or a comma-delimited file (.csv)</div>
										</div>
										<div className={classes(styles.row, styles.space)}>
												<div className={styles.optionLabel}>Step</div>
												<div className={styles.optionCount}>2</div>
												<div className={styles.description}>Choose which line has the first record in order to skip header information</div>
										</div>
										<div className={classes(styles.row, styles.space)}>
												<div className={styles.optionLabel}>Step</div>
												<div className={styles.optionCount}>3</div>
												<div className={styles.description}>Indicate the data which is found in each column.  You can skip columns which contain unrelated information. The lists are pre-set with a default. Your choices are saved for the next time you come to this page.</div>
										</div>
										<div className={classes(styles.row, styles.space)}>
												<div className={styles.optionLabel}>Note</div>
												<div className={styles.optionCount}> </div>
												<div className={styles.description}>
														If this option does not work well for you, we can take care of it for you.
														Choose option #2 in the <span onClick={() => browserHistory.push('/studentAddOptions')} className={styles.link}>Student Add option</span> page.
												</div>
										</div>
								</div>
								<hr/>
								<div className={styles.labelDropZone}>
										Click on the box below to browse for a file, or drag-and-drop a file into the box.
								</div>
								<div className={styles.labelDropZone}>
										ONLY COMMA-DELIMITED FILES (CSV) ARE ALLOWED. You can save an Excel spreadsheet as a comma-delimited-file with the .csv extension.
								</div>
								<div className={styles.maxWidth}>
										<DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}>
												Click here to upload or
										</DropZone>
								</div>
								<div className={styles.background}>
										<div>
												<SelectSingleDropDown
														id={`schoolYearId`}
														label={`School year`}
														value={schoolYearId || personConfig.schoolYearId || companyConfig.schoolYearId}
														options={schoolYears}
														height={`medium`}
														onChange={this.handleUpdateSchoolYear}/>
										</div>
		                <div>
												<SelectSingleDropDown
		                        id={`lineStart`}
		                        label={`On which line does the data start? (skip column headings)`}
		                        value={bulk.delimiter}
														noBlank={true}
		                        options={[
																{id: 0, label: 'first line'},
																{id: 1, label: 'second line'},
																{id: 2, label: 'third line'},
																{id: 3, label: 'fourth line'},
																{id: 4, label: 'fifth line'},
																{id: 5, label: 'sixth line'},
																{id: 6, label: 'seventh line'},
																{id: 7, label: 'eighth line'},
																{id: 8, label: 'ninth line'},
														]}
		                        height={`medium`}
		                        onChange={this.changeBulk} />
										</div>
								</div>
								<div>
                    <SelectSingleDropDown
                        id={1}
                        label={`First field`}
                        value={this.isValueSet(1)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={2}
                        label={`Second field`}
                        value={this.isValueSet(2)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={3}
                        label={`Third field`}
                        value={this.isValueSet(3)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={4}
                        label={`Fourth field`}
                        value={this.isValueSet(4)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={5}
                        label={`Fifth field`}
                        value={this.isValueSet(5)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={6}
                        label={`Sixth field`}
                        value={this.isValueSet(6)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={7}
                        label={`Seventh field`}
                        value={this.isValueSet(7)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={8}
                        label={`Eighth field`}
                        value={this.isValueSet(8)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={9}
                        label={`Ninth field`}
                        value={this.isValueSet(9)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
                    <SelectSingleDropDown
                        id={10}
                        label={`Tenth field`}
                        value={this.isValueSet(10)}
                        options={fileFieldOptions}
                        height={`medium`}
                        onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={11}
												label={`Eleventh field`}
												value={this.isValueSet(11)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={12}
												label={`Twelfth field`}
												value={this.isValueSet(12)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={13}
												label={`Thirteenth field`}
												value={this.isValueSet(13)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={14}
												label={`Fourteenth field`}
												value={this.isValueSet(14)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={15}
												label={`Fifteenth field`}
												value={this.isValueSet(15)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={16}
												label={`Sixteenth field`}
												value={this.isValueSet(16)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
										<SelectSingleDropDown
												id={17}
												label={`Seventeenth field`}
												value={this.isValueSet(17)}
												options={fileFieldOptions}
												height={`medium`}
												onChange={this.changeBulk} />
                </div>
								<div className={styles.buttonDiv}>
										<a onClick={() => browserHistory.goBack()} className={styles.cancelLink}>Cancel</a>
										{!fileSubmitted &&
												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} className={file && file.name ? '' : styles.lowOpacity}
														onClick={file && file.name ? this.handleSubmit : this.handleNoFileOpen} />
										}
										{fileSubmitted &&
												<div className={styles.text}>Loading... you will be redirected</div>
										}
								</div>
						</form>
            <OneFJefFooter />
						{isShowingModal &&
                <MessageModal handleClose={this.handleNoFileClose} heading={<L p={p} t={`No File Chosen`}/>}
                   explainJSX={<L p={p} t={`If you just entered a file, wait for just a moment until it finishing uploading.  Otherwise, please choose a file with student information before choosing to submit a file`}/>}
                   onClick={this.handleNoFileClose} />
            }
        </div>
    );
  }
}

export default withAlert(StudentAddBulkView);
