import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import styles from './DoctorNoteInviteListView.css';
const p = 'DoctorNoteInviteListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Icon  from '../../components/Icon';
import DateTimePicker from '../../components/DateTimePicker';
import DateMoment from '../../components/DateMoment';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class DoctorNoteInviteListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
				note: '',
    }
  }

	handleInstructionsOpen = (doctorNoteInviteId, doctorNoteText) => this.setState({isShowingModal_instructions: true, doctorNoteInviteId, doctorNoteText })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, doctorNoteText: '', doctorNoteInviteId: '' })

	handleEnteredByOpen = (displayDoctor) => this.setState({ isShowingModal_doctor: true, displayDoctor })
	handleEnteredByClose = () => this.setState({ isShowingModal_doctor: false, displayDoctor: '' })

	handlePartialNameText = ({target}) => {
			this.setState({ partialNameText: target.value });
	}

	chooseRecord = (chosen_doctorNoteInviteId) => this.setState({ chosen_doctorNoteInviteId });

	handleDeleteOpen = (doctorNoteInviteId) => this.setState({ isShowingModal_delete: true, doctorNoteInviteId })
	handleDeleteClose = () => this.setState({ isShowingModal_delete: false, doctorNoteInviteId: '' })
	handleDelete = () => {
			const {personId, removeDoctorNoteInvite} = this.props;
			const {doctorNoteInviteId} = this.state;
			removeDoctorNoteInvite(personId, doctorNoteInviteId);
			this.handleDeleteClose();
	}

	changeDate = (field, event) => {
			let newState = Object.assign({}, this.state);
			newState[field] = event.target.value
			this.setState(newState);
	}

	clearFilters = () => {
			this.setState({
					partialNameText: '',
					doctorPersonId: '',
					doctorEmailAddress: '',
					studentPersonId: '',
					searchDate: '',
			});
	}

  render() {
    const {doctorNoteInvites={}, fetchingRecord, accessRoles, doctorList, studentList, doctorEmailAddressList} = this.props;
    const {studentPersonId, isShowingModal_doctor, partialNameText, displayDoctor, searchDate, chosen_doctorNoteInviteId,
						isShowingModal_delete, doctorPersonId, doctorEmailAddress} = this.state;

		let localDoctorNoteInvites = doctorNoteInvites;

		localDoctorNoteInvites = localDoctorNoteInvites && localDoctorNoteInvites.length > 0 && localDoctorNoteInvites.map(m => { m.isChosenRecord = m.doctorNoteInviteId === chosen_doctorNoteInviteId ? true : false; return m; });

		if (localDoctorNoteInvites && localDoctorNoteInvites.length > 0) {
				if (partialNameText) {
						localDoctorNoteInvites = localDoctorNoteInvites.filter(m => {
								let found = false;
								if (m.studentName && m.studentName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorOfficeName && m.doctorOfficeName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorAddress && m.doctorAddress.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorCity && m.doctorCity.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorPhone && m.doctorPhone.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorEmailAddress && m.doctorEmailAddress.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.entryNamePerson && m.entryNamePerson.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorName && m.doctorName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								return found;
						});
				}
				if (studentPersonId && studentPersonId !== '0') {
						localDoctorNoteInvites = localDoctorNoteInvites.filter(m => m.studentPersonId === studentPersonId);
				}
				if (doctorPersonId && doctorPersonId !== '0') {
						localDoctorNoteInvites = localDoctorNoteInvites.filter(m => m.doctorPersonId === doctorPersonId);
				}
				if (doctorEmailAddress) {
						localDoctorNoteInvites = localDoctorNoteInvites.filter(m => m.doctorEmailAddress === doctorEmailAddress);
				}
				if (searchDate) {
						localDoctorNoteInvites = localDoctorNoteInvites.filter(m => m.fromDate.substring(0,10) <= searchDate && m.toDate.substring(0,10) >= searchDate);
				}
		}

		//let uniqueDoctorNoteIds = localDoctorNoteInvites && localDoctorNoteInvites.length > 0 ? [...new Set(localDoctorNoteInvites.map(m => m.doctorNoteInviteId))] : [];

		localDoctorNoteInvites = localDoctorNoteInvites && localDoctorNoteInvites.length > 0 && localDoctorNoteInvites.map((m, i) => {
				m.icons = <div className={classes(styles.row, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteInviteId)} key={i}>
											{accessRoles.doctor &&
													<div className={styles.buttonCell}>
															<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={() => browserHistory.push(`/doctorNoteAdd/${m.doctorNoteInviteId}`)} addClassName={styles.smallButton}/>
													</div>
											}
											<a key={i} onClick={() => this.handleDeleteOpen(m.doctorNoteInviteId)}>
													<Icon pathName={'trash2'} premium={true} className={styles.iconCell} />
											</a>
								  </div>;
				m.doctorOffice = <div className={classes(styles.cellText, globalStyles.link, m.isChosenRecord ? styles.highlight : '')} onClick={() => {this.handleEnteredByOpen(m); this.chooseRecord(m.doctorNoteInviteId);}}>
														{m.doctorOfficeName}
												 </div>
			  m.doctorEmail = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>
														{m.doctorEmailAddress}
												 </div>
			 	m.student = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteInviteId)}>
												{m.studentName}
										</div>
			 	m.from = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteInviteId)}>
										<DateMoment date={m.fromDate} includeTime={false}/>
								</div>
			 	m.to = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteInviteId)}>
										<DateMoment date={m.toDate} includeTime={false}/>
								</div>
			 	m.dateOfEntry = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteInviteId)}>
										<DateMoment date={m.entryDate} includeTime={false}/>
								</div>
				return m;
    });

		let columns = [
			{
				width: 110,
				label: '',
				dataKey: 'icons',
			},
			{
				width: 190,
				label: <L p={p} t={`Doctor office`}/>,
				dataKey: 'doctorOffice',
			},
			{
				width: 160,
				label: <L p={p} t={`Doctor email address`}/>,
				dataKey: 'doctorEmail',
			},
			{
				width: 160,
				label: <L p={p} t={`Student`}/>,
				dataKey: 'student',
			},
			{
				width: 120,
				label: <L p={p} t={`From date`}/>,
				dataKey: 'from',
			},
			{
				width: 120,
				label: <L p={p} t={`To date`}/>,
				dataKey: 'to',
			},
			{
				width: 120,
				label: <L p={p} t={`Entry date`}/>,
				dataKey: 'dateOfEntry',
			},
		];

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                Doctor Note Invites Pending
            </div>
						<div className={styles.rowWrap}>
								<div className={classes(styles.subHeader, styles.moreRight)}>Search:</div>
								<div>
										<InputText
												id={"partialNameText"}
												name={"partialNameText"}
												size={"medium-short"}
												label={<L p={p} t={`Name search`}/>}
												value={partialNameText || ''}
												onChange={this.handlePartialNameText}/>
								</div>
		            <div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Doctor`}/>}
												id={'doctorPersonId'}
												name={'doctorPersonId'}
												options={doctorList || []}
												value={doctorPersonId}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudents}/>
		            </div>
								<div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Doctor email address`}/>}
												id={'doctorEmailAddress'}
												name={'doctorEmailAddress'}
												options={doctorEmailAddressList || []}
												value={doctorEmailAddress}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudents}/>
		            </div>
								<div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Student`}/>}
												id={'students'}
												name={'students'}
												options={studentList || []}
												value={studentPersonId}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudents}/>
		            </div>
								<div className={classes(styles.littleTop, styles.moreRight, styles.row)}>
										<div className={classes(styles.dateRow, styles.moreRight)}>
												<DateTimePicker id={`searchDate`} label={<L p={p} t={`Date`}/>} value={searchDate} onChange={(event) => this.changeDate('searchDate', event)}/>
										</div>
								</div>
								<a onClick={this.clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
										<L p={p} t={`Clear filters`}/>
								</a>
						</div>
						<hr/>
						<Loading isLoading={fetchingRecord.baseCourses} />
						<Paper style={{ height: 250, width: '1000px', marginTop: '8px' }}>
								<TableVirtualFast rowCount={(localDoctorNoteInvites && localDoctorNoteInvites.length) || 0}
										rowGetter={({ index }) => (localDoctorNoteInvites && localDoctorNoteInvites.length > 0 && localDoctorNoteInvites[index]) || ''}
										columns={columns} />
						</Paper>
            <OneFJefFooter />
						{isShowingModal_delete &&
								<MessageModal handleClose={this.handleDeleteClose} heading={<L p={p} t={`Delete Doctor Note Invite`}/>}
									 onClick={this.handleDelete} explainJSX={<L p={p} t={`Are you sure you want to delete this doctor note invite?`}/>} isConfirmType={true}  />
						}
						{isShowingModal_doctor &&
								<MessageModal handleClose={this.handleEnteredByClose} heading={`Doctor's Office`} onClick={this.handleEnteredByClose}
										explainJSX={<div>
																<div className={styles.text}>{displayDoctor.doctorOfficeName}</div>
																<div className={styles.text}>{displayDoctor.doctorAddress}</div>
																<div className={styles.text}>{displayDoctor.doctorCity}</div>
																<div className={styles.text}>{displayDoctor.doctorState}</div>
																<div className={styles.text}>{displayDoctor.doctorPhone}</div>
																<div className={styles.text}>{displayDoctor.doctorEmailAddress}</div>
														</div>
										} />
						}
      </div>
    );
  }
}

export default withAlert(DoctorNoteInviteListView);
