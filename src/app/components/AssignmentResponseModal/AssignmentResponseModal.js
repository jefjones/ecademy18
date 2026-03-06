import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import styles from './AssignmentResponseModal.css';
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index.js';
import classes from 'classnames';
import TextDisplay from '../TextDisplay';
import RadioGroup from '../RadioGroup';
import InputText from '../InputText';
import Required from '../Required';
import Loading from '../Loading';
import MessageModal from '../MessageModal';
import ButtonWithIcon from '../ButtonWithIcon';
import DropZone from 'react-dropzone-component';
import {wait} from '../../utils/wait.js';
//import penspringSmall from '../../assets/Penspring_small.png';
import PenspringWorkAddView from '../../views/PenspringWorkAddView';
const p = 'component';
import L from '../../components/PageLanguage';

//Error:  The date is not being able to be modified.  But we cut it out of the view anyway (showMoreInfo=false) for our purposes here.

export default class AssignmentResponseModal extends Component {
  constructor(props) {
      super(props);

      this.state = {
          file: {},
					assignment: {},
          isSubmitted: false,
          isFileChosen: false,
					newTextResponse: '',
          errorContentType: '',
					errorResponseType: false,
					errorTextResponse: false,
					errorWebsiteLink: false,
					errorFileUpload: false,
					isShowingModal_remove: false,
					fileList: ['First file', 'Second file', 'Third file', 'Fourth file', 'Firth file', 'Sixth file', 'Seventh file', 'Eighth file', 'Ninth file']
      }

      this.djsConfig = {
          addRemoveLinks: true,
          acceptedFiles: ".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .pages, .ppt, .pptx, .pptm, .m4a",
          autoProcessQueue: false,
          maxFiles: 1,
          paramName: "ebiFile",
          success: () => {this.props.recallInitRecords(); this.props.handleClose(); },
      };

      this.componentConfig = {
          iconFiletypes: ['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.pages', '.ppt', '.pptx', '.pptm', '.m4a'],
          showFiletypeIcon: false,
          postUrl: this.buildURL,
          method: 'post',
          paramName: "file", // The name that will be used to transfer the file
          success: () => { this.props.recallInitRecords(); this.props.handleClose()},
          accept: function(file, done) { this.props.handleClose() },
          uploadMultiple: false,
      };

      this.dropzone = null;
  }

  componentDidMount() {
			const {assignmentId, assignmentsInfo, clearPenspringTransfer, personId} = this.props;
			let data = assignmentsInfo && assignmentsInfo.assignments && assignmentsInfo.assignments.length > 0 && assignmentsInfo.assignments.filter(m => m.assignmentId === assignmentId)[0];
			if (!this.state.data || !this.state.data.assignmentId) this.setState({ data });
			clearPenspringTransfer(personId);
  }

	componentDidUpdate() {
			const {assignmentId, assignmentsInfo, penspringTransfer, clearPenspringTransfer, personId, handleClose} = this.props;
			let data = assignmentsInfo && assignmentsInfo.assignments && assignmentsInfo.assignments.length > 0 && assignmentsInfo.assignments.filter(m => m.assignmentId === assignmentId)[0];
			if (!this.state.data || !this.state.data.assignmentId) this.setState({ data });
			if (penspringTransfer) {
					this.setState({ data: {} })
					clearPenspringTransfer(personId);
					handleClose();
			}
	}

  handleFileAdded(file) {
      this.setState({ file, isFileChosen: true })
  }

  handlePost() {
      this.dropzone.processQueue();
  }

  handleFileUpload = () => {
      const {isFileChosen} = this.state;
      let hasError = false;
			//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.

      if (!isFileChosen) {
          hasError = true;
          this.setState({ errorFileUpload: 'A file is required'});
      }

      if (!hasError) {
					this.setState({isSubmitted: true})
		      this.dropzone.processQueue();
      }
  }

  buildURL = () => {
      const {personId, courseScheduledId} = this.props;
      const {data} = this.state;
			return `${apiHost}ebi/studentAssignment/fileUpload/` + personId + `/` + courseScheduledId + `/` + data.responseTypeName + `/` + (data.score || ` `) + `/` + data.assignmentId;
  }

