import React, {Component} from 'react';
import styles from './DoctorNoteListView.css';
const p = 'DoctorNoteListView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import Icon  from '../../components/Icon';
import DateTimePicker from '../../components/DateTimePicker';
import DateMoment from '../../components/DateMoment';
import InputText from '../../components/InputText';
import MessageModal from '../../components/MessageModal';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';

class DoctorNoteListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  changeSearch = (event) => {
	    const field = event.target.name;
	    let newState = Object.assign({}, this.state);
	    newState[field] = event.target.value;
	    this.setState(newState);
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleDocumentOpen = (doctorNoteId, fileUpload) => this.setState({ isShowingModal_document: true, doctorNoteId, fileUpload })
	handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {}, doctorNoteId: '' })
	handleAbsenceApproval = (declineOrApprove) => {
			const {personId, approveAbsenceExcused} = this.props;
			const {doctorNoteId} = this.state;
			this.handleDocumentClose();
			approveAbsenceExcused(personId, doctorNoteId, declineOrApprove);
	}

	handleInstructionsOpen = (doctorNoteId, doctorNoteText) => this.setState({isShowingModal_instructions: true, doctorNoteId, doctorNoteText })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, doctorNoteText: '', doctorNoteId: '' })

	handleEnteredByOpen = (displayDoctor) => this.setState({ isShowingModal_doctor: true, displayDoctor })
	handleEnteredByClose = () => this.setState({ isShowingModal_doctor: false, displayDoctor: '' })

	handlePartialNameText = ({target}) => {
			this.setState({ partialNameText: target.value });
	}

	chooseRecord = (chosen_doctorNoteId) => this.setState({ chosen_doctorNoteId });

	changeDate = (field, event) => {
			let newState = Object.assign({}, this.state);
			newState[field] = event.target.value
			this.setState(newState);
	}

	clearFilters = () => {
			this.setState({
					partialNameText: '',
					doctorPersonId: '',
					studentPersonId: '',
					searchDate: '',
			});
	}

  render() {
    const {doctorNotes={}, fetchingRecord, companyConfig, accessRoles, doctorList, studentList} = this.props;
    const {studentPersonId, doctorPersonId, isShowingModal_instructions, isShowingModal_doctor, partialNameText, note, displayDoctor, searchDate,
						chosen_doctorNoteId, isShowingModal_document, fileUpload, doctorNoteText} = this.state;

		let localDoctorNotes = doctorNotes;

		localDoctorNotes = localDoctorNotes && localDoctorNotes.length > 0 && localDoctorNotes.map(m => { m.isChosenRecord = m.doctorNoteId === chosen_doctorNoteId ? true : false; return m; });

		if (localDoctorNotes && localDoctorNotes.length > 0) {
				if (partialNameText) {
						localDoctorNotes = localDoctorNotes.filter(m => {
								let found = false;
								if (m.studentName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorOfficeName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorAddress.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorCity.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorPhone.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorEmailAddress.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.dataEntryName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								if (m.doctorName.toLowerCase().indexOf(partialNameText.toLowerCase()) > -1) found = true;
								return found;
						});
				}
				if (studentPersonId && studentPersonId !== '0') {
						localDoctorNotes = localDoctorNotes.filter(m => m.studentPersonId === studentPersonId);
				}
				if (doctorPersonId && doctorPersonId !== '0') {
						localDoctorNotes = localDoctorNotes.filter(m => m.doctorPersonId === doctorPersonId);
				}
				if (searchDate) {
						localDoctorNotes = localDoctorNotes.filter(m => m.fromDate.substring(0,10) <= searchDate && m.toDate.substring(0,10) >= searchDate);
				}
		}

		//let uniqueDoctorNoteIds = localDoctorNotes && localDoctorNotes.length > 0 ? [...new Set(localDoctorNotes.map(m => m.doctorNoteId))] : [];

		localDoctorNotes = localDoctorNotes && localDoctorNotes.length > 0 && localDoctorNotes.map((m, i) => {
				m.filesAndNotes = <div className={classes(styles.row, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)} key={i}>
															{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
																	<a onClick={() => this.handleDocumentOpen(m.doctorNoteId, f)} key={i}>
																			<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
																	</a>)
															}
															{m.note &&
																	<div onClick={() => this.handleInstructionsOpen(m.doctorNoteId, m.note)}>
																			<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
																	</div>
															}
												 </div>;
				m.doctorOffice = <div className={classes(styles.cellText, globalStyles.link, m.isChosenRecord ? styles.highlight : '')} onClick={() => {this.handleEnteredByOpen(m); this.chooseRecord(m.doctorNoteId);}}>
														{m.doctorOfficeName}
												 </div>
			 	m.student = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
												{m.studentName}
										</div>
			 	m.from = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
										<DateMoment date={m.fromDate} includeTime={false}/>
								</div>
			 	m.to = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
										<DateMoment date={m.toDate} includeTime={false}/>
								</div>
				m.doctor = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
										{m.doctorName}
								</div>
			 	m.entryPerson = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
										{m.dataEntryName}
								</div>
			 	m.dateOfEntry = <div className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.doctorNoteId)}>
										<DateMoment date={m.entryDate} includeTime={false}/>
								</div>
				return m;
    });

		let columns = [
			{
				width: 110,
				label: <L p={p} t={`Notes or files`}/>,
				dataKey: 'filesAndNotes',
			},
			{
				width: 190,
				label: <L p={p} t={`Doctor office`}/>,
				dataKey: 'doctorOffice',
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
				width: 160,
				label: <L p={p} t={`Doctor name`}/>,
				dataKey: 'doctor',
			},
			{
				width: 90,
				label: <L p={p} t={`Entry person`}/>,
				dataKey: 'entryPerson',
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
                <L p={p} t={`Doctor Notes`}/>
            </div>
						<div className={styles.rowWrap}>
								<div className={classes(styles.subHeader, styles.moreRight)}><L p={p} t={`Search:`}/></div>
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
												onChange={this.changeSearch}/>
		            </div>
								<div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Student`}/>}
												id={'studentPersonId'}
												name={'studentPersonId'}
												options={studentList || []}
												value={studentPersonId}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.changeSearch}/>
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
								<TableVirtualFast rowCount={(localDoctorNotes && localDoctorNotes.length) || 0}
										rowGetter={({ index }) => (localDoctorNotes && localDoctorNotes.length > 0 && localDoctorNotes[index]) || ''}
										columns={columns} />
						</Paper>
            <OneFJefFooter />
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={<L p={p} t={`Excused Absence Note`}/>}
									 onClick={this.handleInstructionsClose} explain={note}  />
						}
						{isShowingModal_doctor &&
								<MessageModal handleClose={this.handleEnteredByClose} heading={<L p={p} t={`Doctor's Office`}/>} onClick={this.handleEnteredByClose}
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
						{isShowingModal_document &&
								<div className={styles.fullWidth}>
										{<DocumentViewOnlyModal handleClose={this.handleDocumentClose} showTitle={true} handleSubmit={this.handleDocumentClose}
												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={fileUpload} />}
								</div>
						}
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={<L p={p} t={`Doctor Office`}/>}
									 onClick={this.handleInstructionsClose} explain={doctorNoteText}  />
						}
      </div>
    );
  }
}

export default withAlert(DoctorNoteListView);
