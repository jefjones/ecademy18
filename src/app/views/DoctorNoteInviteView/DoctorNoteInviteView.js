import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './DoctorNoteInviteView.css';
const p = 'DoctorNoteInviteView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import InputDataList from '../../components/InputDataList';
import InputTextArea from '../../components/InputTextArea';
import DateTimePicker from '../../components/DateTimePicker';
import Required from '../../components/Required';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import {guidEmpty} from '../../utils/guidValidate.js';
import { withAlert } from 'react-alert';
import {emailValidate} from '../../utils/emailValidate';

class DoctorNoteInviteView extends Component {
  constructor(props) {
    super(props);

    this.state = {
			invite: {

			}
    }
  }

  changeInvite = (event) => {
			let invite = Object.assign({}, this.state.invite);
	    const field = event.target.name;
	    invite[field] = event.target.value;
			this.setState({ invite });
  }

  processForm = () => {
      const {addOrUpdateDoctorNoteInvite, personId} = this.props;
      const {invite={}} = this.state;
			let missingInfoMessage = [];
			let errors = {};

      if ((!invite.doctorPersonId || invite.doctorPersonId === guidEmpty) && !invite.doctorEmailAddress) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A doctor's office choice or an email address`}/></div>
          errors.doctorOffice = <L p={p} t={`Please choose a doctor's office or enter an email address`}/>;
      } else if (invite.doctorEmailAddress && !emailValidate(invite.doctorEmailAddress)) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Email address is not valid`}/></div>
					errors.doctorOffice = <L p={p} t={`Email address is not valid`}/>;
			}

			if (!(invite.studentPersonId && invite.studentPersonId.length > 0)) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
          errors.studentPersonId = <L p={p} t={`A student is required`}/>;
      }

			if (!invite.fromDate && !invite.toDate) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A 'from date' or a 'to date' or both`}/></div>
          errors.fromDate = <L p={p} t={`Please enter a 'from date' or a 'to date' or both`}/>;
      } else if (!invite.fromDate) {
					invite.fromDate = invite.toDate;
			} else if (!invite.toDate) {
					invite.toDate = invite.fromDate;
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.setState({ errors });
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
          addOrUpdateDoctorNoteInvite(personId, invite);
          this.setState({ invite: {}, clearDoctor: true, clearStudent: true });
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The request for the doctor's note has been saved and an email has been sent.`}/></div>);
      }
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleSelectedStudent = studentPersonId => this.setState({ invite: {...this.state.invite, studentPersonId: studentPersonId.id} });
	handleSelectedDoctor = doctorPersonId => this.setState({ invite: {...this.state.invite, doctorPersonId: doctorPersonId.id} });

	changeDate = (field, event) => {
			let invite = Object.assign({}, this.state.invite);
			invite[field] = event.target.value
			this.setState({ invite });
	}

	resetClearTextValue_doctor = () => {
			this.setState({ clearDoctor: false });
	}

	resetClearTextValue_student = () => {
			this.setState({ clearStudent: false });
	}

  render() {
    const {doctors, students} = this.props;
    const {isShowingModal_missingInfo, invite={}, errors={}, messageInfoIncomplete, clearDoctor, clearStudent} = this.state;

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Request a Doctor's Note`}/>
            </div>
						<div className={classes(styles.moreTop, styles.row)}>
								<div className={globalStyles.instructionsBigger}><L p={p} t={`If this doctor's office is not in the list, invite them with their email address.`}/></div>
								<Required setIf={true} setWhen={(invite.doctorPersonId && invite.doctorPersonId === guidEmpty)  || invite.doctorEmailAddress} className={styles.required}/>
						</div>
						<div className={styles.rowWrap}>
								<div className={classes(styles.moreTop, styles.moreRight)}>
										<InputDataList
												label={<L p={p} t={`Doctor's office`}/>}
												name={'doctorPersonId'}
												options={doctors}
												value={invite.doctorPersonId}
												multiple={false}
												height={`medium`}
												className={styles.moreSpace}
												clearTextValue={clearDoctor}
												resetClearTextValue={this.resetClearTextValue_doctor}
												onChange={this.handleSelectedDoctorOffice}/>
								</div>
								<div>
										<InputText
												name={'doctorEmailAddress'}
												value={invite.doctorEmailAddress || ''}
												label={<L p={p} t={`Or new doctor's email address`}/>}
												maxLength={150}
												size={'medium'}
												onChange={this.changeInvite}
												errors={errors.doctorOffice}/>
								</div>
						</div>
						<hr/>
						<div className={styles.rowWrap}>
								<div className={styles.moreRight}>
										<InputDataList
												label={<L p={p} t={`Student`}/>}
												name={'studentPersonId'}
												options={students}
												value={invite.studentPersonId}
												multiple={false}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudent}
												required={true}
												whenFilled={invite.studentPersonId}
												clearTextValue={clearStudent}
												resetClearTextValue={this.resetClearTextValue_student}
												error={errors.studentPersonId}/>
								</div>
								<div className={classes(styles.row)}>
										<div className={classes(styles.dateRow, styles.moreRight)}>
												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={invite.fromDate} maxDate={invite.toDate}
														required={true} whenFilled={invite.fromDate || invite.toDate}
														onChange={(event) => this.changeDate('fromDate', event)}/>
										</div>
										<div className={classes(styles.dateRow, styles.littleTop, styles.muchRight)}>
												<DateTimePicker id={`toDate`} value={invite.toDate} label={<L p={p} t={`To date`}/>} minDate={invite.fromDate ? invite.fromDate : ''}
														onChange={(event) => this.changeDate('toDate', event)}/>
										</div>
								</div>
								<div className={styles.textareaPosition}>
										<InputTextArea
												label={<L p={p} t={`Comment`}/>}
												name={'adminNote'}
												value={invite.adminNote || ''}
												autoComplete={'dontdoit'}
												boldText={true}
												onChange={this.changeInvite}/>
								</div>
						</div>
            <div className={styles.rowRight}>
								<Link className={styles.cancelLink} to={'/doctorNotes'}>Close</Link>
								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
            </div>
            <OneFJefFooter />
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
      </div>
    );
  }
}

export default withAlert(DoctorNoteInviteView);
