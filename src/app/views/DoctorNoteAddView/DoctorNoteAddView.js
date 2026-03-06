import React, {Component} from 'react';
import {Link} from 'react-router';
import {apiHost} from '../../api_host.js';
import axios from 'axios';
import styles from './DoctorNoteAddView.css';
const p = 'DoctorNoteAddView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import InputDataList from '../../components/InputDataList';
import InputText from '../../components/InputText';
import Icon from '../../components/Icon';
import Loading from '../../components/Loading';
import DateTimePicker from '../../components/DateTimePicker';
import FileUploadModalWithCrop from '../../components/FileUploadModalWithCrop';
import InputTextArea from '../../components/InputTextArea';
import MessageModal from '../../components/MessageModal';
import ImageDisplay from '../../components/ImageDisplay';
import ButtonWithIcon from '../../components/ButtonWithIcon';
import OneFJefFooter from '../../components/OneFJefFooter';
import classes from 'classnames';
import { withAlert } from 'react-alert';
import {guidEmpty} from '../../utils/guidValidate.js';

class DoctorNoteAddView extends Component {
  constructor(props) {
    super(props);

    this.state = {
				doctorNote: {},
				student: {},
    }
  }

	componentDidUpdate() {
			const {newDoctorNote, doctorNoteInviteId, student} = this.props;
			const {isInit} = this.state;
			if (!isInit && doctorNoteInviteId && newDoctorNote && newDoctorNote.companyId) {
					this.setState({ doctorNote: newDoctorNote, isInit: true, student });
			}
	}

  changeNote = (event) => {
			let doctorNote = Object.assign({}, this.state.doctorNote);
	    const field = event.target.name;
	    doctorNote[field] = event.target.value;
			if (field === 'companyId') {
					this.setState({ doctorNote, clearStudent: true }); //Clear out the student if the school is changed in case a chosen student doesn't belong to that school.
			} else {
	    		this.setState({ doctorNote });
			}
  }

	resetClearTextValue = () => {
			this.setState({ clearStudent: false });
	}

