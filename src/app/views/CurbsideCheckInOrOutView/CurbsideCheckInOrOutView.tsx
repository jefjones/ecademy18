import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import * as globalStyles from '../../utils/globalStyles.css'
const p = 'globalStyles'
import L from '../../components/PageLanguage'
import * as styles from './CurbsideCheckInOrOutView.css'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import CheckboxGroup from '../../components/CheckboxGroup'
import RadioGroup from '../../components/RadioGroup'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import TextDisplay from '../../components/TextDisplay'
import Loading from '../../components/Loading'
import DateMoment from '../../components/DateMoment'
import ImageViewerModal from '../../components/ImageViewerModal'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

//1. The parent/guardian enters a check-in or a check-out entry from the curbside. (CurbsideCheckInOrOutView)
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for the parent/guardian.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office (CurbsideAdminCheckInOrOutView).
//		  a. The admin can confirm that they see the student enter or they can mark that they did not ever see the student enter.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function CurbsideCheckInOrOutView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [checkInOrOut, setCheckInOrOut] = useState('')
  const [reasonOther, setReasonOther] = useState('')
  const [reasonChoice, setReasonChoice] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [parentComment, setParentComment] = useState('')
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [timerId, setTimerId] = useState(setInterval(() => getCheckInOrOuts(personId, checkInOrOuts[0].curbsideCheckInOrOutId), 3000))
  const [errorCheckInOrOut, setErrorCheckInOrOut] = useState(<L p={p} t={`Please choose Check-in or Check-out`}/>)
  const [p, setP] = useState(undefined)
  const [errorReason, setErrorReason] = useState(<L p={p} t={`Please choose or enter a reason`}/>)
  const [errorStudent, setErrorStudent] = useState(<L p={p} t={`Please choose at least one student`}/>)
  const [selectedFile, setSelectedFile] = useState(file)

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
    
    			const {personId, checkInOrOuts, getCheckInOrOuts} = props
    			
    			if (!timerId && checkInOrOuts && checkInOrOuts.length > 0 && !checkInOrOuts[0].acknowledgedType) {
    					setTimerId(setInterval(() => getCheckInOrOuts(personId, checkInOrOuts[0].curbsideCheckInOrOutId), 3000))
    			} else if (timerId && checkInOrOuts && checkInOrOuts.length > 0 && checkInOrOuts[0].acknowledgedType) {
    					clearInterval(timerId)
    					setTimerId('')
    					makeSound()
    			}
    	
  }, [])

  const {personId, reasons, students, checkInOrOuts, myFrequentPlaces, setMyFrequentPlace} = props
      
  
  		let checkInOrOutPending = checkInOrOuts && checkInOrOuts.length > 0 && checkInOrOuts[0]
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								{`Curbside Check-In or Check-Out`}
  						</div>
  						{isPendingConfirmation && checkInOrOutPending && checkInOrOutPending.curbsideCheckInOrOutId &&
  								<div>
  										<TextDisplay label={<L p={p} t={`Type`}/>} text={checkInOrOutPending.checkInOrOut === 'checkin' ? <L p={p} t={`Check In`}/> : <L p={p} t={`Check Out`}/>} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Entry date`}/>} text={<DateMoment date={checkInOrOutPending.entryDate} minusHours={6}/>} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Reason`}/>} text={checkInOrOutPending.reasonTypeName} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Reason`}/>} text={checkInOrOutPending.reasonOther} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Student`}/>} text={checkInOrOutPending.studentNames.join(', ')} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Picture`}/>} text={<a onClick={() => handleImageViewerOpen(checkInOrOutPending.fileUrl)} className={globalStyles.link}>{checkInOrOutPending.fileUrl ? 'View picture' : ''}</a>} hideIfEmpty={true}/>
  										<TextDisplay label={<L p={p} t={`Parent/guardian comment`}/>} text={checkInOrOutPending.parentComment} hideIfEmpty={true}/>
  										<div className={styles.row}>
  												<div className={styles.pendingLabelSmaller}>Confirmation:</div>
  												<Loading loadingText={'Waiting for office response'} isLoading={!checkInOrOutPending.acknowledgedType} />
  												{checkInOrOutPending.acknowledgedType &&
  														<div className={classes(styles.pendingLabel, (checkInOrOutPending.acknowledgedType === 'confirmed' ? styles.blue : styles.maroon))}>
  																{checkInOrOutPending.acknowledgedType === 'confirmed'
  																		? checkInOrOutPending.checkInOrOut === 'checkin'
  																				? <L p={p} t={`Arrival is Confirmed`}/>
  																				: <L p={p} t={`Student(s) sent out`}/>
  																		: checkInOrOutPending.checkInOrOut === 'checkin'
  																				? <L p={p} t={`Arrival is NOT confirmed`}/>
  																				: <L p={p} t={`Student is NOT present to send out`}/>
  																}
  														</div>
  												}
  										</div>
  										<TextDisplay label={<L p={p} t={`Entry date`}/>} text={checkInOrOutPending.acknowledgedDate ? <DateMoment date={checkInOrOutPending.acknowledgedDate} minusHours={6}/> : '- -'}/>
  										<TextDisplay label={<L p={p} t={`Administrator`}/>} text={checkInOrOutPending.adminName || '- -'}/>
  										<TextDisplay label={<L p={p} t={`Comment`}/>} text={checkInOrOutPending.adminComment || '- -'}/>
  								</div>
  						}
  						{!isPendingConfirmation &&
  								<div>
  										<RadioGroup
  												data={[{id: 'checkin', label: <L p={p} t={`Check In`}/>}, {id: 'checkout', label: <L p={p} t={`Check Out`}/>}]}
  												id={`checkInOrOut`}
  												name={`checkInOrOut`}
  												horizontal={true}
  												className={styles.radio}
  												initialValue={checkInOrOut}
  												onClick={handleRadioGroup}
  												error={errorCheckInOrOut}/>
  										<div>
  												<SelectSingleDropDown
  														id={`reasonChoice`}
  														name={`reasonChoice`}
  														label={<L p={p} t={`Reason`}/>}
  														value={reasonChoice || ''}
  														options={reasons}
  														className={styles.moreBottomMargin}
  														height={`medium`}
  														onChange={handleChange}
  														error={errorReason}/>
  										</div>
  										<InputText
  												id={`reasonOther`}
  												name={`reasonOther`}
  												size={"medium-long"}
  												label={<L p={p} t={`Or other reason`}/>}
  												value={reasonOther || ''}
  												onChange={handleChange}/>
  										<InputFile label={<L p={p} t={`Include a picture`}/>} isCamera={true} onChange={handleInputFile} isResize={true}/>
  										<div className={styles.groupPosition}>
  												<CheckboxGroup
  														name={'selectedStudents'}
  														options={students || []}
  														horizontal={true}
  														onSelectedChanged={handleSelectedGroup}
  														label={students && students.length > 1 ? <L p={p} t={`Student`}/> : <L p={p} t={`Students`}/>}
  														labelClass={styles.label}
  														selected={selectedStudents}
  														error={errorStudent}/>
  										</div>
  										<InputTextArea
  												label={<L p={p} t={`Comment (optional)`}/>}
  												name={'parentComment'}
  												value={parentComment}
  												onChange={handleChange} />
  										<div className={classes(styles.muchLeft, styles.row)}>
  												<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  												<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
  										</div>
  								</div>
  						}
  				<MyFrequentPlaces personId={personId} pageName={<L p={p} t={`Curbside Check-in or Check-out`}/>} path={'curbside'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
  				{isShowingModal &&
  						<div className={globalStyles.fullWidth}>
  								<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  						</div>
  				}
        </div>
      )
}

export default withAlert(CurbsideCheckInOrOutView)
