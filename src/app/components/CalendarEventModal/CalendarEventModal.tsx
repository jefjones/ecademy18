import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './CalendarEventModal.css'
import globalStyles from '../../utils/globalStyles.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import MessageModal from '../../components/MessageModal'
import Icon from '../../components/Icon'
import DateMoment from '../../components/DateMoment'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../TextDisplay'
const p = 'component'
import L from '../../components/PageLanguage'

function CalendarEventModal(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)

  const {personId, handleClose, onClick, className, chosenEvent, events, calendarViewRange, calendarTargetDate, accessRoles,
  									doNotAddNew, doNotRemove} = props
  				
  
  		    let eventDisplay = events && events.length > 0
  						? events.filter(m => {  //eslint-disable-line
  				            if (m.start >= chosenEvent.start && m.start <= chosenEvent.start) return m
  				         })
  		      	: []
  
  		    return (
  		        <div className={classes(styles.container, className)}>
  		            <ModalContainer onClose={handleClose}>
  		                <ModalDialog onClose={handleClose}>
  		                    <div className={styles.dialogHeader}><L p={p} t={`Calendar Event`}/></div>
  		                    <br />
  												{eventDisplay && eventDisplay.length > 0 && eventDisplay.map((m,i) =>
  				                    <div key={i} className={classes(styles.row,styles.minWidth)}>
  																<a onClick={() => handleRemoveOpen(m.calendarEventId)} className={classes(styles.remove, styles.muchTop)}><L p={p} t={`remove`}/></a>
  																<TextDisplay label={<L p={p} t={`Date`}/>} text={<DateMoment date={m.fromDate} format={'D MMM YYYY'}/>} />
  																<TextDisplay label={<L p={p} t={`Time`}/>} text={<DateMoment date={m.startTime} timeOnly={true}/>} />
  																<TextDisplay label={<L p={p} t={`Type`}/>} text={m.calendarEventType} />
  																<TextDisplay label={<L p={p} t={`Event`}/>} text={m.pathLink
  																		? <Link to={`/${m.pathLink}`} className={globalStyles.link}>{m.title}</Link>
  																		: m.title}/>
  				                    </div>
  												)}
  												<hr />
  												{!doNotAddNew &&
  														<div className={styles.bottomMargin}>
  				                      <Link to={'/calendarEventAdd/' + chosenEvent.start + '/' + calendarViewRange + '/' + calendarTargetDate} className={classes(styles.text, styles.row)}>
  																<Icon pathName={'plus'} className={styles.icon} fillColor={'green'}/>
  				                        {`Add another event`}
  				                      </Link>
  				                    </div>
  												}
  		                    <div className={styles.dialogButtons}>
  														<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={onClick}/>
  		                    </div>
  		                </ModalDialog>
  		            </ModalContainer>
  								{isShowingModal_remove &&
  										<MessageModal handleClose={handleRemoveClose} heading={<L p={p} t={`Remove this Event?`}/>}
  											 explainJSX={<L p={p} t={`Are you sure you want to remove this event from your calendar?`}/>}
  											 isConfirmType={true} onClick={handleRemove} />
  								}
  		        </div>
  		    )
}
export default CalendarEventModal
