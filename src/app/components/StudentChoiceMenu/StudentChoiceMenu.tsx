
import { useNavigate } from 'react-router-dom'
const p = 'StudentScheduleView'
import L from '../../components/PageLanguage'
import styles from './StudentChoiceMenu.css'
import {guidEmpty} from '../../utils/guidValidate'
import classes from 'classnames'
import Icon from '../Icon'
import { withAlert } from 'react-alert'

function StudentChoiceMenu(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const {className="", personId, studentPersonId, studentType, personConfig, userPersonClipboard, companyConfig, excludeClipboard,
                  noBackground, getRegistrationByStudent} = props
  				let hasChosen = !studentPersonId || studentPersonId === guidEmpty ? false : true
  
          return (
              <div className={classes(styles.container, className, (noBackground ? '' : styles.background))}>
  								{!excludeClipboard && ((!userPersonClipboard || !userPersonClipboard.personList || !userPersonClipboard.personList.length
  												|| (userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && userPersonClipboard.personList.indexOf(studentPersonId) === -1)))
  
  										? <a onClick={!hasChosen ? missingChoice : () => singleAddToClipboard(studentPersonId)} data-rh={'Add student to clipboard'}>
  													<Icon pathName={'clipboard_text'} superscript={'plus'} supFillColor={'#0b7508'} premium={true}
  															superScriptClass={classes(styles.plusPosition, (!hasChosen ? styles.opacityLow : ''))}
  															className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  											</a>
  
  										: !excludeClipboard
  												? <a onClick={!hasChosen ? missingChoice : () => singleRemoveFromClipboard(studentPersonId)} data-rh={'Remove student from clipboard'}>
  															<Icon pathName={'clipboard_text'} superscript={'cross'} supFillColor={'#ff0000'} premium={true}
  																	superScriptClass={classes(styles.plusPosition, (!hasChosen ? styles.opacityLow : ''))}
  																	className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  													</a>
  												: ''
  								}
  								{userPersonClipboard && userPersonClipboard.personList && userPersonClipboard.personList.length > 0 && userPersonClipboard.personList.indexOf(studentPersonId) > -1 &&
  										<div className={styles.missingIcon}></div>
  								}
  								<a onClick={!hasChosen ? missingChoice : () => sendToComposeMessage(studentPersonId)} data-rh={'Send a message to this student'}>
  										<Icon pathName={'comment_text'} premium={true} className={classes(styles.imageLessLeft, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  								</a>
  								<a onClick={!hasChosen ? missingChoice : () => sendToStudentSchedule(studentPersonId)} data-rh={`Student's schedule`}>
  										<Icon pathName={'clock3'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  								</a>
                  <a onClick={!hasChosen ? missingChoice : () => { getRegistrationByStudent(personId, studentPersonId, companyConfig.schoolYearId); navigate('/studentProfile/' + studentPersonId + `/` + personConfig.schoolYearId) }} data-rh={`Student's profile`}>
  										<Icon pathName={'info'} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  								</a>
  								{studentType === 'ACADEMY' &&
  										<a onClick={!hasChosen ? missingChoice : () => navigate('/courseAttendanceSingle/' + studentPersonId)} data-rh={'Attendance'}>
  												<Icon pathName={'calendar_check'} premium={true} className={classes(styles.image, styles.moreTopMargin, (!hasChosen ? styles.opacityLow : ''))}/>
  										</a>
  								}
              </div>
          )
}

export default withAlert(StudentChoiceMenu)
