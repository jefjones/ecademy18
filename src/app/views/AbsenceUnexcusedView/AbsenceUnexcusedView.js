import React, {Component} from 'react';
import {Link} from 'react-router';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import styles from './AbsenceUnexcusedView.css';
import globalStyles from '../../utils/globalStyles.css';
import Paper from '@material-ui/core/Paper';
import TableVirtualFast from '../../components/TableVirtualFast';
import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import Checkbox from '../../components/Checkbox';
import Icon  from '../../components/Icon';
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop';
import DocumentViewOnlyModal from '../../components/DocumentViewOnlyModal';
import DateMoment from '../../components/DateMoment';
import DateTimePicker from '../../components/DateTimePicker';
import InputTextArea from '../../components/InputTextArea';
import MessageModal from '../../components/MessageModal';
import ImageDisplay from '../../components/ImageDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';
const p = 'AbsenceUnexcusedView';
import L from '../../components/PageLanguage';

//If the parameter 'pendingApproval' is sent in, then this is the administrator approved a parent- or student-submitted excused absence.
//Otherwise the admin or the parent or the student can use this page to excuse an absence.  If it is the admin who is using the page, then
//  the absence will be excused automaticalled.  Otherwise, the excusedAbsence record is marked as UserSubmitted = true.
//The administrator can enter a note as well as one or more files.

class AbsenceUnexcusedView extends Component {
  constructor(props) {
    super(props);

    this.state = {
				note: '',
				selectedAbsences: [],
    }
  }

  changeAbsence = (event) => {
	    const field = event.target.name;
	    let newState = Object.assign({}, this.state);
	    newState[field] = event.target.value;
	    this.setState(newState);
  }

  processForm = () => {
			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
      const {setAbsenceExcused, personId, absenceUnexcused} = this.props;
      const {selectedAbsences, note} = this.state;
			let missingInfoMessage = [];

      if (!selectedAbsences || selectedAbsences.length === 0) {
          missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please choose at least one absence to excuse`}/></div>
      }
			if (!note && absenceUnexcused.fileUploads.length === 0) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A note or a file upload is required`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
					let absenceExcused = {
							courseAttendanceIds: selectedAbsences,
							note,
							fileUploads: absenceUnexcused.fileUploads || [],
					}
          setAbsenceExcused(personId, absenceExcused);
          this.setState({
							note: '',
							selectedAbsences: [],
							formData: null,
							selectedStudents: [],
							selectedCourses: [],
          });
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The absence record has been updated`}/></div>);
      }
  }

	approveForm = (declineOrApprove) => {
			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
      const {approveAbsenceExcused, personId} = this.props;
      const {selectedAbsences} = this.state;
			let missingInfoMessage = ``;

      if (!selectedAbsences || selectedAbsences.length === 0) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Please choose at least one excused absence to approve`}/></div>
      }

