import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './OpenRegistrationView.css'
const p = 'OpenRegistrationView'
import L from '../../components/PageLanguage'
import globalStyles from '../../utils/globalStyles.css'
import guidEmpty from '../../utils/guidValidate'
import MessageModal from '../../components/MessageModal'
import InputText from '../../components/InputText'
import DateTimePicker from '../../components/DateTimePicker'
import StudentClipboard from '../../components/StudentClipboard'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import { withAlert } from 'react-alert'

function OpenRegistrationView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [studentPersonId, setStudentPersonId] = useState('')
  const [name, setName] = useState((props.openRegistration && props.openRegistration.name) || '')
  const [openDateFrom, setOpenDateFrom] = useState((props.openRegistration && props.openRegistration.openDateFrom) || '')
  const [openDateTo, setOpenDateTo] = useState((props.openRegistration && props.openRegistration.openDateTo) || '')
  const [errors, setErrors] = useState({
							name: '',
			        openDateTo: '',
							studentList: '',
		      })
  const [studentList, setStudentList] = useState('')
  const [isInit, setIsInit] = useState(true)

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
          const {openRegistration, openRegistrationTableId} = props
          
    			if (!isInit && openRegistrationTableId && openRegistration && openRegistration.name) {
    					setIsInit(true); setName(openRegistration.name); setOpenDateTo(openRegistration.openDateTo); setOpenDateFrom(openRegistration.openDateFrom)
    			}
    	
  }, [])

  const {personId, clipboardStudents, studentAssignmentsInit, companyConfig, gradeLevels, setStudentsSelected, removeAllUserPersonClipboard,
  						courseDocumentsInit} = props
      
  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Open Registration`}/>
              </div>
  						<div className={styles.heading}>Students chosen</div>
  						<StudentClipboard students={clipboardStudents} companyConfig={companyConfig} gradeLevels={gradeLevels} shortVersion={true}
  								setStudentsSelected={setStudentsSelected} getStudentSchedule={props.getStudentSchedule} hideIcons={true}
  								personId={personId} studentAssignmentsInit={studentAssignmentsInit} emptyMessage={<L p={p} t={`No students chosen`}/>}
  								includeRemoveClipboardIcon={true} singleRemoveFromClipboard={handleRemoveSingleFromClipboard}
  								courseDocumentsInit={courseDocumentsInit} removeAllUserPersonClipboard={removeAllUserPersonClipboard}/>
  						<hr />
  						<div className={styles.position}>
  								<InputText
  										id={`name`}
  										name={`name`}
  										size={"medium"}
  										label={<L p={p} t={`Open registration name`}/>}
  										value={name || ''}
  										onChange={changeRecord}
  										error={errors.name}/>
  						</div>
  						<div className={classes(styles.littleLeft, styles.row)}>
                  <div className={styles.dateRow}>
                      <DateTimePicker id={`openDateFrom`} label={<L p={p} t={`Open date: From`}/>} value={openDateFrom} maxDate={openDateTo}
  												onChange={(event) => changeDate('openDateFrom', event)} />
                  </div>
                  <div className={styles.dateRow}>
  										<DateTimePicker id={`openDateTo`} label={<L p={p} t={`To`}/>} value={openDateTo} minDate={openDateFrom ? openDateFrom : ''}
                          onChange={(event) => changeDate('openDateTo', event)} />
                  </div>
              </div>
  						<div className={styles.error}>{errors.openDateTo}</div>
              <div className={styles.rowRight}>
  								<a className={styles.cancelLink} onClick={() => goBack()}><L p={p} t={`Close`}/></a>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
              <OneFJefFooter />
              {isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveItemClose} heading={<L p={p} t={`Remove this student?`}/>}
                     explainJSX={<L p={p} t={`Are you sure you want to delete this student from this open registration list?`}/>} isConfirmType={true}
                     onClick={handleRemoveItem} />
              }
        </div>
      )
}

export default withAlert(OpenRegistrationView)
