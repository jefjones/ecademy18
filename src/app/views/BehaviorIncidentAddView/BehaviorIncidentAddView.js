import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {apiHost} from '../../api_host.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ImageDisplay from '../../components/ImageDisplay';
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop';
import axios from 'axios';
import globalStyles from '../../utils/globalStyles.css';
const p = 'globalStyles';
import L from '../../components/PageLanguage';
import styles from './BehaviorIncidentAddView.css';
import DateTimePicker from '../../components/DateTimePicker';
import TimePicker from '../../components/TimePicker';
import CheckboxGroup from '../../components/CheckboxGroup';
import RadioGroup from '../../components/RadioGroup';
import InputTextArea from '../../components/InputTextArea';
import InputText from '../../components/InputText';
import InputDataList from '../../components/InputDataList';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import MessageModal from '../../components/MessageModal';
import Icon from '../../components/Icon';
import ImageViewerModal from '../../components/ImageViewerModal';
import MyFrequentPlaces from '../../components/MyFrequentPlaces';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';
import moment from 'moment';

class BehaviorIncidentAddView extends Component {
  constructor(props) {
	    super(props);

			let nowDate = new Date();

	    this.state = {
					incidentDate: moment(nowDate).format("YYYY-MM-DD"),
					incidentTime: moment(nowDate).format("HH:mm"),
	    }
  }

  componentDidUpdate() {
      const {behaviorIncident, behaviorIncidentId} = this.props;
      const {isInit} = this.state;

      if (!isInit && behaviorIncident && behaviorIncident.behaviorIncidentId && behaviorIncident.behaviorIncidentId !== guidEmpty) {
          // let choices = behaviorIncident.behaviorIncidentTypeChoices;
          // behaviorIncident.behaviorIncidentTypeChoices = choices && choices.length > 0 && choices.reduce((acc, m) => acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);

          this.setState({
              isInit: true,
              behaviorIncidentId,
              //behaviorIncidentId: behaviorIncident.behaviorIncidentId,
              teacherResponses: behaviorIncident.teacherResponses,
              adminResponses: behaviorIncident.adminResponses,
              incidentDate: behaviorIncident.incidentDate,
              incidentTime: behaviorIncident.incidentTime,
              note: behaviorIncident.note,
              fileUrl: behaviorIncident.fileUrl,
              accusedStudents: behaviorIncident.accusedStudents,
              otherStudents: behaviorIncident.otherStudents,
              staffInvolved: behaviorIncident.staffInvolved,
              otherTeacherResponse: behaviorIncident.otherTeacherResponse,
              otherAdminResponse: behaviorIncident.otherAdminResponse,
              shouldAdminFollowUpStudent: behaviorIncident.shouldAdminFollowUpStudent,
              haveParentsBeenContacted: behaviorIncident.haveParentsBeenContacted,
              parentContactDate: behaviorIncident.parentContactDateTime,
              parentContactTime: behaviorIncident.parentContactTime,
              planToContactParents: behaviorIncident.planToContactParents,
              behaviorIncidentTypeChoices: behaviorIncident.behaviorIncidentTypeChoices,
              behaviorIncidentTypeChoices1: behaviorIncident.behaviorIncidentTypeChoices1,
              behaviorIncidentTypeChoices2: behaviorIncident.behaviorIncidentTypeChoices2,
              behaviorIncidentTypeChoices3: behaviorIncident.behaviorIncidentTypeChoices3,
         });
      }
  }

