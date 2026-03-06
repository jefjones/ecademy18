
import styles from './ReplyToDiscussionEntry.css'
import TextDisplay from '../../components/TextDisplay'
import DateMoment from '../../components/DateMoment'
import LinkDisplay from '../../components/LinkDisplay'
import Icon from '../../components/Icon'
import classes from 'classnames'
const p = 'component'
import L from '../../components/PageLanguage'

function ReplyToDiscussionEntry(props) {
  const {personId, discussion, replies, discussionEntryId, participant, blobUrl, addOrUpdateEntryOpen, accessRoles, removeByAdminOpen, removeFileUploadOpen,
  								removeWebsiteLinkOpen, removeEntryOpen, fileUploadOpen, websiteLinkOpen} = props
  
  		    return !replies || replies.length === 0 ? null : (
  						<div>
  						{replies.filter(m => m.replyToDiscussionEntryId === discussionEntryId).map((reply, ri) => {
  								return (
  										<div className={styles.reply} key={ri}>
  												<div className={styles.moreLeft}>
  														<div className={styles.rowWrap}>
  																<TextDisplay label={<L p={p} t={`Entered by`}/>} text={reply.entryPersonFirstName + ' ' + reply.entryPersonLastName} textClassName={styles.lighter} className={participant === reply.personId ? styles.highlight : ''}/>
  																<TextDisplay label={<L p={p} t={`Entered on`}/>} text={<div className={styles.row}><DateMoment date={reply.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>} textClassName={styles.lighter}/>
  														</div>
  														<div className={styles.comment}>{reply.comment}</div>
  														<div className={classes(styles.moreLeft, styles.rowWrap, styles.moreTop)}>
  																{discussion.fileUploads && discussion.fileUploads.length > 0 && discussion.fileUploads.filter(f => f.discussionEntryId === reply.discussionEntryId).length > 0 &&
  																		<div>
  																				<span className={styles.label}><L p={p} t={`File Attachment`}/></span>
  																				{discussion.fileUploads.filter(f => f.discussionEntryId === reply.discussionEntryId).map((f, i) =>
  																						<LinkDisplay key={i} linkText={f.name} url={f.url} fileUploadId={f.fileUploadId}
  																								isOwner={reply.personId === personId} deleteFunction={() => removeFileUploadOpen(f.discussionFileUploadId)} />
  																				)}
  																		</div>
  																}
  																{discussion.websiteLinks && discussion.websiteLinks.length > 0 && discussion.websiteLinks.filter(w => w.discussionEntryId === reply.discussionEntryId).length > 0 &&
  																		<div>
  																				<span className={styles.label}>{'Website Link'}</span>
  																				{discussion.websiteLinks.filter(w => w.discussionEntryId === reply.discussionEntryId).map((w, i) =>
  																						<LinkDisplay key={i} linkText={w.url} url={w.url} isWebsiteLink={true}
  																								isOwner={true} deleteFunction={() => removeWebsiteLinkOpen(w.discussionWebsiteLinkId)} />
  																				)}
  																		</div>
  																}
  														</div>
  												</div>
  												<div className={styles.row}>
  														<a onClick={() => addOrUpdateEntryOpen(reply, personId, true)} className={classes(styles.row, styles.addNew)}>
  																<Icon pathName={'reply_all'} className={styles.icon}/>
  																<span className={styles.addAnother}>{<L p={p} t={`Add your own reply`}/>}</span>
  														</a>
  														{reply.personId !== personId && accessRoles && (accessRoles.facilitator || accessRoles.admin) &&
  																<a onClick={() => removeByAdminOpen(reply.discussionEntryId, reply.personId)} className={classes(styles.row, styles.addNew)}>
  																		<Icon pathName={'cross_circle'} className={styles.icon} fillColor={'#fa1113'}/>
  																		<span className={styles.addAnother}>{<L p={p} t={`Remove (by admin)`}/>}</span>
  																</a>
  														}
  												</div>
  												{false && blobUrl &&
  													<div>
  															<audio src={blobUrl} preload={'auto'} controls><L p={p} t={`This browser does not support this audio file.`}/></audio>
  													</div>
  												}
  												{reply.personId === personId &&
  														<div className={classes(styles.row, styles.linkRow)}>
  																<a onClick={() => removeEntryOpen(reply.discussionEntryId)} className={styles.link}><L p={p} t={`remove`}/></a> |
  																<a onClick={() => addOrUpdateEntryOpen(reply, reply.personId, true, true)} className={styles.link}><L p={p} t={`edit`}/></a> |
  																<a onClick={() => fileUploadOpen(reply.discussionEntryId)} className={styles.link}><L p={p} t={`add file`}/></a> |
  																<a onClick={() => websiteLinkOpen(reply.discussionEntryId)} className={styles.link}><L p={p} t={`add link`}/></a>
  														</div>
  												}
  												<hr/>
  												<ReplyToDiscussionEntry participant={participant} personId={personId} blobUrl={blobUrl}
  												 		replies={replies} discussion={discussion} discussionEntryId={reply.discussionEntryId}
  														addOrUpdateEntryOpen={addOrUpdateEntryOpen} accessRoles={accessRoles} removeByAdminOpen={removeByAdminOpen}
  														removeFileUploadOpen={removeFileUploadOpen} removeWebsiteLinkOpen={removeWebsiteLinkOpen}
  														removeEntryOpen={removeEntryOpen} fileUploadOpen={fileUploadOpen}
  														websiteLinkOpen={websiteLinkOpen} />
  										</div>
  								)
  						})}
  				</div>
  		    )
}
export default ReplyToDiscussionEntry
