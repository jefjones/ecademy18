import { useEffect, useState } from 'react'
import {apiHost} from '../../api_host'
import styles from './DiscussionEntryView.css'
const p = 'DiscussionEntryView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../../components/MessageModal'
import DiscussionEntryModal from '../../components/DiscussionEntryModal'
import TextDisplay from '../../components/TextDisplay'
import LinkDisplay from '../../components/LinkDisplay'
import VoiceRecordingModal from '../../components/VoiceRecordingModal'
import FileUploadModal from '../../components/FileUploadModal'
import DateMoment from '../../components/DateMoment'
//import Loading from '../../components/Loading';
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import TextareaModal from '../../components/TextareaModal'
import Icon from '../../components/Icon'
import EditTable from '../../components/EditTable'
import classes from 'classnames'
import OneFJefFooter from '../../components/OneFJefFooter'
import ReplyToDiscussionEntry from '../../components/ReplyToDiscussionEntry'
import StudentListModal from '../../components/StudentListModal'
import moment from 'moment'
import {guidEmpty} from '../../utils/guidValidate'

function DiscussionEntryView(props) {
  const [isShowingModal_addOrUpdate, setIsShowingModal_addOrUpdate] = useState(false)
  const [isShowingModal_removeEntry, setIsShowingModal_removeEntry] = useState(false)
  const [isShowingModal_removeByAdmin, setIsShowingModal_removeByAdmin] = useState(false)
  const [isShowingModal_removeWebsiteLink, setIsShowingModal_removeWebsiteLink] = useState(false)
  const [isShowingModal_removeFileUpload, setIsShowingModal_removeFileUpload] = useState(false)
  const [isShowingModal_students, setIsShowingModal_students] = useState(false)
  const [isShowingFileUpload, setIsShowingFileUpload] = useState(false)
  const [isShowingModal_websiteLink, setIsShowingModal_websiteLink] = useState(false)
  const [isShowingVoiceRecording, setIsShowingVoiceRecording] = useState(false)
  const [replyToDiscussionEntry, setReplyToDiscussionEntry] = useState('')
  const [isReply, setIsReply] = useState('')
  const [initialScroll, setInitialScroll] = useState(false)
  const [postsEnteredBy, setPostsEnteredBy] = useState('')
  const [postedSubject, setPostedSubject] = useState('')
  const [participant, setParticipant] = useState('')
  const [initialDiscussion, setInitialDiscussion] = useState(true)
  const [addOrUpdate_discussionEntryId, setAddOrUpdate_discussionEntryId] = useState(discussionEntry.discussionEntryId)
  const [discussionEntryId, setDiscussionEntryId] = useState(null)
  const [replyToDiscussionEntryId, setReplyToDiscussionEntryId] = useState(discussionEntry && discussionEntry.discussionEntryId)
  const [comment, setComment] = useState('')
  const [entryDate, setEntryDate] = useState(moment())
  const [timer, setTimer] = useState(null)
  const [studentPersonId, setStudentPersonId] = useState(undefined)
  const [isEdit, setIsEdit] = useState(undefined)
  const [entryPersonFirstName, setEntryPersonFirstName] = useState(undefined)
  const [entryPersonLastName, setEntryPersonLastName] = useState(undefined)
  const [personId, setPersonId] = useState(undefined)
  const [discussionEntry, setDiscussionEntry] = useState(isReply
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
									: {})
  const [courseEntryId, setCourseEntryId] = useState(undefined)
  const [remove_discussionEntryId, setRemove_discussionEntryId] = useState(undefined)

  useEffect(() => {
    return () => {
      
      			if (timer) clearInterval(timer)
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
        	const {resolveFetchingRecordDiscussionEntries, fetchingRecord, discussion, discussionEntryId} = props
    			
    			if ((!initialScroll && discussion.discussionEntries && discussion.discussionEntries.length > 0)
    						|| (discussion.discussionEntries && discussion.discussionEntries.length === 0
    									&& fetchingRecord && fetchingRecord.discussionEntries === "ready")) {
    					messagesEnd.scrollIntoView({ behavior: "smooth" })
    					setInitialScroll(true)
    					resolveFetchingRecordDiscussionEntries()
    			}
    			if (discussionEntryId && discussion && discussion.firstLevelEntries && discussion.firstLevelEntries.length > 0 && !initialDiscussion) {
    					let chosenDiscussion = discussion.firstLevelEntries.filter(m => m.discussionEntryId === discussionEntryId)[0]
    					chosenDiscussion && chosenDiscussion.assignmentId && recallDiscussion(discussionEntryId, chosenDiscussion.assignmentId)
    					setInitialDiscussion(true)
    			}
      
  }, [])

  const {discussion={}, accessRoles, course={}, discussionEntriesInit, companyConfig={}, fetchingRecord,
  						participants, entryReport, students, updatePersonConfig} = props
  		//let {, postedSubjects} = props;
      
  
  		let headings = [
  				{label: <L p={p} t={`Subject`}/>, tightText:true},
  				{label: <L p={p} t={`Date`}/>, tightText:true},
  				{label: <L p={p} t={`Name`}/>, tightText:true},
  		]
  
  		let data = entryReport && entryReport.length > 0 && entryReport.map((m, i) => {
  				return [
  						{ value: <div onClick={() => recallDiscussion(m.discussionEntryId, m.assignmentId)} className={styles.link}>{m.subject && m.subject.length > 70 ? m.subject.substring(0,70) + '...' : m.subject}</div>},
  						{ value: <div className={styles.dataLabel}>{moment(m.entryDate).format('D MMM')}</div>},
  						{ value: <div className={styles.dataLabel}>{m.personName}</div>},
  				]
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
  										onChange={(event) => {changeItem(event); updatePersonConfig(personId, 'DiscussionParticipant', event.target.value);}}/>
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
  											let blobUrl
  											// if (m.voiceRecording) {
  											// 		const blob = b64toBlob(m.voiceRecording);
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
  																											isOwner={true} deleteFunction={() => handleRemoveFileUploadOpen(f.discussionFileUploadId)}/>
  																							)}
  																					</div>
  																			}
  																			{discussion.websiteLinks && discussion.websiteLinks.length > 0 && discussion.websiteLinks.filter(w => w.discussionEntryId === m.discussionEntryId).length > 0 &&
  																					<div>
  																							<span className={styles.label}>{<L p={p} t={`Website Link`}/>}</span>
  					                            				{discussion.websiteLinks.filter(w => w.discussionEntryId === m.discussionEntryId).map((w, i) =>
  									                                <LinkDisplay key={i} linkText={w.url} url={w.url} isWebsiteLink={true}
  																											isOwner={true} deleteFunction={() => handleRemoveWebsiteLinkOpen(w.discussionWebsiteLinkId)} />
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
  				                              <a onClick={() => handleRemoveEntryOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`remove`}/></a> |
  				                              <a onClick={() => handleAddOrUpdateEntryOpen(m, m.personId, false, true)} className={styles.link}><L p={p} t={`edit`}/></a> |
  				                              <a onClick={() => handleFileUploadOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`add file`}/></a> |
  				                              <a onClick={() => handleWebsiteLinkOpen(m.discussionEntryId)} className={styles.link}><L p={p} t={`add link`}/></a>
  				                          </div>
  															}
  															{m.discussionEntryId && m.discussionEntryId !== guidEmpty &&
  																	<div className={styles.row}>
  																			<a onClick={() => handleAddOrUpdateEntryOpen(m, m.personId, true)} className={classes(styles.row, styles.addNew)}>
  													                <Icon pathName={'reply_all'} className={styles.icon}/>
  													                <span className={styles.addAnother}><L p={p} t={`Add your own reply`}/></span>
  													            </a>
  																			{m.personId !== personId && (accessRoles.facilitator || accessRoles.admin) &&
  																					<a onClick={() => handleRemoveByAdminOpen(m.discussionEntryId, m.personId)} className={classes(styles.row, styles.addNew)}>
  															                <Icon pathName={'cross_circle'} className={styles.icon} fillColor={'#fa1113'}/>
  															                <span className={styles.addAnother}><L p={p} t={`Remove (by admin)`}/></span>
  															            </a>
  																			}
  																	</div>
  															}
  															<hr/>
  															<ReplyToDiscussionEntry participant={participant} personId={personId} blobUrl={blobUrl} discussionEntryId={m.discussionEntryId}
  																	replies={discussion.discussionEntries} discussion={discussion} addOrUpdateEntryOpen={handleAddOrUpdateEntryOpen} accessRoles={accessRoles}
  																	removeFileUploadOpen={handleRemoveFileUploadOpen} removeWebsiteLinkOpen={handleRemoveWebsiteLinkOpen}
  																	removeEntryOpen={handleRemoveEntryOpen} fileUploadOpen={handleFileUploadOpen}
  																	websiteLinkOpen={handleWebsiteLinkOpen} removeByAdminOpen={handleRemoveByAdminOpen} />
  		                          <hr />
  		                      </div>
  		                  )
  		            })}
  								<div style={{ float:"left", clear: "both" }}
  				             ref={(el) => { messagesEnd = el; }}>
  				        </div>
  						</div>
              {isShowingModal_addOrUpdate &&
  							<DiscussionEntryModal handleClose={handleAddOrUpdateEntryClose} showTitle={true} handleSubmit={handleAddOrUpdateEntrySave}
  									discussionEntry={isEdit ? discussionEntry : isReply ? replyToDiscussionEntry : discussionEntry} personId={personId}
  									courseEntryId={courseEntryId} discussionEntryId={discussionEntryId} discussionEntriesInit={discussionEntriesInit}
  									companyConfig={companyConfig} courseName={course.courseName} isReply={isReply} isEdit={isEdit}/>
              }
  						{/*(accessRoles.facilitator || accessRoles.learner) &&
  								<a onClick={() => handleAddOrUpdateEntryOpen('', personId)} className={classes(styles.row, styles.addNew)}>
  										<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
  										<span className={styles.addAnother}>{'Add another subject entry'}</span>
  								</a>
  						*/}
              {isShowingModal_removeEntry &&
                  <MessageModal handleClose={handleRemoveEntryClose} heading={<L p={p} t={`Remove this entry?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this entry for this discussion?`}/>} isConfirmType={true}
                     onClick={handleRemoveEntry} />
              }
  
  						{isShowingModal_removeByAdmin &&
  								<TextareaModal key={'all'} handleClose={handleRemoveByAdminClose} heading={<L p={p} t={`Remove Discussion Entry`}/>} explainJSX={<L p={p} t={`Remove this comment with an explanation. The student will be notified.`}/>}
  									 onClick={handleRemoveByAdminSave} placeholder={``}/>
              }
              {isShowingModal_removeWebsiteLink &&
                  <MessageModal handleClose={handleRemoveWebsiteLinkClose} heading={<L p={p} t={`Remove this website link?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this website link?`}/>} isConfirmType={true}
                     onClick={handleRemoveWebsiteLink} />
              }
              {isShowingModal_removeFileUpload &&
                  <MessageModal handleClose={handleRemoveFileUploadClose} heading={<L p={p} t={`Remove this file upload?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this file upload?`}/>} isConfirmType={true}
                     onClick={handleRemoveFileUpload} />
              }
              {isShowingFileUpload &&
                  <FileUploadModal handleClose={handleFileUploadClose} title={<L p={p} t={`Discussion Entry File Upload`}/>} label={<L p={p} t={`File for`}/>}
                      personId={personId} submitFileUpload={handleSubmitFile} sendInBuildUrl={fileUploadBuildUrl}
                      handleRecordRecall={() => {}} showTitleEntry={true} skipRecordRecall={true}
                      acceptedFiles={".jpg, .jpeg, .tiff, .gif, .png, .bmp, .doc, .docx, .xls, .xlsx, .ppt, .odt, .wpd, .rtf, .txt, .dat, .pdf, .ppt, .pptx, .pptm, .m4a"}
                      iconFiletypes={['.jpg', '.jpeg', '.tiff', '.gif', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.odt', '.wpd', '.rtf', '.txt', '.dat', '.pdf', '.ppt', '.pptx', '.pptm', '.m4a']}/>
              }
              {isShowingVoiceRecording &&
                  <VoiceRecordingModal handleClose={handleVoiceRecordingClose} title={<L p={p} t={`Assessment Question`}/>} label={<L p={p} t={`File for`}/>}
                      personId={personId} discussionEntryId={discussionEntryId} submitVoiceRecording={handleSubmitVoiceRecording}
  										handleRecordRecall={recallAfterVoiceRecording}/>
              }
              {isShowingModal_websiteLink &&
                  <TextareaModal key={'all'} handleClose={handleWebsiteLinkClose} heading={<L p={p} t={`Website Link`}/>} explainJSX={<L p={p} t={`Choose a website link for an assessment question.`}/>}
                     onClick={handleWebsiteLinkSave} placeholder={`Website URL?`}/>
              }
  						{isShowingModal_students &&
  								<StudentListModal handleClose={handleStudentListClose} course={course} students={students} studentList={studentList}
  										discussionEntry={true} courseScheduledId={course.courseScheduledId}/>
  						}
              <OneFJefFooter />
          </div>
      )
}

//							  						<a onClick={() => this.handleVoiceRecordingOpen(m.discussionEntryId)} className={styles.link}>add voice</a> |
export default DiscussionEntryView
