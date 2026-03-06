import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './OpenRegistrationView.css';
const p = 'OpenRegistrationView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import guidEmpty from '../../utils/guidValidate';
import MessageModal from '../../components/MessageModal';
import InputText from '../../components/InputText';
import DateTimePicker from '../../components/DateTimePicker';
import StudentClipboard from '../../components/StudentClipboard';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class OpenRegistrationView extends Component {
  constructor(props) {
	    super(props);

	    this.state = {
		      isShowingModal_remove: false,
		      studentPersonId: '',
          name: (props.openRegistration && props.openRegistration.name) || '',
					openDateFrom: (props.openRegistration && props.openRegistration.openDateFrom) || '',
					openDateTo: (props.openRegistration && props.openRegistration.openDateTo) || '',
		      errors: {
							name: '',
			        openDateTo: '',
							studentList: '',
		      }
	    }
  }

  componentDidUpdate() {
      const {openRegistration, openRegistrationTableId} = this.props;
      const {isInit} = this.state;
			if (!isInit && openRegistrationTableId && openRegistration && openRegistration.name) {
					this.setState({ isInit: true, name: openRegistration.name, openDateTo: openRegistration.openDateTo, openDateFrom: openRegistration.openDateFrom,  });
			}
	}

  changeRecord = (event) => {
      let newState = Object.assign({}, this.state);
	    const field = event.target.name;
	    newState[field] = event.target.value;
      newState['errors'] = {};
	    this.setState(newState);
  }

	changeDate = (field, event) => {
      let newState = Object.assign({}, this.state);
      newState[field] = event.target.value;
      newState['errors'] = {};
      this.setState(newState);
	}

  processForm = () => {
      const {addOrUpdateOpenRegistration, personId, clipboardStudents, openRegistration} = this.props;
      const {name, openDateFrom, openDateTo} = this.state;
			let errors = Object.assign({}, this.state.errors);
      let hasError = false;

			if (!clipboardStudents || !clipboardStudents.length ) {
					hasError = true;
					errors.studentList = <L p={p} t={`At least one student is required`}/>;
			}
      if (!name) {
          hasError = true;
					errors.name = <L p={p} t={`Name is required`}/>;
      }
      if (!openDateTo) {
          hasError = true;
          errors.openDateTo = <L p={p} t={`End date is required`}/>;
      }

      if (!hasError) {
					let studentList = clipboardStudents.map(m => ({
							studentPersonId: m.studentPersonId,
							lastEntryDate: '' //This is the lastDateEntry in the record on the server side.
					}))
          let sendOpenRegistration = {
              openRegistrationTableId: openRegistration.openRegistrationTableId ? openRegistration.openRegistrationTableId : guidEmpty,
    					studentList: studentList,
              name: name,
              openDateFrom: openDateFrom,
              openDateTo: openDateTo,
          }

          addOrUpdateOpenRegistration(personId, sendOpenRegistration);
          this.setState({
              name: '',
              openDateFrom: '',
              openDateTo: '',
							studentList,
          });
					browserHistory.push(`/firstNav`)
			} else {
					this.setState({ errors });
			}
  }

  handleRemoveItemOpen = (studentPersonId) => this.setState({isShowingModal_remove: true, studentPersonId })
  handleRemoveItemClose = () => this.setState({isShowingModal_remove: false })
  handleRemoveItem = () => {
      const {removeStudentOpenRegistration, personId, openRegistrationTableId} = this.props;
      const {studentPersonId} = this.state;
      removeStudentOpenRegistration(personId, openRegistrationTableId, studentPersonId);
      this.handleRemoveItemClose();
  }

	handleRemoveSingleFromClipboard = (studentPersonId) => {
			const {removeStudentUserPersonClipboard, personId} = this.props;
			removeStudentUserPersonClipboard(personId, studentPersonId, 'STUDENT')
			//this.props.alert.info(<div className={styles.alertText}><L p={p} t={`The student clipboard had 1 record removed.`}/></div>)
	}

  render() {
    const {personId, clipboardStudents, studentAssignmentsInit, companyConfig, gradeLevels, setStudentsSelected, removeAllUserPersonClipboard,
						courseDocumentsInit} = this.props;
    const {name, openDateFrom, openDateTo, errors, isShowingModal_remove} = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Open Registration`}/>
            </div>
						<div className={styles.heading}>Students chosen</div>
						<StudentClipboard students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
								setStudentsSelected={setStudentsSelected} getStudentSchedule={this.props.getStudentSchedule} hideIcons={true}
								personId={personId} studentAssignmentsInit={studentAssignmentsInit} emptyMessage={<L p={p} t={`No students chosen`}/>}
								includeRemoveClipboardIcon={true} singleRemoveFromClipboard={this.handleRemoveSingleFromClipboard}
								courseDocumentsInit={courseDocumentsInit} removeAllUserPersonClipboard={removeAllUserPersonClipboard}/>
						<hr />
						<div className={styles.position}>
								<InputText
										id={`name`}
										name={`name`}
										size={"medium"}
										label={<L p={p} t={`Open registration name`}/>}
										value={name || ''}
										onChange={this.changeRecord}
										error={errors.name}/>
						</div>
						<div className={classes(styles.littleLeft, styles.row)}>
                <div className={styles.dateRow}>
                    <DateTimePicker id={`openDateFrom`} label={<L p={p} t={`Open date: From`}/>} value={openDateFrom} maxDate={openDateTo}
												onChange={(event) => this.changeDate('openDateFrom', event)} />
                </div>
                <div className={styles.dateRow}>
										<DateTimePicker id={`openDateTo`} label={<L p={p} t={`To`}/>} value={openDateTo} minDate={openDateFrom ? openDateFrom : ''}
                        onChange={(event) => this.changeDate('openDateTo', event)} />
                </div>
            </div>
						<div className={styles.error}>{errors.openDateTo}</div>
            <div className={styles.rowRight}>
								<a className={styles.cancelLink} onClick={() => browserHistory.goBack()}><L p={p} t={`Close`}/></a>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
            <OneFJefFooter />
            {isShowingModal_remove &&
                <MessageModal handleClose={this.handleRemoveItemClose} heading={<L p={p} t={`Remove this student?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this student from this open registration list?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveItem} />
            }
      </div>
    );
  }
}

export default withAlert(OpenRegistrationView);
