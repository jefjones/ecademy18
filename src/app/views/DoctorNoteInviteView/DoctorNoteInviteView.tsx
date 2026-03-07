import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as styles from './DoctorNoteInviteView.css'
const p = 'DoctorNoteInviteView'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import InputText from '../../components/InputText'
import MessageModal from '../../components/MessageModal'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import InputDataList from '../../components/InputDataList'
import InputTextArea from '../../components/InputTextArea'
import DateTimePicker from '../../components/DateTimePicker'
import Required from '../../components/Required'
import OneFJefFooter from '../../components/OneFJefFooter'
import classes from 'classnames'
import {guidEmpty} from '../../utils/guidValidate'
import { withAlert } from 'react-alert'
import {emailValidate} from '../../utils/emailValidate'

function DoctorNoteInviteView(props) {
  const [invite, setInvite] = useState({

			})
  const [clearDoctor, setClearDoctor] = useState(true)
  const [clearStudent, setClearStudent] = useState(true)
  const [isShowingModal_missingInfo, setIsShowingModal_missingInfo] = useState(true)
  const [messageInfoIncomplete, setMessageInfoIncomplete] = useState('')
  const [studentPersonId, setStudentPersonId] = useState(studentPersonId.id)
  const [doctorPersonId, setDoctorPersonId] = useState(doctorPersonId.id)

  
      return (
          <div className={styles.container}>
              <div className={globalStyles.pageTitle}>
                  <L p={p} t={`Request a Doctor's Note`}/>
              </div>
  						<div className={classes(styles.moreTop, styles.row)}>
  								<div className={globalStyles.instructionsBigger}><L p={p} t={`If this doctor's office is not in the list, invite them with their email address.`}/></div>
  								<Required setIf={true} setWhen={(invite.doctorPersonId && invite.doctorPersonId === guidEmpty)  || invite.doctorEmailAddress} className={styles.required}/>
  						</div>
  						<div className={styles.rowWrap}>
  								<div className={classes(styles.moreTop, styles.moreRight)}>
  										<InputDataList
  												label={<L p={p} t={`Doctor's office`}/>}
  												name={'doctorPersonId'}
  												options={doctors}
  												value={invite.doctorPersonId}
  												multiple={false}
  												height={`medium`}
  												className={styles.moreSpace}
  												clearTextValue={clearDoctor}
  												resetClearTextValue={resetClearTextValue_doctor}
  												onChange={handleSelectedDoctorOffice}/>
  								</div>
  								<div>
  										<InputText
  												name={'doctorEmailAddress'}
  												value={invite.doctorEmailAddress || ''}
  												label={<L p={p} t={`Or new doctor's email address`}/>}
  												maxLength={150}
  												size={'medium'}
  												onChange={changeInvite}
  												errors={errors.doctorOffice}/>
  								</div>
  						</div>
  						<hr/>
  						<div className={styles.rowWrap}>
  								<div className={styles.moreRight}>
  										<InputDataList
  												label={<L p={p} t={`Student`}/>}
  												name={'studentPersonId'}
  												options={students}
  												value={invite.studentPersonId}
  												multiple={false}
  												height={`medium`}
  												className={styles.moreSpace}
  												onChange={handleSelectedStudent}
  												required={true}
  												whenFilled={invite.studentPersonId}
  												clearTextValue={clearStudent}
  												resetClearTextValue={resetClearTextValue_student}
  												error={errors.studentPersonId}/>
  								</div>
  								<div className={classes(styles.row)}>
  										<div className={classes(styles.dateRow, styles.moreRight)}>
  												<DateTimePicker id={`fromDate`} label={<L p={p} t={`From date`}/>} value={invite.fromDate} maxDate={invite.toDate}
  														required={true} whenFilled={invite.fromDate || invite.toDate}
  														onChange={(event) => changeDate('fromDate', event)}/>
  										</div>
  										<div className={classes(styles.dateRow, styles.littleTop, styles.muchRight)}>
  												<DateTimePicker id={`toDate`} value={invite.toDate} label={<L p={p} t={`To date`}/>} minDate={invite.fromDate ? invite.fromDate : ''}
  														onChange={(event) => changeDate('toDate', event)}/>
  										</div>
  								</div>
  								<div className={styles.textareaPosition}>
  										<InputTextArea
  												label={<L p={p} t={`Comment`}/>}
  												name={'adminNote'}
  												value={invite.adminNote || ''}
  												autoComplete={'dontdoit'}
  												boldText={true}
  												onChange={changeInvite}/>
  								</div>
  						</div>
              <div className={styles.rowRight}>
  								<Link className={styles.cancelLink} to={'/doctorNotes'}>Close</Link>
  								<ButtonWithIcon label={<L p={p} t={`Submit`}/>} icon={'checkmark_circle'} onClick={processForm}/>
              </div>
              <OneFJefFooter />
  						{isShowingModal_missingInfo &&
  								<MessageModal handleClose={handleMissingInfoClose} heading={<L p={p} t={`Missing information`}/>}
  									 explainJSX={messageInfoIncomplete} onClick={handleMissingInfoClose} />
  						}
        </div>
      )
}

export default withAlert(DoctorNoteInviteView)
