import React, {Component} from 'react';
import {apiHost} from '../../api_host.js';
import styles from './DiscussionEntryView.css';
const p = 'DiscussionEntryView';
import L from '../../components/PageLanguage';
import globalStyles from '../../utils/globalStyles.css';
import MessageModal from '../../components/MessageModal';
import DiscussionEntryModal from '../../components/DiscussionEntryModal';
import TextDisplay from '../../components/TextDisplay';
import LinkDisplay from '../../components/LinkDisplay';
import VoiceRecordingModal from '../../components/VoiceRecordingModal';
import FileUploadModal from '../../components/FileUploadModal';
import DateMoment from '../../components/DateMoment';
//import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown';
import TextareaModal from '../../components/TextareaModal';
import Icon from '../../components/Icon';
import EditTable from '../../components/EditTable';
import classes from 'classnames';
import OneFJefFooter from '../../components/OneFJefFooter';
import ReplyToDiscussionEntry from '../../components/ReplyToDiscussionEntry';
import StudentListModal from '../../components/StudentListModal';
import moment from 'moment';
import {guidEmpty} from '../../utils/guidValidate.js';

export default class DiscussionEntryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingModal_addOrUpdate: false,
      isShowingModal_removeEntry: false,
			isShowingModal_removeByAdmin: false,
      isShowingModal_removeWebsiteLink: false,
      isShowingModal_removeFileUpload: false,
			isShowingModal_students: false,
      isShowingFileUpload: false,
      isShowingModal_websiteLink: false,
      isShowingVoiceRecording: false,
			replyToDiscussionEntry: '',
			isReply: '',
			initialScroll: false,
			postsEnteredBy: '',
			postedSubject: '',
			participant: '',
    }
  }

  componentDidUpdate(prevProps) {
    	const {resolveFetchingRecordDiscussionEntries, fetchingRecord, discussion, discussionEntryId} = this.props;
			const {initialScroll} = this.state;
			if ((!initialScroll && discussion.discussionEntries && discussion.discussionEntries.length > 0)
						|| (discussion.discussionEntries && discussion.discussionEntries.length === 0
									&& fetchingRecord && fetchingRecord.discussionEntries === "ready")) {
					this.messagesEnd.scrollIntoView({ behavior: "smooth" });
					this.setState({ initialScroll: true });
					resolveFetchingRecordDiscussionEntries();
			}
			if (discussionEntryId && discussion && discussion.firstLevelEntries && discussion.firstLevelEntries.length > 0 && !this.state.initialDiscussion) {
					let chosenDiscussion = discussion.firstLevelEntries.filter(m => m.discussionEntryId === discussionEntryId)[0];
					chosenDiscussion && chosenDiscussion.assignmentId && this.recallDiscussion(discussionEntryId, chosenDiscussion.assignmentId);
					this.setState({ initialDiscussion: true });
			}
  }

	componentWillUnmount() {
			if (this.state.timer) clearInterval(this.state.timer);
	}

  handleSubmitVoiceRecording = (blobThing, discussionEntryId) => {
      const {addVoiceRecording, personId} = this.props;
      addVoiceRecording(personId, discussionEntryId, blobThing);
	  	this.handleVoiceRecordingClose();
  }

  handleFileUploadOpen = (fileUpload_discussionEntryId) => this.setState({isShowingFileUpload: true, fileUpload_discussionEntryId })
  handleFileUploadClose = () => this.setState({isShowingFileUpload: false})
  handleSubmitFile = () => {
      // const {waitingForFileUpload} = this.props;
			// waitingForFileUpload();
			// this.setState({
			// 		waitingForFileUpload: true,
			// });
			//this.handleFileUploadClose(); //This is already done on the fileUploadModal
  }

  handleVoiceRecordingOpen = (recording_discussionEntryId) => this.setState({isShowingVoiceRecording: true, recording_discussionEntryId })
  handleVoiceRecordingClose = () => this.setState({isShowingVoiceRecording: false})
  handleSubmitFile = () => {
      const {discussionEntriesInit, personId, courseEntryId} = this.props;
      this.handleVoiceRecordingClose();
      discussionEntriesInit(personId, courseEntryId);
  }

  // recallAfterFileUpload = () => {
  //   const {discussionEntriesInit, personId, courseEntryId} = this.props;
  //   discussionEntriesInit(personId, courseEntryId);
  // }

  fileUploadBuildUrl = (title) => {
      const {personId} = this.props;
      const {fileUpload_discussionEntryId} = this.state;
      return `${apiHost}ebi/discussionEntry/fileUpload/` + personId + `/` + fileUpload_discussionEntryId + `/` + encodeURIComponent(title);
  }

  handleAddOrUpdateEntryOpen = (discussionEntry, studentPersonId, isReply=false, isEdit=false) => {
			const {personId, entryPersonFirstName, entryPersonLastName} = this.props;
			clearInterval(this.state.timer);
      this.setState({
          isShowingModal_addOrUpdate: true,
          addOrUpdate_discussionEntryId: discussionEntry.discussionEntryId,
					studentPersonId,
					isReply,
					isEdit,
					replyToDiscussionEntry: isEdit
							? discussionEntry
							: isReply
									? {
												...discussionEntry,
												isReply: true,
												discussionEntryId: null,
												replyToDiscussionEntryId: discussionEntry && discussionEntry.discussionEntryId,
												comment: '',
												entryDate: moment(),
												entryPersonFirstName,
												entryPersonLastName,
												personId,
										}
									: {},
					replyToDiscussionEntryId: isEdit ? discussionEntry.replyToDiscussionEntryId : isReply && discussionEntry && discussionEntry.discussionEntryId,
					discussionEntry,
					timer: null,
      });
  }

  handleAddOrUpdateEntryClose = () => {
			const {discussion, discussionEntryId, courseEntryId, personId, discussionEntriesInit} = this.props;
			let chosenDiscussion = discussion.firstLevelEntries.filter(m => m.discussionEntryId === discussionEntryId)[0];
			this.setState({
					isShowingModal_addOrUpdate: false,
					isReply: false,
					timer: setInterval(() => discussionEntriesInit(personId, courseEntryId, chosenDiscussion && chosenDiscussion.assignmentId), 10000),
			});
	}

  handleAddOrUpdateEntrySave = (discussionEntry) => {
			const {addOrUpdateDiscussionEntry, personId, courseEntryId} = this.props;
      const {studentPersonId} = this.state; //, assignmentId, replyToDiscussionEntryId
			this.handleAddOrUpdateEntryClose();
			// discussionEntry.assignmentId = assignmentId;
			// discussionEntry.replyToDiscussionEntryId = replyToDiscussionEntryId;
      addOrUpdateDiscussionEntry(personId, studentPersonId, courseEntryId, discussionEntry);
  }

  handleRemoveEntryOpen = (rmeove_discussionEntryId) => this.setState({isShowingModal_removeEntry: true, rmeove_discussionEntryId })
  handleRemoveEntryClose = () => this.setState({isShowingModal_removeEntry: false })
  handleRemoveEntry = () => {
      const {removeDiscussionEntry, personId} = this.props;
      const {rmeove_discussionEntryId} = this.state;
      removeDiscussionEntry(personId, rmeove_discussionEntryId);
      this.handleRemoveEntryClose();
  }

	handleRemoveByAdminOpen = (remove_discussionEntryId, studentPersonId) => this.setState({isShowingModal_removeByAdmin: true, remove_discussionEntryId, studentPersonId })
  handleRemoveByAdminClose = () => this.setState({isShowingModal_removeByAdmin: false })
  handleRemoveByAdminSave = (whyRemove) => {
      const {removeDiscussionEntryByAdmin, personId} = this.props;
      const {remove_discussionEntryId, studentPersonId} = this.state;
      removeDiscussionEntryByAdmin(personId, remove_discussionEntryId, studentPersonId, whyRemove);
      this.handleRemoveByAdminClose();
  }

  handleRemoveWebsiteLinkOpen = (discussionWebsiteLinkId) => this.setState({isShowingModal_removeWebsiteLink: true, discussionWebsiteLinkId })
  handleRemoveWebsiteLinkClose = () => this.setState({isShowingModal_removeWebsiteLink: false })
  handleRemoveWebsiteLink = () => {
      const {removeDiscussionEntryWebsiteLink, personId} = this.props;
      const {discussionWebsiteLinkId} = this.state;
      removeDiscussionEntryWebsiteLink(personId, discussionWebsiteLinkId);
      this.handleRemoveWebsiteLinkClose();
  }

  handleRemoveFileUploadOpen = (discussionFileUploadId) => this.setState({isShowingModal_removeFileUpload: true, discussionFileUploadId })
  handleRemoveFileUploadClose = () => this.setState({isShowingModal_removeFileUpload: false })
  handleRemoveFileUpload = () => {
      const {removeDiscussionEntryFileUpload, personId} = this.props;
      const {discussionFileUploadId} = this.state;
      removeDiscussionEntryFileUpload(personId, discussionFileUploadId);
      this.handleRemoveFileUploadClose();
  }

  handleWebsiteLinkOpen = (websiteLink_discussionEntryId) => this.setState({isShowingModal_websiteLink: true, websiteLink_discussionEntryId})
  handleWebsiteLinkClose = () => this.setState({isShowingModal_websiteLink: false})
  handleWebsiteLinkSave = (websiteLink) => {
      const {saveDiscussionEntryWebsiteLink, personId} = this.props;
      const {websiteLink_discussionEntryId} = this.state;
      saveDiscussionEntryWebsiteLink(personId, websiteLink_discussionEntryId, websiteLink);
      this.handleWebsiteLinkClose();
  }

  // b64toBlob = (b64Data, sliceSize=512) => {
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];
	//
  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);
	//
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
	//
  //     const byteArray = new Uint8Array(byteNumbers);
	//
  //     byteArrays.push(byteArray);
  //   }

	// let finalVoice = new Blob([m.voiceRecording], { type: 'audio/webm;codecs=opus' });
	// voiceRecording = URL.createObjectURL(finalVoice);
	// var reader = new FileReader(); //going out.
	// reader.readAsBinaryString(b64Data);

  //   const blob = new Blob(byteArrays, {type: 'audio/webm;codecs=opus'});
  //   return blob;
  // }

	changeItem = ({target}) => {
			let newState = Object.assign({}, this.state);
			let field = target.name;
			newState[field] = target.value === "0" ? "" : target.value;
			this.setState(newState);
	}

	setSubjectFilter = (postedSubject, assignmentId) => {
			this.setState({ postedSubject, assignmentId });
	}

	handleStudentListOpen = (studentList) => this.setState({isShowingModal_students: true, course: this.props.course, studentList })
	handleStudentListClose = () => this.setState({isShowingModal_students: false })

	recallDiscussion = (discussionEntryId, assignmentId) => {
			const {discussionEntriesInit, personId, courseEntryId} = this.props;
			this.setState({ discussionEntryId, assignmentId });
			discussionEntriesInit(personId, courseEntryId, assignmentId);
			clearInterval(this.state.timer);
			this.setState({ timer: setInterval(() => discussionEntriesInit(personId, courseEntryId, assignmentId), 10000) });
	}

	render() {
    const {personId, discussion={}, accessRoles, course={}, discussionEntriesInit, courseEntryId, companyConfig={}, fetchingRecord,
						participants, entryReport, students, updatePersonConfig} = this.props;
		//let {, postedSubjects} = this.props;
    const { isShowingModal_addOrUpdate, isShowingModal_removeEntry, discussionEntryId, isShowingFileUpload, isShowingModal_websiteLink,
            isShowingModal_removeWebsiteLink, isShowingModal_removeFileUpload, isShowingVoiceRecording, isReply, isEdit, replyToDiscussionEntry,
						participant, isShowingModal_students, studentList, isShowingModal_removeByAdmin, discussionEntry} = this.state;

		let headings = [
				{label: <L p={p} t={`Subject`}/>, tightText:true},
				{label: <L p={p} t={`Date`}/>, tightText:true},
				{label: <L p={p} t={`Name`}/>, tightText:true},
		];

		let data = entryReport && entryReport.length > 0 && entryReport.map((m, i) => {
				return [
						{ value: <div onClick={() => this.recallDiscussion(m.discussionEntryId, m.assignmentId)} className={styles.link}>{m.subject && m.subject.length > 70 ? m.subject.substring(0,70) + '...' : m.subject}</div>},
						{ value: <div className={styles.dataLabel}>{moment(m.entryDate).format('D MMM')}</div>},
						{ value: <div className={styles.dataLabel}>{m.personName}</div>},
				];
		})

    return (
        <div className={styles.container}>
            <div className={globalStyles.pageTitle}>
                <span className={globalStyles.pageTitle}><L p={p} t={`Class Discussion`}/></span>
            </div>
						<div className={styles.rowWrap}>
								<div className={styles.moreTop}>
		                <TextDisplay label={<L p={p} t={`Course`}/>} text={course.courseName}/>
		            </div>
						</div>
						<div className={styles.moreLeft}>
								<SelectSingleDropDown
										id={`participant`}
										name={`participant`}
										label={<L p={p} t={`Participants`}/>}
										value={participant}
										options={participants}
										className={styles.moreBottomMargin}
										height={`medium`}
										onChange={(event) => {this.changeItem(event); updatePersonConfig(personId, 'DiscussionParticipant', event.target.value);}}/>
						</div>
						<hr/>
						<div className={(styles.scrollableTable, styles.minWidth)}>
								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true} isFetchingRecord={fetchingRecord.discusionEntry}/>
						</div>
						<hr/>
						{/*<Loading loadingText={`Loading`} isLoading={fetchingRecord && fetchingRecord.discussionEntries} />*/}
						{fetchingRecord && !fetchingRecord.discussionEntries && discussion.discussionEntries && discussion.discussionEntries.length === 0 &&
								<div className={styles.noRecord}><L p={p} t={`No discussions found`}/></div>
						}
						<div className={styles.scrollableEntries} id={'mainScroll'}>
								{discussion.discussionEntries && discussion.discussionEntries.length > 0
										&& discussion.discussionEntries.filter(m => m.discussionEntryId === discussionEntryId).map((m, i) => {
											let blobUrl;
											// if (m.voiceRecording) {
											// 		const blob = this.b64toBlob(m.voiceRecording);
											// 		blobUrl = URL.createObjectURL(blob);
											// }
		                    return (
		                      <div key={i}>
		                          <div className={styles.moreLeft}>
																	<div className={classes(styles.row, styles.subject)}>{`Subject: `}<div className={styles.subjectText}>{m.subject}</div></div>
																	<div className={styles.rowWrap}>
																			<TextDisplay label={<L p={p} t={`Entered by`}/>} text={m.entryPersonFirstName + ' ' + m.entryPersonLastName} textClassName={styles.lighter} className={participant === m.personId ? styles.highlight : ''}/>
																			<TextDisplay label={<L p={p} t={`Entered on`}/>} text={<div className={styles.row}><DateMoment date={m.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>}  textClassName={styles.lighter}/>
						                          {m.assignmentId &&
																					<TextDisplay label={<L p={p} t={`Assignment`}/>} textClassName={styles.lighter}
																							text={(m.discussionMinPost && (m.discussionMinPost === 1 ? `${m.discussionMinPost} direct post; ` : `${m.discussionMinPost} direct posts; `))
																									+ (m.discussionMinComment && (m.discussionMinComment === 1 ? `${m.discussionMinComment} comment; ` : `${m.discussionMinComment} comments; `))
																									+ (m.discussionWordCount && (m.discussionWordCount === 1 ? `${m.discussionWordCount} minimum word; ` : `${m.discussionWordCount} minimum words. `))} />
																			}
																	</div>
																	<div className={styles.comment}>{m.comment}</div>
																	<div className={classes(styles.moreLeft, styles.rowWrap, styles.moreTop)}>
																			{discussion.fileUploads && discussion.fileUploads.length > 0 && discussion.fileUploads.filter(f => f.discussionEntryId === m.discussionEntryId).length > 0 &&
																					<div>
																							<span className={styles.label}>{<L p={p} t={`File Attachment`}/>}</span>
																							{discussion.fileUploads.filter(f => f.discussionEntryId === m.discussionEntryId).map((f, i) =>
																									<LinkDisplay key={i} linkText={f.name} url={f.url} fileUploadId={f.discussionEntryId}
																											isOwner={true} deleteFunction={() => this.handleRemoveFileUploadOpen(f.discussionFileUploadId)}/>
																							)}
																					</div>
																			}
																			{discussion.websiteLinks && discussion.websiteLinks.length > 0 && discussion.websiteLinks.filter(w => w.discussionEntryId === m.discussionEntryId).length > 0 &&
																					<div>
																							<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
					                            				{discussion.websiteLinks.filter(w => w.discussionEntryId === m.discussionEntryId).map((w, i) =>
									                                <LinkDisplay key={i} linkText={w.url} url={w.url} isWebsiteLink={true}
																											isOwner={true} deleteFunction={() => this.handleRemoveWebsiteLinkOpen(w.discussionWebsiteLinkId)} />
					                            				)}
																					</div>
																			}
																	</div>
		                          </div>
														  {false && blobUrl &&
															  <div>
															  	  <audio src={blobUrl} preload={'auto'} controls><L p={p} t={`This browser does not support this audio file.`}/></audio>
															  </div>
														  }
		                          {m.personId === personId && m.discussionEntryId && m.discussionEntryId !== guidEmpty &&
																	<div className={classes(styles.row, styles.linkRow)}>
				                              <a onClick={() => this.handleRemoveEntryOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`remove`}/></a> |
				                              <a onClick={() => this.handleAddOrUpdateEntryOpen(m, m.personId, false, true)} className={styles.link}><L p={p} t={`edit`}/></a> |
				                              <a onClick={() => this.handleFileUploadOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`add file`}/></a> |
				                              <a onClick={() => this.handleWebsiteLinkOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`add link`}/></a>
				                          </div>
															}
															{m.discussionEntryId && m.discussionEntryId !== guidEmpty &&
																	<div className={styles.row}>
																			<a onClick={() => this.handleAddOrUpdateEntryOpen(m, m.personId, true)} className={classes(styles.row, styles.addNew)}>
													                <Icon pathName={'reply_all'} className={styles.icon}/>
													                <span className={styles.addAnother}><L p={p} t={`Add your own reply`}/></span>
													            </a>
																			{m.personId !== personId && (accessRoles.facilitator || accessRoles.admin) &&
																					<a onClick={() => this.handleRemoveByAdminOpen(m.discussionEntryId, m.personId)} className={classes(styles.row, styles.addNew)}>
															                <Icon pathName={'cross_circle'} className={styles.icon} fillColor={'#fa1113'}/>
															                <span className={styles.addAnother}><L p={p} t={`Remove (by admin)`}/></span>
															            </a>
																			}
																	</div>
															}
															<hr/>
															<ReplyToDiscussionEntry participant={participant} personId={personId} blobUrl={blobUrl} discussionEntryId={m.discussionEntryId}
																	replies={discussion.discussionEntries} discussion={discussion} addOrUpdateEntryOpen={this.handleAddOrUpdateEntryOpen} accessRoles={accessRoles}
																	removeFileUploadOpen={this.handleRemoveFileUploadOpen} removeWebsiteLinkOpen={this.handleRemoveWebsiteLinkOpen}
																	removeEntryOpen={this.handleRemoveEntryOpen} fileUploadOpen={this.handleFileUploadOpen}
																	websiteLinkOpen={this.handleWebsiteLinkOpen} removeByAdminOpen={this.handleRemoveByAdminOpen} />
		                          <hr />
		                      </div>
		                  )
		            })}
								<div style={{ float:"left", clear: "both" }}
				             ref={(el) => { this.messagesEnd = el; }}>
				        </div>
						</div>
            {isShowingModal_addOrUpdate &&
							<DiscussionEntryModal handleClose={this.handleAddOrUpdateEntryClose} showTitle={true} handleSubmit={this.handleAddOrUpdateEntrySave}
									discussionEntry={isEdit ? discussionEntry : isReply ? replyToDiscussionEntry : discussionEntry} personId={personId}
									courseEntryId={courseEntryId} discussionEntryId={discussionEntryId} discussionEntriesInit={discussionEntriesInit}
									companyConfig={companyConfig} courseName={course.courseName} isReply={isReply} isEdit={isEdit}/>
            }
						{/*(accessRoles.facilitator || accessRoles.learner) &&
								<a onClick={() => this.handleAddOrUpdateEntryOpen('', personId)} className={classes(styles.row, styles.addNew)}>
										<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
										<span className={styles.addAnother}>{'Add another subject entry'}</span>
								</a>
						*/}
            {isShowingModal_removeEntry &&
                <MessageModal handleClose={this.handleRemoveEntryClose} heading={<L p={p} t={`Remove this entry?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this entry for this discussion?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveEntry} />
            }

						{isShowingModal_removeByAdmin &&
								<TextareaModal key={'all'} handleClose={this.handleRemoveByAdminClose} heading={<L p={p} t={`Remove Discussion Entry`}/>} explainJSX={<L p={p} t={`Remove this comment with an explanation. The student will be notified.`}/>}
									 onClick={this.handleRemoveByAdminSave} placeholder={``}/>
            }
            {isShowingModal_removeWebsiteLink &&
                <MessageModal handleClose={this.handleRemoveWebsiteLinkClose} heading={<L p={p} t={`Remove this website link?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this website link?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveWebsiteLink} />
            }
            {isShowingModal_removeFileUpload &&
                <MessageModal handleClose={this.handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file upload?`}/>}
                   explainJSX={<L p={p} t={`Are you sure you want to delete this file upload?`}/>} isConfirmType={true}
                   onClick={this.handleRemoveFileUpload} />
            }
            {isShowingFileUpload &&
                <FileUploadModal handleClose={this.handleFileUploadClose} title={<L p={p} t={`Discussion Entry File Upload`}/>} label={<L p={p} t={`File for`}/>}
                    personId={personId} submitFileUpload={this.handleSubmitFile} sendInBuildUrl={this.fileUploadBuildUrl}
                    handleRecordRecall={() => {}} showTitleEntry={true} skipRecordRecall={true}
                    acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                    iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
            }
            {isShowingVoiceRecording &&
                <VoiceRecordingModal handleClose={this.handleVoiceRecordingClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
                    personId={personId} discussionEntryId={discussionEntryId} submitVoiceRecording={this.handleSubmitVoiceRecording}
										handleRecordRecall={this.recallAfterVoiceRecording}/>
            }
            {isShowingModal_websiteLink &&
                <TextareaModal key={'all'} handleClose={this.handleWebsiteLinkClose} heading={<L p={p} t={`Website Link`}/>} explainJSX={<L p={p} t={`Choose a website link for an assessment question.`}/>}
                   onClick={this.handleWebsiteLinkSave} placeholder={`Website URL?`}/>
            }
						{isShowingModal_students &&
								<StudentListModal handleClose={this.handleStudentListClose} course={course} students={students} studentList={studentList}
										discussionEntry={true} courseScheduledId={course.courseScheduledId}/>
						}
            <OneFJefFooter />
        </div>
    )}
};

//							  						<a onClick={() => this.handleVoiceRecordingOpen(m.discussionEntryId)} className={styles.link}>add voice</a> |