  changeResponse = ({target}) => {
      const data = Object.assign({}, this.state.data);
			const field = target.name;
      data[field] = target.value;
			if (field === 'responseTypeName') this.setState({ errorTextResponse: false });
			if (field === 'newWebsiteLink') this.setState({ errorWebsiteLink: false });
      this.setState({ data });
  }

	handleCommentEntry = ({target}) => {
			let data = Object.assign({}, this.state.data);
			data.newTextResponse = target.value;
			this.setState({ data, errorTextResponse: '' });
	}

	handleResponseType = (value) => {
      let data = Object.assign({}, this.state.data);
      data['responseTypeName'] = value;
      this.setState({ data, errorResponseType: false, errorTextResponse: false, errorWebsiteLink: false, errorFileUpload: false, });
  }

	processForm = () => {
      const {handleSubmit, handleClose, assignmentId}  = this.props;
      const {data} = this.state;
      let hasError = false;
			//If this is a fileAttach, it doesn't use this function.  It uses the dropZone buildURL process.

			if (!data.responseTypeName) {
          hasError = true;
          this.setState({ errorResponseType: <L p={p} t={`A response type is required`}/>});
      }
      if (data.responseTypeName === 'STUDENTRESPONSE' && !data.newTextResponse) {
          hasError = true;
          this.setState({ errorTextResponse: <L p={p} t={`A comment response is required`}/>});
      }
			if (data.responseTypeName === 'WEBSITELINK' && !data.newWebsiteLink) {
          hasError = true;
          this.setState({ errorWebsiteLink: <L p={p} t={`A website link is required`}/>});
      }

      if (!hasError) {
          handleSubmit(data, assignmentId);
          handleClose();
      }
  }

	handleRemoveOpen = (studentAssignmentResponseId, deleteFile='') => this.setState({isShowingModal_remove: true, studentAssignmentResponseId, deleteFile })
  handleRemoveClose = () => this.setState({isShowingModal_remove: false })
  handleRemove = () => {
      const {handleRemove, personId} = this.props;
      const {studentAssignmentResponseId, deleteFile} = this.state;
      handleRemove(personId, studentAssignmentResponseId, deleteFile);
      this.handleRemoveClose();
			//Remove the deleted records from the local data
			let data = Object.assign({}, this.state.data);
			data.studentFileUploadUrls = data.studentFileUploadUrls.length > 0 && data.studentFileUploadUrls.filter(m => m.id !== studentAssignmentResponseId);
			data.studentWebsiteLinks = data.studentWebsiteLinks.length > 0 && data.studentWebsiteLinks.filter(m => m.id !== studentAssignmentResponseId);
			if (data.studentTextResponse && data.studentTextResponse.id && data.studentTextResponse.id === studentAssignmentResponseId) { //Doing this with a terniary just wasn't working for some reason.  I had to do long-hand javascript in this case.
					data.studentTextResponse.id = '';
					data.studentTextResponse.label = '';
			}
			this.setState({ data });
  }

	setEditTextResponse = () => {
			let data = Object.assign({}, this.state.data);
			data.responseTypeName = 'STUDENTRESPONSE';
			this.setState({ data });
	}

