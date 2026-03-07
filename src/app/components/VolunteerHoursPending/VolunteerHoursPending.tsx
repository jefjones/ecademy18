import { useState } from 'react';  //PropTypes
import { useNavigate } from 'react-router-dom'
import styles from './VolunteerHoursPending.css'
import EditTable from '../EditTable'
import DateMoment from '../DateMoment'
import MessageModal from '../MessageModal'
import Icon from '../Icon'
import {doSort} from '../../utils/sort'
const p = 'component'
import L from '../../components/PageLanguage'

//If there is only one student, then the studentSchedule will be sent in and print it below the one student.
function VolunteerHoursPending(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_delete, setIsShowingModal_delete] = useState(false)
  const [volunteerEventId, setVolunteerEventId] = useState('')

  const {personId, volunteerEvents, isFetchingRecord} = props
          
  
  				let localVolunteer = volunteerEvents && volunteerEvents.length > 0 && volunteerEvents.filter(m => m.volunteerPersonId === personId && (!m.confirmCheckIn || !m.checkOut))
  				localVolunteer = doSort(localVolunteer, { sortField: 'checkIn', isAsc: true, isNumber: false })
  
  				let headings = [{},
  						{label: <L p={p} t={`Event type`}/>, tightText: true},
  						{label: <L p={p} t={`Check-in`}/>, tightText: true},
  						{label: <L p={p} t={`Confirmed Check-in`}/>, tightText: true},
  						{label: <L p={p} t={`Volunteer note`}/>, tightText: true},
  						{label: <L p={p} t={`Admin name`}/>, tightText: true},
  						{label: <L p={p} t={`Admin Note`}/>, tightText: true},
  						{label: <L p={p} t={`Check in date`}/>, tightText: true},
  				]
  
  				let data = localVolunteer && localVolunteer.length > 0 && localVolunteer.map(m => ([
  						{value: <a onClick={() => handleDeleteOpen(m.volunteerEventId)}><Icon pathName={'trash2'} premium={true}/></a>},
  						{value: m.volunteerTypeName, clickFunction: () => send(m.volunteerEventId)},
  						{value: <DateMoment date={m.checkIn} minusHours={6}/>, clickFunction: () => send(m.volunteerEventId)},
  						{value: <DateMoment date={m.confirmCheckIn} minusHours={6}/>, clickFunction: () => send(m.volunteerEventId)},
  						{value: m.volunteerNote, clickFunction: () => send(m.volunteerEventId)},
  						{value: m.checkInAdminName, clickFunction: () => send(m.volunteerEventId)},
  						{value: m.checkInAdminNote, clickFunction: () => send(m.volunteerEventId)},
  						{value: <i>No check out time</i>}
  				]))
  
          return !localVolunteer || localVolunteer.length === 0
  						? null
  	          : <div className={styles.container}>
  									<div className={styles.headerLabel}>{`Incomplete volunteer hours`}</div>
  									<EditTable labelClass={styles.tableLabelClass} headings={headings} data={data} isFetchingRecord={isFetchingRecord}/>
  									{isShowingModal_delete &&
  											<MessageModal handleClose={handleDeleteClose} heading={<L p={p} t={`Remove this volunteer record?`}/>}
  												 explainJSX={<L p={p} t={`Are you sure you want to remove this volunteer record?`}/>} isConfirmType={true}
  												 onClick={handleDelete} />
  									}
  	            </div>
}

export default VolunteerHoursPending
