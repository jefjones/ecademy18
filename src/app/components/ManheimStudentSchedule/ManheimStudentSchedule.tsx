import { useState } from 'react'
import * as styles from './ManheimStudentSchedule.css'
const p = 'component'
import L from '../../components/PageLanguage'
import * as globalStyles from '../../utils/globalStyles.css'
import MessageModal from '../MessageModal'
import Icon from '../Icon'
import Required from '../Required'
import DateMoment from '../DateMoment'
import Loading from '../Loading'
import classes from 'classnames'

//For Manneim Central High School:
//0. Show the count down until this student-self-directed choice option expires.  (They can return in three days to make changes...?  Or should that be just a cut off date for everyhone?)
//1. Show the semester classes split up between Fall and Spring
//	   a. If less than four credits chosen so far, show the orange count of the status, such as 2 or 4 chosen (text and an icon in burnt orange)
//		 b. If 4 are chosen, show a green checkmark an the text in green.
//	   c. If more than 4, show the warning in red that there are more than 4:  5 of 4 chosen classes
//2. There are four blocks (periods)
//3. Show a slot for a fifth optional extra credit on-line-only course to be chosen
//4. Show the errors related to the specific chosen classes
//		 a. This class has a pre-requirement that you don't have.
//	   b. There are two classes chosen for the block #2 (for example)
//5. Finalize: Allow for submit after the class choices are complete.

