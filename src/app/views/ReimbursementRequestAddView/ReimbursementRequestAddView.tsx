import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {apiHost} from '../../api_host'
const p = 'StudentScheduleView'
import L from '../../components/PageLanguage'
import InputFile from '../../components/InputFile'
import axios from 'axios'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './ReimbursementRequestAddView.css'
import AlertSound from '../../assets/alert_science_fiction.mp3'
import CheckboxGroup from '../../components/CheckboxGroup'
import RadioGroup from '../../components/RadioGroup'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import InputText from '../../components/InputText'
import InputTextArea from '../../components/InputTextArea'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import MyFrequentPlaces from '../../components/MyFrequentPlaces'
import ImageViewerModal from '../../components/ImageViewerModal'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'
import {guidEmpty} from '../../utils/guidValidate'

//1. The parent/guardian enters a check-in or a check-out entry from the curbside. (ReimbursementRequestAddView)
//		a. The add function gets back ONLY this written record with the Id so that the get call will look for that one only for the parent/guardian.
//	  b. The timer has this Id in order to look for it specifically (it does come back in a list so we just need to pick off the first one - but there is only one)
//2. The entry is received by the office (CurbsideAdminCheckInOrOutView).
//		  a. The admin can confirm that they see the student enter or they can mark that they did not ever see the student enter.
//3. The parent receives that response as a timer is set to get their response back.  See componentDidUpdate for turning that timer on and then off when the response comes.

function ReimbursementRequestAddView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [checkInOrOut, setCheckInOrOut] = useState('')
  const [reasonOther, setReasonOther] = useState('')
  const [reasonChoice, setReasonChoice] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [parentComment, setParentComment] = useState('')
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [fileUrl, setFileUrl] = useState('')
  const [timerId, setTimerId] = useState(setInterval(() => getCheckInOrOuts(personId, checkInOrOuts[0].curbsideCheckInOrOutId), 3000))
  const [errorCheckInOrOut, setErrorCheckInOrOut] = useState("Please choose Check-in or Check-out")
  const [errorReason, setErrorReason] = useState("Please choose or enter a reason")
  const [errorStudent, setErrorStudent] = useState("Please choose at least one student")
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

  const {personId, myFrequentPlaces, setMyFrequentPlace, reasons, students} = props
      
  
      return (
          <div className={styles.container}>
  						<div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
  								{`Curbside Check-In or Check-Out`}
  						</div>
  						{!isPendingConfirmation &&
  								<div>
  										<RadioGroup
  												data={[{id: 'checkin', label: 'Check In'}, {id: 'checkout', label: 'Check Out'}]}
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
  														label={`Reason`}
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
  												label={"Or other reason"}
  												value={reasonOther || ''}
  												onChange={handleChange}/>
  										<InputFile label={`Include a picture`} isCamera={true} onChange={handleInputFile} isResize={true}/>
  										<div className={styles.groupPosition}>
  												<CheckboxGroup
  														name={'selectedStudents'}
  														options={students || []}
  														horizontal={true}
  														onSelectedChanged={handleSelectedGroup}
  														label={students && students.length > 1 ? 'Student' : 'Students'}
  														labelClass={styles.label}
  														selected={selectedStudents}
  														error={errorStudent}/>
  										</div>
  										<InputTextArea
  												label={'Comment (optional)'}
  												name={'parentComment'}
  												value={parentComment}
  												onChange={handleChange} />
  										<div className={classes(styles.muchLeft, styles.row)}>
  												<a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  												<ButtonWithIcon label={'Submit'} icon={'checkmark_circle'} onClick={processForm}/>
  										</div>
  								</div>
  						}
  				<MyFrequentPlaces personId={personId} pageName={'Reimbursement Request (Add)'} path={'reimbursementRequestAdd'} myFrequentPlaces={myFrequentPlaces} setMyFrequentPlace={setMyFrequentPlace}/>
  				<OneFJefFooter />
  				{isShowingModal &&
  						<div className={globalStyles.fullWidth}>
  								<ImageViewerModal handleClose={handleImageViewerClose} fileUrl={fileUrl}/>
  						</div>
  				}
        </div>
      )
}

export default withAlert(ReimbursementRequestAddView)
