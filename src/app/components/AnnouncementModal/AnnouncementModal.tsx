  //PropTypes
import { useNavigate } from 'react-router-dom'
const p = 'component'
import L from '../../components/PageLanguage'
import styles from './AnnouncementModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import TextDisplay from '../TextDisplay'
import LinkDisplay from '../LinkDisplay'
import DateMoment from '../DateMoment'
import AnnouncementReply from '../AnnouncementReply'
import Icon from '../Icon'
import classes from 'classnames'

function AnnouncementModal(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const {personId, onDelete, handleClose, setStudentsSelected, messageFullThread} = props
          return (
              <div className={styles.container}>
                  <ModalContainer onClose={handleClose} className={styles.upperDisplay}>
  	                  <ModalDialog onClose={handleClose} className={styles.upperDisplay}>
  												<div className={styles.dialogHeader}>{<L p={p} t={`Message`}/>}</div>
  		                    <div className={classes(styles.row, styles.dialogButtons)}>
  														<button className={classes(styles.row, styles.yesButton, styles.red)} onClick={() => {onDelete(messageFullThread.announcementId); handleClose();}}>
  																<Icon pathName={'cross_circle'} premium={true} className={styles.icon} fillColor={"white"}/>
  																<div className={styles.buttonText}>{<L p={p} t={`Delete`}/>}</div>
  														</button>
  														<button className={classes(styles.row, styles.yesButton)} onClick={() => {setStudentsSelected([messageFullThread.fromPersonId], messageFullThread.announcementId); navigate('/announcementEdit/reply/' + messageFullThread.announcementId + '/' + messageFullThread.fromPersonId + '/' + messageFullThread.fromPersonFirstName + '/' + messageFullThread.fromPersonLastName); handleClose();}}>
  																<Icon pathName={'reply_arrow'} premium={true} className={styles.icon} fillColor={"white"}/>
  																<div className={styles.buttonText}>{<L p={p} t={`Reply`}/>}</div>
  														</button>
  														<button className={styles.yesButton} onClick={handleClose}>{'Close'}</button>
  		                    </div>
  												<div className={styles.verticalScroll}>
  														<div className={styles.rowWrap}>
  																<TextDisplay label={<L p={p} t={`From`}/>} text={!!messageFullThread.fromPersonFirstName && messageFullThread.fromPersonFirstName + ' ' + messageFullThread.fromPersonLastName}/>
  																<TextDisplay label={<L p={p} t={`Entry date`}/>} text={<div className={styles.row}><DateMoment date={messageFullThread.entryDate} format={'D MMM  h:mm a'} minusHours={6}/></div>}/>
  																<TextDisplay label={<L p={p} t={`Subject`}/>} text={messageFullThread.subject}/>
  														</div>
  														<p className={styles.dialogExplain} dangerouslySetInnerHTML={{__html: messageFullThread.message}}/>
  														{messageFullThread && messageFullThread.attachments && messageFullThread.attachments.length > 0 && messageFullThread.attachments.map((m, i) =>
  																<LinkDisplay key={i} linkText={<L p={p} t={`Attachment #${i+1*1}`}/>} url={m.urlTemp} />
  														)}
  														<AnnouncementReply personId={personId} replies={messageFullThread.replies} />
  												</div>
  	                  </ModalDialog>
                  </ModalContainer>
              </div>
          )
}

// <button className={styles.yesButton} onClick={() => this.handleReply(fromPersonId)}>{'Reply'}</button>
export default AnnouncementModal