  processForm = () => {
			//When the file upload is used, it will create the new ExcusedAbsence record plus let the files be accrued if the user wants to enter
			//	more than one file.  But as soon as the page's submit button is used (processform), then the user is submitting the entire record which may have a note.
			//For the user (either parent, student or admin), the chosen absence records should then disappear from this list.
      const {addOrUpdateDoctorNote, personId, doctorNoteInviteId} = this.props;
      const {doctorNote={}} = this.state;
			let errors = {};
			let missingInfoMessage = [];

			if (!(doctorNote.studentPersonId && doctorNote.studentPersonId.length > 0)) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Student`}/></div>
          errors.studentPersonId = <L p={p} t={`A student is required`}/>;
      }

			if (!doctorNote.doctorName) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Doctor's name`}/></div>
          errors.doctorName = <L p={p} t={`A doctor's name is required`}/>;
      }

			if (!doctorNote.dataEntryName) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`Data entry person's name`}/></div>
          errors.dataEntryName = <L p={p} t={`A data entry person's name is required`}/>;
      }

			if (!doctorNote.fromDate && !doctorNote.toDate) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A 'from date' or a 'to date' or both`}/></div>
          errors.fromDate = <L p={p} t={`Please enter a 'from date' or a 'to date' or both`}/>;
      } else if (!doctorNote.fromDate) {
					doctorNote.fromDate = doctorNote.toDate;
			} else if (!doctorNote.toDate) {
					doctorNote.toDate = doctorNote.fromDate;
			}

			if (!doctorNote.note && doctorNote.fileUploads.length === 0) {
					missingInfoMessage[missingInfoMessage.length] = <div className={globalStyles.moreLeft}><L p={p} t={`A note or a file upload is required`}/></div>
			}

      if (missingInfoMessage && missingInfoMessage.length > 0) {
					this.handleMissingInfoOpen(missingInfoMessage);
			} else {
					doctorNote.doctorNoteInviteId = doctorNoteInviteId; //If the doctorNoteInviteId exists, it needs to delete the doctorNoteInvite when creating this new doctorNote
          addOrUpdateDoctorNote(personId, doctorNote);
          this.setState({ doctorNote: {}, clearStudent: true });
					//We are going to let the doctor note pending count on the main menu be the notification unless we hear otherwise.
					this.props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The doctor's note has been recorded.`}/></div>);
      }
  }

	handleMissingInfoOpen = (messageInfoIncomplete) => this.setState({isShowingModal_missingInfo: true, messageInfoIncomplete })
	handleMissingInfoClose = () => this.setState({isShowingModal_missingInfo: false, messageInfoIncomplete: ''})

	handleFileUploadOpen = () => this.setState({ isShowingFileUpload: true, loadingFiles: true })
	handleFileUploadClose = () => this.setState({ isShowingFileUpload: false, loadingFiles: false })
	handleFileUploadSubmit = () => {
			//When the file upload is used, it will create the new DoctorNote record plus let the files be accrued if the user wants to enter
			//	more than one file.  But as soon as the page's submit button is used (processForm), then the user is submitting the entire record which may have a note.
			const {personId} = this.props;
			const {selectedFile, doctorNote} = this.state;
			let doctorNoteId = doctorNote.doctorNoteId;
			if (!doctorNoteId) doctorNoteId = guidEmpty;
			let data = new FormData();
			data.append('file', selectedFile);
			let url = `${apiHost}ebi/doctorNote/fileUpload/${personId}/${doctorNoteId}`

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
							let doctorNoteId = response.data && response.data.length > 0 && response.data[0].doctorNoteId;
							this.setState({
									doctorNote: {...this.state.doctorNote, doctorNoteId, fileUploads: response.data },
									loadingFiles: false
							})
					})
					.catch(error => this.setState({ loadingFiles: false }))

			this.handleFileUploadClose();
	}

	handleInputFile = (selectedFile) => this.setState({ selectedFile })

	handleRemoveFileUploadOpen = (fileUpload) => this.setState({isShowingModal_removeFileUpload: true, fileUpload })
	handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false, fileUpload: [] })
	handleRemoveFileUpload = () => {
			const {removeDoctorNoteFileUpload, personId} = this.props;
			const {fileUpload} = this.state;
			this.handleRemoveFileUploadClose();
			removeDoctorNoteFileUpload(personId, fileUpload.fileUploadId)
	}

	changeStudent = (student) => {
			this.setState({ student, doctorNote: {...this.state.doctorNote, studentPersonId: student.id} });
	}

	changeDate = (field, event) => {
			let doctorNote = Object.assign({}, this.state.doctorNote);
			doctorNote[field] = event.target.value
			this.setState({ doctorNote });
	}

  render() {
    const {personId, schools, students} = this.props;
    const {isShowingModal_missingInfo, doctorNote={}, messageInfoIncomplete, isShowingModal_removeFileUpload, isShowingFileUpload, selectedFile,
						loadingFiles, student, errors={}, clearStudent} = this.state;

		let studentList = Object.assign([], students);

		if (doctorNote.companyId) studentList = studentList && studentList.length > 0 && studentList.filter(m => m.companyId === doctorNote.companyId);

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <L p={p} t={`Add a Doctor's Note`}/>
            </div>
						<div className={styles.rowWrap}>
								<div className={classes(styles.littleTop, styles.moreRight)}>
										<SelectSingleDropDown
												id={`companyId`}
												name={`companyId`}
												label={<L p={p} t={`School`}/>}
												value={doctorNote.companyId || ''}
												options={schools}
												className={styles.moreBottomMargin}
												height={`medium`}
												onChange={this.changeNote}/>
								</div>
								<div className={classes(styles.moreTop, styles.moreRight)}>
										<InputDataList
												name={`studentPersonId`}
												label={<L p={p} t={`Student`}/>}
												value={student}
												options={studentList}
												height={`medium`}
												className={styles.moreBottomMargin}
												onChange={this.changeStudent}
												clearTextValue={clearStudent}
												resetClearTextValue={this.resetClearTextValue}
												required={true}
												whenFilled={doctorNote.studentPersonId}
												error={errors.studentPersonId}/>
								</div>
								<InputText
										id={`doctorName`}
										name={`doctorName`}
										size={"medium"}
										label={<L p={p} t={`Doctor's name`}/>}
										value={doctorNote.doctorName || ''}
										onChange={this.changeNote}
										required={true}
										whenFilled={doctorNote.doctorName}
										error={errors.doctorName}/>
								<InputText
										id={`dataEntryName`}
										name={`dataEntryName`}
										size={"medium"}
										label={<L p={p} t={`Data entry person`}/>}
										value={doctorNote.dataEntryName || ''}
										onChange={this.changeNote}
										required={true}
										whenFilled={doctorNote.dataEntryName}
										error={errors.dataEntryName}/>
								<div className={classes(styles.moreTop, styles.moreRight, styles.row)}>
										<div className={classes(styles.dateRow, styles.moreRight)}>
												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={doctorNote.fromDate} maxDate={doctorNote.toDate}
														required={true} whenFilled={doctorNote.fromDate || doctorNote.toDate}
														onChange={(event) => this.changeDate('fromDate', event)}/>
										</div>
										<div className={classes(styles.dateRow, styles.moreTop, styles.muchRight)}>
												<DateTimePicker id={`toDate`} value={doctorNote.toDate} label={<L p={p} t={`To date (optional)`}/>} minDate={doctorNote.fromDate ? doctorNote.fromDate : ''}
														onChange={(event) => this.changeDate('toDate', event)}/>
										</div>
								</div>
								<div className={globalStyles.alert}>{errors.fromDate}</div>
					</div>
						<div className={styles.rowWrap}>
								<div className={styles.moreRight}>
										<div className={styles.subHeader}><L p={p} t={`File upload (doctor's notes)`}/></div>
										<div className={classes(styles.moreLeft, styles.row)} onClick={this.handleFileUploadOpen}>
												<Icon pathName={'camera2'} premium={true} className={styles.iconSmall}/>
												<div className={classes(globalStyles.link, styles.linkPosition)}><L p={p} t={`Upload file or picture`}/></div>
										</div>
										<Loading isLoading={loadingFiles} />
										{doctorNote.fileUploads && doctorNote.fileUploads.length > 0 && doctorNote.fileUploads.map((f, i) =>
												<div key={i}>
														<ImageDisplay linkText={''} url={f.fileUrl} isOwner={true} fileUploadId={f.fileUploadId}
																deleteFunction={() => this.handleRemoveFileUploadOpen(f)} deleteId={personId}/>
												</div>
										)}
								</div>
								<div>
										<InputTextArea
												label={<L p={p} t={`Note`}/>}
												name={'note'}
												value={doctorNote.note || ''}
												autoComplete={'dontdoit'}
												onChange={this.changeNote}/>
										<div className={styles.rowRight}>
												<Link className={styles.cancelLink} to={'/firstNav'}><L p={p} t={`Close`}/></Link>
												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={this.processForm}/>
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
						{isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file or image?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file or image?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
      </div>
    );
  }
}

export default withAlert(DoctorNoteAddView);