  render() {
      const {personId, studentPersonId, languageList, handleClose, className, assignmentId, course, companyConfig={}, accessRoles,
							createWorkAndPenspringTransfer, recallInitRecords } = this.props;
      const {data={ assignment: {}}, errorTextResponse, errorWebsiteLink, errorResponseType, errorFileUpload, isShowingModal_remove,
							fileList, isSubmitted, isFileChosen } = this.state;
      const config = this.componentConfig;
      const djsConfig = this.djsConfig;
      const eventHandlers = {
          init: dz => this.dropzone = dz,
          addedfile: this.handleFileAdded.bind(this),
          success: () => {wait(5000); this.props.recallInitRecords()},
      }

			let incomingTextResponse = (data.textResponses && data.textResponses.length > 0 && data.textResponses.filter(m => m.isTeacherResponse === (accessRoles.facilitator || accessRoles.admin))[0]) || {};

      return (
          <div className={classes(styles.container, className)}>
              <ModalContainer onClose={handleClose}>
                  <ModalDialog onClose={handleClose}>
                      <div className={styles.center}>
                          <div className={styles.heading}>Assignment Response</div>
													<TextDisplay label={`Assignment`} text={data.title} />
													<div className={classes(styles.moreTop, styles.row)}>
															<TextDisplay label={<L p={p} t={`Course`}/>} text={course && course.courseName} />
															<TextDisplay label={<L p={p} t={`Teacher`}/>} text={course && course.facilitatorName} />
                              <TextDisplay label={<L p={p} t={`Class Period`}/>} text={course && course.classPeriodName} />
                          </div>
                      </div>
                      <ul className={styles.unorderedList}>
                          <li>
															<div className={styles.row}>
																	<RadioGroup
																			title={<L p={p} t={`How do you want to send your homework?`}/>}
																			name={'responseTypeCode'}
																			data={[
																					//{ label: <div><L p={p} t={`I want a <img className={styles.penspringLogo} src={penspringSmall} alt="penspring"/>editable file`}/></div>, id: "PENSPRING" },
																					{ label: <L p={p} t={`I want to type my answers in plain text.`}/>, id: "STUDENTRESPONSE" },
																					{ label: <L p={p} t={`I want to attach a file.`}/>, id: "FILEATTACH" },
																					{ label: <L p={p} t={`I want to enter in a Google Docs link`}/>, id: "WEBSITELINK" },
																			]}
																			horizontal={false}
																			className={styles.moreTop}
																			initialValue={data.responseTypeName}
																			onClick={this.handleResponseType}/>
																	<div className={styles.error}>{errorResponseType}</div>
													    </div>
													</li>
													{data.canEditScore &&
															<li>
		                             <InputText
		                                 id={`score`}
		                                 name={`score`}
		                                 size={"super-short"}
		                                 label={<L p={p} t={`Score (possible: ${data.totalPoints})`}/>}
		                                 value={data.score || ''}
		                                 onChange={this.changeResponse}
																		 numberOnly={true}
																		 />
																		 {/*maxNumber={Number(data.totalPoints) + Number(data.extraCredit)}*/}
		                          </li>
													}
													{data.responseTypeName === 'PENSPRING' &&
															<li>
                                	<PenspringWorkAddView languageList={languageList} createWorkAndPenspringTransfer={createWorkAndPenspringTransfer} personId={personId}
																			accessRoles={accessRoles} studentPersonId={studentPersonId} course={course} assignmentId={assignmentId}
																			recallInitRecords={recallInitRecords} showMoreInfo={false} companyConfig={companyConfig}/>
		                          </li>
													}
													{data.responseTypeName === 'WEBSITELINK' &&
															<li>
		                             <InputText
		                                 id={`newWebsiteLink`}
		                                 name={`newWebsiteLink`}
		                                 size={"medium-long"}
		                                 label={<L p={p} t={`Google Docs link`}/>}
		                                 value={data.newWebsiteLink || ''}
		                                 onChange={this.changeResponse}
																		 required={true}
																		 whenFilled={data.newWebsiteLink}
																		 error={errorWebsiteLink}/>
		                          </li>
													}
                          {data.responseTypeName === 'FILEATTACH' &&
															<li>
		                                <div className={styles.explanation}>
		                                    <L p={p} t={`Click on the box below to browse for a file,`}/> <br/>
		                                    <L p={p} t={`or drag-and-drop a file into the box:`}/>
		                                </div>
		                                <DropZone config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} className={styles.dropZone}>
																				<L p={p} t={`Click here to upload or`}/>
																		</DropZone>
																		<div className={styles.error}>{errorFileUpload}</div>
																		<div className={styles.instructions}>{'Available file types: .jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .pages, .ppt, .pptx, .pptm'}</div>
		                          </li>
													}
                          {data.responseTypeName === 'STUDENTRESPONSE' &&
															<li>
																	<div className={styles.row}>
				                              <span className={classes(styles.inputText, styles.moveDown)}>{<L p={p} t={`Comments`}/>}</span><br/>
																			<Required setIf={data.responseTypeName === 'STUDENTRESPONSE'} setWhen={data.newTextResponse || (incomingTextResponse && incomingTextResponse.label)} className={styles.required}/>
																	</div>
																	<div className={styles.column}>
				                              <textarea rows={5} cols={45}
				                                      id={`newTextResponse`}
				                                      name={`newTextResponse`}
																							value={data.newTextResponse || (incomingTextResponse && incomingTextResponse.label) || ''}
				                                      onChange={this.handleCommentEntry}
				                                      className={styles.commentTextarea}>
				                              </textarea>
																			<div className={styles.error}>{errorTextResponse}</div>
																	</div>
		                          </li>
													}
													<li>
															<div className={styles.rowWrap}>
																	{data.studentFileUploadUrls && data.studentFileUploadUrls.length > 0 &&
																			<div>
																					<div className={styles.label}><L p={p} t={`File Attachment`}/></div>
																					{data.studentFileUploadUrls.map((f, i) =>
																							<div key={i} className={styles.row}>
																									<a key={i} href={f.label} target={'_blank'} className={styles.link}>{fileList[i]}</a>
																									<a onClick={() => this.handleRemoveOpen(f.id, 'DELETEFILE')} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
																							</div>
																					)}
																			</div>
																	}
																	{data.studentWebsiteLinks && data.studentWebsiteLinks.length > 0 &&
																			<div className={styles.someLeft}>
																					<div className={styles.label}><L p={p} t={`Website Link`}/></div>
																					{data.studentWebsiteLinks.map((w, i) =>
																							<div key={i} className={styles.row}>
																									<a key={i} href={w.label && w.label.indexOf('http') === -1 ? 'http://' + w.label : w.label} target={'_blank'} className={styles.link}>{w.label}</a>
																									<a onClick={() => this.handleRemoveOpen(w.id)} className={classes(styles.someTop, styles.remove)}><L p={p} t={`remove`}/></a>
																							</div>
																					)}
																			</div>
																	}
															</div>
															{data.studentTextResponse && data.studentTextResponse.label &&
																	<div className={styles.moreTop}>
																			<div className={styles.label}><L p={p} t={`Text Response`}/></div>
																			<div className={styles.someLeft}>
																					<a onClick={() => this.handleRemoveOpen(data.studentTextResponse.id)} className={styles.remove}><L p={p} t={`remove`}/></a>
																					<a onClick={this.setEditTextResponse} className={classes(styles.moreLeft, styles.link)}><L p={p} t={`edit`}/></a>
																					<div className={styles.text}>{data.studentTextResponse.label}</div>
																			</div>
																	</div>
															}
													</li>
													{data.responseTypeName !== 'PENSPRING' &&
		                          <li>
																	<hr />
		                              <div className={classes(styles.dialogButtons, styles.row, styles.moreLeft)}>
		                                  <a className={styles.cancelLink} onClick={() => handleClose(isFileChosen)}>Close</a>
																			{isSubmitted &&
																					<Loading isLoading={true} loadingText={<L p={p} t={`Please wait`}/>} />
																			}
																			{!isSubmitted &&
									                    		<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={data.responseTypeName === 'FILEATTACH' ? this.handleFileUpload : this.processForm}/>
																			}
		                              </div>
		                          </li>
													}
                      </ul>
                  </ModalDialog>
              </ModalContainer>
							{isShowingModal_remove &&
	                <MessageModal handleClose={this.handleRemoveClose} heading={<L p={p} t={`Remove this response entry?`}/>}
	                   explainJSX={<L p={p} t={`Are you sure you want to delete this response entry?`}/>} isConfirmType={true}
	                   onClick={this.handleRemove} />
	            }
          </div>
      )
    }
}
