import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import globalStyles from '../../utils/globalStyles.css'
import styles from './AdminResponsePendings.css'
import TextDisplay from '../TextDisplay'
import TextareaModal from '../TextareaModal'
import ButtonWithIcon from '../ButtonWithIcon'
import ConfirmDateAndNote from '../ConfirmDateAndNote'
import classes from 'classnames'
import { withAlert } from 'react-alert'
const p = 'component'
import L from '../../components/PageLanguage'

function AdminResponsePendings(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_safety, setIsShowingModal_safety] = useState(false)
  const [isShowingModal_curbside, setIsShowingModal_curbside] = useState(false)
  const [alertReviewType, setAlertReviewType] = useState('')
  const [safetyAlertId, setSafetyAlertId] = useState('')
  const [acknowledgedType, setAcknowledgedType] = useState(alertReviewType)
  const [curbsideCheckInOrOutId, setCurbsideCheckInOrOutId] = useState('')
  const [checkInOrOut, setCheckInOrOut] = useState('')
  const [isShowingModal_confirm, setIsShowingModal_confirm] = useState(true)
  const [volunteerEventId, setVolunteerEventId] = useState('')
  const [checkInOrOutDate, setCheckInOrOutDate] = useState('')

  const {adminResponsePendings} = props
  		
  
      return (
  				<div className={styles.container}>
  				{adminResponsePendings && adminResponsePendings.length > 0 && adminResponsePendings.map((m, i) => {
  						return (
  								<div key={i} className={classes(styles.border,
  												(m.requestType === 'SafetyAlert'
  														? styles.borderSafety
  														: m.requestType === 'CurbsideCheckInOrOut'
  																? styles.borderCurbside
  																: styles.borderVolunteer))}>
  										<div className={m.requestType==='SafetyAlert' ? styles.redBold : styles.bold}>
  												{m.requestTypeName}
  										</div>
  										<TextDisplay label={<L p={p} t={`Person`}/>} text={m.requesterName}/>
  										<TextDisplay label={<L p={p} t={`Students`}/>} text={m.studentNames && m.studentNames.join(", ")} hideIfEmpty={true} />
  										<TextDisplay label={<L p={p} t={`Note`}/>} text={m.description} hideIfEmpty={true} />
  										{m.fileUrl && <img src={m.fileUrl} alt={'snapshot'} className={styles.image}/>}
  										<div className={styles.row}>
  												<a className={styles.seeMorelink} onClick={
  														m.requestType === 'SafetyAlert'
  																? () => navigate('/safetyAdminAlerts')
  																: m.requestType === 'CurbsideCheckInOrOut'
  																		? () => navigate('/curbsideAdmin')
  																		: m.requestType === 'VolunteerCheckInOrOut'
  																				? () => navigate('/volunteerHours')
  																				: () => {}}
  												><L p={p} t={`See more...`}/></a>
  												<ButtonWithIcon label={<L p={p} t={`Approve`}/>} onClick={
  														m.requestType === 'SafetyAlert'
  																? () => handleConfirmSafetyOpen('approved', m.requestId)
  																: m.requestType === 'CurbsideCheckInOrOut'
  																		? () => handleConfirmCurbsideOpen('confirmed', m.requestId, m.checkInOrOut)
  																		: m.requestType === 'VolunteerCheckInOrOut'
  																				? () => handleConfirmVolunteerOpen(m.checkInOrOut === 'Check in' ? 'in' : 'out', m.requestId, m.entryDate)
  																				: () => {}
  														} icon={'checkmark_circle'} />
  										</div>
  								</div>
  						)})}
  
  						{isShowingModal_safety &&
  							<TextareaModal handleClose={handleConfirmSafetyClose} heading={<L p={p} t={`Confirm Alert`}/>}
  									explain={<div>
  															<div className={classes(styles.bold, styles.green)}><L p={p} t={`Approving this alert`}/></div>
  															<div><L p={p} t={`Add a note (optional)`}/></div>
  														</div>
  									}  onClick={handleConfirmSafety} />
  						}
  						{isShowingModal_curbside &&
  							<TextareaModal handleClose={handleConfirmCurbsideClose} heading={checkInOrOut === 'checkin' ? <L p={p} t={`Curbside Check-In Comment`}/> : <L p={p} t={`Curbside Check-Out Comment`}/>}
  									explain={<div>
  															<div className={classes(styles.bold, styles.green)}><L p={p} t={`Student arrival is confirmed`}/></div>
  															<div><L p={p} t={`Add a comment that the parent will see (optional)`}/></div>
  														</div>
  									}  onClick={handleConfirmCurbside} />
  						}
  						{isShowingModal_confirm &&
  								<ConfirmDateAndNote handleClose={handleConfirmVolunteerClose} heading={checkInOrOut === 'in' ? <L p={p} t={`Confirm Volunteer Check-in`}/> : <L p={p} t={`Confirm Volunteer Check-out`}/>}
  										onClick={handleConfirmVolunteer} date={checkInOrOutDate}/>
  						}
  				</div>
      )
}

export default withAlert(AdminResponsePendings)