  processForm = () => {
      const {personId, addOrUpdateBehaviorIncident} = this.props;
      const {behaviorIncidentId,
              teacherResponses,
              adminResponses,
              incidentDate,
              incidentTime,
              note,
              accusedStudents,
              otherStudents,
              staffInvolved,
              otherTeacherResponse,
              otherAdminResponse,
              shouldAdminFollowUpStudent,
              haveParentsBeenContacted,
              parentContactDate,
              parentContactTime,
              planToContactParents,
              behaviorIncidentTypeChoices } = this.state;

      let hasError = false;
			let missingInfoMessage = [];

			if (!(behaviorIncidentTypeChoices && behaviorIncidentTypeChoices.length > 0)) {
				hasError = true;
				this.setState({ errorBehaviorIncidentTypeChoices: <L p={p} t={`Please choose at least one incident type`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one incident type`}/></div>
			}

			if (!(accusedStudents && accusedStudents.length > 0)) {
				hasError = true;
				this.setState({ errorAccusedStudents: <L p={p} t={`Please choose at least one accused student`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one accused student`}/></div>
			}

			if (!(teacherResponses && teacherResponses.length > 0)) {
				hasError = true;
				this.setState({ errorAdminResponses: <L p={p} t={`Please select whether administation follow up is required`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If administration follow-up is required`}/></div>
			}

			if (!incidentDate) {
				hasError = true;
				this.setState({ errorIncidentDate: <L p={p} t={`Please enter a date`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Incident date`}/></div>
			}

			if (!incidentTime) {
				hasError = true;
				this.setState({ errorIncidentTime: <L p={p} t={`Please enter a time`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Incident time`}/></div>
			}

			if (!note && note < 10) {
				hasError = true;
				this.setState({ errorNotes: <L p={p} t={`Please enter a note that is more than a word or two.`}/> });
				missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Notes`}/></div>
			}

      if (!teacherResponses) {
        hasError = true;
        this.setState({ errorTeacherResponses: <L p={p} t={`Please choose at least one teacher response`}/> });
        missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`At least one teacher response`}/></div>
      }

      if (!haveParentsBeenContacted) {
        hasError = true;
        this.setState({ errorHaveParentsBeenContacted: <L p={p} t={`Please select whether parents have been contacted`}/> });
        missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If parents have been contacted`}/></div>
      }

      if (haveParentsBeenContacted === "true" && (!parentContactDate || !parentContactTime)) {
        hasError = true;
        this.setState({ errorParentContactDateTime: <L p={p} t={`Please select when the parents were contacted`}/> });
        missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`When parents were contacted`}/></div>
      }

      if (!shouldAdminFollowUpStudent) {
        hasError = true;
        this.setState({ errorShouldAdminFollowUpStudent: <L p={p} t={`Please select whether an administator should follow up with the student(s)`}/> });
        missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If an administator should follow up`}/></div>
      }

      if (!planToContactParents && haveParentsBeenContacted === 'false') {
        hasError = true;
        this.setState({ errorPlanToContactParents: <L p={p} t={`Please select if you plan to contact a parent`}/> });
        missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`If you plan to contact a parent`}/></div>
      }
      if (!hasError) {
          let behaviorIncident = {
              behaviorIncidentId,
              incidentDate,
              incidentTime,
              note,
              accusedStudents,
              otherStudents,
              staffInvolved,
              otherTeacherResponse,
              otherAdminResponse,
              shouldAdminFollowUpStudent: shouldAdminFollowUpStudent === 'false' ? false : shouldAdminFollowUpStudent,
              haveParentsBeenContacted: haveParentsBeenContacted === 'false' ? false : haveParentsBeenContacted,
              parentContactDate,
              parentContactTime,
              planToContactParents: planToContactParents === 'false' ? false : planToContactParents,
              behaviorIncidentTypeChoices,
              teacherResponses,
              adminResponses,
          }
          addOrUpdateBehaviorIncident(personId, behaviorIncident);
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The Behavior Incident has been saved.`}/></div>)
					//Consider sending to the admin or the person list of those who should receive an incident report if this is not the final responsible person (principal)

					this.setState({ behaviorIncident: {} })
					browserHistory.push('/behaviorIncidentList');
			} else {
					this.handleMissingInfoOpen(missingInfoMessage);
      }
  }

	handleChange = ({target}) => {
			let newState = Object.assign({}, this.state);
			newState[target.name] = target.value;
			this.setState(newState);
	}

	changeDate = (field, event) => {
			const newState = Object.assign({}, this.state);
			newState[field] = event.target.value;
			this.setState(newState);
	}

	handleDeleteOpen = () => this.setState({ isShowingModal_delete: true });
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false });
	handleDelete = () => {
			const {removeVolunteerHours, personId} = this.props;
      const {behaviorIncidentId} = this.state;
			removeVolunteerHours(personId, behaviorIncidentId);
			this.handleDeleteClose();
			browserHistory.push('/firstNav');
	}

  handleFileUploadOpen = () => this.setState({ isShowingFileUpload: true, loadingFiles: true })
  handleFileUploadClose = () => this.setState({ isShowingFileUpload: false, loadingFiles: false })
  handleFileUploadSubmit = () => {
      //When the file upload is used, it will create the new DoctorNote record plus let the files be accrued if the user wants to enter
      //	more than one file.  But as soon as the page's submit button is used (processForm), then the user is submitting the entire record which may have a note.
      const {personId} = this.props;
      const {selectedFile, behaviorIncidentId} = this.state;
      let data = new FormData();
      data.append('file', selectedFile);
      axios.post(`${apiHost}ebi/behaviorIncident/addFile/${personId}/${(behaviorIncidentId && behaviorIncidentId !== '0') || guidEmpty}`, data,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials' : 'true',
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,POST,DELETE,HEAD,PUT,OPTIONS",
              "Access-Control-Allow-Headers": "Content-type,Accept,X-Custom-Header",
              "Authorization": "Bearer " + localStorage.getItem("authToken"),
          }})
          .then(response => {
              this.setState({ behaviorIncidentId: response.data })
          })
          .catch(error => this.setState({ loadingFiles: false }))

      this.handleFileUploadClose();
  }

  handleInputFile = (selectedFile) => {
      this.setState({ selectedFile });
      var img = this.imageViewer;
      var reader = new FileReader();
      reader.onloadend = function() {
          img.src = reader.result;
      }
      reader.readAsDataURL(selectedFile);
      this.questionFile.after(img);
  }


	handleImageViewerOpen = (fileUrl) => this.setState({isShowingModal: true, fileUrl });
	handleImageViewerClose = () => this.setState({isShowingModal: false, fileUrl: ''})
	handleStudentChange  = ({target}) => this.setState({ studentPersonId: target.value });
	handleRemoveAccusedStudent = (id) => this.setState({ accusedStudents: this.state.accusedStudents.filter(m => m.id !== id) })
	handleRemoveOtherStudent = (id) => this.setState({ otherStudents: this.state.otherStudents.filter(m => m.id !== id) })
	handleRemoveStaff = (id) => this.setState({ staffInvolved: this.state.staffInvolved.filter(m => m.id !== id) })

	handleAccusedStudents = accusedStudents => this.setState({ accusedStudents });
	handleOtherStudents = otherStudents => this.setState({ otherStudents });
	handleStaffInvolved = staffInvolved => this.setState({ staffInvolved });

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleExpansionChange = panel => (event, expanded) => this.setState({ expanded: expanded ? panel : false, hasChangedExpanded: true, })

	handleSelectedTypes1 = (behaviorIncidentTypeChoices) => {
			const {behaviorIncidentTypeChoices2, behaviorIncidentTypeChoices3} = this.state;
			((behaviorIncidentTypeChoices2 && behaviorIncidentTypeChoices2.length > 0) || (behaviorIncidentTypeChoices3 && behaviorIncidentTypeChoices3.length > 0)) &&
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
			this.setState({
          behaviorIncidentTypeChoices,
					level: 1,
					behaviorIncidentTypeChoices1: behaviorIncidentTypeChoices,
					behaviorIncidentTypeChoices2: [],
					behaviorIncidentTypeChoices3: [],
			});
	}

	handleSelectedTypes2 = (behaviorIncidentTypeChoices) => {
			const {behaviorIncidentTypeChoices1, behaviorIncidentTypeChoices3} = this.state;
			((behaviorIncidentTypeChoices1 && behaviorIncidentTypeChoices1.length > 0) || (behaviorIncidentTypeChoices3 && behaviorIncidentTypeChoices3.length > 0)) &&
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
			this.setState({
          behaviorIncidentTypeChoices,
					level: 2,
					behaviorIncidentTypeChoices1: [],
					behaviorIncidentTypeChoices2: behaviorIncidentTypeChoices,
					behaviorIncidentTypeChoices3: [],
			});
	}

	handleSelectedTypes3 = (behaviorIncidentTypeChoices) => {
			const {behaviorIncidentTypeChoices1, behaviorIncidentTypeChoices2} = this.state;
			((behaviorIncidentTypeChoices1 && behaviorIncidentTypeChoices1.length > 0) || (behaviorIncidentTypeChoices2 && behaviorIncidentTypeChoices2.length > 0)) &&
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The level changed. The incident type choices have been reset.`}/></div>)
			this.setState({
          behaviorIncidentTypeChoices,
					level: 3,
					behaviorIncidentTypeChoices1: [],
					behaviorIncidentTypeChoices2: [],
					behaviorIncidentTypeChoices3: behaviorIncidentTypeChoices,
			});
	}

	handleSelectedTeacherResponses = (teacherResponses) =>  this.setState({ teacherResponses });
	handleSelectedAdminResponses = (adminResponses) =>  this.setState({ adminResponses });

	handleTrueFalse = (field, value) => {
      let newState = Object.assign({}, this.state);
      newState[field] = value;
      this.setState(newState);
  }

  showLevelChoices = (typeChoiceList) => {
      const {behaviorIncidentTypes} = this.props;
      if (!(typeChoiceList && typeChoiceList.length > 0)) return;
      return typeChoiceList.reduce((acc, choice) => {
          let type = behaviorIncidentTypes.filter(b => b.id === choice)[0];
          return type && type.label
                    ? acc
                        ? acc += ', ' + type.label
                        : type.label
                    : acc;
      }, '')
  }

  setIncidentTypeChoice = (behaviorIncidentTypeId) => {
      const {behaviorIncident} = this.props;
      return behaviorIncident.behaviorIncidentTypeChoices && behaviorIncident.behaviorIncidentTypeChoices.length > 0 && behaviorIncident.behaviorIncidentTypeChoices.reduce((acc, m) => {
          if (behaviorIncidentTypeId === m.id) {
              acc = acc && acc.length > 0 ? acc.concat(m.id) : [m.id];
          }
          return acc;
      }, [])
  }

  handleRemoveFileUploadOpen = () => this.setState({isShowingModal_removeFileUpload: true })
	handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false })
	handleRemoveFileUpload = () => {
			const {removeBehaviorIncidentFile, personId} = this.props;
			const {behaviorIncidentId} = this.state;
			this.handleRemoveFileUploadClose();
			removeBehaviorIncidentFile(personId, behaviorIncidentId);
      var img = this.imageViewer;
	    img.src = '';
			this.questionFile.after(img);
	}

