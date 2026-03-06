import { useEffect, useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './CurbsideAdminCheckInOrOutView.css'
import RadioGroup from '../../components/RadioGroup'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import Button from '../../components/Button'
import DateMoment from '../../components/DateMoment'
import TextareaModal from '../../components/TextareaModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import InputDataList from '../../components/InputDataList'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

let recordCount = 0
//1. The parent/guardian enters a check-in or a check-out entry from the curbside. (CurbsideCheckInOrOutView)
//2. The entry is received by the office (CurbsideAdminCheckInOrOutView).
//		  a. The admin can confirm that they see the student enter or they can mark that they did not ever see the student enter.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function CurbsideAdminCheckInOrOutView(props) {
  const [checkInOrOut, setCheckInOrOut] = useState('all')
  const [guardianPersonId, setGuardianPersonId] = useState('')
  const [studentPersonId, setStudentPersonId] = useState('')
  const [timerId, setTimerId] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(true)
  const [acknowledgedType, setAcknowledgedType] = useState('')
  const [curbsideCheckInOrOutId, setCurbsideCheckInOrOutId] = useState('')
  const [showSearchControls, setShowSearchControls] = useState(!this.state.showSearchControls)

  useEffect(() => {
    return () => {
      
      			if (timerId) {
      					clearInterval(timerId)
      					setTimerId('')
      			}
      	
    }
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {personId, getCheckInOrOuts, checkInOrOuts} = props
    			
    			if (!timerId) setTimerId(setInterval(() => getCheckInOrOuts(personId), 10000))
    			if (recordCount < checkInOrOuts.length) {
    					recordCount = checkInOrOuts.length
    					makeSound()
    			}
    	
  }, [])

  const {personId, myFrequentPlaces, setMyFrequentPlace, checkInOrOuts, students, guardians, accessRoles, fetchingRecord} = props
  		
  		let localCheckInOrOuts = checkInOrOuts
  		let headings = [{},
  				{label: <L p={p} t={`Date/time`}/>},
  				{label: <L p={p} t={`Check In or Out`}/>, tightText: true},
  				{label: <L p={p} t={`Parent/guardian`}/>, tightText: true},
  				{label: <L p={p} t={`Student`}/>, tightText: true},
  				{label: <L p={p} t={`Admin date/time`}/>, tightText: true},
  				{label: <L p={p} t={`Picture`}/>, tightText: true},
  				{label: <L p={p} t={`Reason`}/>, tightText: true},
  				{label: <L p={p} t={`Admin name`}/>, tightText: true},
  				{label: <L p={p} t={`Parent/guardian comment`}/>, tightText: true},
  				{label: <L p={p} t={`Admin comment`}/>, tightText: true}
  		]
      let data = []
  
      if (localCheckInOrOuts && localCheckInOrOuts.length > 0) {
  				if (guardianPersonId || studentPersonId ||  checkInOrOut !== 'all') {
  						if (guardianPersonId && guardianPersonId != 0) localCheckInOrOuts = localCheckInOrOuts.filter(m => m.parentPersonId === guardianPersonId); //eslint-disable-line
  						if (studentPersonId && studentPersonId != 0) localCheckInOrOuts = localCheckInOrOuts.filter(m => m.studentPersonIds.indexOf(studentPersonId) > -1); //eslint-disable-line
  						if (checkInOrOut && checkInOrOut !== 'all') localCheckInOrOuts = localCheckInOrOuts.filter(m => m.checkInOrOut === checkInOrOut)
  				}
          data = localCheckInOrOuts.map(m => [
                {value: m.acknowledgedType
  									? m.acknowledgedType === 'confirmed'
  											? <div data-rh={'Student arrival confirmed'}>
  														<Icon pathName={'clipboard_check'} premium={true} className={globalStyles.icon} />
  												</div>
  											: <div data-rh={'Student could not be confirmed as present'}>
  														<Icon pathName={'cross'} premium={false} fillColor={'maroon'} className={globalStyles.icon} />
  												</div>
  									: <div className={styles.row}>
  												<div onClick={() => handleConfirmCurbsideOpen('notConfirmed', m.curbsideCheckInOrOutId, m.checkInOrOut)} data-rh={'Unable to confirm arrival of student'} className={styles.row}>
  														<Icon pathName={'user_minus0'} premium={true}  fillColor={'maroon'} className={globalStyles.iconMedium} />
  														<div className={styles.iconRed}>?</div>
  												</div>
  										</div>
  							},
  							{value: <DateMoment date={m.entryDate} />},
  							{value: m.checkInOrOut === 'checkin' ? <L p={p} t={`Check In`}/> : <L p={p} t={`Check Out`}/>},
  							{value: m.parentName},
  							{value: m.studentNames && m.studentNames.length > 0 && m.studentNames.join(', ')},
  							{value: accessRoles.admin
  											? m.acknowledgedDate
  													? <DateMoment date={m.acknowledgedDate} includeTime={true} minusHours={6}/>
  													: <Button label={'Confirm...'} onClick={() => handleConfirmCurbsideOpen('confirmed', m.curbsideCheckInOrOutId, m.checkInOrOut)} addClassName={styles.notSoHigh}/>
  											: m.acknowledgedDate
  							},
  							{value: <a onClick={() => handleImageViewerOpen(m.fileUrl)} className={globalStyles.link}>{m.fileUrl ? <L p={p} t={`picture`}/> : ''}</a>},
  							{value: m.reasonTypeName && m.reasonOther ? m.reasonTypeName + ' - ' + m.reasonOther : m.reasonTypeName || m.reasonOther},
  							{value: m.adminName},
  							{value: m.parentComment},
                {value: m.adminComment},
            ]
          )
      }
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								<L p={p} t={`Curbside Check-In or Check-Out`}/>
  						</div>
  						<div className={styles.row}>
  								<a onClick={toggleSearch} className={classes(styles.row, globalStyles.link)}>
  										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  										{showSearchControls ? <L p={p} t={`Hide search controls`}/> : <L p={p} t={`Show search controls`}/>}
  								</a>
  								{showSearchControls && <a onClick={clearFilters} className={classes(styles.muchRight, globalStyles.link)}><L p={p} t={`Clear filters`}/></a>}
  						</div>
  						{showSearchControls &&
  								<div>
  										<div>
  											<InputDataList
  													name={`guardianPerson`}
  													label={<L p={p} t={`Parent/guardian`}/>}
  													options={guardians}
  													value={guardianPerson}
  													height={`medium`}
  													className={styles.moreBottomMargin}
  													onChange={(choice) => handleChangeInputDataList("guardianPerson", choice)}/>
  										</div>
  										<div>
  												<InputDataList
  														name={`studentPerson`}
  														label={<L p={p} t={`Student`}/>}
  														options={students}
  														value={studentPerson}
  														height={`medium`}
  														className={styles.moreBottomMargin}
  														onChange={(choice) => handleChangeInputDataList("studentPerson", choice)}/>
  										</div>
  										<div className={styles.groupPosition}>
  												<RadioGroup
  														title={<L p={p} t={`Check In or Out`}/>}
  														name={'checkInOrOut'}
  														data={[{id: 'all', label: <L p={p} t={`All`}/>}, {id: 'checkin', label: <L p={p} t={`Check In`}/>}, {id: 'checkout', label: <L p={p} t={`Check Out`}/>}]}
  														horizontal={true}
  														className={styles.moreTop}
  														initialValue={checkInOrOut}
  														onClick={handleCheckInOrOut}/>
  										</div>
  								</div>
  						}
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.curbsideAdminCheckin}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Curbside Check-in or Check-out (Admin)`}/>} path={'curbsideAdmin'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						<OneFJefFooter />
  						{isShowingModal_comment &&
  							<TextareaModal handleClose={handleConfirmCurbsideClose} heading={checkInOrOut === 'checkin' ? <L p={p} t={`Curbside Check-In Comment`}/> : <L p={p} t={`Curbside Check-Out Comment`}/>}
  									explain={<div>
  															<div className={classes(styles.bold, (acknowledgedType ? styles.green : styles.red))}>{acknowledgedType ? <L p={p} t={`Student arrival is confirmed`}/> : <L p={p} t={`Student arrival CANNOT be confirmed`}/>}</div>
  															<div><L p={p} t={`Add a comment that the parent will see`}/></div>
  														</div>
  									}  onClick={handleConfirmCurbside} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
        	</div>
      )
}

export default withAlert(CurbsideAdminCheckInOrOutView)
