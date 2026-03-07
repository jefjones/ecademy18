import { Link } from 'react-router-dom'
import * as styles from './ScheduleModal.css'
import {ModalContainer, ModalDialog} from '../react-modal-dialog/lib/index'
import classes from 'classnames'
import tapOrClick from 'react-tap-or-click'
import EditTable from '../../components/EditTable'
import ButtonWithIcon from '../../components/ButtonWithIcon'
const p = 'component'
import L from '../../components/PageLanguage'

//I had to change the handleClose to onClick for the Close button below since the initial call to this dialog seemed to be
//  calling handleClose immediately.  The dialog didn't have a chance to come up in the first place.

export default ({personId, handleClose, onClick, className, slotInfo, events, removeCalendarEvent, calendarViewRange, calendarTargetDate,
                  companyConfig={}, accessRoles}) => {

    let eventsBySlot = events && events.length > 0 ? events.filter(m => {  //eslint-disable-line
            if (m.start >= slotInfo.slots[0] && m.start <= slotInfo.slots[1]) return m
         })
      : []

    let headings = []
    let data = []

    if (eventsBySlot.length > 0) {
        headings = [{label: ''}, {label: 'Name', tightText: true}, {label: 'Event', tightText: true}]
        data = eventsBySlot && eventsBySlot.length > 0 && eventsBySlot.map(m => {
            return ([
              {id: m.id, value: <a onClick={() => removeCalendarEvent(m.personId, m.id, m.isPersonalEvent)} className={styles.remove}>remove</a>},
              {id: m.id, value: m.personName},
              {id: m.id, value: m.title},
            ])
        })
    }

    return (
        <div className={classes(styles.container, className)}>
            <ModalContainer onClose={handleClose}>
                <ModalDialog onClose={handleClose}>
                    <div className={styles.dialogHeader}><L p={p} t={`What do you want to schedule?`}/>}</div>
                    <br />
                    <div className={styles.bottomMargin}>
                      <Link to={'/calendarEventAdd/' + slotInfo.start + '/' + calendarViewRange + '/' + calendarTargetDate} className={styles.text}>
                        <L p={p} t={`Personal time or meeting`}/>
                      </Link>
                    </div>
                    <hr />
										{accessRoles.admin &&
		                    <div className={styles.moreSpace}>
		                      <Link to={'/calendarEventAdd/admin/' + encodeURIComponent(slotInfo.start.toLocaleString())}
		                          className={styles.text}>
		                        <L p={p} t={`School event`}/>
		                      </Link>
		                    </div>
										}
										{accessRoles.facilitator &&
		                    <div className={styles.moreSpace}>
		                      <Link to={'/calendarEventAdd/course/' + encodeURIComponent(slotInfo.start.toLocaleString())}
		                          className={styles.text}>
		                        <L p={p} t={`Course event or assignment`}/>
		                      </Link>
		                    </div>
										}
                    <div className={styles.dialogButtons}>
												<ButtonWithIcon label={<L p={p} t={`Close`}/>} icon={'checkmark_circle'} onClick={onClick}/>
                    </div>
                    {eventsBySlot.length > 0 &&
                        <div>
                            <hr />
                            <EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} noCount={true}/>
                        </div>
                    }
                </ModalDialog>
            </ModalContainer>
        </div>
    )
}
