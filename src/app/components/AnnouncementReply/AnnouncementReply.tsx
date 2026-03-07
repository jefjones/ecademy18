import { useState } from 'react'
const p = 'component'
import L from '../../components/PageLanguage'
import * as styles from './AnnouncementReply.css'
import DateMoment from '../DateMoment'
import TextDisplay from '../TextDisplay'
import MessageModal from '../MessageModal'
import LinkDisplay from '../LinkDisplay'
import AnnouncementReplyReflexive from '../AnnouncementReply'
import classes from 'classnames'

function AnnouncementReply(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)

  const {personId, replies=[]} = props
  			
  
        return (
  					<div className={styles.container}>
  							{replies && replies.length > 0 && replies.map((r, i) =>
  									<div key={i}>
  											<div className={styles.rowWrap}>
  													<TextDisplay label={<L p={p} t={`Reply by`}/>} text={r.fromPersonFirstName + ' ' + r.fromPersonLastName} textClassName={styles.lighter}/>
  													<TextDisplay label={<L p={p} t={`Replied on`}/>} text={<div className={styles.row}><DateMoment date={r.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>} textClassName={styles.lighter}/>
  											</div>
  											<div className={styles.comment}>{r.message}</div>
                        {r.attachments && r.attachments.length > 0 && r.attachments.map((a, index) =>
                            <LinkDisplay key={index} linkText={<L p={p} t={`Attachment #${i+1*1}`}/>} url={a.urlTemp} />
                        )}
  											<div className={classes(styles.moreLeft, styles.rowWrap, styles.moreTop)}>
  													{/*r.fileUploads.length > 0 &&
  															<div>
  																	<span className={styles.label}>{'File Attachment'}</span>
  																	{r.fileUploads.map((f, i) =>
  																			<LinkDisplay key={i} linkText={f.name} url={f.url} fileUploadId={f.fileUploadId}
  																					isOwner={r.personId === personId} deleteFunction={handleRemoveFileUploadOpen }
  																					deleteId={r.discussionEntryId}/>
  																	)}
  															</div>
  													*/}
  													{/*r.websiteLinks.length > 0 &&
  															<div className={styles.muchMoreLeft}>
  																	<span className={styles.label}>{'Website Link'}</span>
  																	{r.websiteLinks.map((w, i) =>
  																			<LinkDisplay key={i} linkText={w} isWebsiteLink={true}
  																					isOwner={r.personId === personId} deleteFunction={handleRemoveWebsiteLinkOpen }
  																					deleteId={r.discussionEntryId}/>
  																	)}
  															</div>
  													*/}
  											</div>
  											{/*false && blobUrl &&
  												<div>
  														<audio src={blobUrl} preload={'auto'} controls>This browser does not support this audio file.</audio>
  												</div>
  											*/}
  											{r.personId === personId &&
  													<div className={classes(styles.row, styles.linkRow)}>
  															<a onClick={() => handleRemoveEntryOpen(r.discussionEntryId)} className={styles.link}><L p={p} t={`remove`}/></a> |
  															<a onClick={() => handleAddOrUpdateEntryOpen(r.discussionEntryId)} className={styles.link}><L p={p} t={`edit`}/></a> |
  
  															<a onClick={() => handleFileUploadOpen(r.discussionEntryId)} className={styles.link}><L p={p} t={`add file`}/></a> |
  															<a onClick={() => handleWebsiteLinkOpen(r.discussionEntryId)} className={styles.link}><L p={p} t={`add link`}/></a>
  													</div>
  											}
  											<AnnouncementReplyReflexive personId={personId} replies={r.replies} />
  									</div>
  							)}
  							{isShowingModal_remove &&
  									<MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this announcement?`}/>}
  										 explainJSX={<L p={p} t={`Are you sure you want to remove this announcement?`}/>} isConfirmType={true}
  										 onClick={handleRemove} />
  							}
  					</div>
      )
}
export default AnnouncementReply