			if (declineOrApprove === 'decline' && !selectedAbsences.note) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A note is required when choosing 'Declined'.`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
					approveAbsenceExcused(personId, selectedAbsences, declineOrApprove)
          this.setState({
							note: '',
							selectedAbsences: [],
          });
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`Your '${declineOrApprove}' entry has been recorded`}/></div>);
      }
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	toggleCheckbox = (event, id) => {
			//The id can be a courseAttendanceId (not pendingApproval) or excusedAbsenceId (pendingApproval)
			let selectedAbsences = Object.assign([], this.state.selectedAbsences);
			if (selectedAbsences && selectedAbsences.length > 0 && selectedAbsences.indexOf(id) > -1) {
					selectedAbsences = selectedAbsences.filter(m => m !== id);
			} else {
					selectedAbsences = selectedAbsences && selectedAbsences.length > 0 ? selectedAbsences.concat(id) : [id];
			}
			this.setState({ selectedAbsences, chosen_courseAttendanceId: id });
	}

	handleSelectedStudents = ({target}) => this.setState({ studentPersonId: target.value, selectedAbsences: [] })
	handleSelectedCourses = ({target}) => this.setState({ courseScheduledId: target.value, selectedAbsences: [] })

	handleSetAll = (selectedAbsences) => this.setState({ selectedAbsences })

	handleFileUploadOpen = () => this.setState({ isShowingFileUpload: true, loadingFiles: true })
	handleFileUploadClose = () => this.setState({ isShowingFileUpload: false, handleFileUploadOpen: false })
	handleFileUploadSubmit = () => {
			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
			const {personId, reduxAbsenceExcusedFiles} = this.props;
			const {selectedFile, selectedAbsences, note} = this.state;
			let data = new FormData();
			data.append('file', selectedFile);
			let url = `${apiHost}ebi/absenceUnexcused/fileUpload/${personId}/${selectedAbsences.join('^')}/${encodeURIComponent(note)}`

			axios.post(url, data,
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
							reduxAbsenceExcusedFiles(response.data);
							this.setState({ loadingFiles: false })
							// !!!Return the state here to update with the fileUpload records
							// And show the multiple files down below.
					})
					.catch(error => this.setState({ loadingFiles: false }))

			this.handleFileUploadClose();
	}

	handleInputFile = (selectedFile) => this.setState({ selectedFile })

	handleChooseAnAbsenceOpen = () => this.setState({ isShowingModal_chooseAbsence: true })
	handleChooseAnAbsenceClose = () => this.setState({ isShowingModal_chooseAbsence: false })

	handleRemoveFileUploadOpen = (fileUpload) => this.setState({isShowingModal_removeFileUpload: true, fileUpload })
	handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false, fileUpload: [] })
	handleRemoveFileUpload = () => {
			const {removeAbsenceExcusedFileUpload, personId} = this.props;
			const {fileUpload} = this.state;
			this.handleRemoveFileUploadClose();
			removeAbsenceExcusedFileUpload(personId, fileUpload.fileUploadId)
	}

	toggleSiblings = () => this.setState({ includeSiblings: !this.state.includeSiblings });

	handleDocumentOpen = (excusedAbsenceId, fileUpload) => this.setState({ isShowingModal_document: true, excusedAbsenceId, fileUpload })
	handleDocumentClose = () => this.setState({isShowingModal_document: false, fileUpload: {}, excusedAbsenceId: '' })
	handleAbsenceApproval = (declineOrApprove) => {
			const {personId, approveAbsenceExcused} = this.props;
			const {excusedAbsenceId} = this.state;
			this.handleDocumentClose();
			approveAbsenceExcused(personId, excusedAbsenceId, declineOrApprove);
	}

	handleInstructionsOpen = (excusedAbsenceId, note) => this.setState({isShowingModal_instructions: true, excusedAbsenceId, note })
	handleInstructionsClose = () => this.setState({isShowingModal_instructions: false, note: '', excusedAbsenceId: '' })
	handleApprovalSubmit = (declineOrApprove) => {
			const {personId, approveAbsenceExcused} = this.props;
			const {excusedAbsenceId} = this.state;
			this.handleInstructionsClose();
			approveAbsenceExcused(personId, excusedAbsenceId, declineOrApprove);
	}

	handleEnteredByOpen = (displayDoctor) => this.setState({ isShowingModal_doctor: true, displayDoctor })
	handleEnteredByClose = () => this.setState({ isShowingModal_doctor: false, displayDoctor: '' })

	chooseRecord = chosen_courseAttendanceId => this.setState({ chosen_courseAttendanceId });

	clearFilters = () => {
			this.setState({
					studentPersonId: '',
					includeSiblings: '',
					courseScheduledId: '',
					searchDate: '',
			});
	}

	changeDate = (field, event) => {
			let newState = Object.assign({}, this.state);
			newState[field] = event.target.value
			this.setState(newState);
	}

  render() {
    const {personId, absenceUnexcused={}, fetchingRecord, companyConfig, accessRoles, pendingApproval} = this.props;
    const {isShowingModal_missingInfo, selectedAbsences=[], note, studentPersonId, courseScheduledId, messageInfoIncomplete, isShowingModal_removeFileUpload,
						isShowingFileUpload, selectedFile, isShowingModal_chooseAbsence, loadingFiles, includeSiblings, fileUpload, isShowingModal_instructions,
						isShowingModal_document, isShowingModal_doctor, displayDoctor={}, chosen_courseAttendanceId, searchDate} = this.state;

		let localAbsence = (absenceUnexcused && absenceUnexcused.absenceDateLines) || [];

		localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.map(m => { m.isChosenRecord = m.courseAttendanceId === chosen_courseAttendanceId ? true : false; return m });

		if (studentPersonId && studentPersonId !== '0') {
				if (includeSiblings) {
						let studentParent = absenceUnexcused.students && absenceUnexcused.students.length > 0 && absenceUnexcused.students.filter(m => m.id === studentPersonId)[0];
						let parentPersonId = studentParent && studentParent.masterWorkId;
						let studentSiblings = absenceUnexcused.students && absenceUnexcused.students.length > 0 && absenceUnexcused.students.filter(m => m.masterWorkId === parentPersonId);
						if (parentPersonId) {
								localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => {
										let isSiblings = false;
										studentSiblings.forEach(s => {
												if (s.id === m.studentPersonId) isSiblings = true;
										});
										return isSiblings;
								});
						}
				} else {
						localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => m.studentPersonId === studentPersonId);
				}
		}
		if (courseScheduledId && courseScheduledId !== '0') {
				localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.filter(m => m.courseScheduledId === courseScheduledId);
		}
		if (searchDate) {
				localAbsence = localAbsence.filter(m => m.attendanceDate.substring(0,10) === searchDate);
		}

		let uniqueCourseAttendanceIds = localAbsence && localAbsence.length > 0 ? [...new Set(localAbsence.map(m => pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId))] : [];


		localAbsence = localAbsence && localAbsence.length > 0 && localAbsence.map((m, i) => {
				m.checkbox = <div className={classes(styles.row, m.isChosenRecord ? styles.highlight : '')} onClick={() => this.chooseRecord(m.courseAttendanceId)}>
												<div className={styles.checkbox}>
												 		<Checkbox id={pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId} key={i} label={''}
																checked={selectedAbsences.indexOf(pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId) > -1}
																onClick={(event) => this.toggleCheckbox(event, pendingApproval ? m.excusedAbsenceId : m.courseAttendanceId)}/>
												</div>
												{m.fileUploads && m.fileUploads.length > 0 && m.fileUploads.map((f, i) =>
														<a key={i} onClick={() => this.handleDocumentOpen(m.excusedAbsenceId, f)}>
																<Icon pathName={'document0'} premium={true} className={styles.iconCell} />
														</a>)
												}
												{m.note &&
														<div onClick={() => this.handleInstructionsOpen(m.excusedAbsenceId, m.note)}>
																<Icon pathName={'comment_edit'} premium={true} className={styles.iconCell} />
														</div>
												}
										 </div>;
				m.date = <div onClick={(event) => this.toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>
										<DateMoment date={m.attendanceDate} includeTime={false}/>
								</div>;
				m.student = <div onClick={(event) => this.toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>{m.studentName}</div>;
				m.course = <div onClick={(event) => this.toggleCheckbox(event, m.courseAttendanceId)} className={classes(styles.cellText, m.isChosenRecord ? styles.highlight : '')}>{m.courseName}</div>;
				m.enteredBy = <div onClick={m.entryPersonRole === 'Doctor' ? () => this.handleEnteredByOpen(m) : () => this.chooseRecord(m.courseAttendanceId)}
															className={classes((m.entryPersonRole === 'Doctor' ? globalStyles.link : styles.cellText), (m.isChosenRecord ? styles.highlight : ''))}>
													{`${m.entryPersonName} (${m.entryPersonRole})`}
											</div>;
				return m;
    });

		let columns = [
			{
				width: pendingApproval ? 150 : 50,
				label: <div className={styles.smallWidth}>
									<ButtonWithIcon icon={'checkmark_circle'} label={''} onClick={() => this.handleSetAll(uniqueCourseAttendanceIds)} addClassName={styles.smallButton}/>
							 </div>,
				dataKey: 'checkbox',
			},
			{
				width: 90,
				label: <L p={p} t={`Date`}/>,
				dataKey: 'date',
			},
			{
				width: 160,
				label: <L p={p} t={`Student`}/>,
				dataKey: 'student',
			},
			{
				width: 200,
				label: <L p={p} t={`Course`}/>,
				dataKey: 'course',
			},
		];

    if (pendingApproval) columns.push({ width: 200, label: 'Entered by', dataKey: 'enteredBy'})

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                {pendingApproval ? `Excused Absences Pending Approval` : `Unexcused Absences`}
            </div>
						<div className={styles.rowWrap}>
								<div className={styles.subHeader}>Search:</div>
		            <div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Student(s)`}/>}
												id={'students'}
                        name={'students'}
                        options={absenceUnexcused.students || []}
                        value={studentPersonId}
                        height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedStudents}/>
		            </div>
								<div className={styles.checkboxSiblings}>
										<Checkbox
												id={'includeSiblings'}
												label={<L p={p} t={`Include siblings`}/>}
												labelClass={styles.checkboxLabel}
												checked={includeSiblings || false}
												onClick={this.toggleSiblings}
												className={styles.button}/>
								</div>
								<div className={classes(styles.littleLeft)}>
										<SelectSingleDropDown
												label={<L p={p} t={`Course(s)`}/>}
												id={'courses'}
												name={'courses'}
												options={absenceUnexcused.courses || []}
												value={courseScheduledId}
												multiple={true}
												height={`medium`}
												className={styles.moreSpace}
												onChange={this.handleSelectedCourses}/>
									</div>
									<div className={classes(styles.littleTop, styles.moreRight, styles.row)}>
											<div className={classes(styles.dateRow, styles.moreRight)}>
													<DateTimePicker id={`searchDate`} label={<L p={p} t={`Date`}/>} value={searchDate} onChange={(event) => this.changeDate('searchDate', event)}/>
											</div>
									</div>
									<a onClick={this.clearFilters} className={classes(styles.moreLeft, styles.linkStyle, styles.moreRight, styles.moreTop)}>
											Clear filters
									</a>
						</div>
						<hr/>
						<Loading isLoading={fetchingRecord.baseCourses} />
						<Paper style={{ height: 250, width: '700px', marginTop: '8px' }}>
								<TableVirtualFast rowCount={(localAbsence && localAbsence.length) || 0}
										rowGetter={({ index }) => (localAbsence && localAbsence.length > 0 && localAbsence[index]) || ''}
										columns={columns} />
						</Paper>
						<div className={styles.rowWrap}>
								<div className={styles.moreRight}>
										<div className={styles.subHeader}>File upload (doctor's notes)</div>
										<div className={classes(styles.moreLeft, styles.row)}
														onClick={selectedAbsences && selectedAbsences.length > 0
																? this.handleFileUploadOpen
																: this.handleChooseAnAbsenceOpen
														}>
												<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
												<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload file or picture`}/></div>
										</div>
										<br/>
										<Loading isLoading={loadingFiles} />
										{absenceUnexcused.fileUploads && absenceUnexcused.fileUploads.length > 0 && absenceUnexcused.fileUploads.map((f, i) =>
												<ImageDisplay  keyIndex={i} linkText={''} url={f.url} isOwner={true} fileUploadId={f.fileUploadId}
														deleteFunction={() => this.handleRemoveFileUploadOpen(f)} deleteId={personId}/>
										)}
								</div>
								<div>
										<InputTextArea
												label={pendingApproval ? <L p={p} t={`Note (required for decline)`}/>: <L p={p} t={`Note`}/>}
												name={'note'}
												value={note || ''}
												autoComplete={'dontdoit'}
												onChange={this.changeAbsence}/>
										<div className={styles.rowRight}>
												<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
												{!pendingApproval && <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>}
												{pendingApproval && <ButtonWithIcon label={<L p={p} t={`Decline`}/>} icon={'cross_circle'} onClick={() => this.approveForm('decline')} changeRed={true}/>}
												{pendingApproval && <ButtonWithIcon label={<L p={p} t={`Approve`}/>} icon={'checkmark_circle'} onClick={() => this.approveForm('approve')}/>}
				            </div>
								</div>
						</div>
            <OneFJefFooter />
						{isShowingModal_missingInfo &&
								<MessageModal handleClose={this.handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
									 explainJSX={messageInfoIncomplete} onClick={this.handleMissingInfoClose} />
						}
						{isShowingFileUpload &&
								<FileUploadModalWithCrop handleClose={this.handleFileUploadClose} title={<L p={p} t={`Choose File or Image`}/>}
										personId={personId} submitFileUpload={this.handleFileUploadSubmit}
										file={selectedFile} handleInputFile={this.handleInputFile}
										acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .docx, .doc, .pdf, .dat, .txt, .ppt, .wpd, .odt, .rtf, .m4a"}
										handleCancelFile={()=>{}}/>
            }
						{isShowingModal_chooseAbsence &&
                <MessageModal handleClose={this.handleChooseAnAbsenceClose} heading={<L p={p} t={`Choose an absence`}/>}
                   explainJSX={<L p={p} t={`Please choose at least one absence before uploading a file.`}/>}
                   onClick={this.handleChooseAnAbsenceClose} />
            }
						{isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
						{isShowingModal_document &&
								<div className={styles.fullWidth}>
										{<DocumentViewOnlyModal handleClose={this.handleDocumentClose} showTitle={true} handleSubmit={this.handleDocumentClose}
												companyConfig={companyConfig} accessRoles={accessRoles} fileUpload={fileUpload} isSubmitType={!!pendingApproval}
												onSubmit={this.handleAbsenceApproval} />}
								</div>
						}
						{isShowingModal_instructions &&
								<MessageModal handleClose={this.handleInstructionsClose} heading={<L p={p} t={`Excused Absence Note`}/>}
									 onClick={pendingApproval ? this.handleApprovalSubmit : this.handleInstructionsClose} isConfirmType={pendingApproval}
									 explain={note}  />
						}
						{isShowingModal_doctor &&
								<MessageModal handleClose={this.handleEnteredByClose} heading={<L p={p} t={`Doctor's Office`}/>} onClick={this.handleEnteredByClose}
										explainJSX={<div>
																<div className={styles.text}>{displayDoctor.doctorOfficeName}</div>
																<div className={styles.text}>{displayDoctor.doctorPersonnel}</div>
																<div className={styles.text}>{displayDoctor.EntryPersonName}</div>
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

export default withAlert(AbsenceUnexcusedView);