  render() {
    const {behaviorIncidentTypes=[], behaviorIncidentResponseTypes=[], students, facilitators, accessRoles, personId, myFrequentPlaces,
						setMyFrequentPlace} = this.props;
    const {incidentDate, incidentTime, errorIncidentTime, note, errorIncidentDate, errorBehaviorIncidentTypeChoices,
						isShowingModal_delete, isShowingModal, fileUrl, accusedStudents, otherStudents, staffInvolved, errorAccusedStudents,
						behaviorIncidentId, messageInfoIncomplete, isShowingModal_missingInfo, expanded, otherTeacherResponse,
						otherAdminResponse, shouldAdminFollowUpStudent, haveParentsBeenContacted, parentContactDate, parentContactTime,
						planToContactParents, errorNotes, errorTeacherResponses, errorHaveParentsBeenContacted, selectedFile,
            errorShouldAdminFollowUpStudent, errorPlanToContactParents, errorParentContactDateTime, isShowingModal_removeFile,
            behaviorIncidentTypeChoices1, behaviorIncidentTypeChoices2, behaviorIncidentTypeChoices3, teacherResponses, adminResponses,
            isShowingFileUpload, isShowingModal_removeFileUpload} = this.state;

    // let behaviorIncidentTypeChoices = behaviorIncident.behaviorIncidentTypeChoices && behaviorIncident.behaviorIncidentTypeChoices.length > 0
    //     && behaviorIncident.behaviorIncidentTypeChoices.reduce((acc, m) =>
    //        acc && acc.length > 0 ? acc.concat(m.id) : [m.id], []);

		let hasOtherTeacherResponse = false;
		teacherResponses && teacherResponses.length > 0 && teacherResponses.forEach(teacherResponse => {
        let type = behaviorIncidentResponseTypes.filter(b => b.id === teacherResponse)[0];
				if (type && type.label === 'Other') hasOtherTeacherResponse = true;
		})

    let hasOtherAdminResponse = false;
		adminResponses && adminResponses.length > 0 && adminResponses.forEach(adminResponse => {
        let type = behaviorIncidentResponseTypes.filter(b => b.id === adminResponse)[0];
				if (type && type.label === 'Other') hasOtherAdminResponse = true;
		})

    return (
        <div className={styles.container}>
						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
								{behaviorIncidentId ? <L p={p} t={`Update Behavior Incident`}/> : <L p={p} t={`Add Behavior Incident`}/>}
						</div>
						<div>
								<ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleExpansionChange('panel1')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
												<div className={styles.rowWrap}>
                            <div className={styles.row}>
                            		<span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 1`}/></span>
                                <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 1 infractions are minor acts of misconduct that interfere with orderly operation of the classroom and school.`}/></span>
                            </div>
                            <div className={classes(styles.moreLeft, styles.littleTop, styles.textBiggerBold)}>
                                {this.showLevelChoices(behaviorIncidentTypeChoices1)}
                            </div>
												</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={classes(styles.labelTypes, styles.moreBottom)}>
														<CheckboxGroup
																name={'behaviorIncidentTypeChoices1'}
																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 1)}
																horizontal={true}
																className={styles.labelTypes}
																labelClass={styles.labelTypes}
																onSelectedChanged={this.handleSelectedTypes1}
																selected={behaviorIncidentTypeChoices1 || []}/>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleExpansionChange('panel2')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
                        <div className={styles.rowWrap}>
                            <div className={styles.row}>
                                <span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 2`}/></span>
                                <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 2 infractions are more serious and disruptive than level 1. They are minor acts directed against others.`}/></span>
                            </div>
                            <div className={classes(styles.moreLeft, styles.text)}>
                            {this.showLevelChoices(behaviorIncidentTypeChoices2)}
                            </div>
                        </div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={classes(styles.labelTypes, styles.moreBottom)}>
														<CheckboxGroup
																name={'behaviorIncidentTypeChoices2'}
																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 2)}
																horizontal={true}
																className={styles.labelTypes}
																labelClass={styles.labelTypes}
																onSelectedChanged={this.handleSelectedTypes2}
																selected={behaviorIncidentTypeChoices2 || []}/>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleExpansionChange('panel3')}>
										<ExpansionPanelSummary expandIcon={<Icon pathName={'caret_2'} premium={true} className={globalStyles.flipped}/>}>
                        <div className={styles.rowWrap}>
                            <div className={styles.row}>
    														<span className={classes(styles.noWrap, styles.menuHeader)}><L p={p} t={`Level 3`}/></span>
                                <span className={classes(styles.levelDescription, styles.label)}><L p={p} t={`Level 3 incidents are for repeat offenders and major acts of misconduct, including threats to health, safety, and property.`}/></span>
    												</div>
                            <div className={classes(styles.moreLeft, styles.text)}>
                            {this.showLevelChoices(behaviorIncidentTypeChoices3)}
                            </div>
                        </div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
												<div className={classes(styles.labelTypes, styles.moreBottom)}>
														<CheckboxGroup
																name={'behaviorIncidentTypeChoices3'}
																options={behaviorIncidentTypes && behaviorIncidentTypes.length > 0 && behaviorIncidentTypes.filter(m => m.level === 3)}
																horizontal={true}
																className={styles.labelTypes}
																labelClass={styles.labelTypes}
																onSelectedChanged={this.handleSelectedTypes3}
																selected={behaviorIncidentTypeChoices3 || []}/>
												</div>
										</ExpansionPanelDetails>
								</ExpansionPanel>
								<div className={classes(styles.moreTop, globalStyles.errorText)}>{errorBehaviorIncidentTypeChoices}</div>
								<div className={styles.rowWrap}>
										<div>
												<InputDataList
														label={<L p={p} t={`Student(s) accused`}/>}
														name={'accusedStudents'}
														options={students}
														value={accusedStudents}
                            listAbove={true}
														multiple={true}
														height={`medium`}
														className={styles.moreSpace}
														onChange={this.handleAccusedStudents}
														required={true}
														whenFilled={accusedStudents && accusedStudents.length > 0}
														error={errorAccusedStudents}/>
										</div>
										<div className={styles.dataTime}>
												<DateTimePicker id={`incidentDate`} label={<L p={p} t={`Date`}/>} value={incidentDate || ''} onChange={(event) => this.changeDate('incidentDate', event)}
													className={styles.dateTime} error={errorIncidentDate}
													required={true} whenFilled={incidentDate}/>
										</div>
										<div className={styles.dataTime}>
												<TimePicker id={`incidentTime`} label={<L p={p} t={`Time`}/>} value={incidentTime || ''} onChange={this.handleChange} className={styles.dateTime}
														error={errorIncidentTime} required={true} whenFilled={incidentTime}/>
										</div>
										<div className={styles.moreTop}>
												<InputDataList
														label={<L p={p} t={`Other students (innocent)`}/>}
														name={'otherStudents'}
														options={students}
														value={otherStudents}
                            listAbove={true}
														multiple={true}
														height={`medium`}
														className={styles.moreSpace}
														onChange={this.handleOtherStudents}/>
										</div>
										<div className={styles.moreTop}>
												<InputDataList
														label={<L p={p} t={`Staff involved`}/>}
														name={'staffInvolved'}
														options={facilitators}
														value={staffInvolved}
                            listAbove={true}
														multiple={true}
														height={`medium`}
														className={styles.moreSpace}
														onChange={this.handleStaffInvolved}/>
										</div>
								</div>
                <img src={''} alt={'New'} ref={(ref) => (this.imageViewer = ref)} />
                <div className={styles.moreTop} ref={(ref) => (this.questionFile = ref)}>
                    <div className={classes(styles.moreLeft, styles.row)} onClick={this.handleFileUploadOpen}>
                        <Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
                        <div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload a file or picture`}/></div>
                    </div>
                    <div className={styles.minimalSize}>
                        <ImageDisplay linkText={''} url={fileUrl} isOwner={true} deleteFunction={() => this.handleRemoveFileUploadOpen(behaviorIncidentId)} deleteId={behaviorIncidentId}/>
                    </div>
                </div>
								<div className={styles.moreTopMargin}>
										<InputTextArea label={<L p={p} t={`Notes`}/>}
                        name={'note'}
                        value={note}
                        onChange={this.handleChange}
                        required={true}
                        whenFilled={note && note.length > 9}
                        error={errorNotes}
                        instructions={<L p={p} t={`The note must be more than a word or two.`}/>}
                    />
								</div>
								<hr/>
										<div className={styles.textBig}><L p={p} t={`Response and follow-up actions`}/></div>
								<hr/>
								<div className={classes(styles.labelTypes, styles.moreBottom, styles.teacherResponse)}>
										<CheckboxGroup
												name={'teacherResponses'}
												label={<L p={p} t={`Teacher response`}/>}
												options={behaviorIncidentResponseTypes && behaviorIncidentResponseTypes.length > 0 && behaviorIncidentResponseTypes.filter(m => m.adminOrTeacher === 'Teacher')}
												horizontal={true}
												className={styles.labelTypes}
												labelClass={styles.labelTypes}
												onSelectedChanged={this.handleSelectedTeacherResponses}
												selected={teacherResponses || []}
                        required={true}
                        whenFilled={teacherResponses && teacherResponses.length > 0}
                        error={errorTeacherResponses}
                        />
										{hasOtherTeacherResponse &&
												<InputText
														id={`otherTeacherResponse`}
														name={`otherTeacherResponse`}
														size={"medium"}
														label={<L p={p} t={`Other teacher response`}/>}
														value={otherTeacherResponse || ''}
														onChange={this.handleChange}/>
										}
                    </div>
                    <div className={classes(styles.labelTypes, styles.moreBottom)}>
    										<RadioGroup
    												label={<L p={p} t={`Do you want administration to follow up?`}/>}
    												name={`shouldAdminFollowUpStudent`}
    												data={[{ label: 'Yes', id: 'true' }, { label: 'No', id: 'false' }]}
    												horizontal={true}
    												className={styles.radio}
                            initialValue={shouldAdminFollowUpStudent || ''}
    												onClick={(value) => this.handleTrueFalse('shouldAdminFollowUpStudent', value)}
                            required={true}
                            whenFilled={shouldAdminFollowUpStudent}
                            error={errorShouldAdminFollowUpStudent}/>
    								</div>
								{accessRoles.admin &&
										<div className={classes(styles.labelTypes, styles.moreBottom, styles.adminResponse)}>
												<CheckboxGroup
														name={'adminResponses'}
														label={<L p={p} t={`Admin response`}/>}
														options={behaviorIncidentResponseTypes && behaviorIncidentResponseTypes.length > 0 && behaviorIncidentResponseTypes.filter(m => m.adminOrTeacher === 'Admin')}
														horizontal={true}
														className={styles.labelTypes}
														labelClass={styles.labelTypes}
														onSelectedChanged={this.handleSelectedAdminResponses}
														selected={adminResponses || []}/>
												{hasOtherAdminResponse &&
														<InputText
																id={`otherAdminResponse`}
																name={`otherAdminResponse`}
																size={"medium"}
																label={<L p={p} t={`Other admin response`}/>}
																value={otherAdminResponse || ''}
																onChange={this.handleChange}/>
												}
										</div>
								}
								<hr/>
								<div className={classes(styles.labelTypes, styles.moreBottom)}>
										<RadioGroup
												label={<L p={p} t={`Have parents been contacted?`}/>}
												name={`haveParentsBeenContacted`}
												data={[{ label: 'Yes', id: 'true' }, { label: 'No', id: 'false' }]}
												horizontal={true}
												className={styles.radio}
												initialValue={haveParentsBeenContacted || ''}
												onClick={(value) => this.handleTrueFalse('haveParentsBeenContacted', value)}
                        required={true}
                        whenFilled={haveParentsBeenContacted}
                        error={errorHaveParentsBeenContacted}/>
								</div>
								{haveParentsBeenContacted === 'true' &&
										<div className={styles.row}>
												<div className={styles.dataTime}>
														<DateTimePicker id={`parentContactDate`}
                                label={<L p={p} t={`Date`}/>}
                                value={parentContactDate || ''}
                                onChange={(event) => this.changeDate('parentContactDate', event)}
    														className={styles.dateTime}
                                required={true}
                                whenFilled={parentContactDate}
                                error={errorParentContactDateTime}/>
												</div>
												<div className={styles.dataTime}>
														<TimePicker id={`parentContactTime`}
                                label={<L p={p} t={`Time`}/>}
                                value={parentContactTime || ''}
                                onChange={this.handleChange}
                                className={styles.dateTime}
                                required={true}
                                whenFilled={parentContactTime}/>
												</div>
										</div>
								}
								<hr/>
                {haveParentsBeenContacted === 'false' &&
    								<div className={classes(styles.labelTypes, styles.moreBottom)}>
    										<RadioGroup
    												label={<L p={p} t={`If you have not contacted a parent, do you plan to do so?`}/>}
    												name={`planToContactParents`}
    												data={[{ label: 'Yes', id: 'true' }, { label: 'No (not necessary)', id: 'false' }]}
    												horizontal={true}
    												className={styles.radio}
                            initialValue={planToContactParents || ''}
    												onClick={(value) => this.handleTrueFalse('planToContactParents', value)}
                            required={true}
                            whenFilled={planToContactParents}
                            error={errorPlanToContactParents}/>
    								</div>
                }
								<div className={classes(styles.muchLeft, styles.row)}>
										<a className={styles.cancelLink} onClick={() => browserHistory.push('/behaviorIncidentList')}><L p={p} t={`Close`}/></a>
										<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
								</div>
						</div>
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Remove this behavior incident record?`}/>}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this behavior incident record?`}/>} isConfirmType={true}
									 onClick={this.handleDelete} />
						}
						{isShowingModal &&
								<div className={globalStyles.fullWidth}>
										<ImageViewerModal handleClose={this.handleImageViewerClose} fileUrl={fileUrl}/>
								</div>
						}
            {isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
            {isShowingModal_removeFile &&
								<MessageModal handleClose={this.handleRemoveFileClose} heading={<L p={p} t={`Remove file?`}/>} isConfirmType={true}
									 explainJSX={<L p={p} t={`Are you sure you want to remove this file?`}/>} onClick={this.handleRemoveFile} />
						}
            {isShowingFileUpload &&
								<FileUploadModalWithCrop handleClose={this.handleFileUploadClose} title={<L p={p} t={`Choose File or Image`}/>}
										personId={personId} submitFileUpload={this.handleFileUploadSubmit}
										file={selectedFile} handleInputFile={this.handleInputFile}
										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .wav, .mp4, .m4a"}
										handleCancelFile={()=>{}}/>
            }
						{isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Behavior Incident Add`}/>} path={'behaviorIncidentAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
				<OneFJefFooter />
      </div>
    );
  }
}

export default withAlert(BehaviorIncidentAddView);
