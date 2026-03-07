import { useEffect, useState } from 'react'
import * as styles from './CarpoolView.css'
const p = 'CarpoolView'
import L from '../../components/PageLanguage'
import CarpoolRequests from '../../components/CarpoolRequests'
import CarpoolsMine from '../../components/CarpoolsMine'
import CarpoolDailySchedule from '../../components/CarpoolDailySchedule'
import Icon from '../../components/Icon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'

function CarpoolView(props) {
  const [chosenEvent, setChosenEvent] = useState({})
  const [chosenTab, setChosenTab] = useState('')
  const [messageSearch, setMessageSearch] = useState('')
  const [timerId, setTimerId] = useState(setInterval(() => carpoolInit(personId), 60000))
  const [expandAddNewCarpool, setExpandAddNewCarpool] = useState(forceClose ? 'closed' : !this.state.expandAddNewCarpool)

  useEffect(() => {
    
    				const {personId, carpoolInit} = props
    				setTimerId(setInterval(() => carpoolInit(personId), 60000))
    		
    return () => {
      
      				clearInterval(timerId)
      		
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    				const {carpool} = props
    				
    				if (!chosenTab && carpool && carpool.myCarpools && carpool.myCarpools.length > 0)
    						setChosenTab('dailySchedule')
    		
  }, [])

  const {personId, carpool, companyConfig={}, addOrUpdateCarpoolRequest, daysOfWeek, removeCarpoolRequest, addOrUpdateCarpoolSearchFilter,
  								removeCarpool, addOrUpdateCarpool, setStudentsSelected, messageFullThread, getMessageSingleFullThread, removeCarpoolRequestResponse,
  								addCarpoolRequestResponse, setCarpoolMember, setMemberStudentsInCarpool, updateCarpoolDate, setCarpoolDateStudent, setCarpoolDateInCarPickUp,
  								arrivalOptions, arrivalMinuteOptions, setArrivalNotice, setCarpoolTimeStudentAssign, setCarpoolTimeStudentAssignDayChange, acceptDirectRequest,
  								addDirectRequest, declineDirectRequest, removeDirectRequest, daysOfWeekAll, toggleStudentIncluded, toggleCarpoolRequestDirectCanDoDay,
  								setDriverTimeDate, toggleCarpoolRequestFinalCanDoDay, myFrequentPlaces, setMyFrequentPlace, fetchingRecord} = props
          
  
  				let carpoolRequests = Number((carpool.carpoolRequests && carpool.carpoolRequests.length) || 0) + Number((carpool.carpoolRequestsDirect && carpool.carpoolRequestsDirect.length) || 0)
  
          return (
              <div className={styles.container}>
                  <div className={styles.rowWrap}>
      								<div className={styles.classification}>Carpool</div>
      								<div className={styles.row}>
      										{carpool && carpool.myCarpools && carpool.myCarpools.length > 0 &&
      											 	<div onClick={() => changeTab('dailySchedule')}  className={classes(styles.tabs, (chosenTab === 'dailySchedule' && styles.tabChoice))}>
      														<Icon pathName={'calendar_check'} premium={true} fillColor={chosenTab === 'dailySchedule' ? '' : 'white'}/>
      														<div className={classes(styles.row, (chosenTab === 'dailySchedule' ? '' : styles.whiteText))}>
      																<L p={p} t={`DAILY SCHEDULE`}/>
      														</div>
      												</div>
      										}
      										<div onClick={() => changeTab('myCarpools')} className={classes(styles.tabs, (chosenTab === 'myCarpools' && styles.tabChoice))}>
      												<Icon pathName={'car'} premium={true} fillColor={chosenTab === 'myCarpools' ? '' : 'white'}/>
      												<div className={classes(styles.row, (chosenTab === 'myCarpools' ? '' : styles.whiteText))}>
      														<L p={p} t={`MY CARPOOLS`}/>
      														<div className={chosenTab === 'myCarpools' ? styles.count : styles.whiteCount}>{carpool.myCarpools && carpool.myCarpools.length}</div>
      												</div>
      										</div>
      										<div onClick={() => changeTab('carpoolRequests')}
      														className={classes(styles.tabs, (chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' && styles.tabChoice))}>
      												<div className={styles.row}>
      														<Icon pathName={'car'} premium={true} fillColor={chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' ? '' : 'white'}/>
      														<div className={chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' ? styles.iconSuperRed : styles.iconSuperWhite}>?</div>
      												</div>
      												<div className={classes(styles.row, (chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' ? '' : styles.whiteText))}>
      														{`REQUESTS`}
      														<div className={chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' ? styles.count : styles.whiteCount}>{carpoolRequests}</div>
      												</div>
      										</div>
      								</div>
      								{chosenTab === 'dailySchedule' &&
      										<CarpoolDailySchedule carpool={carpool} personId={personId} companyConfig={companyConfig} updateCarpoolDate={updateCarpoolDate}
      												setCarpoolDateStudent={setCarpoolDateStudent} setCarpoolDateInCarPickUp={setCarpoolDateInCarPickUp}
      												arrivalOptions={arrivalOptions} arrivalMinuteOptions={arrivalMinuteOptions} setArrivalNotice={setArrivalNotice}
      												setCarpoolTimeStudentAssignDayChange={setCarpoolTimeStudentAssignDayChange} setDriverTimeDate={setDriverTimeDate}/>
      								}
      								{chosenTab === 'myCarpools' &&
      										<CarpoolsMine carpool={carpool} personId={personId} companyConfig={companyConfig} removeCarpool={removeCarpool}
      												addOrUpdateCarpool={addOrUpdateCarpool} setMemberStudentsInCarpool={setMemberStudentsInCarpool}
      												daysOfWeek={daysOfWeek} daysOfWeekAll={daysOfWeekAll} expanded={expandAddNewCarpool}
      												toggleOpenAddNewCarpool={toggleOpenAddNewCarpool} setCarpoolTimeStudentAssign={setCarpoolTimeStudentAssign}
      												toggleStudentIncluded={toggleStudentIncluded}/>
      								}
      								{chosenTab !== 'dailySchedule' && chosenTab !== 'myCarpools' &&
      										<CarpoolRequests carpool={carpool} personId={personId} companyConfig={companyConfig} daysOfWeek={daysOfWeek} daysOfWeekAll={daysOfWeekAll}
      												addOrUpdateCarpoolRequest={addOrUpdateCarpoolRequest} removeCarpoolRequest={removeCarpoolRequest}
      												addOrUpdateCarpoolSearchFilter={addOrUpdateCarpoolSearchFilter} setStudentsSelected={setStudentsSelected}
      												messageFullThread={messageFullThread} getMessageSingleFullThread={getMessageSingleFullThread}
      												changeTabChosen={changeTab} toggleOpenAddNewCarpool={toggleOpenAddNewCarpool}
      												addCarpoolRequestResponse={addCarpoolRequestResponse} removeCarpoolRequestResponse={removeCarpoolRequestResponse}
      												setCarpoolMember={setCarpoolMember} acceptDirectRequest={acceptDirectRequest} declineDirectRequest={declineDirectRequest}
      												removeDirectRequest={removeDirectRequest} addDirectRequest={addDirectRequest}
      												toggleCarpoolRequestDirectCanDoDay={toggleCarpoolRequestDirectCanDoDay}
      												toggleCarpoolRequestFinalCanDoDay={toggleCarpoolRequestFinalCanDoDay} isFetchingRecord={fetchingRecord.carpoolRequests}/>
      								}
                  </div>
  								<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Carpool`}/>} path={'carpool'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  								<OneFJefFooter />
              </div>
          )
}
export default CarpoolView
