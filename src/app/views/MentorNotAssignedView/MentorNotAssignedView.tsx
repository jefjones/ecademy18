import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as globalStyles from '../../utils/globalStyles.css'
import * as styles from './MentorNotAssignedView.css'
const p = 'MentorNotAssignedView'
import L from '../../components/PageLanguage'
import classes from 'classnames'
import MessageModal from '../../components/MessageModal'
import EditTable from '../../components/EditTable'
import Checkbox from '../../components/Checkbox'
import DateMoment from '../../components/DateMoment'
import ButtonWithIcon from '../../components/ButtonWithIcon'
import SelectSingleDropDown from '../../components/SelectSingleDropDown'
import OneFJefFooter from '../../components/OneFJefFooter'

function MentorNotAssignedView(props) {
  const navigate = useNavigate()
  const navigateReplace = (navPath: string) => navigate(navPath, { replace: true })
  const goBack = () => navigate(-1)
  const [isShowingModal, setIsShowingModal] = useState(false)
  const [learnersChosen, setLearnersChosen] = useState([])
  const [learningCoach, setLearningCoach] = useState('')
  const [errorLearningCoach, setErrorLearningCoach] = useState('')
  const [errorLearnersChosen, setErrorLearnersChosen] = useState('')

  const {learnersNot, mentors, companyConfig={}} = props
          
  
          let headings = [{}, {id:'', label: companyConfig.isMcl ? 'Learner' : 'Student'}, {id:'', label: 'Birth Date'}]
          let data = []
          if (!learnersNot || learnersNot.length === 0) {
              data = [[{value: <span><i>No learners without a learning coach</i></span>, colSpan: 4}]]
          } else {
              data = learnersNot && learnersNot.length > 0 && learnersNot.map(m => ([
                  {
                      id: m.personId,
                      value: <Checkbox id={m.personId} label={``} checked={!!learnersChosen && learnersChosen.includes(m.personId)}
                                onClick={() => toggleCheckbox(m.personId)} labelClass={styles.labelCheckbox} className={styles.checkbox} />
                  },
                  {
                      id: m.personId,
                      value: m.lastName + ', ' + m.firstName,
                  },
                  {
                      id: m.personId,
                      value: <DateMoment date={m.birthDate} format={'D MMM YYYY '} />,
                  },
              ]))
          }
  
          return (
              <section className={styles.container}>
                  <div className={styles.marginLeft}>
                      <div className={classes(globalStyles.pageTitle, styles.moreMarginBottom)}>
                          {companyConfig.isMcl ? `Learners Not Assigned to a Learning Coach` : `Students Not Assigned to a Learning Coach`}
                      </div>
                      <div className={styles.tableView}>
                          <EditTable headings={headings} data={data} className={styles.table} />
                      </div>
                      <span className={styles.error}>{errorLearnersChosen}</span>
                      <div>
                          <SelectSingleDropDown
                              id={`mentor`}
                              label={`Learning coach`}
                              value={learningCoach}
                              options={mentors}
                              className={styles.singleSelect}
                              height={`medium`}
                              onChange={handleMentorChange}
                              error={errorLearningCoach} />
                      </div>
                      <div className={classes(styles.rowCenter)}>
                          <a className={styles.cancelLink} onClick={() => navigate('/firstNav')}>Close</a>
  												<ButtonWithIcon label={'Save'} icon={'checkmark_circle'} onClick={processForm}/>
                      </div>
                      <OneFJefFooter />
                      {isShowingModal &&
                          <MessageModal handleClose={handleMessageClose} heading={<L p={p} t={`Please notice the errors on the page`}/>}
                             explainJSX={<L p={p} t={`Make sure that you have chosen at least one student and a learning coach`}/>}
                             onClick={handleMessageClose} />
                      }
                  </div>
              </section>
          )
}

export default MentorNotAssignedView
