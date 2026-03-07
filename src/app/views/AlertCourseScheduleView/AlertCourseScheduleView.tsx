import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AlertCourseScheduleView.css'
import globalStyles from '../../utils/globalStyles.css'
import TextDisplay from '../../components/TextDisplay'
import MessageModal from '../../components/MessageModal'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import Checkbox from '../../components/Checkbox'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
const p = 'AlertCourseScheduleView'
import L from '../../components/PageLanguage'

function AlertCourseScheduleView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [seats, setSeats] = useState('')
  const [alert, setAlert] = useState({
							courseScheduledId: props.param && props.param.courseScheduledId,
							alertTypeCode: 'NEWSECTION',
					})
  const [courseScheduledId, setCourseScheduledId] = useState(props.param && props.param.courseScheduledId)
  const [alertTypeCode, setAlertTypeCode] = useState('NEWSECTION')
  const [isInit, setIsInit] = useState(true)
  const [errorFirstPref, setErrorFirstPref] = useState(<L p={p} t={`A first preference is required`}/>)
  const [p, setP] = useState(undefined)
  const [errorSecondPref, setErrorSecondPref] = useState(<L p={p} t={`A second preference is required`}/>)
  const [personId, setPersonId] = useState(undefined)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [isShowingModal_removeAlert, setIsShowingModal_removeAlert] = useState(true)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
    			const {alert, alerts} = props
    			
    			if (!isInit && alerts && alerts.length > 0 && alert && alert.alertWhenId) {
    					setIsInit(true); setAlert(alert)
    			}
    	
  }, [])

  
  		// let seatThreshold = '';
  		// let hasNewSectionAlert = false;
  		// alerts && alerts.length > 0 && alerts.forEach(m => {
  		// 		if (m.alertTypeCode === 'SEATTHRESHOLD' && m.courseScheduledId === course.courseScheduledId) seatThreshold = m.seatThreshold;
  		// 		if (m.alertTypeCode === 'NEWSECTION' && m.courseEntryId === course.courseEntryId) hasNewSectionAlert = true;
  		// })
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Course Alerts`}/>
              </div>
  						<TextDisplay label={<L p={p} t={`Course`}/>} text={course.courseName} className={styles.textDisplay} />
  						<TextDisplay label={<L p={p} t={`Open seats`}/>} text={course.maxSeats} className={styles.textDisplay} />
  						<TextDisplay label={<L p={p} t={`Seats used`}/>} text={course.studentList && course.studentList.length} className={styles.textDisplay} />
  						<TextDisplay label={companyConfig.urlcode === 'Manheim' ? 'Marking period' : <L p={p} t={`Interval`}/>} text={course.intervalName} className={styles.textDisplay} />
  						<hr />
  						<div className={styles.subDiv}>
  								{/*<div className={classes(styles.label, styles.row, styles.moreSpace)}>
  				            <div className={styles.topPosition}>
  				                <SelectSingleDropDown
  				                    id={'seatThreshold'}
  														label={'Seats taken'}
  				                    value={seatThreshold}
  				                    options={seats}
  				                    height={`short`}
  				                    className={styles.singleDropDown}
  				                    onChange={sendSeatAlert}/>
  				            </div>
  										{`Alert me when the seats taken reach this number:`}
  								</div>*/}
  								<div className={classes(globalStyles.instructionsBigger, styles.widthInstructions)}>
  										<L p={p} t={`By wait-listing a course, you are expressing an interest in taking a course that is currently full.`}/>
  										<L p={p} t={`The administration will evaluate the high school schedule based on staffing and students' requests.`}/>
  										<L p={p} t={`Please note by marking a course on the wait-list does not establish an expectation that a new course section will be added. Should a new course section be created, students will be notified via email.`}/>
  								</div>
  								<div>
  										<div className={classes(globalStyles.classification, styles.space)}>Alert me if a seat opens up</div>
  										<div className={classes(styles.moreTop, styles.muchBottom)}>
  												<Checkbox
  														id={'ifOpenSeat'}
  														name={'ifOpenSeat'}
  														label={<L p={p} t={`Please notify me of an open seat for this section`}/>}
  														labelClass={styles.checkboxLabel}
  														checked={alert.ifOpenSeat || false}
  														onClick={toggleIfOpenSeat}
  														className={styles.button}/>
  										</div>
  								</div>
  								<div>
  										{doNotAddCourse && <div className={classes(styles.headerLabel, styles.space)}><L p={p} t={`This course is not eligible to create a new course`}/></div>}
  										<div className={classes(globalStyles.classification, styles.space, (doNotAddCourse ? styles.lowOpacity : ''))}><L p={p} t={`Request a new section`}/></div>
  										<div className={classes(styles.moreTop, (doNotAddCourse ? styles.lowOpacity : ''))}>
  												<SelectSingleDropDown
  														id={`firstPrefClassPeriodId`}
  														label={<L p={p} t={`Your first preference: Block`}/>}
  														value={alert.firstPrefClassPeriodId || ''}
  														options={classPeriods}
  														height={`medium`}
  														disabled={doNotAddCourse}
  														onChange={changeItem}/>
  										</div>
  										<div className={classes(styles.moreTop, (doNotAddCourse ? styles.lowOpacity : ''))}>
  												<SelectSingleDropDown
  														id={`secondPrefClassPeriodId`}
  														label={<L p={p} t={`Your second preference: Block`}/>}
  														value={alert.secondPrefClassPeriodId || ''}
  														options={classPeriods}
  														height={`medium`}
  														disabled={doNotAddCourse}
  														onChange={changeItem}/>
  										</div>
  								</div>
  						</div>
  						<div className={classes(styles.fromLeft, styles.row)}>
  								<a className={styles.cancelLink} onClick={() => goBack()}><L p={p} t={`Close`}/></a>
  								{alert.alertWhenId && <ButtonWithIcon label={<L p={p} t={`Delete`}/>} icon={'cross_circle'} onClick={handleRemoveAlertOpen} changeRed={true}/>}
                  <ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
              <OneFJefFooter />
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
  						{isShowingModal_removeAlert &&
                  <MessageModal handleClose={handleRemoveAlertClose} heading={<L p={p} t={`Remove this alert?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this alert?`}/>} isConfirmType={true}
                     onClick={handleRemoveAlert} />
              }
        </div>
      )
}
export default AlertCourseScheduleView
