import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as styles from './AnnouncementManageView.css'
const p = 'AnnouncementManageView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import EditTable from '../../components/EditTable'
import MessageModal from '../../components/MessageModal'
import AnnouncementModal from '../../components/AnnouncementModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import moment from 'moment'

function AnnouncementManageView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_message, setIsShowingModal_message] = useState(false)
  const [announcementId, setAnnouncementId] = useState('')

  const {announcements, setStudentsSelected} = props
        
  
        let headings = [{}, {}, {label: <L p={p} t={`Date`}/>}, {label: <L p={p} t={`Subject`}/>}, {label: <L p={p} t={`Message`}/>}]
        let data = announcements && announcements.length > 0
            ?  announcements.map((m, i) => {
                  return [
  										{ value: <a onClick={() => handleRemoveOpen(m.announcementId)} className={styles.remove}><L p={p} t={`remove`}/></a>},
                      { value: <a onClick={() => navigate('/announcementEdit/' + m.announcementId)} className={styles.editLink}><L p={p} t={`edit`}/></a>},
  										{ id: m.personId, value: <a onClick={() => handleMessageOpen(m.announcementId)} className={styles.link}>{moment(m.sendToDateTime).format('D MMM YYYY')}</a>},
  										{ id: m.personId, value: <a onClick={() => handleMessageOpen(m.announcementId)} className={classes(styles.link, styles.linkBold)}>{m.subject}</a>},
  										{ id: m.personId, value: <a onClick={() => handleMessageOpen(m.announcementId)} className={styles.link}>{m.message.length> 50 ? m.message.substring(0,50) + '...' : m.message}</a>},
                  ]})
            : [[{},{value: 'no messages found'}]]
  
  
  			let subject = ''
  			let message = ''
  
  			if (announcementId) {
  					let announcement = announcements && announcements.length > 0 && announcements.filter(m => m.announcementId === announcementId)[0]
  					if (announcement && announcement.announcementId) {
  							subject = announcement.subject
  							message = announcement.message
  					}
  			}
  
        return (
          <div className={styles.container}>
              <div className={styles.marginLeft}>
                  <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                    	<L p={p} t={`Manage Announcements`}/>
                  </div>
  								<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
              </div>
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this announcement?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this announcement and all of its recipients?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_message &&
                  <AnnouncementModal handleClose={handleMessageClose} onDelete={handleRemoveOpen} subject={subject} message={message}
  										announcementList={announcements} announcementId={announcementId} setStudentsSelected={setStudentsSelected}/>
              }
              <OneFJefFooter />
          </div>
      )
}

export default AnnouncementManageView
