import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './MessagesAndRemindersView.css'
const p = 'MessagesAndRemindersView'
import L from '../../components/PageLanguage'
import AnnouncementList from '../../components/AnnouncementList'
import Icon from '../../components/Icon'
import InputText from '../../components/InputText'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function MessagesAndRemindersView(props) {
  const [typeAnnouncementList, setTypeAnnouncementList] = useState('recipient')
  const [chosenTab, setChosenTab] = useState('inbox')
  const [messageSearch, setMessageSearch] = useState('')
  const [countsTimerId, setCountsTimerId] = useState(setInterval(() => getCountsMessages(personId), 30000))
  const [senderTimerId, setSenderTimerId] = useState(setInterval(() => getAnnouncementsSentBy(personId), 5000))
  const [recipientTimerId, setRecipientTimerId] = useState(null)
  const [discardedTimerId, setDiscardedTimerId] = useState(null)

  useEffect(() => {
    
    				const {personId, getCountsMessages} = props
    				getAnnouncements()
    				setCountsTimerId(setInterval(() => getCountsMessages(personId), 30000))
    		
    return () => {
      
      				clearInterval(recipientTimerId)
      				clearInterval(senderTimerId)
      				clearInterval(discardedTimerId)
      				clearInterval(countsTimerId)
      		
    }
  }, [])

  const {personId, setAsSeenByRecipient, announcementList, announcementsSentBy, announcementsDeleted, removeAnnouncement, setStudentsSelected,
  					 			companyConfig={}, counts, getMessageSingleFullThread, messageFullThread, myFrequentPlaces, setMyFrequentPlace, fetchingRecord} = props
           
  
  				let showList = typeAnnouncementList === 'sentBy'
  						? announcementsSentBy
  						: typeAnnouncementList === 'deleted'
  								? announcementsDeleted
  								: announcementList
  
          return (
              <div className={styles.container}>
  								<div className={styles.classification}>Messages and Reminders</div>
  								<div>
  										<div className={styles.row}>
  												<div onClick={getAnnouncements} className={classes(styles.tabs, (chosenTab === 'inbox' && styles.tabChoice))}>
  														<Icon pathName={'inbox0'} premium={true} fillColor={chosenTab === 'inbox' ? '' : 'white'}/>
  														<div className={classes(styles.row, (chosenTab === 'inbox' ? '' : styles.whiteText))}>
  																<L p={p} t={`INBOX`}/>
  																<div className={chosenTab === 'inbox' ? styles.count : styles.whiteCount}>{counts.recipient}</div>
  														</div>
  												</div>
  												<div onClick={getSentBy}  className={classes(styles.tabs, (chosenTab === 'sent' && styles.tabChoice))}>
  														<Icon pathName={'sent'} premium={true} fillColor={chosenTab === 'sent' ? '' : 'white'}/>
  														<div className={classes(styles.row, (chosenTab === 'sent' ? '' : styles.whiteText))}>
  																<L p={p} t={`SENT`}/>
  																<div className={chosenTab === 'sent' ? styles.count : styles.whiteCount}>{counts.sender}</div>
  														</div>
  												</div>
  												<div onClick={getDeletedAnnouncements}  className={classes(styles.tabs, (chosenTab === 'deleted' && styles.tabChoice))}>
  														<Icon pathName={'trash2'} premium={true} fillColor={chosenTab === 'deleted' ? '' : 'white'} />
  														<div className={classes(styles.row, (chosenTab === 'deleted' ? '' : styles.whiteText))}>
  																<L p={p} t={`DISCARDED`}/>
  																<div className={chosenTab === 'deleted' ? styles.count : styles.whiteCount}>{counts.discarded}</div>
  														</div>
  												</div>
  										</div>
  										<div className={styles.row}>
  												<Link to={`/announcementEdit`} className={classes(styles.row, styles.menuItem, styles.link, styles.moreWidith)}>
  														<Icon pathName={'pencil0'} premium={true} className={styles.iconRight}/>
  														<L p={p} t={`Compose`}/>
  												</Link>
  												<div>
  														<Icon pathName={'magnifier'} premium={true} className={styles.iconRight}/>
  												</div>
  												<InputText
  														id={`messageSearch`}
  														name={`messageSearch`}
  														size={"short"}
  														label={''}
  														value={messageSearch || ''}
  														onChange={changeMessageSearch}/>
  										</div>
  										<div className={styles.scrollable}>
  												<AnnouncementList companyConfig={companyConfig} mainmenuVersion={true} setAsSeenByRecipient={setAsSeenByRecipient}
  														announcementList={showList} announcementsSentBy={announcementsSentBy} listType={typeAnnouncementList} messageSearch={messageSearch}
  														removeAnnouncement={removeAnnouncement} personId={personId} setStudentsSelected={setStudentsSelected}
  														isFetchingRecord={fetchingRecord.announcementList} getMessageSingleFullThread={getMessageSingleFullThread}
  														messageFullThread={messageFullThread}/>
  										</div>
  								</div>
  								<div className={styles.fullWidth}>
  										<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Messages and Reminders`}/>} path={'messagesAndReminders'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  								</div>
  								<OneFJefFooter />
              </div>
          )
}
export default MessagesAndRemindersView
