import { useEffect, useState } from 'react'
import globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import styles from './SafetyAdminAlertView.css'
import EditTable from '../../components/EditTable'
import Icon from '../../components/Icon'
import Button from '../../components/Button'
import DateMoment from '../../components/DateMoment'
import TextareaModal from '../../components/TextareaModal'
import MessageModal from '../../components/MessageModal'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

//1. The alert-person enters an alert
//2. The entry is received by the office (SafetyAdminAlertView).
//		  a. The admin can approve the alert.  The admin can can then choose to broadcast it to all users as well as to the police station.
//3. The aert-person receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function SafetyAdminAlertView(props) {
  const [safetyAlert, setSafetyAlert] = useState('all')
  const [timerId, setTimerId] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [isShowingModal_dismiss, setIsShowingModal_dismiss] = useState(false)
  const [isShowingModal_comment, setIsShowingModal_comment] = useState(undefined)
  const [alertReviewType, setAlertReviewType] = useState(undefined)
  const [safetyAlertId, setSafetyAlertId] = useState(undefined)
  const [showSearchControls, setShowSearchControls] = useState(undefined)
  const [personId, setPersonId] = useState(undefined)
  const [fileUrl, setFileUrl] = useState(undefined)

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
    
    			const {personId, getSafetyAlerts} = props
    			
    			if (!timerId) setTimerId(setInterval(() => getSafetyAlerts(personId), 3000))
    	
  }, [])

  const handleSafetyAlert = (safetyAlert) => {
    
    			setSafetyAlert(safetyAlert)
    	
  }

  const handleChange = ({target}) => {
    
    			let newState = Object.assign({}, state)
    			newState[target.name] = target.value
    			setState(newState)
    	
  }

  const handleConfirmAlertOpen = (alertReviewType, safetyAlertId) => {
    return setIsShowingModal_comment(true); setAlertReviewType(alertReviewType); setSafetyAlertId(safetyAlertId)
  }

  const handleConfirmAlertClose = () => {
    return setIsShowingModal_comment(false); setAlertReviewType(''); setSafetyAlertId('')
  }

  const handleConfirmAlert = (adminComment) => {
    
    			const {personId, confirmSafetyAlert} = props
    			
    			confirmSafetyAlert(personId, {safetyAlertId, acknowledgedType: alertReviewType, note: adminComment})
    			alertReviewType === 'approved'
    					? props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The alert was approved`}/></div>)
    					: props.alert.info(<div className={globalStyles.alertText}><L p={p} t={`The alert is considered a false alarm`}/></div>)
    			handleConfirmAlertClose()
    	
  }

  const handleDismissAlertOpen = (safetyAlertId) => {
    return setIsShowingModal_dismiss(true); setSafetyAlertId(safetyAlertId)
  }

  const handleDismissAlertClose = () => {
    return setIsShowingModal_dismiss(false); setSafetyAlertId('')
  }

  const handleDismissAlert = () => {
    
    			const {personId, dismissSafetyAlert} = props
    			
    			dismissSafetyAlert(personId, safetyAlertId)
    			handleDismissAlertClose()
    	
  }

  const toggleSearch = () => {
    
    			if (showSearchControls) clearFilters()
    			setShowSearchControls(!showSearchControls)
    	
  }

  const clearFilters = () => {
    
    			setPersonId(''); setSafetyAlert('all')
    	
  }

  const handleImageViewerOpen = (fileUrl) => {
    return setIsShowingModal(true); setFileUrl(fileUrl)
  }

  const handleImageViewerClose = () => {
    setIsShowingModal(false); setFileUrl('')
  }

  const {myFrequentPlaces, setMyFrequentPlace, safetyAlerts, accessRoles, fetchingRecord} = props
  		
  		let localSafetyAlerts = safetyAlerts
  
  		let headings = [{},{},
  				{label: <L p={p} t={`Date/time`}/>, tightText: true},
  				{label: <L p={p} t={`Alert type`}/>, tightText: true},
  				{label: <L p={p} t={`Alert person`}/>, tightText: true},
  				{label: <L p={p} t={`Picture`}/>, tightText: true},
  				{label: <L p={p} t={`Student`}/>, tightText: true},
  				{label: <L p={p} t={`Admin date/time`}/>, tightText: true},
  				{label: <L p={p} t={`Admin name`}/>, tightText: true},
  				{label: <L p={p} t={`Alert note`}/>, tightText: true},
  				{label: <L p={p} t={`Admin note`}/>, tightText: true}
  		]
      let data = []
  
      if (localSafetyAlerts && localSafetyAlerts.length > 0) {
  				// if (guardianPersonId || studentPersonId ||  safetyAlert !== 'all') {
  				// 		if (guardianPersonId && guardianPersonId != 0) localSafetyAlerts = localSafetyAlerts.filter(m => m.parentPersonId === guardianPersonId); //eslint-disable-line
  				// 		if (studentPersonId && studentPersonId != 0) localSafetyAlerts = localSafetyAlerts.filter(m => m.studentPersonIds.indexOf(studentPersonId) > -1); //eslint-disable-line
  				// 		if (safetyAlert && safetyAlert !== 'all') localSafetyAlerts = localSafetyAlerts.filter(m => m.safetyAlert === safetyAlert);
  				// }
          data = localSafetyAlerts.map(m => [
  							{value: <div data-rh={'Dismiss this alert'} onClick={() => handleDismissAlertOpen(m.safetyAlertId)}>
  													<Icon pathName={'folder_minus_inside'} premium={true} className={globalStyles.icon} />
  											</div>
  							},
                {value: m.alertReviewType
  									? m.alertReviewType === 'approved'
  											? <div data-rh={'Alert is approved'}>
  														<Icon pathName={'clipboard_check'} premium={true} className={globalStyles.icon} />
  												</div>
  											: <div data-rh={'False alarm'}>
  														<Icon pathName={'cross'} premium={false} fillColor={'maroon'} className={globalStyles.icon} />
  												</div>
  									: <div className={styles.row}>
  												<div onClick={() => handleConfirmAlertOpen('falseAlarm', m.safetyAlertId)} data-rh={'Is this a false alarm?'} className={styles.row}>
  														<Icon pathName={'user_minus0'} premium={true}  fillColor={'maroon'} className={globalStyles.iconMedium} />
  														<div className={styles.iconRed}>?</div>
  												</div>
  										</div>
  							},
  							{value: <DateMoment date={m.entryDate} />},
  							{value: m.safetyAlertTypeName},
  							{value: m.alertPersonName},
  							{value: <a onClick={() => handleImageViewerOpen(m.fileUrl)} className={globalStyles.link}>{m.fileUrl ? <L p={p} t={`picture`}/> : ''}</a>},
  							{value: m.studentNames && m.studentNames.length > 0 && m.studentNames.join(', ')},
  							{value: accessRoles.admin
  											? m.approvedDate
  													? <DateMoment date={m.approvedDate} includeTime={true} minusHours={6}/>
  													: <Button label={<L p={p} t={`Confirm...`}/>} onClick={() => handleConfirmAlertOpen('approved', m.safetyAlertId, m.safetyAlert)} addClassName={styles.notSoHigh}/>
  											: m.approvedDate
  							},
  							{value: m.adminName},
  							{value: m.alertNote},
                {value: m.adminNote},
            ]
          )
      }
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								<L p={p} t={`Safety Alerts`}/>
  						</div>
  						{/*<div className={styles.row}>
  								<a onClick={toggleSearch} className={classes(styles.row, globalStyles.link)}>
  										<Icon pathName={'magnifier'} premium={true} className={styles.icon}/>
  										{showSearchControls ? 'Hide search controls' : 'Show search controls'}
  								</a>
  								{showSearchControls && <a onClick={clearFilters} className={classes(styles.muchRight, globalStyles.link)}>Clear filters</a>}
  						</div>
  						{showSearchControls &&
  								<div>
  										<div>
  												<SelectSingleDropDown
  														id={`guardianPersonId`}
  														name={`guardianPersonId`}
  														label={`Parent/guardian`}
  														value={guardianPersonId || ''}
  														options={guardians}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
  										<div>
  												<SelectSingleDropDown
  														id={`studentPersonId`}
  														name={`studentPersonId`}
  														label={`Student`}
  														value={studentPersonId || ''}
  														options={students}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}/>
  										</div>
  										<div className={styles.groupPosition}>
  												<RadioGroup
  														title={'Check In or Out'}
  														name={'safetyAlert'}
  														data={[{id: 'all', label: 'All'}, {id: 'checkin', label: 'Check In'}, {id: 'checkout', label: 'Check Out'}]}
  														horizontal={true}
  														className={styles.moreTop}
  														initialValue={safetyAlert}
  														onClick={handleSafetyAlert}/>
  										</div>
  								</div>
  						*/}
  						<EditTable data={data} headings={headings} isFetchingRecord={fetchingRecord.safetyAdminAlert}/>
  						<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Safety Admin Alerts`}/>} path={'safetyAdminAlerts'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  						<OneFJefFooter />
  						{isShowingModal_comment &&
  							<TextareaModal handleClose={handleConfirmAlertClose} heading={`Confirm Alert`}
  									explain={<div>
  															<div className={classes(styles.bold, (alertReviewType === 'approved' ? styles.green : styles.red))}>{alertReviewType === 'approved'
  																	? <L p={p} t={`Alert is approved`}/>
  																	: <L p={p} t={`This alert is a false alarm`}/>}</div>
  															<div><L p={p} t={`Add a note (optional)`}/></div>
  														</div>
  									}  onClick={handleConfirmAlert} />
  						}
  						{isShowingModal &&
  								<div className={globalStyles.fullWidth}>
  										<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  								</div>
  						}
  						{isShowingModal_dismiss &&
  								<MessageModal handleClose={handleDismissAlertClose} heading={<L p={p} t={`Dismiss this safety alert?`}/>}
  									 explainJSX={<L p={p} t={`Are you sure you want to dismiss this safety alert?  It will be saved for future reference but hidden from your current view.`}/>}
  									 isConfirmType={true} onClick={handleDismissAlert} />
  					 	}
        	</div>
      )
}

export default withAlert(SafetyAdminAlertView)