function ManheimStudentSchedule(props) {
  const [isShowingModal_remove, setIsShowingModal_remove] = useState(false)
  const [isShowingModal_description, setIsShowingModal_description] = useState(false)
  const [courseName, setCourseName] = useState(<div onClick={() => this.handleDescriptionOpen(course.courseName, course.description)} className={styles.link}>{course.courseName}</div>)

  const {studentSchedule, isFinalizeConfirm, fetchingRecord} = props
        
  
        let fall1 = hasClass('fall1', '1', 'M1', 'M2') || (hasClass('fall1', '1A', 'M1', 'M2') && hasClass('fall1', '1B', 'M1', 'M2')) || (isOneCredit('1A', 'M1', 'M2') && hasClass('fall1', '1A', 'M1', 'M2')) || (isOneCredit('1B', 'M1', 'M2') && hasClass('fall1', '1B', 'M1', 'M2'))
  			let fall2 = hasClass('fall2', '2', 'M1', 'M2')
  			let fall3 = hasClass('fall3', '3', 'M1', 'M2')
  			let fall4 = hasClass('fall4', '4', 'M1', 'M2')
  			let spring1 = hasClass('spring1', '1', 'M3', 'M4') || (hasClass('spring1', '1A', 'M3', 'M4') && hasClass('spring1', '1B', 'M3', 'M4')) || (isOneCredit('1A', 'M3', 'M4') && hasClass('spring1', '1A', 'M3', 'M4')) || (isOneCredit('1B', 'M3', 'M4') && hasClass('spring1', '1B', 'M3', 'M4'))
  			let spring2 = hasClass('spring2', '2', 'M3', 'M4')
  			let spring3 = hasClass('spring3', '3', 'M3', 'M4')
  			let spring4 = hasClass('spring4', '4', 'M3', 'M4')
  
  			let overCreditsFall1 = hasTooManyCredits('1', 'M1', 'M2')
  			let overCreditsFall2 = hasTooManyCredits('2', 'M1', 'M2')
  			let overCreditsFall3 = hasTooManyCredits('3', 'M1', 'M2')
        let overCreditsFall4 = hasTooManyCredits('4', 'M1', 'M2')
  			let overCreditsFall5 = hasTooManyCredits('5', 'M1', 'M2')
  			let overCreditsSpring1 = hasTooManyCredits('1', 'M3', 'M4')
  			let overCreditsSpring2 = hasTooManyCredits('2', 'M3', 'M4')
  			let overCreditsSpring3 = hasTooManyCredits('3', 'M3', 'M4')
        let overCreditsSpring4 = hasTooManyCredits('4', 'M3', 'M4')
  			let overCreditsSpring5 = hasTooManyCredits('5', 'M3', 'M4')
  
  			let missingMPFall1 = hasMissingMarkingPeriod('1', 'M1', 'M2')
  			let missingMPFall2 = hasMissingMarkingPeriod('2', 'M1', 'M2')
  			let missingMPFall3 = hasMissingMarkingPeriod('3', 'M1', 'M2')
  			let missingMPFall4 = hasMissingMarkingPeriod('4', 'M1', 'M2')
  			let missingMPSpring1 = hasMissingMarkingPeriod('1', 'M3', 'M4')
  			let missingMPSpring2 = hasMissingMarkingPeriod('2', 'M3', 'M4')
  			let missingMPSpring3 = hasMissingMarkingPeriod('3', 'M3', 'M4')
  			let missingMPSpring4 = hasMissingMarkingPeriod('4', 'M3', 'M4')
  
        return (
          <div className={styles.container}>
  						<Loading isLoading={fetchingRecord && fetchingRecord.studentSchedule}/>
  						<div className={classes(styles.classification, styles.fallSchedule)}>FALL SCHEDULE</div>
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 1`}</div>
  								<Required setIf={!isFinalizeConfirm && (!fall1 || overCreditsFall1 || missingMPFall1)} className={styles.required}/>
  								<div>
  										{overCreditsFall1 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPFall1 && <div className={styles.error}>{missingMPFall1}</div>}
  								</div>
  								{!isFinalizeConfirm && fall1 && !overCreditsFall1 && !missingMPFall1 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!fall1 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName && m.classPeriodName.indexOf("1") > -1) || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("1") > -1))) {
  																isFound = true
  														}
  												})
  												return isFound
  										})
  									  .map((m, i) => setClassView(m, "fall1", i))
  						}
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 2`}</div>
  								<Required setIf={!isFinalizeConfirm && (!fall2 || overCreditsFall2 || missingMPFall2)} className={styles.required}/>
  								<div>
  										{overCreditsFall2 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPFall2 && <div className={styles.error}>{missingMPFall2}</div>}
  								</div>
  								{!isFinalizeConfirm && fall2 && !overCreditsFall2  && !missingMPFall2 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!fall2 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "2") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("2") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "fall2", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 3`}</div>
  								<Required setIf={!isFinalizeConfirm && (!fall3 || overCreditsFall3 || missingMPFall3)} className={styles.required}/>
  								<div>
  										{overCreditsFall3 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPFall3 && <div className={styles.error}>{missingMPFall3}</div>}
  								</div>
  								{!isFinalizeConfirm && fall3 && !overCreditsFall3 && !missingMPFall3 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!fall3 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "3") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("3") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "fall3", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 4`}</div>
  								<Required setIf={!isFinalizeConfirm && (!fall4 || overCreditsFall4 || missingMPFall4)} className={styles.required}/>
  								<div>
  										{overCreditsFall4 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPFall4 && <div className={styles.error}>{missingMPFall4}</div>}
  								</div>
  								{!isFinalizeConfirm && fall4 && !overCreditsFall4 && !missingMPFall4 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!fall4 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && ((m.classPeriodName === "4") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("4") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "fall4", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Extra Credit (optional)`}</div>
  								<Required setIf={overCreditsFall5} className={styles.required}/>
  								{overCreditsFall5 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  						</div>
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M1') > -1 || t.code.indexOf('M2') > -1) && m.classPeriodName === "5") isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "fall5", i))
  						}
  
  
  						<div className={classes(styles.classification, styles.springSchedule)}>SPRING SCHEDULE</div>
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 1`}</div>
  								<Required setIf={!isFinalizeConfirm && (!spring1 || overCreditsSpring1 || missingMPSpring1)} className={styles.required}/>
  								<div>
  										{overCreditsSpring1 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPSpring1 && <div className={styles.error}>{missingMPSpring1}</div>}
  								</div>
  								{!isFinalizeConfirm && spring1 && !overCreditsSpring1 && !missingMPSpring1 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!spring1 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName && m.classPeriodName.indexOf("1") > -1) || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("1") > -1))) isFound = true
  												})
  												return isFound
  										})
  									  .map((m,i) => setClassView(m, "spring1", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 2`}</div>
  								<Required setIf={!isFinalizeConfirm && (!spring2 || overCreditsSpring2 || missingMPSpring2)} className={styles.required}/>
  								<div>
  										{overCreditsSpring2 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPSpring2 && <div className={styles.error}>{missingMPSpring2}</div>}
  								</div>
  								{!isFinalizeConfirm && spring2 && !overCreditsSpring2 && !missingMPSpring2 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!spring2 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "2") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("2") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "spring2", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 3`}</div>
  								<Required setIf={!isFinalizeConfirm && (!spring3 || overCreditsSpring3 || missingMPSpring3)} className={styles.required}/>
  								<div>
  										{overCreditsSpring3 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPSpring3 && <div className={styles.error}>{missingMPSpring3}</div>}
  								</div>
  								{!isFinalizeConfirm && spring3 && !overCreditsSpring3 && !missingMPSpring3 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!spring3 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "3") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("3") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "spring3", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Block 4`}</div>
  								<Required setIf={!isFinalizeConfirm && (!spring4 || overCreditsSpring4 || missingMPSpring4)} className={styles.required}/>
  								<div>
  										{overCreditsSpring4 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  										{missingMPSpring4 && <div className={styles.error}>{missingMPSpring4}</div>}
  								</div>
  								{!isFinalizeConfirm && spring4 && !overCreditsSpring4 && !missingMPSpring4 && <Icon pathName={'checkmark0'} premium={true} className={styles.checkmarkIcon} fillColor={'green'}/>}
  						</div>
  						{!spring4 && <div className={styles.classNotChosen}>{`- -`}</div>}
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && ((m.classPeriodName === "4") || (m.classPeriodsMultiple && m.classPeriodsMultiple.indexOf("4") > -1))) isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "spring4", i))
  						}
  
  						<div className={styles.row}>
  								<div className={styles.label}>{`Extra Credit (optional)`}</div>
  								<Required setIf={overCreditsSpring5} className={styles.required}/>
  								{overCreditsSpring5 && <div className={styles.error}>{`Too many credits chosen`}</div>}
  						</div>
  						{studentSchedule && studentSchedule.length > 0
  								&& studentSchedule.filter(m => {
  												let isFound = false
  												m.intervals && m.intervals.length > 0 && m.intervals.forEach(t => {
  														if (t.code && (t.code.indexOf('M3') > -1 || t.code.indexOf('M4') > -1) && m.classPeriodName === "5") isFound = true
  												})
  												return isFound
  										})
  										.map((m,i) => setClassView(m, "spring5", i))
  						}
  
  						{isShowingModal_remove &&
                  <MessageModal handleClose={handleRemoveClose} heading={`Remove this course?`}
                     explainJSX={<L p={p} t={`Are you sure you want to remove this course?`}/>} isConfirmType={true}
                     onClick={handleRemove} />
              }
  						{isShowingModal_description &&
                  <MessageModal handleClose={handleDescriptionClose} heading={courseName}
                     explain={description}  onClick={handleDescriptionClose} />
              }
          </div>
      )
}

export default ManheimStudentSchedule
